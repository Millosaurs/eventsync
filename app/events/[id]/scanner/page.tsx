"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    QrCode,
    Camera,
    CheckCircle,
    XCircle,
    Loader2,
    AlertCircle,
    ArrowLeft,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ScanResult {
    success: boolean;
    message: string;
    data?: {
        id: string;
        teamName: string;
        label: string;
        trackingType: string;
        scannedAt: string;
        scannedBy: string;
    };
}

interface EventData {
    id: string;
    title: string;
    startDate: string;
    endDate?: string;
    location?: string;
    status: string;
}

export default function QRScannerPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;
    const { data: session, isPending } = useSession();

    const [event, setEvent] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [manualCode, setManualCode] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [error, setError] = useState("");

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isPending && eventId) {
            loadEvent();
        }
        return () => {
            stopCamera();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId, isPending]);

    const loadEvent = async () => {
        try {
            setLoading(true);
            console.log("Loading event:", eventId);
            const response = await fetch(`/api/events/${eventId}`);
            console.log("Response status:", response.ok);

            if (!response.ok) {
                throw new Error(`Failed to load event: ${response.status}`);
            }

            const data = await response.json();
            console.log("Event data:", data);

            if (data.success && data.data) {
                setEvent(data.data);
            } else {
                throw new Error(data.message || "Failed to load event");
            }
        } catch (error) {
            console.error("Error loading event:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load event details",
            );
        } finally {
            console.log("Setting loading to false");
            setLoading(false);
        }
    };

    const startCamera = async () => {
        try {
            setError("");
            setCameraActive(false);
            console.log("Starting camera...");

            // Check if getUserMedia is supported
            if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia
            ) {
                throw new Error("Camera API is not supported in this browser");
            }

            // Stop any existing stream first
            stopCamera();

            console.log("Requesting camera access...");

            let stream: MediaStream | null = null;

            // Try with ideal constraints first
            try {
                const constraints = {
                    video: {
                        facingMode: { ideal: "environment" },
                        width: { ideal: 1280, max: 1920 },
                        height: { ideal: 720, max: 1080 },
                    },
                    audio: false,
                };

                const streamPromise =
                    navigator.mediaDevices.getUserMedia(constraints);
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(
                        () =>
                            reject(new Error("Camera initialization timeout")),
                        15000,
                    ),
                );

                stream = (await Promise.race([
                    streamPromise,
                    timeoutPromise,
                ])) as MediaStream;
            } catch (err) {
                console.warn(
                    "Failed with ideal constraints, trying basic constraints:",
                    err,
                );
                // Fallback to basic constraints for mobile
                try {
                    const basicConstraints = {
                        video: { facingMode: "environment" },
                        audio: false,
                    };
                    stream =
                        await navigator.mediaDevices.getUserMedia(
                            basicConstraints,
                        );
                } catch (basicErr) {
                    console.error("Failed with basic constraints:", basicErr);
                    // Last resort - try any video
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: false,
                    });
                }
            }

            if (!stream || !stream.active) {
                throw new Error("Camera stream is not active");
            }

            console.log("Camera stream obtained:", stream.active);
            streamRef.current = stream;

            if (videoRef.current) {
                console.log("Setting video source...");
                videoRef.current.srcObject = stream;

                // Wait for video to be ready with timeout
                await Promise.race([
                    new Promise<void>((resolve, reject) => {
                        if (!videoRef.current) {
                            reject(new Error("Video element not found"));
                            return;
                        }

                        videoRef.current.onloadedmetadata = () => {
                            console.log("Video metadata loaded");
                            console.log(
                                "Video dimensions:",
                                videoRef.current?.videoWidth,
                                "x",
                                videoRef.current?.videoHeight,
                            );
                            resolve();
                        };

                        videoRef.current.onerror = (e) => {
                            console.error("Video element error:", e);
                            reject(new Error("Video element error"));
                        };
                    }),
                    new Promise<void>((_, reject) =>
                        setTimeout(
                            () => reject(new Error("Video loading timeout")),
                            10000,
                        ),
                    ),
                ]);

                // Try to play
                try {
                    await videoRef.current.play();
                    console.log("Video playing successfully");
                } catch (playError) {
                    console.error("Error playing video:", playError);
                    // On mobile, play might fail initially, try again after interaction
                    throw playError;
                }
            }

            setCameraActive(true);

            // Start scanning after a short delay to ensure video is rendering
            setTimeout(() => {
                if (streamRef.current && streamRef.current.active) {
                    startScanning();
                } else {
                    setError("Camera stream became inactive");
                }
            }, 1000);
        } catch (err) {
            console.error("Error accessing camera:", err);
            stopCamera(); // Clean up on error
            const errorMessage =
                err instanceof Error ? err.message : "Unknown error";
            if (
                errorMessage.includes("Permission denied") ||
                errorMessage.includes("NotAllowedError")
            ) {
                setError(
                    "Camera access denied. Please allow camera permissions in your browser settings and try again.",
                );
            } else if (errorMessage.includes("not supported")) {
                setError(
                    "Camera is not supported. Please use HTTPS or localhost, or try manual entry.",
                );
            } else if (errorMessage.includes("timeout")) {
                setError(
                    "Camera initialization timed out. Please try again or use manual entry.",
                );
            } else {
                setError(
                    `Failed to access camera: ${errorMessage}. Please check permissions or use manual entry.`,
                );
            }
        }
    };

    const stopCamera = () => {
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
            scanIntervalRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setCameraActive(false);
        setScanning(false);
    };

    const startScanning = () => {
        setScanning(true);
        scanIntervalRef.current = setInterval(() => {
            captureAndDecodeQR();
        }, 500);
    };

    const captureAndDecodeQR = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
            return;
        }

        // Make sure video has valid dimensions
        if (video.videoWidth === 0 || video.videoHeight === 0) {
            console.log("Video dimensions not ready");
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Mirror the image back when drawing to canvas
        context.save();
        context.scale(-1, 1);
        context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        context.restore();

        try {
            const imageData = context.getImageData(
                0,
                0,
                canvas.width,
                canvas.height,
            );
            // Import dynamically to avoid SSR issues
            const jsQR = (await import("jsqr")).default;
            const code = jsQR(
                imageData.data,
                imageData.width,
                imageData.height,
                {
                    inversionAttempts: "dontInvert",
                },
            );

            if (code && code.data) {
                console.log("QR Code detected:", code.data);
                stopCamera();
                await verifyQRCode(code.data);
            }
        } catch (error) {
            console.error("Error decoding QR:", error);
        }
    };

    const verifyQRCode = async (qrData: string) => {
        try {
            setSubmitting(true);
            setScanResult(null);

            const response = await fetch(`/api/events/${eventId}/verify-qr`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ qrData }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setScanResult({
                    success: true,
                    message: result.message || "QR code verified successfully!",
                    data: result.data,
                });
            } else {
                setScanResult({
                    success: false,
                    message: result.message || "Failed to verify QR code",
                });
            }
        } catch (error) {
            console.error("Error verifying QR:", error);
            setScanResult({
                success: false,
                message: "An error occurred while verifying the QR code",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualCode.trim()) return;

        await verifyQRCode(manualCode.trim());
        setManualCode("");
    };

    const resetScanner = () => {
        setScanResult(null);
        setError("");
    };

    if (isPending || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                    {isPending ? "Loading session..." : "Loading event..."}
                </p>
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                            <h2 className="text-xl font-semibold mb-2">
                                Authentication Required
                            </h2>
                            <p className="text-muted-foreground mb-4">
                                Please sign in to access the QR scanner.
                            </p>
                            <Button onClick={() => router.push("/auth")}>
                                Sign In
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                            <h2 className="text-xl font-semibold mb-2">
                                Event Not Found
                            </h2>
                            <p className="text-muted-foreground mb-4">
                                The event you&apos;re looking for doesn&apos;t
                                exist.
                            </p>
                            <Button onClick={() => router.push("/events")}>
                                Back to Events
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.push(`/events/${eventId}`)}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Event
                    </Button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                QR Scanner
                            </h1>
                            <p className="text-muted-foreground">
                                {event.title}
                            </p>
                        </div>
                        <Badge
                            variant={
                                event.status === "running"
                                    ? "default"
                                    : "secondary"
                            }
                        >
                            {event.status}
                        </Badge>
                    </div>
                </div>

                <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        <strong>Camera Requirements:</strong> Make sure
                        you&apos;re using HTTPS (or localhost) and grant camera
                        permissions when prompted. If the camera doesn&apos;t
                        work, you can use manual entry below.
                    </AlertDescription>
                </Alert>

                {error && (
                    <Alert className="mb-6 border-destructive">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <AlertDescription className="text-destructive">
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

                {scanResult ? (
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                {scanResult.success ? (
                                    <>
                                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                                        <div>
                                            <h2 className="text-2xl font-bold text-green-500 mb-2">
                                                Verified!
                                            </h2>
                                            <p className="text-muted-foreground">
                                                {scanResult.message}
                                            </p>
                                        </div>

                                        {scanResult.data && (
                                            <div className="bg-muted rounded-lg p-4 text-left space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">
                                                        Team:
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                        {
                                                            scanResult.data
                                                                .teamName
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">
                                                        Type:
                                                    </span>
                                                    <span className="text-sm font-medium capitalize">
                                                        {scanResult.data.trackingType.replace(
                                                            "_",
                                                            " ",
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">
                                                        Label:
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                        {scanResult.data.label}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-16 w-16 text-destructive mx-auto" />
                                        <div>
                                            <h2 className="text-2xl font-bold text-destructive mb-2">
                                                Invalid
                                            </h2>
                                            <p className="text-muted-foreground">
                                                {scanResult.message}
                                            </p>
                                        </div>
                                    </>
                                )}

                                <Button
                                    onClick={resetScanner}
                                    className="w-full"
                                >
                                    Scan Another QR Code
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Camera className="h-5 w-5" />
                                    Camera Scanner
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!cameraActive ? (
                                    <div className="text-center py-8">
                                        <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground mb-4">
                                            Start the camera to scan QR codes
                                        </p>
                                        <Button
                                            onClick={startCamera}
                                            disabled={submitting}
                                        >
                                            <Camera className="h-4 w-4 mr-2" />
                                            Start Camera
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                                            <video
                                                ref={videoRef}
                                                className="w-full h-full object-cover"
                                                autoPlay
                                                playsInline
                                                muted
                                                style={{
                                                    transform: "scaleX(-1)",
                                                    WebkitTransform:
                                                        "scaleX(-1)",
                                                }}
                                            />
                                            <canvas
                                                ref={canvasRef}
                                                className="hidden"
                                            />
                                            {scanning && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <div className="border-4 border-primary rounded-lg w-64 h-64 animate-pulse" />
                                                </div>
                                            )}
                                            {cameraActive &&
                                                videoRef.current?.readyState !==
                                                    4 && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                                                    </div>
                                                )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={stopCamera}
                                                variant="outline"
                                                className="flex-1"
                                            >
                                                Stop Camera
                                            </Button>
                                        </div>
                                        {submitting && (
                                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Verifying QR code...
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Manual Entry</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleManualSubmit}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            QR Code ID
                                        </label>
                                        <input
                                            type="text"
                                            value={manualCode}
                                            onChange={(e) =>
                                                setManualCode(e.target.value)
                                            }
                                            placeholder="Enter QR code ID manually"
                                            className="w-full px-3 py-2 border rounded-md"
                                            disabled={submitting}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={
                                            !manualCode.trim() || submitting
                                        }
                                        className="w-full"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Verifying...
                                            </>
                                        ) : (
                                            "Verify Code"
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
}

"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    Users,
    Settings,
    Bell,
    TrendingUp,
    FileText,
    User,
    Shield,
    BarChart3,
    Clock,
    CheckCircle2,
    AlertCircle,
    Plus,
    UserPlus,
    Activity,
} from "lucide-react";

export default function DashboardPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/auth");
        }
    }, [session, isPending, router]);

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                    <p className="text-muted-foreground">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const user = session.user;
    const role = user.role || "user";

    // User/Applicant Dashboard
    if (role === "user") {
        return (
            <div className="min-h-screen bg-muted/30">
                <div className="container mx-auto px-4 py-8 space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Welcome back, {user.name}
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Manage your event registrations
                            </p>
                        </div>
                        <Badge variant="secondary" className="gap-2">
                            <User className="w-3 h-3" />
                            Applicant
                        </Badge>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Registered Events
                                </CardTitle>
                                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">12</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    +2 this month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Attended
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">8</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Past events
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Upcoming
                                </CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">4</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Events scheduled
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* My Registrations */}
                        <Card>
                            <CardHeader>
                                <CardTitle>My Registrations</CardTitle>
                                <CardDescription>
                                    Events you&apos;ve registered for
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">
                                            Tech Conference 2024
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Registered 2 days ago
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="bg-green-500/10 text-green-700 border-green-200"
                                    >
                                        Confirmed
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">
                                            Design Workshop
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Registered 5 days ago
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="bg-green-500/10 text-green-700 border-green-200"
                                    >
                                        Confirmed
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">
                                            Startup Pitch Event
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Registered 1 week ago
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="bg-green-500/10 text-green-700 border-green-200"
                                    >
                                        Confirmed
                                    </Badge>
                                </div>

                                <Button variant="outline" className="w-full">
                                    View All Registrations
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Upcoming Events */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming Events</CardTitle>
                                <CardDescription>
                                    Events you&apos;re attending
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3 p-3 rounded-lg border">
                                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">
                                            Design Workshop
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Dec 25, 2024 at 2:00 PM
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 rounded-lg border">
                                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">
                                            Startup Pitch Event
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Dec 28, 2024 at 10:00 AM
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 rounded-lg border">
                                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">
                                            Networking Mixer
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Jan 5, 2025 at 6:00 PM
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full gap-2"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Browse More Events
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common tasks</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                <Button variant="outline" className="gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Browse Events
                                </Button>
                                <Button variant="outline" className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    Register for Event
                                </Button>
                                <Button variant="outline" className="gap-2">
                                    <User className="w-4 h-4" />
                                    Edit Profile
                                </Button>
                                <Button variant="outline" className="gap-2">
                                    <Bell className="w-4 h-4" />
                                    Notifications
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Event Manager Dashboard
    if (role === "manager") {
        return (
            <div className="min-h-screen bg-muted/30">
                <div className="container mx-auto px-4 py-8 space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Event Manager Portal
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Manage your events and applications
                            </p>
                        </div>
                        <Badge variant="secondary" className="gap-2">
                            <Users className="w-3 h-3" />
                            Manager
                        </Badge>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Active Events
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">8</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    +2 from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Registrations
                                </CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">342</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Total registrations
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Check-ins
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">298</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Attended events
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Capacity
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">68%</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Average fill rate
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* My Events */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>My Events</CardTitle>
                                        <CardDescription>
                                            Events you&apos;re managing
                                        </CardDescription>
                                    </div>
                                    <Button size="sm" className="gap-2">
                                        <Plus className="w-4 h-4" />
                                        Create Event
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">
                                            Tech Conference 2024
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Dec 30, 2024 • 45 attendees
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="bg-green-500/10 text-green-700 border-green-200"
                                    >
                                        Active
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">
                                            Design Workshop
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Dec 25, 2024 • 32 attendees
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="bg-green-500/10 text-green-700 border-green-200"
                                    >
                                        Active
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">
                                            Networking Mixer
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Jan 5, 2025 • 28 attendees
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="bg-blue-500/10 text-blue-700 border-blue-200"
                                    >
                                        Upcoming
                                    </Badge>
                                </div>

                                <Button variant="outline" className="w-full">
                                    View All Events
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Recent Registrations */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Registrations</CardTitle>
                                <CardDescription>
                                    Latest event registrations
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">
                                                John Smith
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Registered for Tech Conference
                                                2024
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="bg-green-500/10 text-green-700 border-green-200"
                                    >
                                        Confirmed
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">
                                                Sarah Johnson
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Registered for Design Workshop
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="bg-green-500/10 text-green-700 border-green-200"
                                    >
                                        Confirmed
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">
                                                Mike Davis
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Registered for Networking Mixer
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="bg-green-500/10 text-green-700 border-green-200"
                                    >
                                        Confirmed
                                    </Badge>
                                </div>

                                <Button variant="outline" className="w-full">
                                    View All Registrations
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>
                                Latest updates on your events
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                                <div className="flex-1">
                                    <p className="text-sm">
                                        New registration for{" "}
                                        <span className="font-medium">
                                            Tech Conference 2024
                                        </span>
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        2 hours ago
                                    </p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                                <div className="flex-1">
                                    <p className="text-sm">
                                        Event published:{" "}
                                        <span className="font-medium">
                                            Networking Mixer
                                        </span>
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        5 hours ago
                                    </p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                                <div className="flex-1">
                                    <p className="text-sm">
                                        Capacity reached for{" "}
                                        <span className="font-medium">
                                            Design Workshop
                                        </span>
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        1 day ago
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Admin Dashboard
    if (role === "admin") {
        return (
            <div className="min-h-screen bg-muted/30">
                <div className="container mx-auto px-4 py-8 space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Admin Dashboard
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                System overview and management
                            </p>
                        </div>
                        <Badge variant="secondary" className="gap-2">
                            <Shield className="w-3 h-3" />
                            Administrator
                        </Badge>
                    </div>

                    {/* System Stats */}
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Users
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">2,456</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    +12% from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Events
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">187</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    +8% from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Event Managers
                                </CardTitle>
                                <UserPlus className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">48</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    +3 new this month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    System Health
                                </CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">99.9%</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Uptime
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* User Management */}
                        <Card>
                            <CardHeader>
                                <CardTitle>User Management</CardTitle>
                                <CardDescription>
                                    Manage system users and roles
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                Regular Users
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                2,360 users
                                            </p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline">
                                        Manage
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Users className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                Event Managers
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                48 managers
                                            </p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline">
                                        Manage
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Shield className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                Administrators
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                5 admins
                                            </p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline">
                                        Manage
                                    </Button>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full gap-2"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Add New User
                                </Button>
                            </CardContent>
                        </Card>

                        {/* System Analytics */}
                        <Card>
                            <CardHeader>
                                <CardTitle>System Analytics</CardTitle>
                                <CardDescription>
                                    Platform usage statistics
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Active Events
                                        </span>
                                        <span className="font-medium">
                                            142/187
                                        </span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full"
                                            style={{ width: "76%" }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            User Engagement
                                        </span>
                                        <span className="font-medium">84%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full"
                                            style={{ width: "84%" }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Application Rate
                                        </span>
                                        <span className="font-medium">92%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full"
                                            style={{ width: "92%" }}
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">
                                            Avg. Response Time
                                        </p>
                                        <p className="text-lg font-semibold">
                                            2.4h
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">
                                            User Satisfaction
                                        </p>
                                        <p className="text-lg font-semibold">
                                            4.8/5
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full gap-2"
                                >
                                    <BarChart3 className="w-4 h-4" />
                                    View Detailed Analytics
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Issues & System Logs */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Issues</CardTitle>
                                <CardDescription>
                                    System alerts and notifications
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-start gap-3 p-3 rounded-lg border border-yellow-200 bg-yellow-500/5">
                                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            High load detected
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Database queries taking longer than
                                            usual
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            30 minutes ago
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 rounded-lg border">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            Backup completed
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Database backup successful
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            2 hours ago
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 rounded-lg border">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            System update deployed
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Version 2.4.1 deployed successfully
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            5 hours ago
                                        </p>
                                    </div>
                                </div>

                                <Button variant="outline" className="w-full">
                                    View All Logs
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>
                                    Administrative tools
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-2"
                                >
                                    <Settings className="w-4 h-4" />
                                    System Settings
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-2"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Promote User to Manager
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-2"
                                >
                                    <BarChart3 className="w-4 h-4" />
                                    Generate Reports
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-2"
                                >
                                    <Bell className="w-4 h-4" />
                                    Send Announcement
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-2"
                                >
                                    <Shield className="w-4 h-4" />
                                    Security Settings
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // Default fallback
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="max-w-md">
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>
                        Your role is not recognized
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Please contact an administrator to set up your account
                        role.
                    </p>
                    <Button
                        className="w-full mt-4"
                        onClick={() => router.push("/")}
                    >
                        Return Home
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

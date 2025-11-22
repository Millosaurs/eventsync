import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

/**
 * GET /api/events/[id]
 * Fetches a single event by ID
 *
 * Response format:
 * {
 *   "success": true,
 *   "data": {
 *     "id": "string",
 *     "title": "string",
 *     "description": "string",
 *     "imageUrl": "string | null",
 *     "startDate": "string",
 *     "endDate": "string",
 *     "location": "string",
 *     "maxCapacity": "number | null",
 *     "registrationDeadline": "string",
 *     "status": "string",
 *     "managerId": "string",
 *     "teamId": "string | null",
 *     "createdAt": "string",
 *     "updatedAt": "string"
 *   },
 *   "message": "string"
 * }
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;

        // Validate ID format (UUID)
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return NextResponse.json(
                {
                    success: false,
                    data: null,
                    message: "Invalid event ID format",
                    error: "INVALID_ID",
                },
                { status: 400 },
            );
        }

        // Fetch event from database
        const events = await db
            .select({
                id: schema.event.id,
                title: schema.event.title,
                description: schema.event.description,
                imageUrl: schema.event.imageUrl,
                startDate: schema.event.startDate,
                endDate: schema.event.endDate,
                location: schema.event.location,
                maxCapacity: schema.event.maxCapacity,
                registrationDeadline: schema.event.registrationDeadline,
                status: schema.event.status,
                managerId: schema.event.managerId,
                teamId: schema.event.teamId,
                createdAt: schema.event.createdAt,
                updatedAt: schema.event.updatedAt,
            })
            .from(schema.event)
            .where(eq(schema.event.id, id))
            .limit(1);

        // Check if event exists
        if (!events || events.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    data: null,
                    message: "Event not found",
                    error: "NOT_FOUND",
                },
                { status: 404 },
            );
        }

        const event = events[0];

        // Return event data
        return NextResponse.json(
            {
                success: true,
                data: event,
                message: "Event fetched successfully",
            },
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "public, max-age=60, s-maxage=60",
                },
            },
        );
    } catch (error) {
        console.error("Error fetching event:", error);
        return NextResponse.json(
            {
                success: false,
                data: null,
                message: "Failed to fetch event",
                error:
                    error instanceof Error
                        ? error.message
                        : "INTERNAL_SERVER_ERROR",
            },
            { status: 500 },
        );
    }
}

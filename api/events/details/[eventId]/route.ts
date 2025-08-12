import { type NextRequest, NextResponse } from "next/server"
import { eventService } from "@/lib/supply-chain/event-service"

export async function GET(request: NextRequest, { params }: { params: { eventId: string } }) {
  try {
    const { eventId } = params

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    // Get event details with IPFS metadata
    const eventDetails = await eventService.getEventDetails(eventId)

    return NextResponse.json({
      message: "Event details retrieved successfully",
      event: eventDetails,
    })
  } catch (error: any) {
    console.error("Error getting event details:", error)
    return NextResponse.json({ error: error.message || "Failed to get event details" }, { status: 500 })
  }
}

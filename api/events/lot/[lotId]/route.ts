import { type NextRequest, NextResponse } from "next/server"
import { eventService } from "@/lib/supply-chain/event-service"

export async function GET(request: NextRequest, { params }: { params: { lotId: string } }) {
  try {
    const { lotId } = params

    if (!lotId) {
      return NextResponse.json({ error: "Lot ID is required" }, { status: 400 })
    }

    // Get events for lot
    const events = await eventService.getEventsForLot(lotId)

    return NextResponse.json({
      message: "Events retrieved successfully",
      events,
      count: events.length,
    })
  } catch (error: any) {
    console.error("Error getting events for lot:", error)
    return NextResponse.json({ error: error.message || "Failed to get events" }, { status: 500 })
  }
}

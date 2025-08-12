import { type NextRequest, NextResponse } from "next/server"
import { eventService } from "@/lib/supply-chain/event-service"

export async function GET(request: NextRequest, { params }: { params: { eventId: string } }) {
  try {
    const { eventId } = params

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    // Verify event
    const isValid = await eventService.verifyEvent(eventId)

    return NextResponse.json({
      message: "Event verification completed",
      eventId,
      isValid,
    })
  } catch (error: any) {
    console.error("Error verifying event:", error)
    return NextResponse.json({ error: error.message || "Failed to verify event" }, { status: 500 })
  }
}

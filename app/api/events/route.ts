import { type NextRequest, NextResponse } from "next/server"
import { eventService } from "@/lib/supply-chain/event-service"
import { verifyAuth } from "@/lib/auth/middleware"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const lotId = searchParams.get("lotId")
    const eventId = searchParams.get("eventId")

    switch (action) {
      case "lot":
        if (!lotId) {
          return NextResponse.json({ error: "Lot ID is required" }, { status: 400 })
        }
        const events = await eventService.getEventsForLot(lotId)
        return NextResponse.json({
          message: "Events retrieved successfully",
          events,
          count: events.length,
        })

      case "timeline":
        if (!lotId) {
          return NextResponse.json({ error: "Lot ID is required" }, { status: 400 })
        }
        const timeline = await eventService.getSupplyChainTimeline(lotId)
        return NextResponse.json({
          message: "Timeline retrieved successfully",
          timeline,
          count: timeline.length,
        })

      case "details":
        if (!eventId) {
          return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
        }
        const eventDetails = await eventService.getEventDetails(eventId)
        return NextResponse.json({
          message: "Event details retrieved successfully",
          event: eventDetails,
        })

      case "verify":
        if (!eventId) {
          return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
        }
        const isValid = await eventService.verifyEvent(eventId)
        return NextResponse.json({
          message: "Event verification completed",
          eventId,
          isValid,
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Event error:", error)
    return NextResponse.json({ error: error.message || "Event operation failed" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, lotId, location, metadata, documents, images } = body

    if (!type || !lotId) {
      return NextResponse.json({ error: "Type and lot ID are required" }, { status: 400 })
    }

    const validTypes = [
      "planting",
      "harvesting",
      "processing",
      "quality_check",
      "shipping",
      "delivery",
      "certification",
    ]
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 })
    }

    const event = await eventService.createEvent({
      type,
      lotId,
      actor: authResult.user!.did || "",
      location,
      metadata: metadata || {},
      documents,
      images,
    })

    return NextResponse.json({
      message: "Event created successfully",
      event,
    })
  } catch (error: any) {
    console.error("Event creation error:", error)
    return NextResponse.json({ error: error.message || "Failed to create event" }, { status: 500 })
  }
}

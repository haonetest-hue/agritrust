import { type NextRequest, NextResponse } from "next/server"
import { eventService } from "@/lib/supply-chain/event-service"
import { authMiddleware } from "@/lib/auth/middleware"

export async function POST(request: NextRequest) {
  // Apply auth middleware
  const authResult = await authMiddleware(request)
  if (authResult.status !== 200) return authResult

  try {
    const body = await request.json()
    const { type, lotId, location, metadata, documents, images } = body
    const actor = request.headers.get("x-user-did")!

    // Validate required fields
    if (!type || !lotId) {
      return NextResponse.json({ error: "Type and lot ID are required" }, { status: 400 })
    }

    // Validate event type
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

    // Create event
    const event = await eventService.createEvent({
      type,
      lotId,
      actor,
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

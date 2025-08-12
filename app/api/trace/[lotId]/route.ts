import { type NextRequest, NextResponse } from "next/server"
import { eventService } from "@/lib/supply-chain/event-service"

export async function GET(request: NextRequest, { params }: { params: { lotId: string } }) {
  try {
    const { lotId } = params

    if (!lotId) {
      return NextResponse.json({ error: "Lot ID is required" }, { status: 400 })
    }

    // Get supply chain timeline for traceability
    const timeline = await eventService.getSupplyChainTimeline(lotId)

    // Mock additional traceability data
    const traceabilityData = {
      lotId,
      timeline,
      summary: {
        totalEvents: timeline.length,
        verified: timeline.filter((e) => e.verified).length,
        lastUpdate: timeline.length > 0 ? timeline[timeline.length - 1].timestamp : new Date(),
        status: timeline.length > 0 ? "active" : "inactive",
      },
      locations: timeline
        .filter((e) => e.location)
        .map((e) => ({
          eventId: e.id,
          type: e.type,
          location: e.location,
          timestamp: e.timestamp,
        })),
      participants: [...new Set(timeline.map((e) => e.actor))],
      documents: timeline.flatMap((e) => e.documents || []),
      images: timeline.flatMap((e) => e.images || []),
    }

    return NextResponse.json({
      success: true,
      traceability: traceabilityData,
    })
  } catch (error: any) {
    console.error("Traceability error:", error)
    return NextResponse.json({ error: error.message || "Failed to get traceability data" }, { status: 500 })
  }
}

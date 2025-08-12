import { type NextRequest, NextResponse } from "next/server"
import { eventService } from "@/lib/supply-chain/event-service"

export async function GET(request: NextRequest, { params }: { params: { lotId: string } }) {
  try {
    const { lotId } = params

    if (!lotId) {
      return NextResponse.json({ error: "Lot ID is required" }, { status: 400 })
    }

    // Get supply chain timeline
    const timeline = await eventService.getSupplyChainTimeline(lotId)

    return NextResponse.json({
      message: "Timeline retrieved successfully",
      timeline,
      count: timeline.length,
    })
  } catch (error: any) {
    console.error("Error getting timeline:", error)
    return NextResponse.json({ error: error.message || "Failed to get timeline" }, { status: 500 })
  }
}

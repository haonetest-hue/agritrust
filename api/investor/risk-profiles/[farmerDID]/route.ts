import { type NextRequest, NextResponse } from "next/server"
import { investorAnalyticsService } from "@/lib/analytics/investor-analytics-service"
import { verifyAuth } from "@/lib/auth/middleware"

export async function GET(request: NextRequest, { params }: { params: { farmerDID: string } }) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { farmerDID } = params

    if (!farmerDID) {
      return NextResponse.json({ error: "Farmer DID is required" }, { status: 400 })
    }

    // Generate farmer risk profile
    const riskProfile = await investorAnalyticsService.generateFarmerRiskProfile(farmerDID)

    return NextResponse.json({
      success: true,
      riskProfile,
    })
  } catch (error) {
    console.error("Error generating farmer risk profile:", error)
    return NextResponse.json({ error: "Failed to generate risk profile" }, { status: 500 })
  }
}

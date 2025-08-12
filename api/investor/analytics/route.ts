import { type NextRequest, NextResponse } from "next/server"
import { investorAnalyticsService } from "@/lib/analytics/investor-analytics-service"
import { verifyAuth } from "@/lib/auth/middleware"

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "metrics"

    switch (type) {
      case "metrics":
        const metrics = await investorAnalyticsService.getInvestorMetrics(authResult.user.did)
        return NextResponse.json({ success: true, metrics })

      case "performance":
        const months = Number.parseInt(searchParams.get("months") || "12")
        const performance = await investorAnalyticsService.getPerformanceHistory(authResult.user.did, months)
        return NextResponse.json({ success: true, performance })

      case "risk":
        const riskAnalysis = await investorAnalyticsService.performRiskAnalysis(authResult.user.did)
        return NextResponse.json({ success: true, riskAnalysis })

      default:
        return NextResponse.json({ error: "Invalid analytics type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error fetching investor analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { investorAnalyticsService } from "@/lib/analytics/investor-analytics-service"
import { verifyAuth } from "@/lib/auth/middleware"

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const farmerDID = searchParams.get("farmerDID")

    switch (action) {
      case "metrics":
        const metrics = await investorAnalyticsService.getInvestorMetrics(authResult.user!.did || "")
        return NextResponse.json({ success: true, metrics })

      case "performance":
        const months = Number.parseInt(searchParams.get("months") || "12")
        const performance = await investorAnalyticsService.getPerformanceHistory(authResult.user!.did || "", months)
        return NextResponse.json({ success: true, performance })

      case "risk":
        const riskAnalysis = await investorAnalyticsService.performRiskAnalysis(authResult.user!.did || "")
        return NextResponse.json({ success: true, riskAnalysis })

      case "farmer-risk":
        if (!farmerDID) {
          return NextResponse.json({ error: "Farmer DID is required" }, { status: 400 })
        }
        const riskProfile = await investorAnalyticsService.generateFarmerRiskProfile(farmerDID)
        return NextResponse.json({
          success: true,
          riskProfile,
        })

      case "portfolio":
        const portfolio = await investorAnalyticsService.getPortfolioBreakdown(authResult.user!.did || "")
        return NextResponse.json({ success: true, portfolio })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Investor analytics error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch analytics" }, { status: 500 })
  }
}

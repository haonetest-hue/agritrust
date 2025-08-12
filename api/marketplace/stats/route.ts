import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // In production, calculate real stats from database
    const mockStats = {
      totalVolume: 2400000, // $2.4M USD
      volumeChange: 12.5, // +12.5%
      activeListings: 156,
      newListingsToday: 8,
      avgInterestRate: 14.2, // 14.2%
      interestRateChange: -0.8, // -0.8%
      activeTraders: 89,
      newTradersThisWeek: 5,
      totalTrades: 1247,
      successRate: 94.2, // 94.2%
      topCrops: [
        { crop: "Coffee", volume: 850000, percentage: 35.4 },
        { crop: "Cocoa", volume: 720000, percentage: 30.0 },
        { crop: "Rice", volume: 480000, percentage: 20.0 },
        { crop: "Palm Oil", volume: 350000, percentage: 14.6 },
      ],
      topRegions: [
        { region: "Sumatra", volume: 960000, percentage: 40.0 },
        { region: "Java", volume: 720000, percentage: 30.0 },
        { region: "Sulawesi", volume: 480000, percentage: 20.0 },
        { region: "Aceh", volume: 240000, percentage: 10.0 },
      ],
    }

    return NextResponse.json({
      success: true,
      stats: mockStats,
    })
  } catch (error) {
    console.error("Error fetching marketplace stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}

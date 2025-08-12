export interface InvestorMetrics {
  totalInvested: number
  totalReturns: number
  activeInvestments: number
  averageROI: number
  portfolioValue: number
  riskScore: number
}

export interface PerformanceData {
  month: string
  invested: number
  returns: number
  roi: number
}

export interface RiskAnalysis {
  overallRisk: "low" | "medium" | "high"
  riskScore: number
  factors: {
    diversification: number
    marketVolatility: number
    creditRisk: number
    liquidityRisk: number
  }
  recommendations: string[]
}

export interface FarmerRiskProfile {
  farmerDID: string
  riskScore: number
  creditRating: string
  factors: {
    paymentHistory: number
    cropDiversification: number
    weatherRisk: number
    marketExposure: number
  }
  recommendations: string[]
}

// Mock data storage
const investorData: Map<string, any> = new Map()

export class InvestorAnalyticsService {
  async getInvestorMetrics(investorDID: string): Promise<InvestorMetrics> {
    // Mock metrics - in production, calculate from real data
    return {
      totalInvested: Math.floor(Math.random() * 500000) + 50000,
      totalReturns: Math.floor(Math.random() * 100000) + 10000,
      activeInvestments: Math.floor(Math.random() * 20) + 5,
      averageROI: Math.random() * 0.15 + 0.08, // 8-23%
      portfolioValue: Math.floor(Math.random() * 600000) + 60000,
      riskScore: Math.random() * 100,
    }
  }

  async getPerformanceHistory(investorDID: string, months = 12): Promise<PerformanceData[]> {
    const data: PerformanceData[] = []
    const now = new Date()

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

      const invested = Math.floor(Math.random() * 50000) + 10000
      const returns = invested * (Math.random() * 0.15 + 0.05) // 5-20% returns

      data.push({
        month: monthName,
        invested,
        returns,
        roi: (returns / invested) * 100,
      })
    }

    return data
  }

  async performRiskAnalysis(investorDID: string): Promise<RiskAnalysis> {
    const diversification = Math.random() * 100
    const marketVolatility = Math.random() * 100
    const creditRisk = Math.random() * 100
    const liquidityRisk = Math.random() * 100

    const riskScore = (diversification + marketVolatility + creditRisk + liquidityRisk) / 4

    let overallRisk: "low" | "medium" | "high"
    if (riskScore < 33) overallRisk = "low"
    else if (riskScore < 66) overallRisk = "medium"
    else overallRisk = "high"

    const recommendations = [
      "Consider diversifying across different crop types",
      "Monitor weather patterns in investment regions",
      "Review farmer credit histories regularly",
      "Maintain adequate liquidity reserves",
    ]

    return {
      overallRisk,
      riskScore,
      factors: {
        diversification,
        marketVolatility,
        creditRisk,
        liquidityRisk,
      },
      recommendations,
    }
  }

  async generateFarmerRiskProfile(farmerDID: string): Promise<FarmerRiskProfile> {
    const paymentHistory = Math.random() * 100
    const cropDiversification = Math.random() * 100
    const weatherRisk = Math.random() * 100
    const marketExposure = Math.random() * 100

    const riskScore = (paymentHistory + cropDiversification + weatherRisk + marketExposure) / 4

    let creditRating: string
    if (riskScore >= 80) creditRating = "AAA"
    else if (riskScore >= 70) creditRating = "AA"
    else if (riskScore >= 60) creditRating = "A"
    else if (riskScore >= 50) creditRating = "BBB"
    else if (riskScore >= 40) creditRating = "BB"
    else creditRating = "B"

    const recommendations = [
      "Maintain consistent payment history",
      "Diversify crop portfolio to reduce risk",
      "Implement weather risk mitigation strategies",
      "Monitor market conditions regularly",
    ]

    return {
      farmerDID,
      riskScore,
      creditRating,
      factors: {
        paymentHistory,
        cropDiversification,
        weatherRisk,
        marketExposure,
      },
      recommendations,
    }
  }

  async getPortfolioBreakdown(investorDID: string): Promise<any> {
    // Mock portfolio breakdown
    return {
      byCrop: {
        Coffee: 35,
        Cocoa: 25,
        Rice: 20,
        Wheat: 15,
        Corn: 5,
      },
      byRegion: {
        Africa: 40,
        Asia: 30,
        "South America": 20,
        "North America": 10,
      },
      byRisk: {
        "Low Risk": 50,
        "Medium Risk": 35,
        "High Risk": 15,
      },
    }
  }
}

export const investorAnalyticsService = new InvestorAnalyticsService()

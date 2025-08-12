import { AgriCreditService } from "../nft/agricredit-service"
import { labAttestationService } from "../lab/attestation-service"

export interface InvestorMetrics {
  totalInvested: number
  currentValue: number
  totalReturns: number
  roi: number
  activeInvestments: number
  completedInvestments: number
  defaultedInvestments: number
  defaultRate: number
  avgInterestRate: number
  portfolioRiskScore: number
  diversificationScore: number
  liquidityScore: number
}

export interface PerformanceData {
  date: string
  totalInvested: number
  totalReturns: number
  roi: number
  activeInvestments: number
}

export interface RiskAnalysis {
  valueAtRisk95: number
  expectedShortfall: number
  riskDistribution: {
    lowRisk: number
    mediumRisk: number
    highRisk: number
    veryHighRisk: number
  }
  concentrationRisk: number
  creditRisk: number
  marketRisk: number
}

export interface FarmerRiskProfile {
  farmerDID: string
  farmerName: string
  reputationScore: number
  completedTransactions: number
  onTimeDeliveryRate: number
  qualityConsistency: number
  defaultHistory: number
  avgQualityGrade: number
  riskCategory: "low" | "medium" | "high" | "very_high"
  creditLimit: number
  interestRateAdjustment: number
}

export class InvestorAnalyticsService {
  private agriCreditService: AgriCreditService

  constructor() {
    this.agriCreditService = new AgriCreditService()
  }

  // Get comprehensive investor metrics
  async getInvestorMetrics(investorDID: string): Promise<InvestorMetrics> {
    try {
      // In production, query database for investor's investments
      const investments = await this.getInvestorInvestments(investorDID)

      const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
      const totalReturns = investments
        .filter((inv) => inv.status === "completed")
        .reduce((sum, inv) => sum + (inv.actualReturn || 0), 0)

      const activeInvestments = investments.filter((inv) => inv.status === "active").length
      const completedInvestments = investments.filter((inv) => inv.status === "completed").length
      const defaultedInvestments = investments.filter((inv) => inv.status === "defaulted").length

      const defaultRate = completedInvestments > 0 ? (defaultedInvestments / completedInvestments) * 100 : 0
      const avgInterestRate =
        investments.length > 0 ? investments.reduce((sum, inv) => sum + inv.interestRate, 0) / investments.length : 0

      const currentValue = totalInvested + totalReturns
      const roi = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0

      // Calculate risk scores
      const portfolioRiskScore = await this.calculatePortfolioRiskScore(investments)
      const diversificationScore = this.calculateDiversificationScore(investments)
      const liquidityScore = this.calculateLiquidityScore(investments)

      return {
        totalInvested,
        currentValue,
        totalReturns,
        roi,
        activeInvestments,
        completedInvestments,
        defaultedInvestments,
        defaultRate,
        avgInterestRate,
        portfolioRiskScore,
        diversificationScore,
        liquidityScore,
      }
    } catch (error) {
      console.error("Error calculating investor metrics:", error)
      throw new Error("Failed to calculate investor metrics")
    }
  }

  // Get performance data over time
  async getPerformanceHistory(investorDID: string, months = 12): Promise<PerformanceData[]> {
    try {
      // In production, query historical data from database
      const performanceData: PerformanceData[] = []

      for (let i = months - 1; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)

        // Mock calculation - in production, calculate actual historical values
        const totalInvested = 85000 + i * 5000
        const totalReturns = totalInvested * 0.08 + Math.random() * 2000
        const roi = (totalReturns / totalInvested) * 100
        const activeInvestments = 8 + Math.floor(Math.random() * 6)

        performanceData.push({
          date: date.toISOString().split("T")[0],
          totalInvested,
          totalReturns,
          roi,
          activeInvestments,
        })
      }

      return performanceData
    } catch (error) {
      console.error("Error getting performance history:", error)
      return []
    }
  }

  // Perform comprehensive risk analysis
  async performRiskAnalysis(investorDID: string): Promise<RiskAnalysis> {
    try {
      const investments = await this.getInvestorInvestments(investorDID)
      const totalValue = investments.reduce((sum, inv) => sum + inv.amount, 0)

      // Calculate Value at Risk (95% confidence)
      const returns = investments.map((inv) => (inv.actualReturn || inv.expectedReturn) / inv.amount - 1)
      const sortedReturns = returns.sort((a, b) => a - b)
      const var95Index = Math.floor(returns.length * 0.05)
      const valueAtRisk95 = totalValue * Math.abs(sortedReturns[var95Index] || 0.1)

      // Calculate Expected Shortfall
      const tailReturns = sortedReturns.slice(0, var95Index + 1)
      const avgTailReturn = tailReturns.reduce((sum, ret) => sum + ret, 0) / tailReturns.length
      const expectedShortfall = totalValue * Math.abs(avgTailReturn)

      // Risk distribution
      const riskDistribution = {
        lowRisk: investments.filter((inv) => inv.riskScore >= 80).length,
        mediumRisk: investments.filter((inv) => inv.riskScore >= 60 && inv.riskScore < 80).length,
        highRisk: investments.filter((inv) => inv.riskScore >= 40 && inv.riskScore < 60).length,
        veryHighRisk: investments.filter((inv) => inv.riskScore < 40).length,
      }

      // Risk metrics
      const concentrationRisk = this.calculateConcentrationRisk(investments)
      const creditRisk = this.calculateCreditRisk(investments)
      const marketRisk = this.calculateMarketRisk(investments)

      return {
        valueAtRisk95,
        expectedShortfall,
        riskDistribution,
        concentrationRisk,
        creditRisk,
        marketRisk,
      }
    } catch (error) {
      console.error("Error performing risk analysis:", error)
      throw new Error("Failed to perform risk analysis")
    }
  }

  // Generate farmer risk profiles
  async generateFarmerRiskProfile(farmerDID: string): Promise<FarmerRiskProfile> {
    try {
      // Get farmer's transaction history
      const transactions = await this.getFarmerTransactionHistory(farmerDID)
      const attestations = await labAttestationService.getAttestationsForLot("") // Get all farmer's lots

      // Calculate metrics
      const completedTransactions = transactions.filter((t) => t.status === "completed").length
      const onTimeDeliveries = transactions.filter((t) => t.deliveredOnTime).length
      const onTimeDeliveryRate = completedTransactions > 0 ? (onTimeDeliveries / completedTransactions) * 100 : 0

      const qualityGrades = attestations.map((a) => a.testResult.overallGrade)
      const avgQualityGrade =
        qualityGrades.length > 0 ? qualityGrades.reduce((a, b) => a + b, 0) / qualityGrades.length : 0
      const qualityConsistency = this.calculateQualityConsistency(qualityGrades)

      const defaultHistory = transactions.filter((t) => t.status === "defaulted").length
      const defaultRate = completedTransactions > 0 ? (defaultHistory / completedTransactions) * 100 : 0

      // Calculate reputation score
      const reputationScore = this.calculateReputationScore({
        onTimeDeliveryRate,
        avgQualityGrade,
        qualityConsistency,
        defaultRate,
        completedTransactions,
      })

      // Determine risk category
      let riskCategory: FarmerRiskProfile["riskCategory"] = "medium"
      if (reputationScore >= 80) riskCategory = "low"
      else if (reputationScore >= 60) riskCategory = "medium"
      else if (reputationScore >= 40) riskCategory = "high"
      else riskCategory = "very_high"

      // Calculate credit limit and interest rate adjustment
      const baseCreditLimit = 50000
      const creditLimit = baseCreditLimit * (reputationScore / 100) * 1.5
      const baseInterestRate = 15
      const interestRateAdjustment = (80 - reputationScore) * 0.1

      return {
        farmerDID,
        farmerName: "Farmer Name", // Get from identity service
        reputationScore,
        completedTransactions,
        onTimeDeliveryRate,
        qualityConsistency,
        defaultHistory,
        avgQualityGrade,
        riskCategory,
        creditLimit,
        interestRateAdjustment,
      }
    } catch (error) {
      console.error("Error generating farmer risk profile:", error)
      throw new Error("Failed to generate farmer risk profile")
    }
  }

  // Private helper methods
  private async getInvestorInvestments(investorDID: string): Promise<any[]> {
    // Mock data - in production, query database
    return [
      {
        id: "INV-001",
        amount: 15000,
        interestRate: 12.5,
        status: "active",
        riskScore: 75,
        expectedReturn: 1875,
        crop: "Coffee",
        region: "Aceh",
      },
      // Add more mock investments
    ]
  }

  private async calculatePortfolioRiskScore(investments: any[]): Promise<number> {
    if (investments.length === 0) return 0

    const weightedRiskScore = investments.reduce((sum, inv) => {
      const weight = inv.amount / investments.reduce((total, i) => total + i.amount, 0)
      return sum + inv.riskScore * weight
    }, 0)

    return Math.round(weightedRiskScore)
  }

  private calculateDiversificationScore(investments: any[]): number {
    if (investments.length === 0) return 0

    // Calculate diversification across crops, regions, farmers
    const crops = new Set(investments.map((inv) => inv.crop))
    const regions = new Set(investments.map((inv) => inv.region))

    const cropDiversification = Math.min(crops.size / 4, 1) * 40 // Max 40 points for crop diversity
    const regionDiversification = Math.min(regions.size / 5, 1) * 30 // Max 30 points for region diversity
    const sizeDiversification = Math.min(investments.length / 10, 1) * 30 // Max 30 points for number of investments

    return Math.round(cropDiversification + regionDiversification + sizeDiversification)
  }

  private calculateLiquidityScore(investments: any[]): number {
    if (investments.length === 0) return 0

    // Calculate based on time to maturity and market liquidity
    const avgDaysToMaturity = investments.reduce((sum, inv) => sum + (inv.daysToMaturity || 90), 0) / investments.length

    // Shorter maturity = higher liquidity
    const maturityScore = Math.max(0, 100 - avgDaysToMaturity / 3)

    return Math.round(maturityScore)
  }

  private calculateConcentrationRisk(investments: any[]): number {
    // Calculate Herfindahl-Hirschman Index for concentration
    const totalValue = investments.reduce((sum, inv) => sum + inv.amount, 0)
    const hhi = investments.reduce((sum, inv) => {
      const share = inv.amount / totalValue
      return sum + share * share
    }, 0)

    return Math.round(hhi * 100)
  }

  private calculateCreditRisk(investments: any[]): number {
    // Average risk score weighted by investment amount
    const totalValue = investments.reduce((sum, inv) => sum + inv.amount, 0)
    const weightedRisk = investments.reduce((sum, inv) => {
      const weight = inv.amount / totalValue
      return sum + (100 - inv.riskScore) * weight
    }, 0)

    return Math.round(weightedRisk)
  }

  private calculateMarketRisk(investments: any[]): number {
    // Simplified market risk based on crop price volatility
    const cropVolatility = {
      Coffee: 25,
      Cocoa: 30,
      Rice: 15,
      "Palm Oil": 35,
    }

    const totalValue = investments.reduce((sum, inv) => sum + inv.amount, 0)
    const weightedVolatility = investments.reduce((sum, inv) => {
      const weight = inv.amount / totalValue
      const volatility = cropVolatility[inv.crop as keyof typeof cropVolatility] || 20
      return sum + volatility * weight
    }, 0)

    return Math.round(weightedVolatility)
  }

  private async getFarmerTransactionHistory(farmerDID: string): Promise<any[]> {
    // Mock data - in production, query database
    return []
  }

  private calculateQualityConsistency(grades: number[]): number {
    if (grades.length < 2) return 100

    const mean = grades.reduce((a, b) => a + b, 0) / grades.length
    const variance = grades.reduce((sum, grade) => sum + Math.pow(grade - mean, 2), 0) / grades.length
    const standardDeviation = Math.sqrt(variance)

    // Lower standard deviation = higher consistency
    return Math.max(0, 100 - standardDeviation * 2)
  }

  private calculateReputationScore(metrics: {
    onTimeDeliveryRate: number
    avgQualityGrade: number
    qualityConsistency: number
    defaultRate: number
    completedTransactions: number
  }): number {
    const { onTimeDeliveryRate, avgQualityGrade, qualityConsistency, defaultRate, completedTransactions } = metrics

    // Weighted scoring
    const deliveryScore = onTimeDeliveryRate * 0.25
    const qualityScore = avgQualityGrade * 0.3
    const consistencyScore = qualityConsistency * 0.2
    const reliabilityScore = Math.max(0, 100 - defaultRate * 10) * 0.15
    const experienceScore = Math.min(completedTransactions * 2, 100) * 0.1

    return Math.round(deliveryScore + qualityScore + consistencyScore + reliabilityScore + experienceScore)
  }
}

export const investorAnalyticsService = new InvestorAnalyticsService()

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, DollarSign, AlertTriangle, Target, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react"

interface PortfolioSummary {
  totalInvested: number
  currentValue: number
  totalReturns: number
  roi: number
  activeInvestments: number
  completedInvestments: number
  defaultRate: number
  avgInterestRate: number
}

interface Investment {
  id: string
  lotId: string
  farmerName: string
  crop: string
  region: string
  amount: number
  interestRate: number
  dueDate: string
  status: "active" | "completed" | "defaulted" | "overdue"
  riskScore: number
  expectedReturn: number
  actualReturn?: number
  daysToMaturity: number
}

interface MarketInsight {
  metric: string
  value: string
  change: number
  trend: "up" | "down" | "stable"
}

export default function InvestorDashboardPage() {
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null)
  const [investments, setInvestments] = useState<Investment[]>([])
  const [marketInsights, setMarketInsights] = useState<MarketInsight[]>([])
  const [performanceData, setPerformanceData] = useState<any[]>([])
  const [riskDistribution, setRiskDistribution] = useState<any[]>([])
  const [cropDistribution, setCropDistribution] = useState<any[]>([])

  useEffect(() => {
    // Mock data - in production, fetch from API
    setPortfolioSummary({
      totalInvested: 125000,
      currentValue: 150875, // 20.7% APY growth
      totalReturns: 25875, // 20.7% returns
      roi: 20.7, // Consistent with homepage APY
      activeInvestments: 12,
      completedInvestments: 28,
      defaultRate: 2.1,
      avgInterestRate: 18.7, // Base APY from data set
    })

    setInvestments([
      {
        id: "INV-001",
        lotId: "LOT-001",
        farmerName: "Budi Santoso",
        crop: "Coffee",
        region: "Aceh",
        amount: 15000,
        interestRate: 18.7, // Updated to base APY
        dueDate: "2025-03-15",
        status: "active",
        riskScore: 75,
        expectedReturn: 2805, // 18.7% APY
        daysToMaturity: 45,
      },
      {
        id: "INV-002",
        lotId: "LOT-002",
        farmerName: "Sari Dewi",
        crop: "Cocoa",
        region: "Sulawesi",
        amount: 22000,
        interestRate: 19.2, // Slight premium for higher risk
        dueDate: "2025-04-20",
        status: "active",
        riskScore: 68,
        expectedReturn: 4224, // 19.2% APY
        daysToMaturity: 81,
      },
      {
        id: "INV-003",
        lotId: "LOT-003",
        farmerName: "Ahmad Rizki",
        crop: "Rice",
        region: "Java",
        amount: 8500,
        interestRate: 20.5, // Higher rate for higher risk
        dueDate: "2025-02-28",
        status: "overdue",
        riskScore: 45,
        expectedReturn: 1743, // 20.5% APY
        daysToMaturity: -5,
      },
      {
        id: "INV-004",
        lotId: "LOT-004",
        farmerName: "Indira Sari",
        crop: "Palm Oil",
        region: "Sumatra",
        amount: 35000,
        interestRate: 18.7, // Base APY
        dueDate: "2024-12-15",
        status: "completed",
        riskScore: 82,
        expectedReturn: 6545,
        actualReturn: 6545,
        daysToMaturity: 0,
      },
    ])

    setMarketInsights([
      { metric: "Avg Interest Rate", value: "18.7%", change: -0.3, trend: "down" }, // Updated to base APY
      { metric: "Default Rate", value: "2.1%", change: 0.3, trend: "up" },
      { metric: "Active Listings", value: "156", change: 12, trend: "up" },
      { metric: "Market Volume", value: "$30B", change: 15.2, trend: "up" }, // Updated to target volume
    ])

    setPerformanceData([
      { month: "Aug", invested: 85000, returns: 7200, roi: 8.5 },
      { month: "Sep", invested: 92000, returns: 8800, roi: 9.6 },
      { month: "Oct", invested: 105000, returns: 10500, roi: 10.0 },
      { month: "Nov", invested: 118000, returns: 12400, roi: 10.5 },
      { month: "Dec", invested: 125000, returns: 13750, roi: 11.0 },
      { month: "Jan", invested: 125000, returns: 13750, roi: 11.0 },
    ])

    setRiskDistribution([
      { name: "Low Risk (80-100)", value: 35, color: "#22c55e" },
      { name: "Medium Risk (60-79)", value: 45, color: "#f59e0b" },
      { name: "High Risk (40-59)", value: 15, color: "#ef4444" },
      { name: "Very High Risk (<40)", value: 5, color: "#dc2626" },
    ])

    setCropDistribution([
      { name: "Coffee", value: 40, amount: 50000 },
      { name: "Cocoa", value: 30, amount: 37500 },
      { name: "Rice", value: 20, amount: 25000 },
      { name: "Palm Oil", value: 10, amount: 12500 },
    ])
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "overdue":
        return "destructive"
      case "defaulted":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    if (score >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (!portfolioSummary) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Investor Analytics</h1>
          <p className="text-muted-foreground">Monitor your AgriCredit investment portfolio</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Target className="w-4 h-4 mr-2" />
            New Investment
          </Button>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(portfolioSummary.totalInvested)}</div>
            <p className="text-xs text-muted-foreground">Across {portfolioSummary.activeInvestments} investments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(portfolioSummary.currentValue)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />+{portfolioSummary.roi}% ROI
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(portfolioSummary.totalReturns)}</div>
            <p className="text-xs text-muted-foreground">Avg {portfolioSummary.avgInterestRate}% interest rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Default Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{portfolioSummary.defaultRate}%</div>
            <p className="text-xs text-muted-foreground">
              {portfolioSummary.completedInvestments} completed investments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Market Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Market Insights</CardTitle>
          <CardDescription>Key market metrics and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {marketInsights.map((insight, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">{insight.metric}</p>
                  <p className="text-2xl font-bold">{insight.value}</p>
                </div>
                <div className="flex items-center">
                  {insight.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : insight.trend === "down" ? (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  ) : (
                    <div className="w-4 h-4" />
                  )}
                  <span
                    className={`text-sm ml-1 ${
                      insight.trend === "up" ? "text-green-500" : insight.trend === "down" ? "text-red-500" : ""
                    }`}
                  >
                    {insight.change > 0 ? "+" : ""}
                    {insight.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Analytics */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Investment value and returns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [formatCurrency(Number(value)), name]} />
                    <Legend />
                    <Line type="monotone" dataKey="invested" stroke="#8884d8" name="Total Invested" />
                    <Line type="monotone" dataKey="returns" stroke="#82ca9d" name="Total Returns" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI Trend</CardTitle>
                <CardDescription>Return on investment percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, "ROI"]} />
                    <Area type="monotone" dataKey="roi" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Crop Distribution</CardTitle>
                <CardDescription>Investment allocation by crop type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={cropDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {cropDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 90}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Allocation"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment by Amount</CardTitle>
                <CardDescription>Distribution of investment amounts</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cropDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Amount"]} />
                    <Bar dataKey="amount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Portfolio risk profile breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
                <CardDescription>Key risk indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Portfolio Risk Score</span>
                    <span className="font-medium">72/100</span>
                  </div>
                  <Progress value={72} className="mt-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Diversification Score</span>
                    <span className="font-medium">85/100</span>
                  </div>
                  <Progress value={85} className="mt-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Liquidity Score</span>
                    <span className="font-medium">68/100</span>
                  </div>
                  <Progress value={68} className="mt-2" />
                </div>
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Value at Risk (95%)</span>
                    <span className="text-sm font-medium">{formatCurrency(8750)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Expected Shortfall</span>
                    <span className="text-sm font-medium">{formatCurrency(12500)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="investments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investment Portfolio</CardTitle>
              <CardDescription>Detailed view of all investments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Investment ID</TableHead>
                    <TableHead>Farmer</TableHead>
                    <TableHead>Crop</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Interest Rate</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Days to Maturity</TableHead>
                    <TableHead>Expected Return</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investments.map((investment) => (
                    <TableRow key={investment.id}>
                      <TableCell className="font-medium">{investment.id}</TableCell>
                      <TableCell>{investment.farmerName}</TableCell>
                      <TableCell>{investment.crop}</TableCell>
                      <TableCell>{investment.region}</TableCell>
                      <TableCell>{formatCurrency(investment.amount)}</TableCell>
                      <TableCell>{investment.interestRate}%</TableCell>
                      <TableCell>
                        <span className={getRiskColor(investment.riskScore)}>{investment.riskScore}/100</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(investment.status) as any}>
                          {investment.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={investment.daysToMaturity < 0 ? "text-red-600" : ""}>
                          {investment.daysToMaturity < 0 ? "Overdue" : `${investment.daysToMaturity} days`}
                        </span>
                      </TableCell>
                      <TableCell className="text-green-600">
                        {formatCurrency(investment.actualReturn || investment.expectedReturn)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

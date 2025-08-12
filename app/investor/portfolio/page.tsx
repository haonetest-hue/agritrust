"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  TrendingUp,
  Target,
  Clock,
  Shield,
  Globe,
  Truck,
  CheckCircle,
  LucidePieChart,
  BarChart3,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import {
  PieChart as RechartsPieChart,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Pie,
} from "recharts"

interface Investment {
  id: string
  invoiceId: string
  containerId: string
  supplierName: string
  commodity: string
  route: string
  investmentAmount: number
  expectedReturn: number
  actualReturn?: number
  expectedAPY: number
  actualAPY?: number
  term: number
  daysRemaining: number
  status: "active" | "completed" | "overdue"
  shippingStatus: string
  riskGrade: string
  investmentDate: string
  expectedPayoutDate: string
  actualPayoutDate?: string
  progress: number
}

interface PortfolioStats {
  totalInvested: number
  totalReturns: number
  activeInvestments: number
  completedInvestments: number
  averageAPY: number
  successRate: number
  totalROI: number
}

export default function InvestorPortfolioPage() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data fetch
    const mockInvestments: Investment[] = [
      {
        id: "INV-001",
        invoiceId: "INV-005",
        containerId: "MSKU7834156",
        supplierName: "Budi Santoso Cooperative",
        commodity: "Coffee Arabica Premium",
        route: "Jakarta → Hamburg",
        investmentAmount: 25000,
        expectedReturn: 375,
        expectedAPY: 18.7,
        term: 45,
        daysRemaining: 12,
        status: "active",
        shippingStatus: "in-transit",
        riskGrade: "A+",
        investmentDate: "2025-01-15",
        expectedPayoutDate: "2025-03-01",
        progress: 73,
      },
      {
        id: "INV-002",
        invoiceId: "INV-003",
        containerId: "TCLU9876543",
        supplierName: "Ghana Cocoa Collective",
        commodity: "Cocoa Beans Premium",
        route: "Tema → Rotterdam",
        investmentAmount: 50000,
        expectedReturn: 1050,
        actualReturn: 1050,
        expectedAPY: 22.3,
        actualAPY: 22.3,
        term: 35,
        daysRemaining: 0,
        status: "completed",
        shippingStatus: "delivered",
        riskGrade: "A",
        investmentDate: "2024-12-20",
        expectedPayoutDate: "2025-01-24",
        actualPayoutDate: "2025-01-24",
        progress: 100,
      },
      {
        id: "INV-003",
        invoiceId: "INV-007",
        containerId: "HLBU5432109",
        supplierName: "Colombian Coffee Alliance",
        commodity: "Coffee Arabica Specialty",
        route: "Cartagena → Miami",
        investmentAmount: 15000,
        expectedReturn: 270,
        expectedAPY: 25.2,
        term: 28,
        daysRemaining: 8,
        status: "active",
        shippingStatus: "loading",
        riskGrade: "A+",
        investmentDate: "2025-01-20",
        expectedPayoutDate: "2025-02-17",
        progress: 71,
      },
      {
        id: "INV-004",
        invoiceId: "INV-001",
        containerId: "MSCU1234567",
        supplierName: "Brazilian Coffee Estates",
        commodity: "Coffee Arabica Santos",
        route: "Santos → Hamburg",
        investmentAmount: 30000,
        expectedReturn: 450,
        actualReturn: 450,
        expectedAPY: 19.5,
        actualAPY: 19.5,
        term: 42,
        daysRemaining: 0,
        status: "completed",
        shippingStatus: "delivered",
        riskGrade: "A",
        investmentDate: "2024-12-01",
        expectedPayoutDate: "2025-01-12",
        actualPayoutDate: "2025-01-12",
        progress: 100,
      },
      {
        id: "INV-005",
        invoiceId: "INV-008",
        containerId: "OOLU8765432",
        supplierName: "Ethiopian Highlands Co-op",
        commodity: "Coffee Arabica Single Origin",
        route: "Djibouti → Hamburg",
        investmentAmount: 20000,
        expectedReturn: 240,
        expectedAPY: 15.8,
        term: 52,
        daysRemaining: 28,
        status: "active",
        shippingStatus: "preparing",
        riskGrade: "A",
        investmentDate: "2025-01-05",
        expectedPayoutDate: "2025-02-26",
        progress: 46,
      },
    ]

    const mockStats: PortfolioStats = {
      totalInvested: 140000,
      totalReturns: 2385,
      activeInvestments: 3,
      completedInvestments: 2,
      averageAPY: 20.3,
      successRate: 100,
      totalROI: 1.7,
    }

    setInvestments(mockInvestments)
    setPortfolioStats(mockStats)
    setIsLoading(false)
  }, [])

  const activeInvestments = investments.filter((inv) => inv.status === "active")
  const completedInvestments = investments.filter((inv) => inv.status === "completed")

  // Commodity diversification data
  const commodityData = investments.reduce(
    (acc, inv) => {
      const commodity = inv.commodity.split(" ")[0] // Get first word (Coffee, Cocoa, etc.)
      const existing = acc.find((item) => item.name === commodity)
      if (existing) {
        existing.value += inv.investmentAmount
      } else {
        acc.push({ name: commodity, value: inv.investmentAmount })
      }
      return acc
    },
    [] as { name: string; value: number }[],
  )

  // Performance comparison data
  const performanceData = completedInvestments.map((inv) => ({
    name: inv.commodity.split(" ")[0],
    expected: inv.expectedAPY,
    actual: inv.actualAPY || 0,
  }))

  const COLORS = ["#8b5cf6", "#f97316", "#06b6d4", "#10b981", "#f59e0b"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-700"
      case "completed":
        return "bg-green-100 text-green-700"
      case "overdue":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getShippingStatusColor = (status: string) => {
    switch (status) {
      case "preparing":
        return "bg-gray-100 text-gray-700"
      case "loading":
        return "bg-blue-100 text-blue-700"
      case "in-transit":
        return "bg-purple-100 text-purple-700"
      case "delivered":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (isLoading || !portfolioStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-orange-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                Investment Portfolio
              </span>
              <div className="text-xs text-muted-foreground">{investments.length} total investments</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/investor/marketplace">
                <Target className="w-4 h-4 mr-2" />
                Browse Invoices
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/investor">← Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Invested</p>
                  <p className="text-2xl font-bold">${portfolioStats.totalInvested.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Returns</p>
                  <p className="text-2xl font-bold text-green-600">+${portfolioStats.totalReturns.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average APY</p>
                  <p className="text-2xl font-bold text-purple-600">{portfolioStats.averageAPY.toFixed(1)}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <LucidePieChart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-orange-600">{portfolioStats.successRate}%</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LucidePieChart className="h-5 w-5 mr-2" />
                Commodity Diversification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={commodityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {commodityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Investment"]} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Performance Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="expected" fill="#8b5cf6" name="Expected APY" />
                  <Bar dataKey="actual" fill="#10b981" name="Actual APY" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Investment Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Investments ({activeInvestments.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed Investments ({completedInvestments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activeInvestments.map((investment) => (
              <Card key={investment.id}>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold">{investment.commodity}</h3>
                          <p className="text-muted-foreground">{investment.supplierName}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className="bg-green-100 text-green-700 border-green-300">
                              Risk {investment.riskGrade}
                            </Badge>
                            <Badge className={getShippingStatusColor(investment.shippingStatus)} variant="outline">
                              {investment.shippingStatus.replace("-", " ")}
                            </Badge>
                            <Badge className={getStatusColor(investment.status)}>{investment.status}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{investment.expectedAPY.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Expected APY</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <div className="text-muted-foreground">Container</div>
                          <div className="font-medium flex items-center">
                            <Truck className="h-3 w-3 mr-1 text-blue-600" />
                            {investment.containerId}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Route</div>
                          <div className="font-medium flex items-center">
                            <Globe className="h-3 w-3 mr-1 text-purple-600" />
                            {investment.route.split(" → ")[1]}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Investment</div>
                          <div className="font-bold text-blue-600">${investment.investmentAmount.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Expected Return</div>
                          <div className="font-bold text-green-600">+${investment.expectedReturn.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress ({investment.daysRemaining} days remaining)</span>
                          <span>{investment.progress}%</span>
                        </div>
                        <Progress value={investment.progress} className="h-2" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-3">Investment Timeline</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            </div>
                            <div>
                              <div className="font-medium">Investment Made</div>
                              <div className="text-muted-foreground">
                                {new Date(investment.investmentDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <Clock className="h-3 w-3 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">Expected Payout</div>
                              <div className="text-muted-foreground">
                                {new Date(investment.expectedPayoutDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                        <Link href={`/shared/lot-viewer/${investment.containerId}`}>
                          <Globe className="w-4 h-4 mr-2" />
                          Track Shipment
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {activeInvestments.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No active investments</h3>
                <p className="text-muted-foreground mb-4">Start investing in agricultural invoices to see them here</p>
                <Button asChild className="bg-gradient-to-r from-purple-600 to-orange-600">
                  <Link href="/investor/marketplace">
                    <Target className="w-4 h-4 mr-2" />
                    Browse Invoices
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedInvestments.map((investment) => (
              <Card key={investment.id}>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold">{investment.commodity}</h3>
                          <p className="text-muted-foreground">{investment.supplierName}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className="bg-green-100 text-green-700 border-green-300">
                              Risk {investment.riskGrade}
                            </Badge>
                            <Badge className={getShippingStatusColor(investment.shippingStatus)} variant="outline">
                              {investment.shippingStatus}
                            </Badge>
                            <Badge className={getStatusColor(investment.status)}>{investment.status}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{investment.actualAPY?.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Actual APY</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <div className="text-muted-foreground">Container</div>
                          <div className="font-medium flex items-center">
                            <Truck className="h-3 w-3 mr-1 text-blue-600" />
                            {investment.containerId}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Route</div>
                          <div className="font-medium flex items-center">
                            <Globe className="h-3 w-3 mr-1 text-purple-600" />
                            {investment.route.split(" → ")[1]}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Investment</div>
                          <div className="font-bold text-blue-600">${investment.investmentAmount.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Actual Return</div>
                          <div className="font-bold text-green-600">+${investment.actualReturn?.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            Investment completed successfully on{" "}
                            {investment.actualPayoutDate && new Date(investment.actualPayoutDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-3">Performance Summary</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span>Expected APY:</span>
                            <span className="font-medium">{investment.expectedAPY.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Actual APY:</span>
                            <span className="font-medium text-green-600">{investment.actualAPY?.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Expected Return:</span>
                            <span className="font-medium">${investment.expectedReturn.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Actual Return:</span>
                            <span className="font-medium text-green-600">
                              ${investment.actualReturn?.toLocaleString()}
                            </span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Total Payout:</span>
                            <span className="text-green-600">
                              ${((investment.actualReturn || 0) + investment.investmentAmount).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                        <Link href="/investor/marketplace">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Reinvest
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {completedInvestments.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No completed investments yet</h3>
                <p className="text-muted-foreground mb-4">Your completed investments will appear here</p>
                <Button asChild className="bg-gradient-to-r from-purple-600 to-orange-600">
                  <Link href="/investor/marketplace">
                    <Target className="w-4 h-4 mr-2" />
                    Start Investing
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

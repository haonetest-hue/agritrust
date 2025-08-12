"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, DollarSign, PieChart, Search, Eye, Plus, BarChart3, Target } from "lucide-react"
import Link from "next/link"

// Mock data
const mockStats = {
  totalInvested: 850000,
  activeInvestments: 12,
  totalReturns: 156000,
  avgAPY: 19.2,
}

const mockInvestments = [
  {
    id: "INV-001",
    invoiceId: "INV-COFFEE-001",
    supplier: "Budi Santoso",
    product: "Premium Arabica Coffee",
    amount: 216000,
    apy: 18.5,
    term: "45 days",
    status: "Active",
    progress: 67,
    expectedReturn: 21600,
  },
  {
    id: "INV-002",
    invoiceId: "INV-COCOA-002",
    supplier: "Maria Santos",
    product: "Organic Cocoa Beans",
    amount: 144000,
    apy: 19.8,
    term: "38 days",
    status: "Completed",
    progress: 100,
    expectedReturn: 14400,
  },
  {
    id: "INV-003",
    invoiceId: "INV-VANILLA-003",
    supplier: "Jean Baptiste",
    product: "Vanilla Pods",
    amount: 68000,
    apy: 17.2,
    term: "52 days",
    status: "Active",
    progress: 23,
    expectedReturn: 6800,
  },
]

const mockPortfolio = [
  {
    category: "Coffee",
    allocation: 45,
    value: 382500,
    returns: 18.5,
  },
  {
    category: "Cocoa",
    allocation: 30,
    value: 255000,
    returns: 19.8,
  },
  {
    category: "Spices",
    allocation: 15,
    value: 127500,
    returns: 17.2,
  },
  {
    category: "Grains",
    allocation: 10,
    value: 85000,
    returns: 16.8,
  },
]

export default function InvestorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Investor Dashboard</h1>
        <p className="text-gray-600">Track your agricultural trade finance investments</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="investments">My Investments</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${mockStats.totalInvested.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.activeInvestments}</div>
                <p className="text-xs text-muted-foreground">Across 4 categories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${mockStats.totalReturns.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+22% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average APY</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.avgAPY}%</div>
                <p className="text-xs text-muted-foreground">Above market average</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for investors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild className="h-20 flex-col">
                  <Link href="/investor/marketplace">
                    <Search className="h-6 w-6 mb-2" />
                    Browse Invoices
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                  <Link href="/investor/portfolio">
                    <PieChart className="h-6 w-6 mb-2" />
                    View Portfolio
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                  <Link href="/investor/analytics">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    Analytics
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Performance Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Investment Performance</CardTitle>
              <CardDescription>Your returns over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Performance chart will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investments" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Investments</h2>
            <Button asChild>
              <Link href="/investor/marketplace">
                <Plus className="h-4 w-4 mr-2" />
                New Investment
              </Link>
            </Button>
          </div>

          <div className="grid gap-6">
            {mockInvestments.map((investment) => (
              <Card key={investment.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {investment.product}
                        <Badge className={getStatusColor(investment.status)}>{investment.status}</Badge>
                      </CardTitle>
                      <CardDescription>
                        {investment.invoiceId} • Supplier: {investment.supplier}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">${investment.amount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{investment.apy}% APY</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Term</div>
                      <div className="font-medium">{investment.term}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Expected Return</div>
                      <div className="font-medium text-green-600">+${investment.expectedReturn.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{investment.progress}%</span>
                    </div>
                    <Progress value={investment.progress} className="h-2" />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Track Performance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Portfolio Analysis</h2>
            <Button asChild variant="outline">
              <Link href="/investor/rebalance">
                <PieChart className="h-4 w-4 mr-2" />
                Rebalance
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio Allocation */}
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Distribution across agricultural categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPortfolio.map((item) => (
                    <div key={item.category} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.category}</span>
                        <span>{item.allocation}%</span>
                      </div>
                      <Progress value={item.allocation} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>${item.value.toLocaleString()}</span>
                        <span>{item.returns}% APY</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">19.2%</div>
                      <div className="text-sm text-muted-foreground">Average APY</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">42 days</div>
                      <div className="text-sm text-muted-foreground">Avg Term</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">94%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">$156K</div>
                      <div className="text-sm text-muted-foreground">Total Returns</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest investment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2024-01-28</TableCell>
                    <TableCell>Investment</TableCell>
                    <TableCell>INV-COFFEE-001</TableCell>
                    <TableCell>$216,000</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2024-01-25</TableCell>
                    <TableCell>Return</TableCell>
                    <TableCell>INV-COCOA-002</TableCell>
                    <TableCell>+$14,400</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2024-01-22</TableCell>
                    <TableCell>Investment</TableCell>
                    <TableCell>INV-VANILLA-003</TableCell>
                    <TableCell>$68,000</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingUp, Search, Filter, Target, Clock, Shield, Globe, Truck, Calculator } from "lucide-react"
import Link from "next/link"

interface Invoice {
  id: string
  containerId: string
  supplierName: string
  commodity: string
  route: string
  invoiceValue: number
  availableInvestment: number
  fundingPercentage: number
  discountRate: number
  expectedAPY: number
  term: number
  riskGrade: string
  location: string
  dueDate: string
  status: string
  fundedAmount: number
  shippingStatus: string
  qualityScore: number
  certifications: string[]
  supplierRating: number
}

export default function InvestorMarketplacePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCommodity, setSelectedCommodity] = useState("all")
  const [selectedRiskGrade, setSelectedRiskGrade] = useState("all")
  const [apyRange, setAPYRange] = useState([0, 50])
  const [termRange, setTermRange] = useState([0, 180])
  const [sortBy, setSortBy] = useState("apy-desc")
  const [isLoading, setIsLoading] = useState(true)
  const [calculatorAmount, setCalculatorAmount] = useState(10000)

  useEffect(() => {
    // Mock data fetch
    const mockInvoices: Invoice[] = [
      {
        id: "INV-005",
        containerId: "MSKU7834156",
        supplierName: "Budi Santoso Cooperative",
        commodity: "Coffee Arabica Premium",
        route: "Jakarta → Hamburg",
        invoiceValue: 270000,
        availableInvestment: 216000,
        fundingPercentage: 80,
        discountRate: 1.5,
        expectedAPY: 18.7,
        term: 45,
        riskGrade: "A+",
        location: "Aceh, Indonesia",
        dueDate: "2025-03-15",
        status: "available",
        fundedAmount: 0,
        shippingStatus: "loading",
        qualityScore: 95,
        certifications: ["Organic", "Fair Trade", "Rainforest Alliance"],
        supplierRating: 4.8,
      },
      {
        id: "INV-006",
        containerId: "TCLU9876543",
        supplierName: "Ghana Cocoa Collective",
        commodity: "Cocoa Beans Premium",
        route: "Tema → Rotterdam",
        invoiceValue: 450000,
        availableInvestment: 360000,
        fundingPercentage: 80,
        discountRate: 2.1,
        expectedAPY: 22.3,
        term: 35,
        riskGrade: "A",
        location: "Ashanti, Ghana",
        dueDate: "2025-02-28",
        status: "available",
        fundedAmount: 120000,
        shippingStatus: "in-transit",
        qualityScore: 92,
        certifications: ["Fair Trade", "UTZ Certified"],
        supplierRating: 4.6,
      },
      {
        id: "INV-007",
        containerId: "HLBU5432109",
        supplierName: "Colombian Coffee Alliance",
        commodity: "Coffee Arabica Specialty",
        route: "Cartagena → Miami",
        invoiceValue: 180000,
        availableInvestment: 144000,
        fundingPercentage: 80,
        discountRate: 1.8,
        expectedAPY: 25.2,
        term: 28,
        riskGrade: "A+",
        location: "Huila, Colombia",
        dueDate: "2025-02-15",
        status: "available",
        fundedAmount: 72000,
        shippingStatus: "loading",
        qualityScore: 97,
        certifications: ["Organic", "Fair Trade", "Bird Friendly"],
        supplierRating: 4.9,
      },
      {
        id: "INV-008",
        containerId: "MSCU1234567",
        supplierName: "Ethiopian Highlands Co-op",
        commodity: "Coffee Arabica Single Origin",
        route: "Djibouti → Hamburg",
        invoiceValue: 320000,
        availableInvestment: 256000,
        fundingPercentage: 80,
        discountRate: 1.2,
        expectedAPY: 15.8,
        term: 52,
        riskGrade: "A",
        location: "Sidamo, Ethiopia",
        dueDate: "2025-04-01",
        status: "available",
        fundedAmount: 51200,
        shippingStatus: "preparing",
        qualityScore: 89,
        certifications: ["Organic", "Rainforest Alliance"],
        supplierRating: 4.4,
      },
      {
        id: "INV-009",
        containerId: "OOLU8765432",
        supplierName: "Vietnam Robusta Producers",
        commodity: "Coffee Robusta Premium",
        route: "Ho Chi Minh → Long Beach",
        invoiceValue: 220000,
        availableInvestment: 176000,
        fundingPercentage: 80,
        discountRate: 1.6,
        expectedAPY: 19.4,
        term: 38,
        riskGrade: "B+",
        location: "Dak Lak, Vietnam",
        dueDate: "2025-03-08",
        status: "available",
        fundedAmount: 88000,
        shippingStatus: "loading",
        qualityScore: 85,
        certifications: ["UTZ Certified"],
        supplierRating: 4.2,
      },
    ]

    setInvoices(mockInvoices)
    setFilteredInvoices(mockInvoices)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const filtered = invoices.filter((invoice) => {
      const matchesSearch =
        invoice.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.containerId.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCommodity =
        selectedCommodity === "all" || invoice.commodity.toLowerCase().includes(selectedCommodity)

      const matchesRiskGrade = selectedRiskGrade === "all" || invoice.riskGrade === selectedRiskGrade

      const matchesAPY = invoice.expectedAPY >= apyRange[0] && invoice.expectedAPY <= apyRange[1]

      const matchesTerm = invoice.term >= termRange[0] && invoice.term <= termRange[1]

      return matchesSearch && matchesCommodity && matchesRiskGrade && matchesAPY && matchesTerm
    })

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "apy-desc":
          return b.expectedAPY - a.expectedAPY
        case "apy-asc":
          return a.expectedAPY - b.expectedAPY
        case "risk-asc":
          return a.riskGrade.localeCompare(b.riskGrade)
        case "term-asc":
          return a.term - b.term
        case "amount-desc":
          return b.availableInvestment - a.availableInvestment
        default:
          return 0
      }
    })

    setFilteredInvoices(filtered)
  }, [invoices, searchTerm, selectedCommodity, selectedRiskGrade, apyRange, termRange, sortBy])

  const calculateReturn = (amount: number, discountRate: number, term: number) => {
    const discountAmount = (amount * discountRate) / 100
    return {
      profit: discountAmount,
      total: amount + discountAmount,
      apy: (discountAmount / amount) * (365 / term) * 100,
    }
  }

  const getRiskColor = (grade: string) => {
    switch (grade) {
      case "A+":
        return "bg-green-100 text-green-700 border-green-300"
      case "A":
        return "bg-blue-100 text-blue-700 border-blue-300"
      case "B+":
        return "bg-yellow-100 text-yellow-700 border-yellow-300"
      case "B":
        return "bg-orange-100 text-orange-700 border-orange-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading investment opportunities...</p>
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
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                Invoice Marketplace
              </span>
              <div className="text-xs text-muted-foreground">{filteredInvoices.length} opportunities available</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/investor/portfolio">
                <TrendingUp className="w-4 h-4 mr-2" />
                Portfolio
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/investor">← Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Calculator */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Quick Investment Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div>
                <label className="text-sm font-medium mb-2 block">Investment Amount</label>
                <Input
                  type="number"
                  value={calculatorAmount}
                  onChange={(e) => setCalculatorAmount(Number(e.target.value))}
                  min={1000}
                  step={1000}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Best APY</div>
                  <div className="text-lg font-bold text-green-600">
                    {filteredInvoices.length > 0
                      ? `${Math.max(...filteredInvoices.map((i) => i.expectedAPY)).toFixed(1)}%`
                      : "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Avg Term</div>
                  <div className="text-lg font-bold">
                    {filteredInvoices.length > 0
                      ? `${Math.round(filteredInvoices.reduce((sum, i) => sum + i.term, 0) / filteredInvoices.length)} days`
                      : "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Est. Return</div>
                  <div className="text-lg font-bold text-purple-600">
                    {filteredInvoices.length > 0
                      ? `+$${Math.round((calculatorAmount * Math.max(...filteredInvoices.map((i) => i.discountRate))) / 100).toLocaleString()}`
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search commodity, supplier, container..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Commodity</label>
                <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Commodities</SelectItem>
                    <SelectItem value="coffee">Coffee</SelectItem>
                    <SelectItem value="cocoa">Cocoa</SelectItem>
                    <SelectItem value="tea">Tea</SelectItem>
                    <SelectItem value="spices">Spices</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Risk Grade</label>
                <Select value={selectedRiskGrade} onValueChange={setSelectedRiskGrade}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Grades</SelectItem>
                    <SelectItem value="A+">A+ (Lowest Risk)</SelectItem>
                    <SelectItem value="A">A (Low Risk)</SelectItem>
                    <SelectItem value="B+">B+ (Medium Risk)</SelectItem>
                    <SelectItem value="B">B (Higher Risk)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apy-desc">Highest APY</SelectItem>
                    <SelectItem value="apy-asc">Lowest APY</SelectItem>
                    <SelectItem value="risk-asc">Lowest Risk</SelectItem>
                    <SelectItem value="term-asc">Shortest Term</SelectItem>
                    <SelectItem value="amount-desc">Largest Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  APY Range: {apyRange[0]}% - {apyRange[1]}%
                </label>
                <Slider value={apyRange} onValueChange={setAPYRange} max={50} min={0} step={1} className="w-full" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Term Range: {termRange[0]} - {termRange[1]} days
                </label>
                <Slider value={termRange} onValueChange={setTermRange} max={180} min={0} step={5} className="w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredInvoices.map((invoice) => {
            const returns = calculateReturn(calculatorAmount, invoice.discountRate, invoice.term)
            const fundingProgress = (invoice.fundedAmount / invoice.availableInvestment) * 100

            return (
              <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{invoice.commodity}</h3>
                      <p className="text-sm text-muted-foreground">{invoice.supplierName}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getRiskColor(invoice.riskGrade)}>Risk {invoice.riskGrade}</Badge>
                        <Badge className={getShippingStatusColor(invoice.shippingStatus)} variant="outline">
                          {invoice.shippingStatus.replace("-", " ")}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{invoice.expectedAPY.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">APY</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Container</div>
                      <div className="font-medium flex items-center">
                        <Truck className="h-3 w-3 mr-1 text-blue-600" />
                        {invoice.containerId}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Route</div>
                      <div className="font-medium flex items-center">
                        <Globe className="h-3 w-3 mr-1 text-purple-600" />
                        {invoice.route.split(" → ")[1]}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Available</div>
                      <div className="font-bold text-blue-600">${invoice.availableInvestment.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Term</div>
                      <div className="font-medium flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-orange-600" />
                        {invoice.term} days
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Funding Progress</span>
                      <span>{fundingProgress.toFixed(0)}%</span>
                    </div>
                    <Progress value={fundingProgress} className="h-2" />
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">
                        Your ${calculatorAmount.toLocaleString()} investment returns:
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="font-bold text-green-600">+${returns.profit.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Profit</div>
                        </div>
                        <div>
                          <div className="font-bold">${returns.total.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Total</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Shield className="h-3 w-3" />
                      <span>USDC Escrow</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="h-3 w-3" />
                      <span>Auto Payout</span>
                    </div>
                  </div>

                  <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-orange-600">
                    <Link href={`/investor/fund-invoice/${invoice.id}`}>
                      Fund Invoice
                      <DollarSign className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedCommodity("all")
                setSelectedRiskGrade("all")
                setAPYRange([0, 50])
                setTermRange([0, 180])
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Eye,
  Search,
  Filter,
  ExternalLink,
  Copy,
} from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

interface AgriCreditListing {
  id: string
  invoiceId: string
  lotId: string
  farmerName: string
  farmerDID: string
  amount: number
  agriCreditAmount: number
  qualityGrade: number
  dueDate: string
  interestRate: number
  advanceRate: number
  crop: string
  region: string
  status: "available" | "partially_filled" | "filled"
  createdAt: string
  hederaTopicId: string
  hederaTokenId: string
  escrowContractId: string
}

interface MarketOrder {
  id: string
  listingId: string
  buyerDID: string
  amount: number
  price: number
  orderType: "buy" | "sell"
  status: "pending" | "filled" | "cancelled"
  createdAt: string
  transactionId?: string
}

// Mock listings with real Hedera identifiers
const mockListings: AgriCreditListing[] = [
  {
    id: "LIST-001",
    invoiceId: "INV-001",
    lotId: "LOT-001",
    farmerName: "Budi Santoso",
    farmerDID: "did:hedera:farmer:001",
    amount: 50000000, // 50M IDR
    agriCreditAmount: 47500000, // 47.5M IDR (95% of invoice)
    qualityGrade: 92,
    dueDate: "2025-03-15",
    interestRate: 12, // 12% annual
    advanceRate: 80, // 80% advance
    crop: "Coffee",
    region: "Aceh",
    status: "available",
    createdAt: "2025-01-15",
    hederaTopicId: "0.0.4567890",
    hederaTokenId: "0.0.4567891",
    escrowContractId: "0.0.4567892",
  },
  {
    id: "LIST-002",
    invoiceId: "INV-002",
    lotId: "LOT-002",
    farmerName: "Sari Dewi",
    farmerDID: "did:hedera:farmer:002",
    amount: 75000000, // 75M IDR
    agriCreditAmount: 67500000, // 67.5M IDR (90% of invoice)
    qualityGrade: 88,
    dueDate: "2025-04-20",
    interestRate: 15, // 15% annual
    advanceRate: 75, // 75% advance
    crop: "Cocoa",
    region: "Sulawesi",
    status: "partially_filled",
    createdAt: "2025-01-10",
    hederaTopicId: "0.0.4567893",
    hederaTokenId: "0.0.4567894",
    escrowContractId: "0.0.4567895",
  },
  {
    id: "LIST-003",
    invoiceId: "INV-003",
    lotId: "LOT-003",
    farmerName: "Ahmad Rizki",
    farmerDID: "did:hedera:farmer:003",
    amount: 30000000, // 30M IDR
    agriCreditAmount: 25500000, // 25.5M IDR (85% of invoice)
    qualityGrade: 85,
    dueDate: "2025-02-28",
    interestRate: 18, // 18% annual
    advanceRate: 70, // 70% advance
    crop: "Rice",
    region: "Java",
    status: "available",
    createdAt: "2025-01-12",
    hederaTopicId: "0.0.4567896",
    hederaTokenId: "0.0.4567897",
    escrowContractId: "0.0.4567898",
  },
  {
    id: "LIST-004",
    invoiceId: "INV-004",
    lotId: "LOT-004",
    farmerName: "Indira Sari",
    farmerDID: "did:hedera:farmer:004",
    amount: 85000000, // 85M IDR
    agriCreditAmount: 76500000, // 76.5M IDR (90% of invoice)
    qualityGrade: 94,
    dueDate: "2025-03-30",
    interestRate: 14, // 14% annual
    advanceRate: 85, // 85% advance
    crop: "Palm Oil",
    region: "Sumatra",
    status: "available",
    createdAt: "2025-01-18",
    hederaTopicId: "0.0.4567899",
    hederaTokenId: "0.0.4567900",
    escrowContractId: "0.0.4567901",
  },
  {
    id: "LIST-005",
    invoiceId: "INV-005",
    lotId: "LOT-005",
    farmerName: "Wayan Putra",
    farmerDID: "did:hedera:farmer:005",
    amount: 42000000, // 42M IDR
    agriCreditAmount: 37800000, // 37.8M IDR (90% of invoice)
    qualityGrade: 90,
    dueDate: "2025-03-10",
    interestRate: 16, // 16% annual
    advanceRate: 80, // 80% advance
    crop: "Vanilla",
    region: "Bali",
    status: "available",
    createdAt: "2025-01-20",
    hederaTopicId: "0.0.4567902",
    hederaTokenId: "0.0.4567903",
    escrowContractId: "0.0.4567904",
  },
]

export default function MarketplacePage() {
  const [listings, setListings] = useState<AgriCreditListing[]>([])
  const [orders, setOrders] = useState<MarketOrder[]>([])
  const [selectedListing, setSelectedListing] = useState<AgriCreditListing | null>(null)
  const [orderAmount, setOrderAmount] = useState("")
  const [filterCrop, setFilterCrop] = useState("all")
  const [filterRegion, setFilterRegion] = useState("all")
  const [sortBy, setSortBy] = useState("interest_rate")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setListings(mockListings)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleBuyOrder = async (listing: AgriCreditListing) => {
    if (!orderAmount) {
      toast({
        title: "Amount Required",
        description: "Please enter an investment amount",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(orderAmount)
    if (amount < 1000) {
      toast({
        title: "Minimum Investment",
        description: "Minimum investment is $1,000",
        variant: "destructive",
      })
      return
    }

    // Mock transaction
    const transactionId = `0.0.${Math.floor(Math.random() * 1000000)}@${Date.now()}.${Math.floor(Math.random() * 1000000000)}`

    const order: MarketOrder = {
      id: `order-${Date.now()}`,
      listingId: listing.id,
      buyerDID: "did:hedera:investor:001", // Current user DID
      amount: amount,
      price: listing.amount * (listing.advanceRate / 100),
      orderType: "buy",
      status: "filled",
      createdAt: new Date().toISOString(),
      transactionId,
    }

    setOrders([...orders, order])
    setOrderAmount("")
    setSelectedListing(null)

    toast({
      title: "Order Placed Successfully!",
      description: `Transaction ID: ${transactionId}`,
    })
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    })
  }

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.region.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false
    if (filterCrop !== "all" && listing.crop.toLowerCase() !== filterCrop) return false
    if (filterRegion !== "all" && listing.region.toLowerCase() !== filterRegion) return false
    return true
  })

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "interest_rate":
        return a.interestRate - b.interestRate
      case "amount":
        return b.amount - a.amount
      case "quality":
        return b.qualityGrade - a.qualityGrade
      case "due_date":
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      default:
        return 0
    }
  })

  // Calculate market stats
  const totalVolume = listings.reduce((sum, listing) => sum + listing.amount, 0) / 15000 // Convert to USD
  const avgInterestRate = listings.reduce((sum, listing) => sum + listing.interestRate, 0) / listings.length
  const activeListings = listings.filter((l) => l.status === "available").length

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AgriCredit Marketplace</h1>
          <p className="text-muted-foreground">Trade agricultural invoice tokens with verified farmers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Watchlist
          </Button>
          <Button>
            <ShoppingCart className="w-4 h-4 mr-2" />
            My Orders ({orders.length})
          </Button>
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalVolume.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeListings}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />+{listings.length - activeListings} new today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Interest Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgInterestRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline w-3 h-3 mr-1" />
              -0.8% from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Traders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +5 new this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search farmers, crops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCrop} onValueChange={setFilterCrop}>
              <SelectTrigger>
                <SelectValue placeholder="Select crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                <SelectItem value="coffee">Coffee</SelectItem>
                <SelectItem value="cocoa">Cocoa</SelectItem>
                <SelectItem value="rice">Rice</SelectItem>
                <SelectItem value="palm oil">Palm Oil</SelectItem>
                <SelectItem value="vanilla">Vanilla</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRegion} onValueChange={setFilterRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="aceh">Aceh</SelectItem>
                <SelectItem value="sulawesi">Sulawesi</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="sumatra">Sumatra</SelectItem>
                <SelectItem value="bali">Bali</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="interest_rate">Interest Rate</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="quality">Quality Grade</SelectItem>
                <SelectItem value="due_date">Due Date</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setFilterCrop("all")
                setFilterRegion("all")
                setSortBy("interest_rate")
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="listings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="listings">Available Listings ({sortedListings.length})</TabsTrigger>
          <TabsTrigger value="orders">My Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="history">Trade History</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-4">
          {sortedListings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No listings found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setFilterCrop("all")
                      setFilterRegion("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                  <Button asChild>
                    <Link href="/supplier/mint-lot">Create Listing</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {sortedListings.map((listing) => (
                <Card key={listing.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{listing.farmerName}</CardTitle>
                        <CardDescription>
                          {listing.crop} • {listing.region} • Lot: {listing.lotId}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={listing.status === "available" ? "default" : "secondary"}>
                          {listing.status.replace("_", " ")}
                        </Badge>
                        <Badge variant="outline">Grade {listing.qualityGrade}/100</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Invoice Amount</p>
                        <p className="font-semibold">${(listing.amount / 15000).toLocaleString()} USD</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">AgriCredit Amount</p>
                        <p className="font-semibold">${(listing.agriCreditAmount / 15000).toLocaleString()} USD</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Interest Rate</p>
                        <p className="font-semibold text-green-600">{listing.interestRate}% APR</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Due Date</p>
                        <p className="font-semibold">{new Date(listing.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* On-chain Proof */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <h4 className="font-medium text-blue-900 mb-2 text-sm">On-Chain Verification</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700">Topic:</span>
                          <div className="flex items-center space-x-1">
                            <code className="bg-white px-1 py-0.5 rounded">{listing.hederaTopicId}</code>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(listing.hederaTopicId, "Topic ID")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" asChild>
                              <a
                                href={`https://hashscan.io/testnet/topic/${listing.hederaTopicId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700">Token:</span>
                          <div className="flex items-center space-x-1">
                            <code className="bg-white px-1 py-0.5 rounded">{listing.hederaTokenId}</code>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(listing.hederaTokenId, "Token ID")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" asChild>
                              <a
                                href={`https://hashscan.io/testnet/token/${listing.hederaTokenId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700">Escrow:</span>
                          <div className="flex items-center space-x-1">
                            <code className="bg-white px-1 py-0.5 rounded">{listing.escrowContractId}</code>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(listing.escrowContractId, "Contract ID")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" asChild>
                              <a
                                href={`https://hashscan.io/testnet/contract/${listing.escrowContractId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Created: {new Date(listing.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/trace/${listing.lotId}`}>View Details</Link>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setSelectedListing(listing)}
                          disabled={listing.status === "filled"}
                        >
                          Buy AgriCredit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>My Orders</CardTitle>
              <CardDescription>Your buy and sell orders</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No orders yet</p>
                  <Button variant="outline" className="bg-transparent" onClick={() => window.location.reload()}>
                    Browse Listings
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Listing</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transaction</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Badge variant={order.orderType === "buy" ? "default" : "secondary"}>
                            {order.orderType.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.listingId}</TableCell>
                        <TableCell>${order.amount.toLocaleString()}</TableCell>
                        <TableCell>${order.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === "filled" ? "default" : "outline"}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {order.transactionId && (
                            <div className="flex items-center space-x-2">
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {order.transactionId.slice(0, 20)}...
                              </code>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={() => copyToClipboard(order.transactionId!, "Transaction ID")}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" asChild>
                                <a
                                  href={`https://hashscan.io/testnet/transaction/${order.transactionId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
              <CardDescription>Your completed trades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground">No trade history available</p>
                <p className="text-sm text-muted-foreground mt-2">Complete your first trade to see history here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Buy Order Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Buy AgriCredit</CardTitle>
              <CardDescription>Purchase AgriCredit tokens from {selectedListing.farmerName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Available Amount</p>
                <p className="font-semibold">${(selectedListing.agriCreditAmount / 15000).toLocaleString()} USD</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Interest Rate</p>
                <p className="font-semibold text-green-600">{selectedListing.interestRate}% APR</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Advance Rate</p>
                <p className="font-semibold">{selectedListing.advanceRate}%</p>
              </div>
              <div>
                <label className="text-sm font-medium">Purchase Amount (USD)</label>
                <Input
                  type="number"
                  placeholder="Enter amount (min $1,000)"
                  value={orderAmount}
                  onChange={(e) => setOrderAmount(e.target.value)}
                  min="1000"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedListing(null)}>
                  Cancel
                </Button>
                <Button onClick={() => handleBuyOrder(selectedListing)}>Place Order</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Eye } from "lucide-react"

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
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<AgriCreditListing[]>([])
  const [orders, setOrders] = useState<MarketOrder[]>([])
  const [selectedListing, setSelectedListing] = useState<AgriCreditListing | null>(null)
  const [orderAmount, setOrderAmount] = useState("")
  const [filterCrop, setFilterCrop] = useState("all")
  const [filterRegion, setFilterRegion] = useState("all")
  const [sortBy, setSortBy] = useState("interest_rate")

  // Mock data - in production, fetch from API
  useEffect(() => {
    const mockListings: AgriCreditListing[] = [
      {
        id: "1",
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
      },
      {
        id: "2",
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
      },
      {
        id: "3",
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
      },
    ]
    setListings(mockListings)
  }, [])

  const handleBuyOrder = async (listing: AgriCreditListing) => {
    if (!orderAmount) return

    const order: MarketOrder = {
      id: `order-${Date.now()}`,
      listingId: listing.id,
      buyerDID: "did:hedera:investor:001", // Current user DID
      amount: Number.parseFloat(orderAmount),
      price: listing.amount * (listing.advanceRate / 100),
      orderType: "buy",
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    // In production, call API to create order
    setOrders([...orders, order])
    setOrderAmount("")
    setSelectedListing(null)
  }

  const filteredListings = listings.filter((listing) => {
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
            My Orders
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
            <div className="text-2xl font-bold">$2.4M</div>
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
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +8 new today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Interest Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.2%</div>
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
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <Select value={filterCrop} onValueChange={setFilterCrop}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                <SelectItem value="coffee">Coffee</SelectItem>
                <SelectItem value="cocoa">Cocoa</SelectItem>
                <SelectItem value="rice">Rice</SelectItem>
                <SelectItem value="palm">Palm Oil</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRegion} onValueChange={setFilterRegion}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="aceh">Aceh</SelectItem>
                <SelectItem value="sulawesi">Sulawesi</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="sumatra">Sumatra</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="interest_rate">Interest Rate</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="quality">Quality Grade</SelectItem>
                <SelectItem value="due_date">Due Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="listings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="listings">Available Listings</TabsTrigger>
          <TabsTrigger value="orders">Order Book</TabsTrigger>
          <TabsTrigger value="history">Trade History</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-4">
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
                    <Badge variant={listing.status === "available" ? "default" : "secondary"}>
                      {listing.status.replace("_", " ")}
                    </Badge>
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
                      <p className="text-sm text-muted-foreground">Quality Grade</p>
                      <p className="font-semibold">{listing.qualityGrade}/100</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Interest Rate</p>
                      <p className="font-semibold">{listing.interestRate}% APR</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Due: {new Date(listing.dueDate).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
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
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order Book</CardTitle>
              <CardDescription>Current buy and sell orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Listing</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
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
                        <Badge variant="outline">{order.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No orders yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
              <CardDescription>Recent completed trades</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">No trade history available</p>
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
                <p className="text-sm text-muted-foreground">Advance Rate</p>
                <p className="font-semibold">{selectedListing.advanceRate}%</p>
              </div>
              <div>
                <label className="text-sm font-medium">Purchase Amount (USD)</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={orderAmount}
                  onChange={(e) => setOrderAmount(e.target.value)}
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

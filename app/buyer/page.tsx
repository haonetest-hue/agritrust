"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShoppingCart, Package, DollarSign, Search, Eye, CheckCircle, Truck, Shield } from "lucide-react"
import Link from "next/link"

// Mock data
const mockStats = {
  totalPurchases: 18,
  activePurchases: 5,
  totalSpent: 2100000,
  escrowBalance: 450000,
}

const mockPurchases = [
  {
    id: "PUR-001",
    product: "Premium Arabica Coffee",
    supplier: "Budi Santoso",
    quantity: "20 tons",
    status: "In Transit",
    amount: 270000,
    progress: 65,
    eta: "2024-02-15",
  },
  {
    id: "PUR-002",
    product: "Organic Cocoa Beans",
    supplier: "Maria Santos",
    quantity: "15 tons",
    status: "Delivered",
    amount: 180000,
    progress: 100,
    eta: "2024-01-28",
  },
  {
    id: "PUR-003",
    product: "Vanilla Pods",
    supplier: "Jean Baptiste",
    quantity: "500 kg",
    status: "Processing",
    amount: 85000,
    progress: 30,
    eta: "2024-03-05",
  },
]

const mockEscrows = [
  {
    id: "ESC-001",
    purchaseId: "PUR-001",
    amount: 270000,
    status: "Active",
    releaseCondition: "Delivery Confirmation",
    createdDate: "2024-01-15",
  },
  {
    id: "ESC-002",
    purchaseId: "PUR-003",
    amount: 85000,
    status: "Active",
    releaseCondition: "Quality Verification",
    createdDate: "2024-01-20",
  },
  {
    id: "ESC-003",
    purchaseId: "PUR-002",
    amount: 180000,
    status: "Released",
    releaseCondition: "Delivery Confirmed",
    createdDate: "2024-01-10",
  },
]

export default function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
      case "released":
        return "bg-green-100 text-green-800"
      case "in transit":
      case "active":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Buyer Dashboard</h1>
        <p className="text-gray-600">Manage your purchases and track deliveries</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="purchases">My Purchases</TabsTrigger>
          <TabsTrigger value="escrow">Escrow Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalPurchases}</div>
                <p className="text-xs text-muted-foreground">+3 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Purchases</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.activePurchases}</div>
                <p className="text-xs text-muted-foreground">Currently tracking</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${mockStats.totalSpent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+18% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Escrow Balance</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${mockStats.escrowBalance.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">2 active escrows</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for buyers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild className="h-20 flex-col">
                  <Link href="/buyer/discover">
                    <Search className="h-6 w-6 mb-2" />
                    Discover Products
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                  <Link href="/buyer/escrow">
                    <Shield className="h-6 w-6 mb-2" />
                    Manage Escrow
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                  <Link href="/buyer/track">
                    <Truck className="h-6 w-6 mb-2" />
                    Track Shipments
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Purchases</h2>
            <Button asChild>
              <Link href="/buyer/discover">
                <Search className="h-4 w-4 mr-2" />
                Discover More
              </Link>
            </Button>
          </div>

          <div className="grid gap-6">
            {mockPurchases.map((purchase) => (
              <Card key={purchase.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {purchase.product}
                        <Badge className={getStatusColor(purchase.status)}>{purchase.status}</Badge>
                      </CardTitle>
                      <CardDescription>
                        Purchase ID: {purchase.id} • Supplier: {purchase.supplier}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">${purchase.amount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">ETA: {purchase.eta}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Delivery Progress</span>
                      <span>{purchase.progress}%</span>
                    </div>
                    <Progress value={purchase.progress} className="h-2" />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Truck className="h-4 w-4 mr-2" />
                      Track Shipment
                    </Button>
                    {purchase.status === "Delivered" && (
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm Receipt
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="escrow" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Escrow Management</h2>
            <Button asChild>
              <Link href="/buyer/escrow/create">
                <Shield className="h-4 w-4 mr-2" />
                Create Escrow
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Active Escrows</CardTitle>
              <CardDescription>Manage your USDC escrow accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Escrow ID</TableHead>
                    <TableHead>Purchase ID</TableHead>
                    <TableHead>Amount (USDC)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Release Condition</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEscrows.map((escrow) => (
                    <TableRow key={escrow.id}>
                      <TableCell className="font-medium">{escrow.id}</TableCell>
                      <TableCell>{escrow.purchaseId}</TableCell>
                      <TableCell>${escrow.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(escrow.status)}>{escrow.status}</Badge>
                      </TableCell>
                      <TableCell>{escrow.releaseCondition}</TableCell>
                      <TableCell>{escrow.createdDate}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Manage
                        </Button>
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

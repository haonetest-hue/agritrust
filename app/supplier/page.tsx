"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, Package, DollarSign, Clock, Plus, Eye, Truck, FileText } from "lucide-react"
import Link from "next/link"

// Mock data
const mockStats = {
  totalLots: 24,
  activeLots: 8,
  totalRevenue: 1250000,
  pendingPayments: 180000,
}

const mockLots = [
  {
    id: "LOT-001",
    product: "Premium Arabica Coffee",
    quantity: "20 tons",
    status: "Active",
    buyer: "Hamburg Coffee Co.",
    value: 270000,
    progress: 75,
  },
  {
    id: "LOT-002",
    product: "Organic Cocoa Beans",
    quantity: "15 tons",
    status: "Shipped",
    buyer: "Swiss Chocolate Ltd.",
    value: 180000,
    progress: 90,
  },
  {
    id: "LOT-003",
    product: "Vanilla Pods",
    quantity: "500 kg",
    status: "Processing",
    buyer: "French Flavors Inc.",
    value: 85000,
    progress: 45,
  },
]

const mockInvoices = [
  {
    id: "INV-001",
    lotId: "LOT-001",
    amount: 270000,
    status: "Funded",
    dueDate: "2024-02-15",
    fundingRate: "18.5%",
  },
  {
    id: "INV-002",
    lotId: "LOT-002",
    amount: 180000,
    status: "Paid",
    dueDate: "2024-01-30",
    fundingRate: "19.2%",
  },
  {
    id: "INV-003",
    lotId: "LOT-003",
    amount: 85000,
    status: "Pending",
    dueDate: "2024-03-10",
    fundingRate: "17.8%",
  },
]

export default function SupplierDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "funded":
        return "bg-green-100 text-green-800"
      case "shipped":
      case "paid":
        return "bg-blue-100 text-blue-800"
      case "processing":
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Supplier Dashboard</h1>
        <p className="text-gray-600">Manage your agricultural lots and track shipments</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lots">My Lots</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Lots</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalLots}</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Lots</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.activeLots}</div>
                <p className="text-xs text-muted-foreground">Currently in process</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${mockStats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${mockStats.pendingPayments.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">3 invoices pending</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for suppliers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild className="h-20 flex-col">
                  <Link href="/supplier/mint-lot">
                    <Plus className="h-6 w-6 mb-2" />
                    Mint New Lot
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                  <Link href="/supplier/publish-event">
                    <Truck className="h-6 w-6 mb-2" />
                    Publish Event
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                  <Link href="/supplier/escrow-status">
                    <Eye className="h-6 w-6 mb-2" />
                    Check Escrow
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lots" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Agricultural Lots</h2>
            <Button asChild>
              <Link href="/supplier/mint-lot">
                <Plus className="h-4 w-4 mr-2" />
                Create New Lot
              </Link>
            </Button>
          </div>

          <div className="grid gap-6">
            {mockLots.map((lot) => (
              <Card key={lot.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {lot.product}
                        <Badge className={getStatusColor(lot.status)}>{lot.status}</Badge>
                      </CardTitle>
                      <CardDescription>
                        Lot ID: {lot.id} • Quantity: {lot.quantity}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">${lot.value.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Buyer: {lot.buyer}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{lot.progress}%</span>
                    </div>
                    <Progress value={lot.progress} className="h-2" />
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Invoice Management</h2>
            <Button asChild>
              <Link href="/supplier/create-invoice">
                <FileText className="h-4 w-4 mr-2" />
                Create Invoice
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>Track your invoice funding and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Lot ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Funding Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.lotId}</TableCell>
                      <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                      </TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>{invoice.fundingRate}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          View
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

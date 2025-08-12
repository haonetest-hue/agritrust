"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, Eye, Clock, CheckCircle } from "lucide-react"

interface EscrowStatus {
  lotId: string
  lotName: string
  buyer: string
  amount: number
  status: "awaiting" | "deposited" | "quality_ok" | "accepted" | "released"
  depositDate?: string
  releaseDate?: string
  commodity: string
}

export default function EscrowStatusPage() {
  const [escrowData, setEscrowData] = useState<EscrowStatus[]>([])

  useEffect(() => {
    // Mock escrow data
    setEscrowData([
      {
        lotId: "LOT-001",
        lotName: "Premium Coffee Batch #1",
        buyer: "Global Coffee Traders Ltd",
        amount: 15000,
        status: "deposited",
        depositDate: "2025-01-15",
        commodity: "Coffee Arabica",
      },
      {
        lotId: "LOT-002",
        lotName: "Organic Cocoa Batch #2",
        buyer: "European Cocoa Import Co",
        amount: 22000,
        status: "quality_ok",
        depositDate: "2025-01-10",
        commodity: "Cocoa Trinitario",
      },
      {
        lotId: "LOT-003",
        lotName: "Rice Premium Grade",
        buyer: "Asian Rice Distribution",
        amount: 8500,
        status: "accepted",
        depositDate: "2025-01-08",
        commodity: "Rice Jasmine",
      },
      {
        lotId: "LOT-004",
        lotName: "Palm Oil Batch #5",
        buyer: "Palm Oil Processors Inc",
        amount: 12000,
        status: "released",
        depositDate: "2024-12-20",
        releaseDate: "2025-01-05",
        commodity: "Palm Oil",
      },
    ])
  }, [])

  const getStatusConfig = (status: string) => {
    const configs = {
      awaiting: {
        label: "Awaiting Deposit",
        variant: "outline" as const,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        icon: Clock,
      },
      deposited: {
        label: "Deposited",
        variant: "default" as const,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        icon: DollarSign,
      },
      quality_ok: {
        label: "Quality Approved",
        variant: "default" as const,
        color: "text-green-600",
        bgColor: "bg-green-50",
        icon: CheckCircle,
      },
      accepted: {
        label: "Delivery Accepted",
        variant: "default" as const,
        color: "text-green-600",
        bgColor: "bg-green-50",
        icon: CheckCircle,
      },
      released: {
        label: "Payment Released",
        variant: "secondary" as const,
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        icon: CheckCircle,
      },
    }
    return configs[status as keyof typeof configs] || configs.awaiting
  }

  const totalEscrowValue = escrowData.reduce((sum, item) => sum + item.amount, 0)
  const activeEscrows = escrowData.filter((item) => !["released"].includes(item.status)).length
  const completedEscrows = escrowData.filter((item) => item.status === "released").length

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Escrow Status Dashboard</h1>
        <p className="text-muted-foreground">Track payment status for all your agricultural lots</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl card-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Escrow Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEscrowValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all lots</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl card-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Escrows</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeEscrows}</div>
            <p className="text-xs text-muted-foreground">Pending release</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl card-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedEscrows}</div>
            <p className="text-xs text-muted-foreground">Payments released</p>
          </CardContent>
        </Card>
      </div>

      {/* Escrow Table */}
      <Card className="rounded-2xl card-shadow">
        <CardHeader>
          <CardTitle>Escrow Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lot</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deposit Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {escrowData.map((escrow) => {
                  const statusConfig = getStatusConfig(escrow.status)
                  const StatusIcon = statusConfig.icon

                  return (
                    <TableRow key={escrow.lotId}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{escrow.lotName}</div>
                          <div className="text-sm text-muted-foreground">{escrow.commodity}</div>
                          <Badge variant="outline" className="text-xs">
                            {escrow.lotId}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{escrow.buyer}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${escrow.amount.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${statusConfig.bgColor}`}
                          >
                            <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                          </div>
                          <Badge variant={statusConfig.variant} className={statusConfig.color}>
                            {statusConfig.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {escrow.depositDate && (
                            <div className="text-sm">
                              Deposited: {new Date(escrow.depositDate).toLocaleDateString()}
                            </div>
                          )}
                          {escrow.releaseDate && (
                            <div className="text-sm text-green-600">
                              Released: {new Date(escrow.releaseDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          {escrow.status === "quality_ok" && (
                            <Button size="sm" className="success-gradient">
                              Release
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

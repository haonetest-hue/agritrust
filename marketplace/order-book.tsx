"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown } from "lucide-react"

interface OrderBookEntry {
  price: number
  amount: number
  total: number
  type: "buy" | "sell"
}

interface OrderBookProps {
  listingId?: string
}

export function OrderBook({ listingId }: OrderBookProps) {
  const [buyOrders, setBuyOrders] = useState<OrderBookEntry[]>([])
  const [sellOrders, setSellOrders] = useState<OrderBookEntry[]>([])
  const [lastPrice, setLastPrice] = useState(0)
  const [priceChange, setPriceChange] = useState(0)

  useEffect(() => {
    // Mock order book data
    const mockBuyOrders: OrderBookEntry[] = [
      { price: 8500, amount: 1000, total: 8500000, type: "buy" },
      { price: 8400, amount: 2500, total: 21000000, type: "buy" },
      { price: 8300, amount: 1800, total: 14940000, type: "buy" },
      { price: 8200, amount: 3200, total: 26240000, type: "buy" },
      { price: 8100, amount: 1500, total: 12150000, type: "buy" },
    ]

    const mockSellOrders: OrderBookEntry[] = [
      { price: 8600, amount: 800, total: 6880000, type: "sell" },
      { price: 8700, amount: 1200, total: 10440000, type: "sell" },
      { price: 8800, amount: 2000, total: 17600000, type: "sell" },
      { price: 8900, amount: 1600, total: 14240000, type: "sell" },
      { price: 9000, amount: 2200, total: 19800000, type: "sell" },
    ]

    setBuyOrders(mockBuyOrders)
    setSellOrders(mockSellOrders)
    setLastPrice(8550)
    setPriceChange(2.3)
  }, [listingId])

  return (
    <div className="space-y-4">
      {/* Price Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Price</span>
            <Badge variant={priceChange >= 0 ? "default" : "destructive"}>
              {priceChange >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {priceChange >= 0 ? "+" : ""}
              {priceChange}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${lastPrice.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">Last traded price</p>
        </CardContent>
      </Card>

      {/* Order Book */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Buy Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Buy Orders</CardTitle>
            <CardDescription>Highest bids first</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Price</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buyOrders.map((order, index) => (
                  <TableRow key={index} className="hover:bg-green-50">
                    <TableCell className="font-medium text-green-600">${order.price.toLocaleString()}</TableCell>
                    <TableCell>{order.amount.toLocaleString()}</TableCell>
                    <TableCell>${(order.total / 1000000).toFixed(1)}M</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="text-green-600 bg-transparent">
                        Sell
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Sell Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Sell Orders</CardTitle>
            <CardDescription>Lowest asks first</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Price</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellOrders.map((order, index) => (
                  <TableRow key={index} className="hover:bg-red-50">
                    <TableCell className="font-medium text-red-600">${order.price.toLocaleString()}</TableCell>
                    <TableCell>{order.amount.toLocaleString()}</TableCell>
                    <TableCell>${(order.total / 1000000).toFixed(1)}M</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                        Buy
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

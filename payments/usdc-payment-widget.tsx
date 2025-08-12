"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, DollarSign, CreditCard, Wallet } from "lucide-react"

interface USDCPaymentWidgetProps {
  amount: number
  recipientAddress: string
  onPaymentComplete: (transactionId: string) => void
  onPaymentError: (error: string) => void
}

export default function USDCPaymentWidget({
  amount,
  recipientAddress,
  onPaymentComplete,
  onPaymentError,
}: USDCPaymentWidgetProps) {
  const [paymentMethod, setPaymentMethod] = useState<"usdc" | "fiat">("usdc")
  const [isProcessing, setIsProcessing] = useState(false)
  const [usdcBalance, setUSDCBalance] = useState<number | null>(null)
  const [fiatAmount, setFiatAmount] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [email, setEmail] = useState("")

  const handleUSDCPayment = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/payments/usdc/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAccountId: "0.0.123456", // User's account ID
          toAccountId: recipientAddress,
          amount,
        }),
      })

      const data = await response.json()
      if (data.success) {
        onPaymentComplete(data.transactionId)
      } else {
        onPaymentError(data.error || "Payment failed")
      }
    } catch (error) {
      onPaymentError("Network error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFiatPayment = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/payments/fiat-to-usdc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number.parseFloat(fiatAmount),
          currency,
          walletAddress: recipientAddress,
          userEmail: email,
        }),
      })

      const data = await response.json()
      if (data.success) {
        window.open(data.paymentUrl, "_blank")
      } else {
        onPaymentError(data.error || "Failed to create payment order")
      }
    } catch (error) {
      onPaymentError("Network error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <span>Payment Options</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Amount Display */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">${amount.toFixed(2)} USDC</div>
          <div className="text-sm text-gray-600">Payment Amount</div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <Label>Payment Method</Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={paymentMethod === "usdc" ? "default" : "outline"}
              onClick={() => setPaymentMethod("usdc")}
              className="flex items-center space-x-2"
            >
              <Wallet className="w-4 h-4" />
              <span>USDC Wallet</span>
            </Button>
            <Button
              variant={paymentMethod === "fiat" ? "default" : "outline"}
              onClick={() => setPaymentMethod("fiat")}
              className="flex items-center space-x-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Credit Card</span>
            </Button>
          </div>
        </div>

        {/* USDC Payment */}
        {paymentMethod === "usdc" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">Your USDC Balance</span>
              <Badge variant="secondary">{usdcBalance !== null ? `$${usdcBalance.toFixed(2)}` : "Loading..."}</Badge>
            </div>

            <Button
              onClick={handleUSDCPayment}
              disabled={isProcessing || (usdcBalance !== null && usdcBalance < amount)}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                `Pay ${amount.toFixed(2)} USDC`
              )}
            </Button>
          </div>
        )}

        {/* Fiat Payment */}
        {paymentMethod === "fiat" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="fiat-amount">Amount</Label>
                <Input
                  id="fiat-amount"
                  type="number"
                  value={fiatAmount}
                  onChange={(e) => setFiatAmount(e.target.value)}
                  placeholder="100.00"
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <Button onClick={handleFiatPayment} disabled={isProcessing || !fiatAmount || !email} className="w-full">
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Payment...
                </>
              ) : (
                `Buy ${amount.toFixed(2)} USDC`
              )}
            </Button>
          </div>
        )}

        {/* Payment Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Payments are processed securely on Hedera network</p>
          <p>• USDC transactions are typically confirmed within seconds</p>
          <p>• Credit card purchases may take 5-10 minutes to complete</p>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  DollarSign,
  TrendingUp,
  Shield,
  Calculator,
  ArrowRight,
  CheckCircle,
  Target,
  Wallet,
  Globe,
  Truck,
} from "lucide-react"
import Link from "next/link"
import USDCPaymentWidget from "@/payments/usdc-payment-widget"

interface InvoiceDetail {
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
  historicalPerformance: number
  collateralValue: number
}

export default function FundInvoicePage() {
  const params = useParams()
  const router = useRouter()
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState<number>(10000)
  const [isLoading, setIsLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)
  const [fundingStep, setFundingStep] = useState(1)

  useEffect(() => {
    // Mock invoice detail fetch
    const mockInvoice: InvoiceDetail = {
      id: params.invoiceId as string,
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
      historicalPerformance: 98.5,
      collateralValue: 324000,
    }

    setInvoice(mockInvoice)
    setIsLoading(false)
  }, [params.invoiceId])

  const calculateReturns = (amount: number, discountRate: number, term: number) => {
    const discountAmount = (amount * discountRate) / 100
    const apy = (discountAmount / amount) * (365 / term) * 100
    return {
      discountAmount,
      apy,
      totalReturn: amount + discountAmount,
    }
  }

  const handleInvestmentChange = (value: number[]) => {
    setInvestmentAmount(value[0])
  }

  const handlePaymentComplete = (transactionId: string) => {
    // Handle successful payment
    console.log("Payment completed:", transactionId)
    setFundingStep(3)

    // Redirect to portfolio after 3 seconds
    setTimeout(() => {
      router.push("/investor/portfolio")
    }, 3000)
  }

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error)
    // Show user-friendly error message instead of throwing
    alert(`Payment failed: ${error}. Please try again or contact support.`)
  }

  if (isLoading || !invoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading invoice details...</p>
        </div>
      </div>
    )
  }

  const returns = calculateReturns(investmentAmount, invoice.discountRate, invoice.term)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/investor/marketplace" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-orange-600 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                  Fund Invoice
                </span>
                <div className="text-xs text-muted-foreground">{invoice.id}</div>
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-gradient-to-r from-purple-600 to-orange-600 text-white">Step {fundingStep} of 3</Badge>
            <Button variant="outline" size="sm" asChild>
              <Link href="/investor/marketplace">← Back to Marketplace</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center space-x-2 ${fundingStep >= 1 ? "text-purple-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${fundingStep >= 1 ? "bg-purple-600 text-white" : "bg-gray-200"}`}
              >
                {fundingStep > 1 ? <CheckCircle className="h-5 w-5" /> : "1"}
              </div>
              <span className="font-medium">Review Investment</span>
            </div>
            <div className={`w-16 h-1 ${fundingStep >= 2 ? "bg-purple-600" : "bg-gray-200"} rounded`}></div>
            <div className={`flex items-center space-x-2 ${fundingStep >= 2 ? "text-purple-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${fundingStep >= 2 ? "bg-purple-600 text-white" : "bg-gray-200"}`}
              >
                {fundingStep > 2 ? <CheckCircle className="h-5 w-5" /> : "2"}
              </div>
              <span className="font-medium">Fund Invoice</span>
            </div>
            <div className={`w-16 h-1 ${fundingStep >= 3 ? "bg-purple-600" : "bg-gray-200"} rounded`}></div>
            <div className={`flex items-center space-x-2 ${fundingStep >= 3 ? "text-green-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${fundingStep >= 3 ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                {fundingStep >= 3 ? <CheckCircle className="h-5 w-5" /> : "3"}
              </div>
              <span className="font-medium">Investment Complete</span>
            </div>
          </div>
        </div>

        {fundingStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Invoice Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Invoice Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{invoice.commodity}</h3>
                      <p className="text-muted-foreground">{invoice.supplierName}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className="bg-green-100 text-green-700 border-green-300">Risk {invoice.riskGrade}</Badge>
                        <Badge variant="outline">Quality {invoice.qualityScore}/100</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Container ID</div>
                      <div className="font-medium flex items-center">
                        <Truck className="h-4 w-4 mr-1 text-blue-600" />
                        {invoice.containerId}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Route</div>
                      <div className="font-medium flex items-center">
                        <Globe className="h-4 w-4 mr-1 text-purple-600" />
                        {invoice.route}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Invoice Value</div>
                      <div className="font-bold text-green-600">${invoice.invoiceValue.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Available Investment</div>
                      <div className="font-bold text-blue-600">${invoice.availableInvestment.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Discount Rate</div>
                      <div className="font-bold text-purple-600">{invoice.discountRate}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Term</div>
                      <div className="font-bold">{invoice.term} days</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Supplier Rating</span>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.floor(invoice.supplierRating) ? "text-yellow-400" : "text-gray-300"
                              }`}
                            >
                              ★
                            </div>
                          ))}
                        </div>
                        <span className="text-sm font-medium">{invoice.supplierRating}/5</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Historical Performance</span>
                      <span className="text-sm font-medium text-green-600">{invoice.historicalPerformance}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Collateral Value</span>
                      <span className="text-sm font-medium">${invoice.collateralValue.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {invoice.certifications.map((cert) => (
                      <Badge key={cert} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investment Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Investment Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="investment-amount">Investment Amount</Label>
                    <div className="mt-2 space-y-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">$1,000</span>
                        <Slider
                          value={[investmentAmount]}
                          onValueChange={handleInvestmentChange}
                          max={Math.min(invoice.availableInvestment, 100000)}
                          min={1000}
                          step={1000}
                          className="flex-1"
                        />
                        <span className="text-sm text-muted-foreground">$100K</span>
                      </div>
                      <Input
                        id="investment-amount"
                        type="number"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                        min={1000}
                        max={invoice.availableInvestment}
                        step={1000}
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg p-6 space-y-4">
                    <h4 className="font-semibold text-center">Investment Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-muted-foreground">Investment</div>
                        <div className="text-2xl font-bold text-purple-600">${investmentAmount.toLocaleString()}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground">Expected Return</div>
                        <div className="text-2xl font-bold text-green-600">
                          +${returns.discountAmount.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground">Total Payout</div>
                        <div className="text-xl font-bold">${returns.totalReturn.toLocaleString()}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground">Annualized APY</div>
                        <div className="text-xl font-bold text-orange-600">{returns.apy.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      Investment term: {invoice.term} days • Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>USDC escrow smart contract protection</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Real-time HCS shipment tracking</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Target className="h-4 w-4 text-green-600" />
                      <span>Automatic payout on delivery confirmation</span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-orange-600"
                    onClick={() => setFundingStep(2)}
                    disabled={investmentAmount < 1000 || investmentAmount > invoice.availableInvestment}
                  >
                    Proceed to Payment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {fundingStep === 2 && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="h-5 w-5 mr-2" />
                  Fund Your Investment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Investment Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Invoice</div>
                        <div className="font-medium">{invoice.commodity}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Container</div>
                        <div className="font-medium">{invoice.containerId}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Investment Amount</div>
                        <div className="font-bold text-purple-600">${investmentAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Expected Return</div>
                        <div className="font-bold text-green-600">+${returns.discountAmount.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  <USDCPaymentWidget
                    amount={investmentAmount}
                    recipientAddress="0.0.123456" // Escrow contract address
                    onPaymentComplete={handlePaymentComplete}
                    onPaymentError={handlePaymentError}
                  />

                  <div className="flex space-x-4">
                    <Button variant="outline" onClick={() => setFundingStep(1)} className="flex-1">
                      ← Back to Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {fundingStep === 3 && (
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="p-12">
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-green-600 mb-2">Investment Successful!</h2>
                    <p className="text-muted-foreground">
                      Your investment of ${investmentAmount.toLocaleString()} has been successfully funded.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                    <h4 className="font-semibold mb-4">What happens next?</h4>
                    <div className="space-y-3 text-sm text-left">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">1</span>
                        </div>
                        <span>Your USDC is held in escrow smart contract</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-purple-600">2</span>
                        </div>
                        <span>Track container shipment in real-time via HCS</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-green-600">3</span>
                        </div>
                        <span>Automatic payout on delivery confirmation</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-orange-600" asChild>
                      <Link href="/investor/portfolio">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        View Portfolio
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <Link href="/investor/marketplace">Find More Opportunities</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

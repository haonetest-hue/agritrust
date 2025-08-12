"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Leaf,
  Shield,
  TrendingUp,
  Clock,
  Zap,
  Package,
  ArrowRight,
  CheckCircle,
  QrCode,
  BarChart3,
  Globe,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-6xl mx-auto">
          {/* Revolutionary Badge */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 px-6 py-3 rounded-full text-sm font-semibold shadow-lg border border-yellow-200">
              <Zap className="w-5 h-5 mr-2 text-yellow-600" />
              Revolutionary Agricultural Trade Finance
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="text-gray-900">From </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Invoice</span>
            <span className="text-gray-900"> to </span>
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Fork:</span>
            <br />
            <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Complete Agri-Trade Ecosystem
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-16 leading-relaxed max-w-5xl mx-auto font-medium">
            Fund container shipments with USDC escrow, track from farm to consumer with blockchain transparency, and
            earn 18-20% APY through fractional invoice investments.
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur hover:scale-105">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">$2.4T</div>
                <div className="text-sm text-gray-600 font-medium">Global Market</div>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur hover:scale-105">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">80%</div>
                <div className="text-sm text-gray-600 font-medium">USDC Advance</div>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur hover:scale-105">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">18-20%</div>
                <div className="text-sm text-gray-600 font-medium">APY Returns</div>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur hover:scale-105">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">≤5s</div>
                <div className="text-sm text-gray-600 font-medium">Finality</div>
              </CardContent>
            </Card>
          </div>

          {/* Role Selection */}
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-12">Choose Your Role to Get Started</h2>

            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-4xl mx-auto">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-10 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                asChild
              >
                <Link href="/supplier" className="flex items-center">
                  <Leaf className="w-6 h-6 mr-4" />
                  I'm a Supplier
                  <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                asChild
              >
                <Link href="/buyer" className="flex items-center">
                  <Package className="w-6 h-6 mr-4" />
                  I'm a Buyer
                  <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-10 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                asChild
              >
                <Link href="/investor" className="flex items-center">
                  <TrendingUp className="w-6 h-6 mr-4" />
                  I'm an Investor
                  <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 mb-6">End-to-End Workflow</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How AgriTrust 2.0 Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From farm to fork, every step is transparent, secure, and profitable for all stakeholders
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Step 1: Supplier */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-800">1. Supplier Creates Lot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Mint agricultural lot NFT with metadata</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Generate QR codes for tracking</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Publish supply chain events</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Set up USDC escrow contract</span>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Buyer */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-blue-800">2. Buyer Discovers & Purchases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Browse marketplace for lots</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">View complete traceability data</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Deposit 80% USDC to escrow</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Track shipment in real-time</span>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Investor */}
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-purple-800">3. Investor Funds Invoice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Browse invoice marketplace</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Analyze risk profiles & returns</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Fund fractional invoice amounts</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Earn 18-20% APY on investment</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workflow Visualization */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Complete Transaction Flow</h3>
            <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-bold">1</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Lot Creation</span>
              </div>
              <ArrowRight className="h-6 w-6 text-gray-400 rotate-90 md:rotate-0" />
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-bold">2</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Escrow Deposit</span>
              </div>
              <ArrowRight className="h-6 w-6 text-gray-400 rotate-90 md:rotate-0" />
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-bold">3</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Invoice Funding</span>
              </div>
              <ArrowRight className="h-6 w-6 text-gray-400 rotate-90 md:rotate-0" />
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-bold">4</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Delivery & Payment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Built on Hedera Hashgraph</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade blockchain with carbon-negative consensus and sub-second finality
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <QrCode className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">QR Code Traceability</h3>
                <p className="text-gray-600">
                  Generate and scan QR codes to track products from farm to consumer with complete transparency.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">USDC Escrow</h3>
                <p className="text-gray-600">
                  Secure payments with smart contract escrow, releasing funds only upon delivery confirmation.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Invoice Factoring</h3>
                <p className="text-gray-600">
                  Fractional investment opportunities with 18-20% APY returns on agricultural trade invoices.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Global Marketplace</h3>
                <p className="text-gray-600">
                  Connect suppliers, buyers, and investors worldwide in a transparent agricultural marketplace.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Tracking</h3>
                <p className="text-gray-600">
                  Monitor shipments and supply chain events with Hedera Consensus Service immutability.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Carbon Negative</h3>
                <p className="text-gray-600">
                  Built on the world's most sustainable blockchain with proof-of-stake consensus mechanism.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Agricultural Trade?</h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto text-green-100">
            Join the future of transparent, profitable, and sustainable agriculture with blockchain technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <Link href="/role-selection">
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-white text-white hover:bg-white hover:text-green-600 transition-all bg-transparent"
              asChild
            >
              <Link href="/marketplace">Explore Marketplace</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

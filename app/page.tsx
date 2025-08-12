"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Leaf,
  Shield,
  TrendingUp,
  Users,
  Globe,
  Zap,
  ArrowRight,
  CheckCircle,
  DollarSign,
  Clock,
  Award,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { useRole } from "@/components/providers/role-provider"

export default function LandingPage() {
  const { setRole } = useRole()

  const handleGetStarted = () => {
    // Navigate to role selection
    window.location.href = "/role-selection"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
              🚀 Unlocking $2.4 Trillion Agricultural Market
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Democratize African Agriculture with <span className="text-green-600">8-20% APY</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform farmland into tokenized assets (RWA) on Hedera blockchain. Connect farmers with global investors
              through transparent, secure, and profitable agricultural investments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
                onClick={handleGetStarted}
              >
                Start Investing <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg bg-transparent"
                asChild
              >
                <Link href="/marketplace">Explore Projects</Link>
              </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">$500B+</div>
                <div className="text-sm text-gray-600">Unlocked Value</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">8-20%</div>
                <div className="text-sm text-gray-600">APY Range</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">≤3s</div>
                <div className="text-sm text-gray-600">Transaction Speed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">$0.001</div>
                <div className="text-sm text-gray-600">Transaction Cost</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Trusted by the Agricultural Community</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">500+</div>
              <div className="text-gray-600">Active Farmers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">$50M+</div>
              <div className="text-gray-600">Total Funded</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">1,000+</div>
              <div className="text-gray-600">Tokenized Lots</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">15+</div>
              <div className="text-gray-600">African Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How AgriTrust Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, transparent, and secure process for both farmers and investors
            </p>
          </div>

          {/* For Investors */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-blue-600">For Investors</h3>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">1. Explore</h4>
                <p className="text-gray-600 text-sm">
                  Browse verified agricultural lots tokenized as NFTs on Hedera blockchain
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">2. Fund</h4>
                <p className="text-gray-600 text-sm">
                  Invest securely using USDC with smart contract escrow protection
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">3. Track</h4>
                <p className="text-gray-600 text-sm">Monitor real-time progress via Hedera Consensus Service</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">4. Earn</h4>
                <p className="text-gray-600 text-sm">Receive 8-20% APY returns after successful harvest and sale</p>
              </div>
            </div>
          </div>

          {/* For Farmers */}
          <div>
            <h3 className="text-2xl font-bold text-center mb-8 text-green-600">For Farmers</h3>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">1. Apply</h4>
                <p className="text-gray-600 text-sm">
                  Submit your farmland and project for verification by AgriTrust team
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">2. Tokenize</h4>
                <p className="text-gray-600 text-sm">
                  Your approved farmland becomes a digital asset (NFT) ready for funding
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">3. Receive</h4>
                <p className="text-gray-600 text-sm">
                  Get working capital directly to your wallet once funding target is met
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">4. Report</h4>
                <p className="text-gray-600 text-sm">
                  Update farming progress regularly to maintain transparency with investors
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose AgriTrust */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose AgriTrust?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built on Hedera blockchain for maximum security, speed, and sustainability
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Built on Hedera's enterprise-grade blockchain with bank-level security and regulatory compliance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Transactions settle in ≤3 seconds with predictable fees as low as $0.001 per transaction.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Carbon Negative</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Hedera is carbon-negative, making your agricultural investments environmentally sustainable.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>High Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Earn 8-20% APY through direct agricultural investments with transparent profit sharing.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Social Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Directly support African farmers and contribute to food security while earning returns.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Full Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track every step from seed to sale with immutable records on Hedera Consensus Service.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Agriculture?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of investors and farmers already building the future of sustainable agriculture on
            blockchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              onClick={handleGetStarted}
            >
              Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg bg-transparent"
              asChild
            >
              <Link href="/qr-tools">Try QR Tools</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

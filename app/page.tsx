"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Shield, TrendingUp, Globe, Zap, Users, CheckCircle, BarChart3, QrCode } from "lucide-react"

const metrics = [
  { label: "Market Size", value: "$2.4T", description: "Global agricultural market" },
  { label: "Value Unlocked", value: "$500B+", description: "Through blockchain transparency" },
  { label: "Transaction Speed", value: "≤3s", description: "Average settlement time" },
  { label: "Transaction Cost", value: "$0.001", description: "Per transaction on Hedera" },
]

const socialProof = [
  { label: "Farmers", value: "500+", description: "Active on platform" },
  { label: "Funded", value: "$50M+", description: "Total funding provided" },
  { label: "Lots Tracked", value: "1,000+", description: "Supply chain transparency" },
  { label: "Countries", value: "15+", description: "Global reach" },
]

const benefits = [
  {
    icon: Shield,
    title: "Blockchain Security",
    description: "Immutable records on Hedera Hashgraph ensure data integrity and prevent fraud.",
  },
  {
    icon: TrendingUp,
    title: "Higher Returns",
    description: "Earn 8-20% APY by investing directly in agricultural supply chains.",
  },
  {
    icon: Globe,
    title: "Global Access",
    description: "Connect farmers worldwide with investors, removing geographical barriers.",
  },
  {
    icon: Zap,
    title: "Instant Settlements",
    description: "Fast, low-cost transactions powered by Hedera and USDC payments.",
  },
  {
    icon: Users,
    title: "Verified Network",
    description: "All participants verified through decentralized identity (DID) system.",
  },
  {
    icon: CheckCircle,
    title: "Quality Assured",
    description: "Lab-verified quality attestations ensure product standards.",
  },
]

const featuredProjects = [
  {
    id: 1,
    title: "Ethiopian Coffee Cooperative",
    location: "Sidamo, Ethiopia",
    crop: "Arabica Coffee",
    funding: 85000,
    target: 100000,
    apy: "18%",
    duration: "8 months",
    quality: "Grade A",
    image: "/placeholder.svg?height=200&width=300&text=Coffee+Farm",
  },
  {
    id: 2,
    title: "Organic Rice Farm",
    location: "Punjab, India",
    crop: "Basmati Rice",
    funding: 62000,
    target: 75000,
    apy: "15%",
    duration: "6 months",
    quality: "Organic Certified",
    image: "/placeholder.svg?height=200&width=300&text=Rice+Farm",
  },
  {
    id: 3,
    title: "Cocoa Plantation",
    location: "Ghana",
    crop: "Premium Cocoa",
    funding: 120000,
    target: 150000,
    apy: "20%",
    duration: "12 months",
    quality: "Fair Trade",
    image: "/placeholder.svg?height=200&width=300&text=Cocoa+Farm",
  },
]

export default function LandingPage() {
  const [currentMetric, setCurrentMetric] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetric((prev) => (prev + 1) % metrics.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
              🌱 Revolutionizing Agriculture Finance
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Unlock the $2.4 Trillion Agricultural Market
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Connect farmers with global investors through blockchain-verified supply chains. Earn{" "}
              <span className="font-bold text-green-600">8-20% APY</span> while supporting sustainable agriculture.
            </p>
          </div>

          {/* Dynamic Metrics Display */}
          <div className="mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto shadow-lg border">
              <div className="text-4xl font-bold text-gray-900 mb-2">{metrics[currentMetric].value}</div>
              <div className="text-lg font-semibold text-gray-700 mb-1">{metrics[currentMetric].label}</div>
              <div className="text-sm text-gray-500">{metrics[currentMetric].description}</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/role-selection">
              <Button
                size="lg"
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                Start Investing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/qr-tools">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold border-2 bg-transparent">
                <QrCode className="mr-2 h-5 w-5" />
                QR Tools
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {socialProof.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-gray-700 mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose AgriTrust?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The first blockchain platform to combine agricultural finance, supply chain transparency, and verified
              quality assurance in one ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Investment Opportunities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover verified agricultural projects with transparent supply chains and guaranteed returns.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white">
                <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {project.apy} APY
                    </Badge>
                  </div>
                  <CardDescription className="text-sm text-gray-600">
                    {project.location} • {project.crop}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Funding Progress</span>
                        <span className="font-medium">
                          ${project.funding.toLocaleString()} / ${project.target.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={(project.funding / project.target) * 100} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Duration</div>
                        <div className="font-medium">{project.duration}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Quality</div>
                        <div className="font-medium">{project.quality}</div>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                      Invest Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How AgriTrust Works</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Three simple steps to start earning returns while supporting global agriculture.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">1. Choose Your Role</h3>
              <p className="opacity-90 leading-relaxed">
                Select whether you're a farmer seeking funding, an investor looking for returns, or a buyer wanting
                traceable products.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">2. Verify & Connect</h3>
              <p className="opacity-90 leading-relaxed">
                Complete identity verification through our DID system and connect with verified participants in the
                agricultural ecosystem.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">3. Earn & Track</h3>
              <p className="opacity-90 leading-relaxed">
                Start earning returns on your investments while tracking every step of the supply chain through
                blockchain transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Platform Statistics</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real numbers from our growing agricultural finance ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  {metric.value}
                </div>
                <div className="text-lg font-semibold mb-1">{metric.label}</div>
                <div className="text-sm text-gray-400">{metric.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Transform Agriculture Finance?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers and investors already using AgriTrust to create a more transparent and profitable
            agricultural ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/role-selection">
              <Button
                size="lg"
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold border-2 bg-transparent">
                <BarChart3 className="mr-2 h-5 w-5" />
                Explore Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

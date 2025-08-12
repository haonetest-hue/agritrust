"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, Truck, DollarSign, ArrowRight, CheckCircle } from "lucide-react"

const roles = [
  {
    id: "supplier",
    title: "Agricultural Supplier",
    description: "Export your agricultural products globally with instant financing",
    icon: Leaf,
    color: "from-green-500 to-emerald-600",
    benefits: [
      "Get 80% advance payment instantly",
      "No collateral required",
      "Global market access",
      "Quality certification support",
    ],
    cta: "Start Exporting",
    route: "/supplier",
  },
  {
    id: "buyer",
    title: "Agricultural Buyer",
    description: "Source quality agricultural products with secure USDC escrow",
    icon: Truck,
    color: "from-blue-500 to-cyan-600",
    benefits: [
      "Guaranteed product quality",
      "Secure USDC escrow protection",
      "Full supply chain visibility",
      "Direct supplier relationships",
    ],
    cta: "Start Sourcing",
    route: "/buyer",
  },
  {
    id: "investor",
    title: "Trade Finance Investor",
    description: "Fund agricultural invoices and earn 18-20% APY returns",
    icon: DollarSign,
    color: "from-purple-500 to-pink-600",
    benefits: [
      "High yield returns (18-20% APY)",
      "Short-term investments (30-60 days)",
      "Diversified portfolio options",
      "Transparent risk assessment",
    ],
    cta: "Start Investing",
    route: "/investor",
  },
]

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const router = useRouter()

  const handleRoleSelect = (roleId: string, route: string) => {
    setSelectedRole(roleId)
    // Store role in sessionStorage for persistence
    sessionStorage.setItem("agritrust-role", roleId)

    // Navigate to role dashboard
    setTimeout(() => {
      router.push(route)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Choose Your Role</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select your role in the AgriTrust 2.0 ecosystem to access tailored features and opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {roles.map((role) => {
            const Icon = role.icon
            const isSelected = selectedRole === role.id

            return (
              <Card
                key={role.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${
                  isSelected ? "ring-2 ring-purple-500 scale-105" : "hover:scale-105"
                }`}
                onClick={() => handleRoleSelect(role.id, role.route)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-5`}></div>

                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                  <CardDescription className="text-base">{role.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {role.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full bg-gradient-to-r ${role.color} hover:opacity-90 transition-all duration-300 ${
                      isSelected ? "animate-pulse" : ""
                    }`}
                    disabled={isSelected}
                  >
                    {isSelected ? (
                      "Redirecting..."
                    ) : (
                      <>
                        {role.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>

                {isSelected && (
                  <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">Not sure which role fits you best?</p>
          <Button variant="outline" asChild>
            <a href="/marketplace">
              Explore Marketplace First
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

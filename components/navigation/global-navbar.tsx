"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useRole } from "@/components/providers/role-provider"
import {
  Menu,
  Leaf,
  Package,
  TrendingUp,
  Microscope,
  Wallet,
  User,
  LogOut,
  QrCode,
  BarChart3,
  ShoppingCart,
} from "lucide-react"
import { useState } from "react"

interface WalletInfo {
  address: string
  balance: string
  connected: boolean
}

export function GlobalNavbar() {
  const { currentRole, setRole, userProfile } = useRole()
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Connect to Hedera wallet
  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      // HashConnect integration would go here
      if (typeof window !== "undefined" && (window as any).hashconnect) {
        const hashconnect = (window as any).hashconnect
        const appMetadata = {
          name: "AgriTrust 2.0",
          description: "Agricultural Trade Finance Platform",
          icon: "/favicon.ico",
        }

        await hashconnect.init(appMetadata)
        const state = await hashconnect.connect()

        if (state.pairingData) {
          setWalletInfo({
            address: state.pairingData.accountIds[0],
            balance: "0.00 HBAR", // Would fetch real balance
            connected: true,
          })
        }
      } else {
        // Fallback for demo
        setWalletInfo({
          address: "0.0.123456",
          balance: "1,250.50 HBAR",
          connected: true,
        })
      }
    } catch (error) {
      console.error("Wallet connection failed:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setWalletInfo(null)
    setRole(null)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "supplier":
        return <Leaf className="h-4 w-4" />
      case "buyer":
        return <Package className="h-4 w-4" />
      case "investor":
        return <TrendingUp className="h-4 w-4" />
      case "lab":
        return <Microscope className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "supplier":
        return "bg-green-100 text-green-800"
      case "buyer":
        return "bg-blue-100 text-blue-800"
      case "investor":
        return "bg-purple-100 text-purple-800"
      case "lab":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const mainNavItems = [
    { href: `/${currentRole}`, label: "Dashboard", icon: BarChart3 },
    { href: "/marketplace", label: "Marketplace", icon: ShoppingCart },
    { href: "/qr-tools", label: "QR Tools", icon: QrCode },
  ]

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg flex items-center justify-center">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">AgriTrust</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {currentRole &&
              mainNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Role Selector */}
            {currentRole && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden md:flex bg-transparent">
                    {getRoleIcon(currentRole)}
                    <span className="ml-2 capitalize">{currentRole}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">Switch Role</p>
                  </div>
                  <DropdownMenuSeparator />
                  {["supplier", "buyer", "investor", "lab"].map((role) => (
                    <DropdownMenuItem
                      key={role}
                      onClick={() => setRole(role as any)}
                      className="flex items-center space-x-2"
                    >
                      {getRoleIcon(role)}
                      <span className="capitalize">{role}</span>
                      {role === currentRole && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          Active
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Wallet */}
            {walletInfo ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden md:flex bg-transparent">
                    <Wallet className="h-4 w-4" />
                    <span className="ml-2">{walletInfo.address.slice(0, 8)}...</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">Wallet Connected</p>
                    <p className="text-xs text-gray-500">{walletInfo.address}</p>
                    <p className="text-sm font-semibold mt-1">{walletInfo.balance}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={disconnectWallet}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                size="sm"
                className="hidden md:flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden bg-transparent">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-6">
                  {/* Role Selection */}
                  {currentRole && (
                    <div>
                      <h3 className="font-semibold mb-3">Current Role</h3>
                      <Badge className={`${getRoleColor(currentRole)} flex items-center w-fit`}>
                        {getRoleIcon(currentRole)}
                        <span className="ml-2 capitalize">{currentRole}</span>
                      </Badge>
                    </div>
                  )}

                  {/* Navigation */}
                  <div>
                    <h3 className="font-semibold mb-3">Navigation</h3>
                    <div className="space-y-2">
                      {mainNavItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  {/* Role Switching */}
                  <div>
                    <h3 className="font-semibold mb-3">Switch Role</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {["supplier", "buyer", "investor", "lab"].map((role) => (
                        <Button
                          key={role}
                          variant={role === currentRole ? "default" : "outline"}
                          size="sm"
                          onClick={() => setRole(role as any)}
                          className="flex items-center space-x-2"
                        >
                          {getRoleIcon(role)}
                          <span className="capitalize text-xs">{role}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Wallet */}
                  <div>
                    <h3 className="font-semibold mb-3">Wallet</h3>
                    {walletInfo ? (
                      <div className="space-y-2">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">{walletInfo.address}</p>
                          <p className="text-sm text-gray-600">{walletInfo.balance}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={disconnectWallet}
                          className="w-full bg-transparent"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={connectWallet}
                        disabled={isConnecting}
                        size="sm"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        {isConnecting ? "Connecting..." : "Connect Wallet"}
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

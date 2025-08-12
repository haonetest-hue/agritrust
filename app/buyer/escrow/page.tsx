"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, DollarSign, CheckCircle, Copy, AlertCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

interface Lot {
  id: string
  supplier: string
  commodity: string
  variety: string
  value: number
  weight: number
}

export default function EscrowPage() {
  const searchParams = useSearchParams()
  const [selectedLot, setSelectedLot] = useState<string>("")
  const [amount, setAmount] = useState<number>(0)
  const [usdcAssociated, setUsdcAssociated] = useState(false)
  const [isDepositing, setIsDepositing] = useState(false)
  const [escrowCreated, setEscrowCreated] = useState(false)
  const [acceptQR, setAcceptQR] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  const availableLots: Lot[] = [
    {
      id: "LOT-001",
      supplier: "Budi Santoso Cooperative",
      commodity: "Coffee Arabica",
      variety: "Premium Grade",
      value: 62500,
      weight: 25000,
    },
    {
      id: "LOT-002",
      supplier: "Ghana Cocoa Collective",
      commodity: "Cocoa Beans",
      variety: "Trinitario Premium",
      value: 45000,
      weight: 18000,
    },
    {
      id: "LOT-003",
      supplier: "Colombian Coffee Alliance",
      commodity: "Coffee Arabica",
      variety: "Specialty Grade",
      value: 50000,
      weight: 20000,
    },
  ]

  useEffect(() => {
    const lotParam = searchParams.get("lot")
    if (lotParam) {
      setSelectedLot(lotParam)
      const lot = availableLots.find((l) => l.id === lotParam)
      if (lot) {
        setAmount(lot.value * 0.8) // Default to 80% of lot value
      }
    }
  }, [searchParams])

  const handleDeposit = async () => {
    if (!selectedLot || !amount || !usdcAssociated) {
      toast({
        title: "Missing Information",
        description: "Please select a lot, enter amount, and associate USDC-HTS",
        variant: "destructive",
      })
      return
    }

    setIsDepositing(true)

    try {
      // Simulate escrow creation
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`
      const mockAcceptQR = `${window.location.origin}/a/accept?nonce=abc123&exp=1234567890&sig=def456&lot=${selectedLot}`

      setTxHash(mockTxHash)
      setAcceptQR(mockAcceptQR)
      setEscrowCreated(true)

      toast({
        title: "Escrow Created Successfully!",
        description: `USDC deposited: $${amount.toLocaleString()}`,
      })
    } catch (error) {
      toast({
        title: "Escrow Creation Failed",
        description: "Failed to create escrow. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDepositing(false)
    }
  }

  const copyAcceptLink = () => {
    if (acceptQR) {
      navigator.clipboard.writeText(acceptQR)
      toast({
        title: "Accept Link Copied",
        description: "Share this link with logistics for delivery acceptance",
      })
    }
  }

  if (escrowCreated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-green-600">Escrow Created Successfully!</h1>
              <p className="text-muted-foreground">Your USDC has been deposited and secured</p>
            </div>

            <div className="space-y-4 text-left bg-muted/50 rounded-xl p-6">
              <div className="flex justify-between">
                <span className="font-medium">Lot ID:</span>
                <Badge variant="outline">{selectedLot}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount Deposited:</span>
                <span className="font-bold text-green-600">${amount.toLocaleString()} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Transaction Hash:</span>
                <Button variant="link" size="sm" className="p-0 h-auto">
                  {txHash?.substring(0, 20)}...
                </Button>
              </div>
            </div>

            {acceptQR && (
              <div className="space-y-4">
                <h3 className="font-bold">Accept Delivery QR Code</h3>
                <div className="bg-white p-4 rounded-lg border">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(acceptQR)}`}
                    alt="Accept Delivery QR Code"
                    className="mx-auto"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={copyAcceptLink} variant="outline" className="flex-1 bg-transparent">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Accept Link
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent" asChild>
                    <Link href={`/trace/${selectedLot}`}>View in Lot Viewer</Link>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this QR code or link with logistics team for delivery acceptance
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setEscrowCreated(false)}>
                Create Another Escrow
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/buyer">Go to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create Escrow
              </span>
              <div className="text-xs text-muted-foreground">Secure USDC transactions</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/buyer/discover">Discover Lots</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/buyer">← Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Create USDC Escrow</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="lot-select">Select Lot</Label>
                <Select value={selectedLot} onValueChange={setSelectedLot}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a lot to purchase" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLots.map((lot) => (
                      <SelectItem key={lot.id} value={lot.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {lot.id} - {lot.commodity}
                          </span>
                          <span className="text-muted-foreground ml-4">${lot.value.toLocaleString()}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedLot && (
                <div className="bg-muted/50 rounded-lg p-4">
                  {(() => {
                    const lot = availableLots.find((l) => l.id === selectedLot)
                    return lot ? (
                      <div className="space-y-2">
                        <h4 className="font-medium">
                          {lot.commodity} - {lot.variety}
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Supplier:</span>
                            <div>{lot.supplier}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Weight:</span>
                            <div>{lot.weight.toLocaleString()} kg</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Total Value:</span>
                            <div className="font-bold">${lot.value.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Recommended (80%):</span>
                            <div className="font-bold text-green-600">${(lot.value * 0.8).toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    ) : null
                  })()}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Checkbox id="usdc-associate" checked={usdcAssociated} onCheckedChange={setUsdcAssociated} />
                  <div className="flex-1">
                    <Label htmlFor="usdc-associate" className="text-sm font-medium">
                      Associate USDC-HTS Token
                    </Label>
                    <p className="text-xs text-muted-foreground">Required to deposit USDC into escrow smart contract</p>
                  </div>
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>

                {!usdcAssociated && (
                  <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium">USDC-HTS Association Required</p>
                      <p className="text-xs">You must associate the USDC token before creating escrow</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Escrow Amount (USDC)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Enter amount in USDC"
                />
                <p className="text-xs text-muted-foreground">Recommended: 80% of lot value for standard terms</p>
              </div>

              <Button
                onClick={handleDeposit}
                disabled={isDepositing || !selectedLot || !amount || !usdcAssociated}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                {isDepositing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                    Creating Escrow...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5 mr-3" />
                    Deposit ${amount.toLocaleString()} USDC
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-6">
              <h3 className="font-bold mb-3">🔒 How Escrow Works</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Your USDC is locked in a smart contract until delivery conditions are met</p>
                <p>• Funds are automatically released when the supplier completes all milestones</p>
                <p>• You'll receive an Accept QR code to confirm delivery upon arrival</p>
                <p>• Full transparency with blockchain transaction records</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

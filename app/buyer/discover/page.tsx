"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MapPin, Award, Eye, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface Lot {
  id: string
  supplier: string
  country: string
  commodity: string
  variety: string
  weight: number
  value: number
  certifications: string[]
  lastEvent: string
  qualityScore: number
  supplierRating: number
  harvestDate: string
}

export default function DiscoverLotsPage() {
  const [lots, setLots] = useState<Lot[]>([])
  const [filteredLots, setFilteredLots] = useState<Lot[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCommodity, setSelectedCommodity] = useState("all")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [selectedCertification, setSelectedCertification] = useState("all")

  useEffect(() => {
    // Mock data
    const mockLots: Lot[] = [
      {
        id: "LOT-001",
        supplier: "Budi Santoso Cooperative",
        country: "Indonesia",
        commodity: "Coffee Arabica",
        variety: "Premium Grade",
        weight: 25000,
        value: 62500,
        certifications: ["Organic", "Fair Trade", "Rainforest Alliance"],
        lastEvent: "Quality OK",
        qualityScore: 95,
        supplierRating: 4.8,
        harvestDate: "2024-01-15",
      },
      {
        id: "LOT-002",
        supplier: "Ghana Cocoa Collective",
        country: "Ghana",
        commodity: "Cocoa Beans",
        variety: "Trinitario Premium",
        weight: 18000,
        value: 45000,
        certifications: ["Fair Trade", "UTZ Certified"],
        lastEvent: "Dispatched",
        qualityScore: 92,
        supplierRating: 4.6,
        harvestDate: "2024-01-20",
      },
      {
        id: "LOT-003",
        supplier: "Colombian Coffee Alliance",
        country: "Colombia",
        commodity: "Coffee Arabica",
        variety: "Specialty Grade",
        weight: 20000,
        value: 50000,
        certifications: ["Organic", "Fair Trade", "Bird Friendly"],
        lastEvent: "Quality OK",
        qualityScore: 97,
        supplierRating: 4.9,
        harvestDate: "2024-01-25",
      },
      {
        id: "LOT-004",
        supplier: "Ethiopian Highlands Co-op",
        country: "Ethiopia",
        commodity: "Coffee Arabica",
        variety: "Single Origin",
        weight: 15000,
        value: 37500,
        certifications: ["Organic", "Rainforest Alliance"],
        lastEvent: "Quality OK",
        qualityScore: 89,
        supplierRating: 4.4,
        harvestDate: "2024-02-01",
      },
      {
        id: "LOT-005",
        supplier: "Vietnam Robusta Producers",
        country: "Vietnam",
        commodity: "Coffee Robusta",
        variety: "Premium",
        weight: 30000,
        value: 45000,
        certifications: ["UTZ Certified"],
        lastEvent: "Dispatched",
        qualityScore: 85,
        supplierRating: 4.2,
        harvestDate: "2024-02-05",
      },
    ]

    setLots(mockLots)
    setFilteredLots(mockLots)
  }, [])

  useEffect(() => {
    const filtered = lots.filter((lot) => {
      const matchesSearch =
        lot.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.variety.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCommodity = selectedCommodity === "all" || lot.commodity.toLowerCase().includes(selectedCommodity)
      const matchesCountry = selectedCountry === "all" || lot.country === selectedCountry
      const matchesCertification =
        selectedCertification === "all" ||
        lot.certifications.some((cert) => cert.toLowerCase().includes(selectedCertification))

      return matchesSearch && matchesCommodity && matchesCountry && matchesCertification
    })

    setFilteredLots(filtered)
  }, [lots, searchTerm, selectedCommodity, selectedCountry, selectedCertification])

  const getEventStatusColor = (event: string) => {
    switch (event) {
      case "Quality OK":
        return "bg-green-100 text-green-800"
      case "Dispatched":
        return "bg-blue-100 text-blue-800"
      case "In Transit":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Discover Lots
              </span>
              <div className="text-xs text-muted-foreground">{filteredLots.length} verified lots available</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/buyer/escrow">Manage Escrow</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/buyer">← Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filter & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search commodity, supplier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Commodity</label>
                <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Commodities</SelectItem>
                    <SelectItem value="coffee">Coffee</SelectItem>
                    <SelectItem value="cocoa">Cocoa</SelectItem>
                    <SelectItem value="tea">Tea</SelectItem>
                    <SelectItem value="spices">Spices</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Country</label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="Indonesia">Indonesia</SelectItem>
                    <SelectItem value="Ghana">Ghana</SelectItem>
                    <SelectItem value="Colombia">Colombia</SelectItem>
                    <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                    <SelectItem value="Vietnam">Vietnam</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Certification</label>
                <Select value={selectedCertification} onValueChange={setSelectedCertification}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Certifications</SelectItem>
                    <SelectItem value="organic">Organic</SelectItem>
                    <SelectItem value="fair trade">Fair Trade</SelectItem>
                    <SelectItem value="rainforest alliance">Rainforest Alliance</SelectItem>
                    <SelectItem value="utz certified">UTZ Certified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lots Grid */}
        {filteredLots.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No lots found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedCommodity("all")
                setSelectedCountry("all")
                setSelectedCertification("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLots.map((lot) => (
              <Card key={lot.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{lot.commodity}</h3>
                      <p className="text-sm text-muted-foreground">{lot.variety}</p>
                    </div>
                    <Badge className={getEventStatusColor(lot.lastEvent)}>{lot.lastEvent}</Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{lot.supplier}</span>
                      <Badge variant="outline" className="text-xs">
                        {lot.country}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Weight:</span>
                        <div className="font-medium">{lot.weight.toLocaleString()} kg</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Value:</span>
                        <div className="font-bold text-green-600">${lot.value.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span>Quality: {lot.qualityScore}%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>Rating: {lot.supplierRating}/5</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {lot.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                      <Link href={`/trace/${lot.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" asChild>
                      <Link href={`/buyer/escrow?lot=${lot.id}`}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Create Escrow
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tips */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <h3 className="font-bold mb-2">💡 Tips for Buyers</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Look for lots with "Quality OK" status - they're ready for purchase</p>
              <p>• Check supplier ratings and certifications for quality assurance</p>
              <p>• Use the escrow system for secure USDC transactions</p>
              <p>• Scan QR codes on arrival to verify authenticity</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

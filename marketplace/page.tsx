"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { TxLink } from "@/components/ui/tx-link"
import { ProofBadge } from "@/components/ui/proof-badge"
import { EmptyState } from "@/components/ui/empty-state"
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Eye, Filter, Search, Plus } from "lucide-react"

interface AgriCreditListing {
  id: string
  invoiceId: string
  lotId: string
  farmerName: string
  farmerDID: string
  amount: number
  agriCreditAmount: number
  qualityGrade: number
  dueDate: string
  interestRate: number
  advanceRate: number
  crop: string
  region: string
  status: "available" | "partially_filled" | "filled"
  createdAt: string
  htsTokenId: string
  escrowTxId: string
  traceTopicId: string
  kycVerified: boolean
  qcVerified: boolean
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<AgriCreditListing[]>([])
  const [filteredListings, setFilteredListings] = useState<AgriCreditListing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCrop, setFilterCrop] = useState("all")
  const [filterRegion, setFilterRegion] = useState("all")
  const [sortBy, setSortBy] = useState("interest_rate")

  // Mock data - in production, fetch from API
  useEffect(() => {
    const mockListings: AgriCreditListing[] = [
      {
        id: "1",
        invoiceId: "INV-001",
        lotId: "LOT-001",
        farmerName: "Budi Santoso",
        farmerDID: "did:hedera:farmer:001",
        amount: 50000000,
        agriCreditAmount: 47500000,
        qualityGrade: 92,
        dueDate: "2025-03-15",
        interestRate: 12,
        advanceRate: 80,
        crop: "Coffee",
        region: "Aceh",
        status: "available",
        createdAt: "2025-01-15",
        htsTokenId: "0.0.123456",
        escrowTxId: "0.0.123456@1641234567.123456789",
        traceTopicId: "0.0.789012",
        kycVerified: true,
        qcVerified: true,
      },
      {
        id: "2",
        invoiceId: "INV-002",
        lotId: "LOT-002",
        farmerName: "Sari Dewi",
        farmerDID: "did:hedera:farmer:002",
        amount: 75000000,
        agriCreditAmount: 67500000,
        qualityGrade: 88,
        dueDate: "2025-04-20",
        interestRate: 15,
        advanceRate: 75,
        crop: "Cocoa",
        region: "Sulawesi",
        status: "partially_filled",
        createdAt: "2025-01-10",
        htsTokenId: "0.0.234567",
        escrowTxId: "0.0.234567@1641234567.123456789",
        traceTopicId: "0.0.890123",
        kycVerified: true,
        qcVerified: false,
      },
      {
        id: "3",
        invoiceId: "INV-003",
        lotId: "LOT-003",
        farmerName: "Ahmad Rizki",
        farmerDID: "did:hedera:farmer:003",
        amount: 30000000,
        agriCreditAmount: 25500000,
        qualityGrade: 85,
        dueDate: "2025-02-28",
        interestRate: 18,
        advanceRate: 70,
        crop: "Rice",
        region: "Java",
        status: "available",
        createdAt: "2025-01-12",
        htsTokenId: "0.0.345678",
        escrowTxId: "0.0.345678@1641234567.123456789",
        traceTopicId: "0.0.901234",
        kycVerified: true,
        qcVerified: true,
      },
    ]

    setTimeout(() => {
      setListings(mockListings)
      setFilteredListings(mockListings)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter and search logic
  useEffect(() => {
    const filtered = listings.filter((listing) => {
      const matchesSearch =
        listing.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.region.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCrop = filterCrop === "all" || listing.crop.toLowerCase() === filterCrop
      const matchesRegion = filterRegion === "all" || listing.region.toLowerCase() === filterRegion

      return matchesSearch && matchesCrop && matchesRegion
    })

    // Sort listings
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "interest_rate":
          return a.interestRate - b.interestRate
        case "amount":
          return b.amount - a.amount
        case "quality":
          return b.qualityGrade - a.qualityGrade
        case "due_date":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        default:
          return 0
      }
    })

    setFilteredListings(filtered)
  }, [listings, searchQuery, filterCrop, filterRegion, sortBy])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "partially_filled":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "filled":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="container-custom section-padding">
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="grid-cards">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom section-padding space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-display">AgriCredit Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Investasi dalam invoice pertanian terverifikasi dengan return hingga 20% APY
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl bg-transparent">
            <Eye className="w-4 h-4 mr-2" />
            Watchlist
          </Button>
          <Button className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Buat Listing
          </Button>
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4M</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-600" />
              +12.5% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card className="card-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listing Aktif</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listings.length}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-600" />
              +3 baru hari ini
            </p>
          </CardContent>
        </Card>

        <Card className="card-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata APY</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.0%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingDown className="inline w-3 h-3 mr-1 text-red-600" />
              -0.8% dari minggu lalu
            </p>
          </CardContent>
        </Card>

        <Card className="card-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investor Aktif</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-600" />
              +5 baru minggu ini
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-custom">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari berdasarkan nama, komoditas, atau region..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>
            <Select value={filterCrop} onValueChange={setFilterCrop}>
              <SelectTrigger className="w-full md:w-[180px] rounded-xl">
                <SelectValue placeholder="Pilih komoditas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Komoditas</SelectItem>
                <SelectItem value="coffee">Coffee</SelectItem>
                <SelectItem value="cocoa">Cocoa</SelectItem>
                <SelectItem value="rice">Rice</SelectItem>
                <SelectItem value="palm">Palm Oil</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRegion} onValueChange={setFilterRegion}>
              <SelectTrigger className="w-full md:w-[180px] rounded-xl">
                <SelectValue placeholder="Pilih region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Region</SelectItem>
                <SelectItem value="aceh">Aceh</SelectItem>
                <SelectItem value="sulawesi">Sulawesi</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="sumatra">Sumatra</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px] rounded-xl">
                <SelectValue placeholder="Urutkan berdasarkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="interest_rate">Tingkat Bunga</SelectItem>
                <SelectItem value="amount">Jumlah</SelectItem>
                <SelectItem value="quality">Kualitas</SelectItem>
                <SelectItem value="due_date">Jatuh Tempo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Listings */}
      {filteredListings.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="Tidak ada listing yang ditemukan"
          description="Coba ubah filter pencarian atau buat listing demo untuk melihat contoh data."
          action={{
            label: "Reset Filter",
            onClick: () => {
              setSearchQuery("")
              setFilterCrop("all")
              setFilterRegion("all")
            },
          }}
          secondaryAction={{
            label: "Buat Demo",
            onClick: () => {
              // Add demo listings
              console.log("Creating demo listings...")
            },
          }}
        />
      ) : (
        <div className="grid-cards">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="card-custom hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-medium">{listing.farmerName}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span>
                        {listing.crop} • {listing.region}
                      </span>
                      <div className="flex gap-1">
                        <ProofBadge
                          status={listing.kycVerified ? "verified" : "unverified"}
                          label="KYC"
                          variant="compact"
                        />
                        <ProofBadge
                          status={listing.qcVerified ? "verified" : "unverified"}
                          label="QC"
                          variant="compact"
                        />
                      </div>
                    </CardDescription>
                  </div>
                  <Badge className={`rounded-lg ${getStatusColor(listing.status)}`}>
                    {listing.status === "available"
                      ? "Tersedia"
                      : listing.status === "partially_filled"
                        ? "Sebagian Terpenuhi"
                        : "Penuh"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Tenor</p>
                    <p className="font-medium">
                      {Math.ceil((new Date(listing.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}{" "}
                      hari
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Target APY</p>
                    <p className="font-medium text-[hsl(var(--brand))]">{listing.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Kebutuhan</p>
                    <p className="font-medium">${(listing.agriCreditAmount / 15000).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Kualitas</p>
                    <p className="font-medium">{listing.qualityGrade}/100</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress Funding</span>
                    <span>{listing.status === "partially_filled" ? "65%" : "0%"}</span>
                  </div>
                  <Progress value={listing.status === "partially_filled" ? 65 : 0} className="h-2" />
                </div>

                {/* Proof Section */}
                <div className="space-y-2 pt-2 border-t">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bukti On-Chain</p>
                  <div className="space-y-1">
                    <TxLink type="token" id={listing.htsTokenId} label="HTS" variant="compact" />
                    <TxLink type="tx" id={listing.escrowTxId} label="Escrow" variant="compact" />
                    <TxLink type="topic" id={listing.traceTopicId} label="Trace" variant="compact" />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1 rounded-xl bg-transparent">
                    <Eye className="h-4 w-4 mr-2" />
                    Detail
                  </Button>
                  <Button size="sm" className="flex-1 rounded-xl" disabled={listing.status === "filled"}>
                    Danai Sekarang
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

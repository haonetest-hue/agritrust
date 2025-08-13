"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, DollarSign, PieChart, ArrowRight, Wallet, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function InvestorPage() {
  const router = useRouter()

  // Option A: Simple redirect (uncomment to use)
  // useEffect(() => {
  //   router.replace("/marketplace")
  // }, [router])

  // Option B: Investor Hub with embedded marketplace (current implementation)
  const mockStats = {
    totalInvested: 850000,
    activeInvestments: 12,
    totalReturns: 156000,
    avgAPY: 19.2,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Investor Hub Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-semibold mb-2">Investor Hub</h1>
        <p className="text-[hsl(var(--fg-muted))]">Kelola investasi dan temukan peluang pembiayaan pertanian</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="rounded-2xl border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Diinvestasikan</CardTitle>
            <DollarSign className="h-4 w-4 text-[hsl(var(--fg-muted))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockStats.totalInvested.toLocaleString()}</div>
            <p className="text-xs text-[hsl(var(--fg-muted))]">+15% dari bulan lalu</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investasi Aktif</CardTitle>
            <TrendingUp className="h-4 w-4 text-[hsl(var(--fg-muted))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.activeInvestments}</div>
            <p className="text-xs text-[hsl(var(--fg-muted))]">Tersebar di 4 kategori</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Return</CardTitle>
            <BarChart3 className="h-4 w-4 text-[hsl(var(--fg-muted))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockStats.totalReturns.toLocaleString()}</div>
            <p className="text-xs text-[hsl(var(--fg-muted))]">+22% dari bulan lalu</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata APY</CardTitle>
            <PieChart className="h-4 w-4 text-[hsl(var(--fg-muted))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.avgAPY}%</div>
            <p className="text-xs text-[hsl(var(--fg-muted))]">Di atas rata-rata pasar</p>
          </CardContent>
        </Card>
      </div>

      {/* Main CTA to Marketplace */}
      <Card className="rounded-2xl border-[hsl(var(--border))] bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--accent))] text-white mb-8">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Temukan Peluang Investasi Baru</h2>
              <p className="text-white/90 mb-4">
                Jelajahi marketplace untuk menemukan invoice pertanian dengan return hingga 20% APY
              </p>
              <Button asChild className="bg-white text-[hsl(var(--brand))] hover:bg-white/90 h-11 px-5 rounded-xl">
                <Link href="/marketplace">
                  Lihat Marketplace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="hidden md:block">
              <TrendingUp className="h-24 w-24 text-white/20" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="rounded-2xl border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-[hsl(var(--brand))]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-6 w-6 text-[hsl(var(--brand))]" />
            </div>
            <h3 className="text-lg font-medium mb-2">Mulai Investasi</h3>
            <p className="text-sm text-[hsl(var(--fg-muted))] mb-4">Temukan invoice dengan return terbaik</p>
            <Button asChild variant="outline" className="w-full rounded-xl bg-transparent">
              <Link href="/marketplace">Browse Listings</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-[hsl(var(--accent))]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-6 w-6 text-[hsl(var(--accent))]" />
            </div>
            <h3 className="text-lg font-medium mb-2">Kelola Portfolio</h3>
            <p className="text-sm text-[hsl(var(--fg-muted))] mb-4">Pantau performa investasi Anda</p>
            <Button asChild variant="outline" className="w-full rounded-xl bg-transparent">
              <Link href="/investor/portfolio">Lihat Portfolio</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Analytics</h3>
            <p className="text-sm text-[hsl(var(--fg-muted))] mb-4">Analisis mendalam performa investasi</p>
            <Button asChild variant="outline" className="w-full rounded-xl bg-transparent">
              <Link href="/investor/analytics">Lihat Analytics</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="rounded-2xl border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-medium">Aktivitas Terbaru</CardTitle>
              <CardDescription>Investasi dan return terbaru Anda</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-xl bg-transparent">
              <Link href="/marketplace">Lihat Semua</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[hsl(var(--muted))] rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Return Diterima</p>
                  <p className="text-sm text-[hsl(var(--fg-muted))]">INV-COFFEE-001 • +$21,600</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 rounded-lg">Completed</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-[hsl(var(--muted))] rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Investasi Baru</p>
                  <p className="text-sm text-[hsl(var(--fg-muted))]">INV-COCOA-002 • $144,000</p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800 rounded-lg">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-[hsl(var(--muted))] rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Portfolio Update</p>
                  <p className="text-sm text-[hsl(var(--fg-muted))]">Performance +15% bulan ini</p>
                </div>
              </div>
              <Badge variant="outline" className="rounded-lg">
                Info
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

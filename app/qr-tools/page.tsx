"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QrCode, Scan, Camera, Package, Container, FileText, Zap, CheckCircle } from "lucide-react"
import Link from "next/link"
import { QRGenerator } from "@/components/qr/qr-generator"
import { QRScanner } from "@/components/qr/qr-scanner"

export default function QRToolsPage() {
  const [activeTab, setActiveTab] = useState("scanner")

  const demoLots = [
    { id: "LOT-001", type: "Coffee Arabica", status: "In Transit" },
    { id: "LOT-002", type: "Cocoa Beans", status: "Quality Tested" },
    { id: "LOT-003", type: "Rice Jasmine", status: "Delivered" },
  ]

  const demoInvoices = [
    { id: "INV-005", supplier: "Budi Santoso Cooperative", amount: "$270,000" },
    { id: "INV-006", supplier: "Ghana Cocoa Collective", amount: "$450,000" },
    { id: "INV-007", supplier: "Colombian Coffee Alliance", amount: "$180,000" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
              <QrCode className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                QR Code Tools
              </span>
              <div className="text-xs text-muted-foreground">Scanner & Generator for AgriTrust</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">← Home</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Feature Highlights */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">QR Code Tools</h1>
          <p className="text-center text-muted-foreground mb-6">
            Scan existing QR codes or generate new ones for your AgriTrust supply chain
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scan className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">QR Scanner</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Scan QR codes from containers, packages, or documents to access traceability data
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="bg-white">
                    <Camera className="h-3 w-3 mr-1" />
                    Camera
                  </Badge>
                  <Badge variant="outline" className="bg-white">
                    <Package className="h-3 w-3 mr-1" />
                    Upload
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">QR Generator</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create QR codes for lots, containers, packages, or investment invoices
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="bg-white">
                    <Container className="h-3 w-3 mr-1" />
                    Container
                  </Badge>
                  <Badge variant="outline" className="bg-white">
                    <FileText className="h-3 w-3 mr-1" />
                    Invoice
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Tools */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scanner" className="flex items-center space-x-2">
              <Scan className="h-4 w-4" />
              <span>QR Scanner</span>
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center space-x-2">
              <QrCode className="h-4 w-4" />
              <span>QR Generator</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scanner" className="space-y-6">
            <QRScanner />

            {/* Demo Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Demo Lots Available</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {demoLots.map((lot) => (
                      <div key={lot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{lot.id}</div>
                          <div className="text-sm text-muted-foreground">{lot.type}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{lot.status}</Badge>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/trace/${lot.id}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Demo Invoices Available</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {demoInvoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{invoice.id}</div>
                          <div className="text-sm text-muted-foreground">{invoice.supplier}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{invoice.amount}</Badge>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/investor/fund-invoice/${invoice.id}`}>Fund</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="generator" className="space-y-6">
            <QRGenerator />

            {/* Usage Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Usage Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">When to use each QR type:</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <QrCode className="h-4 w-4 mt-1 text-green-600" />
                        <div>
                          <div className="font-medium text-sm">Lot QR</div>
                          <div className="text-xs text-muted-foreground">
                            General traceability - attach to lot documentation
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Container className="h-4 w-4 mt-1 text-blue-600" />
                        <div>
                          <div className="font-medium text-sm">Container QR</div>
                          <div className="text-xs text-muted-foreground">
                            Shipping containers - for logistics tracking
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Package className="h-4 w-4 mt-1 text-purple-600" />
                        <div>
                          <div className="font-medium text-sm">Package QR</div>
                          <div className="text-xs text-muted-foreground">
                            Consumer packages - for end-user verification
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <FileText className="h-4 w-4 mt-1 text-orange-600" />
                        <div>
                          <div className="font-medium text-sm">Invoice QR</div>
                          <div className="text-xs text-muted-foreground">
                            Investment opportunities - for funding access
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Best practices:</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Print QR codes at least 2cm x 2cm for reliable scanning</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Use high contrast (black on white) for best results</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Test QR codes before mass printing</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Include backup text ID below QR code</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

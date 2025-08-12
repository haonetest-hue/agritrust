"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QrCode, MapPin, Calendar, Package, FileText, Leaf, ExternalLink, CheckCircle } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

interface LotDetails {
  id: string
  name: string
  commodity: string
  variety: string
  weight: number
  valueUSD: number
  supplierName: string
  location: string
  harvestDate: string
  qualityGrade: number
  certifications: string[]
  carbonFootprint: number
  coaHash: string
  events: Array<{
    type: string
    timestamp: string
    txHash: string
    status: "completed" | "pending"
  }>
  metadata: {
    moistureContent: number
    proteinContent: number
    fatContent: number
    defectRate: number
  }
}

export default function LotViewerPage({ params }: { params: { lotId: string } }) {
  const [lotDetails, setLotDetails] = useState<LotDetails | null>(null)

  useEffect(() => {
    // Mock lot details
    setLotDetails({
      id: params.lotId,
      name: "Premium Coffee Batch #1",
      commodity: "Coffee",
      variety: "Arabica",
      weight: 1000,
      valueUSD: 15000,
      supplierName: "Budi Santoso Farm",
      location: "Aceh, Indonesia",
      harvestDate: "2025-01-15",
      qualityGrade: 92,
      certifications: ["Organic", "Fair Trade", "Rainforest Alliance"],
      carbonFootprint: 2.4,
      coaHash: "QmX7Y8Z9A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0",
      events: [
        {
          type: "HARVESTED",
          timestamp: "2025-01-15T08:00:00Z",
          txHash: "0x1234567890abcdef1234567890abcdef12345678",
          status: "completed",
        },
        {
          type: "QUALITY_TESTED",
          timestamp: "2025-01-16T14:30:00Z",
          txHash: "0x2345678901bcdef12345678901bcdef123456789",
          status: "completed",
        },
        {
          type: "DISPATCHED",
          timestamp: "2025-01-18T10:15:00Z",
          txHash: "0x3456789012cdef123456789012cdef1234567890",
          status: "completed",
        },
        {
          type: "ACCEPTED",
          timestamp: "",
          txHash: "",
          status: "pending",
        },
        {
          type: "PAID",
          timestamp: "",
          txHash: "",
          status: "pending",
        },
      ],
      metadata: {
        moistureContent: 12.5,
        proteinContent: 11.2,
        fatContent: 15.8,
        defectRate: 2.1,
      },
    })
  }, [params.lotId])

  if (!lotDetails) {
    return <div>Loading...</div>
  }

  const qrCodeValue = `https://agritrust.app/trace/${lotDetails.id}`

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">{lotDetails.name}</h1>
        <p className="text-muted-foreground">Complete traceability and quality information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="rounded-2xl card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-primary" />
                <span>Lot Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Commodity:</span>
                    <span>{lotDetails.commodity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Variety:</span>
                    <span>{lotDetails.variety}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Weight:</span>
                    <span>{lotDetails.weight.toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Value:</span>
                    <span className="font-bold text-green-600">${lotDetails.valueUSD.toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Supplier:</span>
                    <span>{lotDetails.supplierName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Location:</span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {lotDetails.location}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Harvest Date:</span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(lotDetails.harvestDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Quality Grade:</span>
                    <Badge variant="outline" className="text-green-600">
                      {lotDetails.qualityGrade}/100
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="font-medium">Certifications:</div>
                <div className="flex flex-wrap gap-2">
                  {lotDetails.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Carbon Footprint</span>
                </div>
                <span className="text-green-600 font-bold">{lotDetails.carbonFootprint} kg CO₂/kg</span>
              </div>
            </CardContent>
          </Card>

          {/* Supply Chain Timeline */}
          <Card className="rounded-2xl card-shadow">
            <CardHeader>
              <CardTitle>Supply Chain Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {lotDetails.events.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        event.status === "completed" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {event.status === "completed" ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{event.type.replace("_", " ")}</h4>
                        {event.status === "completed" && (
                          <Badge variant="outline" className="text-green-600">
                            Completed
                          </Badge>
                        )}
                      </div>
                      {event.timestamp && (
                        <p className="text-sm text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
                      )}
                      {event.txHash && (
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                          View Transaction: {event.txHash.substring(0, 20)}...
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quality Metadata */}
          <Card className="rounded-2xl card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Quality Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-xl">
                  <div className="text-2xl font-bold">{lotDetails.metadata.moistureContent}%</div>
                  <div className="text-sm text-muted-foreground">Moisture Content</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-xl">
                  <div className="text-2xl font-bold">{lotDetails.metadata.proteinContent}%</div>
                  <div className="text-sm text-muted-foreground">Protein Content</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-xl">
                  <div className="text-2xl font-bold">{lotDetails.metadata.fatContent}%</div>
                  <div className="text-sm text-muted-foreground">Fat Content</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{lotDetails.metadata.defectRate}%</div>
                  <div className="text-sm text-muted-foreground">Defect Rate</div>
                </div>
              </div>

              {lotDetails.coaHash && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Certificate of Analysis</h4>
                      <p className="text-sm text-muted-foreground">IPFS Hash: {lotDetails.coaHash}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      View COA
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* QR Code */}
          <Card className="rounded-2xl card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <QrCode className="h-5 w-5 text-primary" />
                <span>QR Code</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex justify-center">
                <QRCodeSVG value={qrCodeValue} size={200} />
              </div>
              <p className="text-sm text-muted-foreground">Scan to view this lot on mobile</p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Share Lot
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="rounded-2xl card-shadow">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full hedera-gradient">Purchase This Lot</Button>
              <Button variant="outline" className="w-full bg-transparent">
                Contact Supplier
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Mirror Node
              </Button>
            </CardContent>
          </Card>

          {/* Lot Statistics */}
          <Card className="rounded-2xl card-shadow">
            <CardHeader>
              <CardTitle>Lot Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Lot ID:</span>
                <Badge variant="outline">{lotDetails.id}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Events Recorded:</span>
                <span className="font-medium">
                  {lotDetails.events.filter((e) => e.status === "completed").length}/5
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Blockchain Network:</span>
                <span className="font-medium">Hedera</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Last Updated:</span>
                <span className="font-medium">
                  {new Date(
                    lotDetails.events.filter((e) => e.status === "completed").pop()?.timestamp || "",
                  ).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

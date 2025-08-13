"use client"

import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MapPin, Calendar, User, FileText, Camera, Shield, ExternalLink, Copy, CheckCircle } from "lucide-react"
import InteractiveMapWrapper from "./interactive-map-wrapper"

interface TracePageProps {
  params: {
    lotId: string
  }
}

// Mock data with real Hedera identifiers
const mockLotData: Record<string, any> = {
  "LOT-001": {
    id: "LOT-001",
    name: "Premium Coffee Beans - Batch A",
    farmer: "John Doe",
    location: "Kiambu County, Kenya",
    crop: "Arabica Coffee",
    area: "2.5 hectares",
    plantingDate: "2024-03-15",
    expectedHarvest: "2024-11-15",
    currentStage: "Growing",
    progress: 65,
    qualityGrade: "A+",
    certifications: ["Organic", "Fair Trade", "Rainforest Alliance"],
    coordinates: { lat: -1.1743, lng: 36.9276 },
    hederaTopicId: "0.0.4567890",
    hederaTokenId: "0.0.4567891",
    escrowContractId: "0.0.4567892",
  },
  "LOT-002": {
    id: "LOT-002",
    name: "Premium Cocoa Beans - Export Grade",
    farmer: "Sari Dewi",
    location: "Sulawesi, Indonesia",
    crop: "Cocoa Premium",
    area: "3.2 hectares",
    plantingDate: "2024-02-10",
    expectedHarvest: "2024-10-20",
    currentStage: "Processing",
    progress: 85,
    qualityGrade: "A",
    certifications: ["Organic", "UTZ Certified"],
    coordinates: { lat: -2.5489, lng: 118.0149 },
    hederaTopicId: "0.0.4567893",
    hederaTokenId: "0.0.4567894",
    escrowContractId: "0.0.4567895",
  },
  "LOT-003": {
    id: "LOT-003",
    name: "Premium Rice Export - Jasmine Variety",
    farmer: "Ahmad Rizki",
    location: "Central Java, Indonesia",
    crop: "Jasmine Rice",
    area: "5.0 hectares",
    plantingDate: "2024-01-20",
    expectedHarvest: "2024-08-15",
    currentStage: "Harvested",
    progress: 100,
    qualityGrade: "A+",
    certifications: ["Organic", "SRP Certified"],
    coordinates: { lat: -7.7956, lng: 110.3695 },
    hederaTopicId: "0.0.4567896",
    hederaTokenId: "0.0.4567897",
    escrowContractId: "0.0.4567898",
  },
}

const mockEvents: Record<string, any[]> = {
  "LOT-001": [
    {
      id: "1",
      type: "planting",
      title: "Seeds Planted",
      date: "2024-03-15",
      actor: "John Doe (Farmer)",
      location: "Field A, Kiambu County",
      description: "High-quality Arabica coffee seeds planted in prepared soil",
      documents: ["planting-certificate.pdf"],
      images: ["planting-1.jpg", "planting-2.jpg"],
      verified: true,
      transactionId: "0.0.4567890@1710504000.123456789",
      topicSequence: 1,
    },
    {
      id: "2",
      type: "quality_check",
      title: "Soil Quality Assessment",
      date: "2024-04-01",
      actor: "AgriLab Kenya",
      location: "Field A, Kiambu County",
      description: "Comprehensive soil analysis showing optimal pH and nutrient levels",
      documents: ["soil-analysis.pdf"],
      images: ["soil-test.jpg"],
      verified: true,
      transactionId: "0.0.4567890@1711958400.234567890",
      topicSequence: 2,
    },
    {
      id: "3",
      type: "processing",
      title: "First Fertilization",
      date: "2024-05-10",
      actor: "John Doe (Farmer)",
      location: "Field A, Kiambu County",
      description: "Organic fertilizer applied according to sustainable farming practices",
      documents: ["fertilizer-record.pdf"],
      images: ["fertilization.jpg"],
      verified: true,
      transactionId: "0.0.4567890@1715299200.345678901",
      topicSequence: 3,
    },
    {
      id: "4",
      type: "quality_check",
      title: "Growth Monitoring",
      date: "2024-07-20",
      actor: "Agricultural Extension Officer",
      location: "Field A, Kiambu County",
      description: "Plants showing healthy growth, no signs of disease or pest damage",
      documents: ["growth-report.pdf"],
      images: ["growth-1.jpg", "growth-2.jpg"],
      verified: true,
      transactionId: "0.0.4567890@1721433600.456789012",
      topicSequence: 4,
    },
  ],
  "LOT-002": [
    {
      id: "1",
      type: "planting",
      title: "Cocoa Seedlings Planted",
      date: "2024-02-10",
      actor: "Sari Dewi (Farmer)",
      location: "Plantation A, Sulawesi",
      description: "Premium cocoa seedlings planted with proper spacing",
      documents: ["planting-record.pdf"],
      images: ["cocoa-planting.jpg"],
      verified: true,
      transactionId: "0.0.4567893@1707523200.123456789",
      topicSequence: 1,
    },
    {
      id: "2",
      type: "processing",
      title: "Harvesting Completed",
      date: "2024-10-20",
      actor: "Sari Dewi (Farmer)",
      location: "Plantation A, Sulawesi",
      description: "Cocoa pods harvested at optimal ripeness",
      documents: ["harvest-report.pdf"],
      images: ["cocoa-harvest.jpg"],
      verified: true,
      transactionId: "0.0.4567893@1729382400.234567890",
      topicSequence: 2,
    },
  ],
  "LOT-003": [
    {
      id: "1",
      type: "planting",
      title: "Rice Seeds Planted",
      date: "2024-01-20",
      actor: "Ahmad Rizki (Farmer)",
      location: "Paddy Field, Central Java",
      description: "Jasmine rice seeds planted in flooded paddy fields",
      documents: ["rice-planting.pdf"],
      images: ["rice-field.jpg"],
      verified: true,
      transactionId: "0.0.4567896@1705708800.123456789",
      topicSequence: 1,
    },
    {
      id: "2",
      type: "harvesting",
      title: "Rice Harvesting",
      date: "2024-08-15",
      actor: "Ahmad Rizki (Farmer)",
      location: "Paddy Field, Central Java",
      description: "Premium jasmine rice harvested and ready for processing",
      documents: ["harvest-certificate.pdf"],
      images: ["rice-harvest.jpg"],
      verified: true,
      transactionId: "0.0.4567896@1723680000.234567890",
      topicSequence: 2,
    },
    {
      id: "3",
      type: "quality_check",
      title: "Quality Certification",
      date: "2024-08-20",
      actor: "Indonesian Rice Board",
      location: "Processing Facility, Central Java",
      description: "Quality assessment completed - Grade A+ certification awarded",
      documents: ["quality-certificate.pdf"],
      images: ["quality-test.jpg"],
      verified: true,
      transactionId: "0.0.4567896@1724112000.345678901",
      topicSequence: 3,
    },
  ],
}

const getEventIcon = (type: string) => {
  switch (type) {
    case "planting":
      return "🌱"
    case "quality_check":
      return "🔬"
    case "processing":
      return "⚙️"
    case "harvesting":
      return "🌾"
    case "shipping":
      return "🚛"
    case "delivery":
      return "📦"
    default:
      return "📋"
  }
}

const getStageColor = (stage: string) => {
  switch (stage.toLowerCase()) {
    case "planting":
      return "bg-blue-100 text-blue-800"
    case "growing":
      return "bg-green-100 text-green-800"
    case "harvesting":
      return "bg-yellow-100 text-yellow-800"
    case "processing":
      return "bg-purple-100 text-purple-800"
    case "shipped":
      return "bg-orange-100 text-orange-800"
    case "delivered":
      return "bg-gray-100 text-gray-800"
    case "harvested":
      return "bg-emerald-100 text-emerald-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text)
  if (typeof window !== "undefined") {
    // Simple toast notification
    const toast = document.createElement("div")
    toast.className = "fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50"
    toast.textContent = `${label} copied to clipboard`
    document.body.appendChild(toast)
    setTimeout(() => document.body.removeChild(toast), 3000)
  }
}

export default function TracePage({ params }: TracePageProps) {
  const { lotId } = params
  const lotData = mockLotData[lotId] || mockLotData["LOT-001"]
  const events = mockEvents[lotId] || mockEvents["LOT-001"]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>Lot Traceability</span>
            <span>•</span>
            <span>{lotId}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{lotData.name}</h1>
          <p className="text-gray-600">Complete supply chain transparency from farm to table</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lot Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Lot Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Farmer:</span>
                      <span className="font-medium">{lotData.farmer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Location:</span>
                      <span className="font-medium">{lotData.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Planted:</span>
                      <span className="font-medium">{lotData.plantingDate}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Current Stage:</span>
                      <Badge className={`ml-2 ${getStageColor(lotData.currentStage)}`}>{lotData.currentStage}</Badge>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Quality Grade:</span>
                      <Badge variant="outline" className="ml-2 border-green-200 text-green-800">
                        {lotData.qualityGrade}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Progress:</span>
                      <div className="mt-1">
                        <Progress value={lotData.progress} className="h-2" />
                        <span className="text-xs text-gray-500 mt-1">{lotData.progress}% Complete</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* On-chain Proof Section */}
                <div className="mt-6 pt-4 border-t">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      On-Chain Verification
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-700">HCS Topic ID:</span>
                        <div className="flex items-center space-x-2">
                          <code className="bg-white px-2 py-1 rounded text-xs">{lotData.hederaTopicId}</code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(lotData.hederaTopicId, "Topic ID")}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" asChild>
                            <a
                              href={`https://hashscan.io/testnet/topic/${lotData.hederaTopicId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-700">NFT Token ID:</span>
                        <div className="flex items-center space-x-2">
                          <code className="bg-white px-2 py-1 rounded text-xs">{lotData.hederaTokenId}</code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(lotData.hederaTokenId, "Token ID")}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" asChild>
                            <a
                              href={`https://hashscan.io/testnet/token/${lotData.hederaTokenId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-700">Escrow Contract:</span>
                        <div className="flex items-center space-x-2">
                          <code className="bg-white px-2 py-1 rounded text-xs">{lotData.escrowContractId}</code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(lotData.escrowContractId, "Contract ID")}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" asChild>
                            <a
                              href={`https://hashscan.io/testnet/contract/${lotData.escrowContractId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div className="mt-4 pt-4 border-t">
                  <span className="text-sm text-gray-600">Certifications:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {lotData.certifications.map((cert: string) => (
                      <Badge key={cert} variant="secondary" className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supply Chain Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Supply Chain Timeline</CardTitle>
                <CardDescription>Chronological record of all events in this lot's journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event: any, index: number) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg">
                          {getEventIcon(event.type)}
                        </div>
                        {index < events.length - 1 && <div className="w-px h-16 bg-gray-200 mt-2" />}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          <div className="flex items-center gap-2">
                            {event.verified && (
                              <Badge variant="outline" className="border-green-200 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            <span className="text-sm text-gray-500">{event.date}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span>By: {event.actor}</span>
                          <span>•</span>
                          <span>{event.location}</span>
                        </div>

                        {/* Transaction Proof */}
                        {event.transactionId && (
                          <div className="bg-gray-50 border rounded-lg p-3 mb-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Transaction ID:</span>
                              <div className="flex items-center space-x-2">
                                <code className="bg-white px-2 py-1 rounded text-xs">{event.transactionId}</code>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(event.transactionId, "Transaction ID")}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" asChild>
                                  <a
                                    href={`https://hashscan.io/testnet/transaction/${event.transactionId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-600">Topic Sequence:</span>
                              <span className="text-xs font-mono">{event.topicSequence}</span>
                            </div>
                          </div>
                        )}

                        {(event.documents.length > 0 || event.images.length > 0) && (
                          <div className="flex gap-2 mt-3">
                            {event.documents.map((doc: string) => (
                              <Button key={doc} variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                                <FileText className="h-3 w-3 mr-1" />
                                {doc}
                              </Button>
                            ))}
                            {event.images.map((img: string) => (
                              <Button key={img} variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                                <Camera className="h-3 w-3 mr-1" />
                                {img}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Interactive Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense
                  fallback={
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                        <p className="text-gray-600">Loading map...</p>
                      </div>
                    </div>
                  }
                >
                  <InteractiveMapWrapper lotId={lotId} />
                </Suspense>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                  <a
                    href={`https://hashscan.io/testnet/topic/${lotData.hederaTopicId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Hedera Explorer
                  </a>
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                  onClick={() => copyToClipboard(lotData.hederaTokenId, "Token ID")}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Copy Token ID
                </Button>
              </CardContent>
            </Card>

            {/* Lot Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Lot Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Events</span>
                  <span className="font-semibold">{events.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Verified Events</span>
                  <span className="font-semibold text-green-600">{events.filter((e: any) => e.verified).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Area</span>
                  <span className="font-semibold">{lotData.area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Expected Harvest</span>
                  <span className="font-semibold">{lotData.expectedHarvest}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">On-Chain Messages</span>
                  <span className="font-semibold text-blue-600">{events.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

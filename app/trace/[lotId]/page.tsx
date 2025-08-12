import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MapPin, Calendar, User, FileText, Camera, Shield, ExternalLink } from "lucide-react"
import InteractiveMapWrapper from "./interactive-map-wrapper"

interface TracePageProps {
  params: {
    lotId: string
  }
}

// Mock data - in production, fetch from API
const mockLotData = {
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
}

const mockEvents = [
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
  },
]

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
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function TracePage({ params }: TracePageProps) {
  const { lotId } = params

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockLotData.name}</h1>
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
                      <span className="font-medium">{mockLotData.farmer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Location:</span>
                      <span className="font-medium">{mockLotData.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Planted:</span>
                      <span className="font-medium">{mockLotData.plantingDate}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Current Stage:</span>
                      <Badge className={`ml-2 ${getStageColor(mockLotData.currentStage)}`}>
                        {mockLotData.currentStage}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Quality Grade:</span>
                      <Badge variant="outline" className="ml-2 border-green-200 text-green-800">
                        {mockLotData.qualityGrade}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Progress:</span>
                      <div className="mt-1">
                        <Progress value={mockLotData.progress} className="h-2" />
                        <span className="text-xs text-gray-500 mt-1">{mockLotData.progress}% Complete</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div className="mt-4 pt-4 border-t">
                  <span className="text-sm text-gray-600">Certifications:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {mockLotData.certifications.map((cert) => (
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
                  {mockEvents.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg">
                          {getEventIcon(event.type)}
                        </div>
                        {index < mockEvents.length - 1 && <div className="w-px h-16 bg-gray-200 mt-2" />}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          <div className="flex items-center gap-2">
                            {event.verified && (
                              <Badge variant="outline" className="border-green-200 text-green-800">
                                <Shield className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            <span className="text-sm text-gray-500">{event.date}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>By: {event.actor}</span>
                          <span>•</span>
                          <span>{event.location}</span>
                        </div>
                        {(event.documents.length > 0 || event.images.length > 0) && (
                          <div className="flex gap-2 mt-3">
                            {event.documents.map((doc) => (
                              <Button key={doc} variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                                <FileText className="h-3 w-3 mr-1" />
                                {doc}
                              </Button>
                            ))}
                            {event.images.map((img) => (
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
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Hedera Explorer
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Verify Authenticity
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
                  <span className="font-semibold">{mockEvents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Verified Events</span>
                  <span className="font-semibold text-green-600">{mockEvents.filter((e) => e.verified).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Area</span>
                  <span className="font-semibold">{mockLotData.area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Expected Harvest</span>
                  <span className="font-semibold">{mockLotData.expectedHarvest}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

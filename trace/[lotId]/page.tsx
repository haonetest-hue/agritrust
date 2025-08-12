import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Leaf, Award, Calendar, Truck, CheckCircle } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamic import for map to avoid SSR issues
const InteractiveMap = dynamic(() => import("@/components/consumer/interactive-map"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />,
})

async function getLotTraceability(lotId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/trace/${lotId}`, {
    cache: "no-store",
  })
  if (!response.ok) throw new Error("Failed to fetch lot data")
  return response.json()
}

export default async function TracePage({ params }: { params: { lotId: string } }) {
  const data = await getLotTraceability(params.lotId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Journey</h1>
          <p className="text-gray-600">Trace your product from farm to table</p>
        </div>

        {/* Product Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{data.lot.productType}</CardTitle>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                Verified Organic
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{data.lot.quantity}kg</div>
                <div className="text-sm text-gray-600">Total Quantity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{data.sustainability.carbonFootprint}kg</div>
                <div className="text-sm text-gray-600">CO₂ Footprint</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{data.sustainability.waterUsage}L</div>
                <div className="text-sm text-gray-600">Water Used</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{data.farmer.reputation}/100</div>
                <div className="text-sm text-gray-600">Farm Score</div>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                Supply Chain Journey
              </h3>
              <InteractiveMap events={data.events} />
            </div>
          </CardContent>
        </Card>

        {/* Farmer Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-green-600" />
              Meet Your Farmer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">{data.farmer.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{data.farmer.name}</h3>
                <p className="text-gray-600 mb-2">{data.farmer.location}</p>
                <p className="text-sm text-gray-700">{data.farmer.story}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {data.farmer.certifications.map((cert: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supply Chain Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Journey Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.events.map((event: any, index: number) => (
                <div key={event.id} className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    {index < data.events.length - 1 && <div className="w-0.5 h-8 bg-gray-200 mt-2" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold capitalize">{event.eventType.replace("_", " ")}</h4>
                      <span className="text-sm text-gray-500">{new Date(event.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{event.description}</p>
                    {event.location && (
                      <p className="text-gray-500 text-xs mt-1 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {event.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quality & Certifications */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-600" />
              Quality & Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Lab Test Results</h4>
                <div className="space-y-2">
                  {data.qualityTests.map((test: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{test.parameter}</span>
                      <Badge variant={test.status === "passed" ? "default" : "destructive"}>
                        {test.value} {test.unit}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Certifications</h4>
                <div className="space-y-2">
                  {data.certifications.map((cert: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{cert.name}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Valid until {new Date(cert.expiryDate).toLocaleDateString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sustainability Impact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Leaf className="w-5 h-5 mr-2 text-green-600" />
              Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold mb-1">Carbon Neutral</h4>
                <p className="text-sm text-gray-600">This product offset {data.sustainability.carbonOffset}kg CO₂</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-1">Local Sourcing</h4>
                <p className="text-sm text-gray-600">Traveled only {data.sustainability.transportDistance}km</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-1">Fair Trade</h4>
                <p className="text-sm text-gray-600">
                  Supporting {data.sustainability.farmersSupported} farming families
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

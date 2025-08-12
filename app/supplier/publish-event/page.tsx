"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Upload, Activity, CheckCircle, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const eventTypes = [
  { value: "HARVESTED", label: "Harvested", description: "Crop has been harvested from the farm" },
  { value: "QUALITY_TESTED", label: "Quality Tested", description: "Quality analysis completed by certified lab" },
  { value: "DISPATCHED", label: "Dispatched", description: "Product shipped from origin" },
  { value: "ACCEPTED", label: "Accepted", description: "Product received and accepted by buyer" },
  { value: "PAID", label: "Paid", description: "Payment completed and released" },
]

export default function PublishEventPage() {
  const [selectedLot, setSelectedLot] = useState("")
  const [eventType, setEventType] = useState("")
  const [notes, setNotes] = useState("")
  const [coaHash, setCoaHash] = useState("")
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishResult, setPublishResult] = useState<{ txHash: string; timestamp: string } | null>(null)
  const { toast } = useToast()

  const mockLots = [
    { id: "LOT-001", name: "Premium Coffee Batch #1", commodity: "Coffee Arabica" },
    { id: "LOT-002", name: "Organic Cocoa Batch #2", commodity: "Cocoa Trinitario" },
    { id: "LOT-003", name: "Rice Premium Grade", commodity: "Rice Jasmine" },
  ]

  const handlePublishEvent = async () => {
    if (!selectedLot || !eventType) {
      toast({
        title: "Missing Information",
        description: "Please select a lot and event type",
        variant: "destructive",
      })
      return
    }

    setIsPublishing(true)
    try {
      // Mock HCS event publishing
      await new Promise((resolve) => setTimeout(resolve, 2500))

      const result = {
        txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        timestamp: new Date().toISOString(),
      }

      setPublishResult(result)
      toast({
        title: "Event Published Successfully!",
        description: `${eventType} event recorded on HCS`,
      })
    } catch (error) {
      toast({
        title: "Publishing Failed",
        description: "Failed to publish event to HCS",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  if (publishResult) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto rounded-2xl card-shadow">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 success-gradient rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-green-600">Event Published Successfully!</h1>
              <p className="text-muted-foreground">Supply chain event recorded on Hedera Consensus Service</p>
            </div>

            <div className="space-y-4 text-left bg-muted/50 rounded-xl p-6">
              <div className="flex justify-between">
                <span className="font-medium">Event Type:</span>
                <Badge variant="outline">{eventType}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Timestamp:</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(publishResult.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Transaction Hash:</span>
                <Button variant="link" size="sm" className="p-0 h-auto">
                  {publishResult.txHash.substring(0, 20)}...
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setPublishResult(null)}>
                Publish Another Event
              </Button>
              <Button className="hedera-gradient">
                View on Mirror Node
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Publish Supply Chain Event</h1>
          <p className="text-muted-foreground">Update the supply chain timeline with HCS events</p>
        </div>

        <Card className="rounded-2xl card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Event Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Lot Selection */}
            <div className="space-y-2">
              <Label htmlFor="lot">Select AgriLot *</Label>
              <Select value={selectedLot} onValueChange={setSelectedLot}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a lot to update" />
                </SelectTrigger>
                <SelectContent>
                  {mockLots.map((lot) => (
                    <SelectItem key={lot.id} value={lot.id}>
                      {lot.name} - {lot.commodity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Event Type */}
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type *</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((event) => (
                    <SelectItem key={event.value} value={event.value}>
                      <div className="space-y-1">
                        <div className="font-medium">{event.label}</div>
                        <div className="text-xs text-muted-foreground">{event.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Event Timeline Preview */}
            {selectedLot && (
              <div className="space-y-4">
                <Label>Current Event Timeline</Label>
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center space-x-4">
                    {["HARVESTED", "QUALITY_TESTED", "DISPATCHED", "ACCEPTED", "PAID"].map((event, index) => (
                      <div key={event} className="flex items-center space-x-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                            event === "HARVESTED" || event === "QUALITY_TESTED"
                              ? "bg-green-100 text-green-700"
                              : event === eventType
                                ? "bg-blue-100 text-blue-700 ring-2 ring-blue-300"
                                : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span
                          className={`text-xs ${
                            event === "HARVESTED" || event === "QUALITY_TESTED"
                              ? "text-green-700"
                              : event === eventType
                                ? "text-blue-700 font-medium"
                                : "text-gray-500"
                          }`}
                        >
                          {event.replace("_", " ")}
                        </span>
                        {index < 4 && <div className="w-4 h-px bg-gray-300" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* COA Hash */}
            <div className="space-y-2">
              <Label htmlFor="coaHash">COA Hash (Optional)</Label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="coaHash"
                  placeholder="Enter IPFS hash or document hash"
                  value={coaHash}
                  onChange={(e) => setCoaHash(e.target.value)}
                  className="flex-1 px-3 py-2 border border-input rounded-md text-sm"
                />
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information about this event..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Publish Button */}
            <div className="pt-6">
              <Button
                onClick={handlePublishEvent}
                disabled={isPublishing}
                className="w-full hedera-gradient text-lg py-6"
                size="lg"
              >
                {isPublishing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                    Publishing to HCS...
                  </>
                ) : (
                  <>
                    <Activity className="h-5 w-5 mr-3" />
                    Publish Event to HCS
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

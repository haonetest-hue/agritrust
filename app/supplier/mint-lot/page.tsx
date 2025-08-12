"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, MapPin, Calendar, Package, ExternalLink, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MintLotPage() {
  const [formData, setFormData] = useState({
    commodity: "",
    variety: "",
    weight: "",
    location: "",
    harvestDate: "",
    notes: "",
  })
  const [coaFile, setCoaFile] = useState<File | null>(null)
  const [ipfsCid, setIpfsCid] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [mintResult, setMintResult] = useState<{ txHash: string; tokenId: string; serialNumber: string } | null>(null)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    try {
      // Mock IPFS upload
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const mockCid = `QmX${Math.random().toString(36).substring(2, 15)}`
      setIpfsCid(mockCid)
      toast({
        title: "COA Uploaded Successfully",
        description: `IPFS CID: ${mockCid}`,
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload COA to IPFS",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleMintLot = async () => {
    if (!formData.commodity || !formData.variety || !formData.weight || !formData.harvestDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsMinting(true)
    try {
      // Mock minting process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const result = {
        txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        tokenId: "0.0.123456",
        serialNumber: Math.floor(Math.random() * 1000).toString(),
      }

      setMintResult(result)
      toast({
        title: "AgriLot Minted Successfully!",
        description: `Token ID: ${result.tokenId}, Serial: ${result.serialNumber}`,
      })
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: "Failed to mint AgriLot NFT",
        variant: "destructive",
      })
    } finally {
      setIsMinting(false)
    }
  }

  if (mintResult) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto rounded-2xl card-shadow">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 success-gradient rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-green-600">AgriLot Minted Successfully!</h1>
              <p className="text-muted-foreground">Your agricultural lot has been tokenized on Hedera</p>
            </div>

            <div className="space-y-4 text-left bg-muted/50 rounded-xl p-6">
              <div className="flex justify-between">
                <span className="font-medium">Token ID:</span>
                <Badge variant="outline">{mintResult.tokenId}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Serial Number:</span>
                <Badge variant="outline">{mintResult.serialNumber}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Transaction Hash:</span>
                <Button variant="link" size="sm" className="p-0 h-auto">
                  {mintResult.txHash.substring(0, 20)}...
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setMintResult(null)}>
                Mint Another Lot
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
          <h1 className="text-3xl font-bold">Mint AgriLot NFT</h1>
          <p className="text-muted-foreground">Create a new agricultural lot token on Hedera</p>
        </div>

        <Card className="rounded-2xl card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-primary" />
              <span>Lot Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="commodity">Commodity *</Label>
                <Select value={formData.commodity} onValueChange={(value) => handleInputChange("commodity", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select commodity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coffee">Coffee</SelectItem>
                    <SelectItem value="cocoa">Cocoa</SelectItem>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="palm-oil">Palm Oil</SelectItem>
                    <SelectItem value="rubber">Rubber</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="variety">Variety *</Label>
                <Input
                  id="variety"
                  placeholder="e.g., Arabica, Trinitario, Jasmine"
                  value={formData.variety}
                  onChange={(e) => handleInputChange("variety", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="1000"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="harvestDate">Harvest Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="harvestDate"
                    type="date"
                    className="pl-10"
                    value={formData.harvestDate}
                    onChange={(e) => handleInputChange("harvestDate", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Farm address or coordinates (auto-detected)"
                  className="pl-10"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information about this lot..."
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
              />
            </div>

            {/* COA Upload */}
            <div className="space-y-4">
              <Label>Certificate of Analysis (COA)</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center space-y-4">
                {!coaFile ? (
                  <>
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-sm font-medium">Upload COA Document</p>
                      <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                    </div>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setCoaFile(file)
                          handleFileUpload(file)
                        }
                      }}
                      className="max-w-xs mx-auto"
                    />
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">{coaFile.name}</span>
                    </div>
                    {ipfsCid && (
                      <div className="space-y-2">
                        <Badge variant="outline" className="text-green-600">
                          Uploaded to IPFS
                        </Badge>
                        <p className="text-xs text-muted-foreground">CID: {ipfsCid}</p>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCoaFile(null)
                        setIpfsCid("")
                      }}
                    >
                      Remove File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Mint Button */}
            <div className="pt-6">
              <Button
                onClick={handleMintLot}
                disabled={isMinting || isUploading}
                className="w-full hedera-gradient text-lg py-6"
                size="lg"
              >
                {isMinting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                    Minting AgriLot NFT...
                  </>
                ) : (
                  <>
                    <Package className="h-5 w-5 mr-3" />
                    Mint AgriLot NFT
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

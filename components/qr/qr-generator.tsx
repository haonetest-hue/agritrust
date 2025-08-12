"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { QrCode, Download, Copy, Package, Container, FileText, CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface QRGeneratorProps {
  defaultType?: "lot" | "container" | "package" | "invoice"
  defaultId?: string
}

export function QRGenerator({ defaultType = "lot", defaultId = "" }: QRGeneratorProps) {
  const [qrType, setQRType] = useState(defaultType)
  const [lotId, setLotId] = useState(defaultId)
  const [generatedQR, setGeneratedQR] = useState<string | null>(null)
  const [qrUrl, setQRUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateQR = async () => {
    if (!lotId.trim()) {
      toast({
        title: "Missing ID",
        description: "Please enter a lot ID, container ID, or invoice ID",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Generate the appropriate URL based on type
      let targetUrl = ""
      const baseUrl = window.location.origin

      switch (qrType) {
        case "lot":
          targetUrl = `${baseUrl}/trace/${lotId}`
          break
        case "container":
          targetUrl = `${baseUrl}/trace/${lotId}?type=container`
          break
        case "package":
          targetUrl = `${baseUrl}/trace/${lotId}?type=package`
          break
        case "invoice":
          targetUrl = `${baseUrl}/investor/fund-invoice/${lotId}`
          break
      }

      // Generate QR code using QR Server API
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(targetUrl)}`

      setGeneratedQR(qrApiUrl)
      setQRUrl(targetUrl)

      toast({
        title: "QR Code Generated!",
        description: `${qrType.charAt(0).toUpperCase() + qrType.slice(1)} QR code created successfully`,
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQR = () => {
    if (generatedQR) {
      const link = document.createElement("a")
      link.href = generatedQR
      link.download = `agritrust-${qrType}-${lotId}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "QR Code Downloaded",
        description: `Saved as agritrust-${qrType}-${lotId}.png`,
      })
    }
  }

  const copyUrl = () => {
    if (qrUrl) {
      navigator.clipboard.writeText(qrUrl)
      toast({
        title: "URL Copied",
        description: "QR code URL copied to clipboard",
      })
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lot":
        return <QrCode className="h-4 w-4" />
      case "container":
        return <Container className="h-4 w-4" />
      case "package":
        return <Package className="h-4 w-4" />
      case "invoice":
        return <FileText className="h-4 w-4" />
      default:
        return <QrCode className="h-4 w-4" />
    }
  }

  const getTypeDescription = (type: string) => {
    switch (type) {
      case "lot":
        return "General lot traceability - shows complete farm-to-fork journey"
      case "container":
        return "Container-level tracking - for shipping and logistics"
      case "package":
        return "Consumer package - for end-user verification"
      case "invoice":
        return "Investment opportunity - for funding agricultural invoices"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <QrCode className="h-5 w-5" />
            <span>QR Code Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qr-type">QR Code Type</Label>
              <Select value={qrType} onValueChange={setQRType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lot">
                    <div className="flex items-center space-x-2">
                      <QrCode className="h-4 w-4" />
                      <span>Lot Traceability</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="container">
                    <div className="flex items-center space-x-2">
                      <Container className="h-4 w-4" />
                      <span>Container Tracking</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="package">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span>Consumer Package</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="invoice">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Investment Invoice</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lot-id">
                {qrType === "invoice" ? "Invoice ID" : qrType === "container" ? "Container ID" : "Lot ID"}
              </Label>
              <Input
                id="lot-id"
                value={lotId}
                onChange={(e) => setLotId(e.target.value)}
                placeholder={
                  qrType === "invoice"
                    ? "e.g., INV-005"
                    : qrType === "container"
                      ? "e.g., MSKU7834156"
                      : "e.g., LOT-001"
                }
              />
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              {getTypeIcon(qrType)}
              <div>
                <h4 className="font-medium capitalize">{qrType} QR Code</h4>
                <p className="text-sm text-muted-foreground">{getTypeDescription(qrType)}</p>
              </div>
            </div>
          </div>

          <Button onClick={generateQR} disabled={isGenerating || !lotId.trim()} className="w-full">
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generating QR Code...
              </>
            ) : (
              <>
                <QrCode className="h-4 w-4 mr-2" />
                Generate QR Code
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedQR && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Generated QR Code</span>
              <Badge variant="outline" className="capitalize">
                {getTypeIcon(qrType)}
                <span className="ml-1">{qrType}</span>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg border">
                <img src={generatedQR || "/placeholder.svg"} alt="Generated QR Code" className="w-48 h-48" />
              </div>

              <div className="text-center space-y-2">
                <p className="font-medium">
                  {qrType.charAt(0).toUpperCase() + qrType.slice(1)}: {lotId}
                </p>
                <p className="text-sm text-muted-foreground break-all">{qrUrl}</p>
              </div>

              <div className="flex space-x-2">
                <Button onClick={downloadQR} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PNG
                </Button>
                <Button onClick={copyUrl} variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy URL
                </Button>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Usage Instructions</span>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                {qrType === "lot" && <p>• Attach this QR code to lot documentation for complete traceability</p>}
                {qrType === "container" && <p>• Print and attach to shipping containers for logistics tracking</p>}
                {qrType === "package" && <p>• Include on consumer packaging for end-user verification</p>}
                {qrType === "invoice" && <p>• Share with investors for direct access to funding opportunities</p>}
                <p>• Scanning will redirect to the appropriate AgriTrust verification page</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

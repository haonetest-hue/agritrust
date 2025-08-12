"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Camera, Upload, AlertCircle, Zap, CheckCircle, X, Scan } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function QRScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasCamera, setHasCamera] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastScanResult, setLastScanResult] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  useEffect(() => {
    checkCameraAvailability()
  }, [])

  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter((device) => device.kind === "videoinput")
      setHasCamera(videoDevices.length > 0)
    } catch (err) {
      setHasCamera(false)
      setError("Camera access not available")
    }
  }

  const startScanning = async () => {
    try {
      setError(null)
      setIsScanning(true)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()

        // Start scanning for QR codes
        startQRDetection()
      }
    } catch (err) {
      setError("Unable to access camera. Please check permissions and try again.")
      setIsScanning(false)
      toast({
        title: "Camera Error",
        description: "Please allow camera access to scan QR codes",
        variant: "destructive",
      })
    }
  }

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
    }
    setIsScanning(false)
    setIsProcessing(false)
  }

  const startQRDetection = () => {
    // In a real implementation, you would use a QR code detection library
    // For demo purposes, we'll simulate detection after a few seconds
    setTimeout(() => {
      if (isScanning) {
        simulateQRDetection()
      }
    }, 3000)
  }

  const simulateQRDetection = () => {
    setIsProcessing(true)

    // Simulate QR code detection with different types
    const qrTypes = [
      { type: "lot", id: "LOT-001", url: "/trace/LOT-001" },
      { type: "container", id: "MSKU7834156", url: "/trace/LOT-002?type=container" },
      { type: "package", id: "PKG-003", url: "/trace/LOT-003?type=package" },
      { type: "invoice", id: "INV-005", url: "/investor/fund-invoice/INV-005" },
      { type: "accept", id: "ACC-789", url: "/a/accept?nonce=abc123&exp=1234567890&sig=def456" },
    ]

    const randomQR = qrTypes[Math.floor(Math.random() * qrTypes.length)]

    setTimeout(() => {
      setLastScanResult(`${randomQR.type.toUpperCase()}: ${randomQR.id}`)
      setIsProcessing(false)
      stopScanning()

      toast({
        title: "QR Code Detected!",
        description: `Found ${randomQR.type} QR code: ${randomQR.id}`,
      })

      // Navigate to the appropriate page
      setTimeout(() => {
        router.push(randomQR.url)
      }, 1500)
    }, 2000)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsProcessing(true)

      // Simulate QR code detection from uploaded image
      setTimeout(() => {
        const mockTypes = ["LOT", "CONTAINER", "PACKAGE", "INVOICE"]
        const randomType = mockTypes[Math.floor(Math.random() * mockTypes.length)]
        const mockId = randomType + "-" + Math.random().toString(36).substr(2, 6).toUpperCase()
        setLastScanResult(`${randomType}: ${mockId}`)
        setIsProcessing(false)

        toast({
          title: "QR Code Found in Image!",
          description: `Detected ${randomType.toLowerCase()}: ${mockId}`,
        })

        setTimeout(() => {
          if (randomType === "INVOICE") {
            router.push(`/investor/fund-invoice/${mockId}`)
          } else {
            router.push(`/trace/${mockId}`)
          }
        }, 1500)
      }, 2000)
    }
  }

  const clearResult = () => {
    setLastScanResult(null)
    setError(null)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scan className="h-5 w-5" />
            <span>AgriTrust QR Scanner</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {lastScanResult && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-green-800">
                  <strong>Scanned:</strong> {lastScanResult}
                </span>
                <Button size="sm" variant="ghost" onClick={clearResult}>
                  <X className="h-3 w-3" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Camera Scanner */}
          {hasCamera && (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-64 bg-gray-100 rounded-lg object-cover"
                  style={{ display: isScanning ? "block" : "none" }}
                />
                <canvas ref={canvasRef} className="hidden" />

                {!isScanning && (
                  <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 font-medium">Camera Scanner</p>
                      <p className="text-sm text-gray-400">Point camera at QR code</p>
                    </div>
                  </div>
                )}

                {/* Scanning Overlay */}
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-500 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-500 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-500 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-500 rounded-br-lg"></div>

                      {isProcessing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                          <div className="bg-white rounded-full p-3">
                            <Zap className="h-6 w-6 text-green-600 animate-pulse" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {!isScanning ? (
                  <Button onClick={startScanning} className="flex-1 bg-green-600 hover:bg-green-700">
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera Scanner
                  </Button>
                ) : (
                  <div className="flex gap-2 w-full">
                    <div className="flex-1 flex items-center justify-center space-x-2 bg-green-50 rounded-md px-3 py-2">
                      {isProcessing ? (
                        <>
                          <Zap className="h-4 w-4 text-green-600 animate-pulse" />
                          <span className="text-sm text-green-700">Processing...</span>
                        </>
                      ) : (
                        <>
                          <Scan className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-700">Scanning for QR codes...</span>
                        </>
                      )}
                    </div>
                    <Button onClick={stopScanning} variant="outline">
                      Stop
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* File Upload Scanner */}
          <div className="space-y-4">
            <div className="relative">
              <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-blue-600 font-medium">Upload QR Code Image</p>
                  <p className="text-xs text-blue-400">JPG, PNG, or other image formats</p>
                </div>
              </div>

              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-50/90 rounded-lg">
                  <div className="bg-white rounded-full p-3 shadow-lg">
                    <Zap className="h-6 w-6 text-blue-600 animate-pulse" />
                  </div>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="qr-upload"
              disabled={isProcessing}
            />
            <Button asChild variant="outline" className="w-full bg-transparent" disabled={isProcessing}>
              <label htmlFor="qr-upload" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                {isProcessing ? "Processing Image..." : "Choose Image File"}
              </label>
            </Button>
          </div>

          {/* Supported QR Types */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Supported QR Code Types:</h4>
            <div className="grid grid-cols-2 gap-2">
              <Badge variant="outline" className="justify-center py-2">
                <Scan className="h-3 w-3 mr-1" />
                Lot Tracing
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                <Camera className="h-3 w-3 mr-1" />
                Container
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                <Upload className="h-3 w-3 mr-1" />
                Package
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                <CheckCircle className="h-3 w-3 mr-1" />
                Invoice
              </Badge>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-xs text-muted-foreground space-y-2 pt-4 border-t">
            <p>
              <strong>How to use:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Point camera at QR code on containers, packages, or documents</li>
              <li>Or upload an image containing a QR code</li>
              <li>Scanner will automatically detect and redirect to traceability data</li>
              <li>Works with AgriTrust lot IDs, invoices, and supply chain events</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

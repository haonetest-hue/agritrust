"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Upload, AlertCircle } from "lucide-react"

export function QRScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasCamera, setHasCamera] = useState(false)
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
    }
  }

  const startScanning = async () => {
    try {
      setError(null)
      setIsScanning(true)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (err) {
      setError("Unable to access camera. Please check permissions.")
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
    }
    setIsScanning(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Simulate QR code detection from uploaded image
      // In a real implementation, you'd use a QR code library here
      const mockLotId = "LOT-" + Math.random().toString(36).substr(2, 9).toUpperCase()
      router.push(`/trace/${mockLotId}`)
    }
  }

  const simulateQRDetection = () => {
    // Simulate successful QR code scan
    const mockLotId = "LOT-" + Math.random().toString(36).substr(2, 9).toUpperCase()
    stopScanning()
    router.push(`/trace/${mockLotId}`)
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {hasCamera && (
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-64 bg-gray-100 rounded-lg object-cover"
                  style={{ display: isScanning ? "block" : "none" }}
                />
                <canvas ref={canvasRef} className="hidden" />
                {!isScanning && (
                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Camera preview will appear here</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                {!isScanning ? (
                  <Button onClick={startScanning} className="flex-1">
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera
                  </Button>
                ) : (
                  <>
                    <Button onClick={simulateQRDetection} className="flex-1">
                      Simulate QR Detection
                    </Button>
                    <Button onClick={stopScanning} variant="outline">
                      Stop
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-4">Or upload an image with QR code</p>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="qr-upload" />
              <Button asChild variant="outline" className="w-full bg-transparent">
                <label htmlFor="qr-upload" className="cursor-pointer">
                  Choose Image
                </label>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-xs text-gray-500 text-center">
        <p>Point your camera at a QR code or upload an image to trace the product's journey</p>
      </div>
    </div>
  )
}

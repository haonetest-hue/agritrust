"use client"

import { QRScanner } from "@/components/qr/qr-scanner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ScanPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Scan Product QR Code</CardTitle>
            <CardDescription>
              Scan the QR code on your product to view its complete supply chain journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QRScanner />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

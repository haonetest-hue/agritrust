"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Package, Clock, CheckCircle, DollarSign, QrCode } from "lucide-react"

interface AgriLot {
  id: string
  tokenId: string
  serialNumber: string
  crop: string
  variety: string
  weight: number
  harvestDate: string
  location: {
    latitude: number
    longitude: number
    address: string
  }
  qualityGrade?: number
  escrowStatus: "none" | "created" | "funded" | "quality_pending" | "released"
  events: string[]
  coaHash?: string
  qrCode: string
}

export default function SupplierDashboardPage() {
  const [lots, setLots] = useState<AgriLot[]>([])
  const [isCreatingLot, setIsCreatingLot] = useState(false)
  const [selectedLot, setSelectedLot] = useState<AgriLot | null>(null)

  // Mint Lot Form States
  const [crop, setCrop] = useState("")
  const [variety, setVariety] = useState("")
  const [weight, setWeight] = useState("")
  const [harvestDate, setHarvestDate] = useState("")
  const [location, setLocation] = useState("")
  const [coaFile, setCoaFile] = useState<File | null>(null)

  // Event Publishing States
  const [eventType, setEventType] = useState("")
  const [eventNotes, setEventNotes] = useState("")

  useEffect(() => {
    // Mock data - in production, fetch from API
    const mockLots: AgriLot[] = [
      {
        id: "LOT-001",
        tokenId: "0.0.123456",
        serialNumber: "1",
        crop: "Coffee",
        variety: "Arabica",
        weight: 1000,
        harvestDate: "2025-01-15",
        location: {
          latitude: 4.695135,
          longitude: 96.749397,
          address: "Aceh, Indonesia",
        },
        qualityGrade: 92,
        escrowStatus: "funded",
        events: ["HARVESTED", "QUALITY_TESTED"],
        coaHash: "QmX1Y2Z3...",
        qrCode: "/api/qr/LOT-001",
      },
      {
        id: "LOT-002",
        tokenId: "0.0.123457",
        serialNumber: "2",
        crop: "Cocoa",
        variety: "Trinitario",
        weight: 2500,
        harvestDate: "2025-01-10",
        location: {
          latitude: -2.548926,
          longitude: 118.0148634,
          address: "Sulawesi, Indonesia",
        },
        escrowStatus: "quality_pending",
        events: ["HARVESTED", "QUALITY_TESTED", "DISPATCHED"],
        coaHash: "QmA1B2C3...",
        qrCode: "/api/qr/LOT-002",
      },
    ]
    setLots(mockLots)
  }, [])

  const handleMintLot = async () => {
    if (!crop || !variety || !weight || !harvestDate || !location) return

    setIsCreatingLot(true)
    try {
      // Upload COA to IPFS if provided
      let coaHash = ""
      if (coaFile) {
        const formData = new FormData()
        formData.append("file", coaFile)
        const uploadResponse = await fetch("/api/ipfs/upload", {
          method: "POST",
          body: formData,
        })
        const uploadResult = await uploadResponse.json()
        coaHash = uploadResult.hash
      }

      // Create lot data
      const lotData = {
        crop,
        variety,
        weight: Number.parseFloat(weight),
        harvestDate,
        location,
        coaHash,
      }

      // Call API to mint AgriLot NFT
      const response = await fetch("/api/lots/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lotData),
      })

      if (response.ok) {
        const newLot = await response.json()
        setLots([...lots, newLot])

        // Reset form
        setCrop("")
        setVariety("")
        setWeight("")
        setHarvestDate("")
        setLocation("")
        setCoaFile(null)
      }
    } catch (error) {
      console.error("Error minting lot:", error)
    } finally {
      setIsCreatingLot(false)
    }
  }

  const handlePublishEvent = async (lotId: string) => {
    if (!eventType) return

    try {
      const eventData = {
        lotId,
        type: eventType,
        notes: eventNotes,
        timestamp: new Date().toISOString(),
      }

      const response = await fetch("/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      })

      if (response.ok) {
        // Update lot events
        setLots(lots.map((lot) => (lot.id === lotId ? { ...lot, events: [...lot.events, eventType] } : lot)))
        setEventType("")
        setEventNotes("")
        setSelectedLot(null)
      }
    } catch (error) {
      console.error("Error publishing event:", error)
    }
  }

  const getEscrowStatusBadge = (status: string) => {
    const statusConfig = {
      none: { label: "No Escrow", variant: "outline" as const },
      created: { label: "Awaiting Deposit", variant: "secondary" as const },
      funded: { label: "Deposited", variant: "default" as const },
      quality_pending: { label: "Quality OK", variant: "default" as const },
      released: { label: "Released", variant: "secondary" as const },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.none
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Supplier Dashboard</h1>
          <p className="text-muted-foreground">Manage your AgriLots and supply chain events</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Mint AgriLot
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Mint New AgriLot NFT</DialogTitle>
                <DialogDescription>Create a new AgriLot token for your harvest batch</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="crop">Crop</Label>
                    <Select value={crop} onValueChange={setCrop}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Coffee">Coffee</SelectItem>
                        <SelectItem value="Cocoa">Cocoa</SelectItem>
                        <SelectItem value="Rice">Rice</SelectItem>
                        <SelectItem value="Palm Oil">Palm Oil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="variety">Variety</Label>
                    <Input
                      id="variety"
                      value={variety}
                      onChange={(e) => setVariety(e.target.value)}
                      placeholder="e.g., Arabica, Trinitario"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="harvestDate">Harvest Date</Label>
                    <Input
                      id="harvestDate"
                      type="date"
                      value={harvestDate}
                      onChange={(e) => setHarvestDate(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Farm address or coordinates"
                  />
                </div>

                <div>
                  <Label htmlFor="coa">Certificate of Analysis (COA)</Label>
                  <Input
                    id="coa"
                    type="file"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) => setCoaFile(e.target.files?.[0] || null)}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleMintLot} disabled={isCreatingLot}>
                    {isCreatingLot ? "Minting..." : "Mint AgriLot"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lots</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lots.length}</div>
            <p className="text-xs text-muted-foreground">AgriLot NFTs minted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Escrows</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lots.filter((lot) => lot.escrowStatus !== "none" && lot.escrowStatus !== "released").length}
            </div>
            <p className="text-xs text-muted-foreground">Pending payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Sales</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lots.filter((lot) => lot.escrowStatus === "released").length}</div>
            <p className="text-xs text-muted-foreground">Payments received</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$125,000</div>
            <p className="text-xs text-muted-foreground">From completed sales</p>
          </CardContent>
        </Card>
      </div>

      {/* Lots Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your AgriLots</CardTitle>
          <CardDescription>Manage your minted lots and track their progress</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lot ID</TableHead>
                <TableHead>Crop</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Quality Grade</TableHead>
                <TableHead>Escrow Status</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lots.map((lot) => (
                <TableRow key={lot.id}>
                  <TableCell className="font-medium">{lot.id}</TableCell>
                  <TableCell>
                    {lot.crop} ({lot.variety})
                  </TableCell>
                  <TableCell>{lot.weight.toLocaleString()} kg</TableCell>
                  <TableCell>{lot.qualityGrade ? `${lot.qualityGrade}/100` : "-"}</TableCell>
                  <TableCell>{getEscrowStatusBadge(lot.escrowStatus)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {lot.events.map((event, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedLot(lot)}>
                            Publish Event
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Publish Supply Chain Event</DialogTitle>
                            <DialogDescription>
                              Add a new event to the supply chain timeline for {lot.id}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="eventType">Event Type</Label>
                              <Select value={eventType} onValueChange={setEventType}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select event type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="QUALITY_TESTED">Quality Tested</SelectItem>
                                  <SelectItem value="DISPATCHED">Dispatched</SelectItem>
                                  <SelectItem value="ACCEPTED">Accepted by Buyer</SelectItem>
                                  <SelectItem value="PAID">Payment Received</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="eventNotes">Notes</Label>
                              <Textarea
                                id="eventNotes"
                                value={eventNotes}
                                onChange={(e) => setEventNotes(e.target.value)}
                                placeholder="Additional details about this event"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setSelectedLot(null)}>
                                Cancel
                              </Button>
                              <Button onClick={() => handlePublishEvent(lot.id)}>Publish to HCS</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="outline">
                        <QrCode className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Core AgriTrust Types

export interface Farmer {
  id: string
  did: string
  name: string
  location: {
    latitude: number
    longitude: number
    address: string
  }
  certifications: string[]
  reputationScore: number
  createdAt: Date
}

export interface Cooperative {
  id: string
  did: string
  name: string
  farmers: string[]
  location: string
  reputationScore: number
}

export interface Offtaker {
  id: string
  did: string
  name: string
  type: "processor" | "retailer" | "exporter"
  reputationScore: number
}

export interface SupplyChainEvent {
  id: string
  type: "planting" | "harvesting" | "processing" | "quality_check" | "shipping" | "delivery"
  lotId: string
  actor: string
  timestamp: Date
  location?: {
    latitude: number
    longitude: number
  }
  metadata: Record<string, any>
  hcsMessageId?: string
}

export interface Lot {
  id: string
  nftTokenId: string
  farmerId: string
  crop: string
  quantity: number
  unit: string
  harvestDate: Date
  qualityGrade: "A" | "B" | "C"
  certifications: string[]
  currentLocation: string
  status: "harvested" | "in_transit" | "processed" | "delivered"
  events: SupplyChainEvent[]
}

export interface EscrowContract {
  id: string
  lotId: string
  buyerId: string
  sellerId: string
  amount: number
  currency: string
  status: "pending" | "funded" | "released" | "disputed"
  qualityRequirements: Record<string, any>
  createdAt: Date
}

export interface RevenueShare {
  farmer: number
  cooperative: number
  processor?: number
  logistics?: number
}

export interface SupplyChainEvent {
  id: string
  type: "planting" | "harvesting" | "processing" | "quality_check" | "shipping" | "delivery" | "certification"
  lotId: string
  actor: string
  timestamp: Date
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
  metadata: Record<string, any>
  documents?: string[]
  images?: string[]
  ipfsHash?: string
  hcsMessageId?: string
  verified: boolean
}

export interface CreateEventData {
  type: string
  lotId: string
  actor: string
  location?: any
  metadata: Record<string, any>
  documents?: string[]
  images?: string[]
}

// Mock database
const events: Map<string, SupplyChainEvent> = new Map()

export class EventService {
  async createEvent(data: CreateEventData): Promise<SupplyChainEvent> {
    const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const event: SupplyChainEvent = {
      id: eventId,
      type: data.type as SupplyChainEvent["type"],
      lotId: data.lotId,
      actor: data.actor,
      timestamp: new Date(),
      location: data.location,
      metadata: data.metadata,
      documents: data.documents || [],
      images: data.images || [],
      ipfsHash: `Qm${Math.random().toString(36).substr(2, 44)}`, // Mock IPFS hash
      hcsMessageId: `0.0.${Math.floor(Math.random() * 1000000)}-${Date.now()}`, // Mock HCS message ID
      verified: true,
    }

    events.set(eventId, event)

    console.log("Created supply chain event:", event)

    return event
  }

  async getEventsForLot(lotId: string): Promise<SupplyChainEvent[]> {
    const lotEvents = Array.from(events.values()).filter((event) => event.lotId === lotId)
    return lotEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  }

  async getEventDetails(eventId: string): Promise<SupplyChainEvent | null> {
    return events.get(eventId) || null
  }

  async verifyEvent(eventId: string): Promise<boolean> {
    const event = events.get(eventId)
    if (!event) return false

    // Mock verification - in production, verify against blockchain
    return event.verified
  }

  async getSupplyChainTimeline(lotId: string): Promise<SupplyChainEvent[]> {
    return this.getEventsForLot(lotId)
  }

  async updateEventVerification(eventId: string, verified: boolean): Promise<boolean> {
    const event = events.get(eventId)
    if (!event) return false

    event.verified = verified
    events.set(eventId, event)

    return true
  }
}

export const eventService = new EventService()

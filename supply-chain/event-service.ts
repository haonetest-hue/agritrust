import { v4 as uuidv4 } from "uuid"
import { hcsService } from "./hcs-service"
import { ipfsService, type IPFSMetadata } from "./ipfs-service"
import type { SupplyChainEvent } from "./hcs-service"

export interface CreateEventData {
  type: SupplyChainEvent["type"]
  lotId: string
  actor: string // DID of the actor
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
  metadata: Record<string, any>
  documents?: string[] // Base64 encoded files
  images?: string[] // Base64 encoded images
}

export class EventService {
  // Create and publish supply chain event
  async createEvent(data: CreateEventData): Promise<SupplyChainEvent> {
    try {
      const eventId = uuidv4()
      const timestamp = new Date()

      // Upload metadata to IPFS if there are documents/images
      let ipfsHash: string | undefined
      if (data.documents?.length || data.images?.length || Object.keys(data.metadata).length > 0) {
        const ipfsMetadata: IPFSMetadata = {
          eventId,
          documents: data.documents,
          images: data.images,
          additionalData: data.metadata,
        }
        ipfsHash = await ipfsService.uploadMetadata(ipfsMetadata)
      }

      // Create event object
      const event: Omit<SupplyChainEvent, "hcsMessageId" | "hcsTopicId"> = {
        id: eventId,
        type: data.type,
        lotId: data.lotId,
        actor: data.actor,
        timestamp,
        location: data.location,
        metadata: data.metadata,
        ipfsHash,
      }

      // Publish to HCS
      const hcsMessageId = await hcsService.publishEvent(event)

      // Complete event with HCS data
      const completeEvent: SupplyChainEvent = {
        ...event,
        hcsMessageId,
        hcsTopicId: process.env.HEDERA_TOPIC_ID,
      }

      // Store in database for indexing
      await this.storeEvent(completeEvent)

      return completeEvent
    } catch (error) {
      console.error("Error creating event:", error)
      throw new Error("Failed to create supply chain event")
    }
  }

  // Get events for a specific lot
  async getEventsForLot(lotId: string): Promise<SupplyChainEvent[]> {
    try {
      // Implement database query
      return await this.queryEventsByLot(lotId)
    } catch (error) {
      console.error("Error getting events for lot:", error)
      throw new Error("Failed to get events for lot")
    }
  }

  // Get events by actor (DID)
  async getEventsByActor(actorDID: string): Promise<SupplyChainEvent[]> {
    try {
      // Implement database query
      return await this.queryEventsByActor(actorDID)
    } catch (error) {
      console.error("Error getting events by actor:", error)
      throw new Error("Failed to get events by actor")
    }
  }

  // Get events by type
  async getEventsByType(type: SupplyChainEvent["type"]): Promise<SupplyChainEvent[]> {
    try {
      // Implement database query
      return await this.queryEventsByType(type)
    } catch (error) {
      console.error("Error getting events by type:", error)
      throw new Error("Failed to get events by type")
    }
  }

  // Get event details with IPFS metadata
  async getEventDetails(eventId: string): Promise<SupplyChainEvent & { ipfsMetadata?: IPFSMetadata }> {
    try {
      const event = await this.getEventById(eventId)
      if (!event) {
        throw new Error("Event not found")
      }

      let ipfsMetadata: IPFSMetadata | undefined
      if (event.ipfsHash) {
        try {
          ipfsMetadata = await ipfsService.getMetadata(event.ipfsHash)
        } catch (error) {
          console.warn("Failed to retrieve IPFS metadata:", error)
        }
      }

      return { ...event, ipfsMetadata }
    } catch (error) {
      console.error("Error getting event details:", error)
      throw new Error("Failed to get event details")
    }
  }

  // Verify event integrity
  async verifyEvent(eventId: string): Promise<boolean> {
    try {
      const event = await this.getEventById(eventId)
      if (!event) return false

      // Verify HCS message exists
      if (event.hcsMessageId && event.hcsTopicId) {
        // In a real implementation, you would query the Hedera Mirror Node
        // to verify the message exists and matches the event data
        console.log(`Verifying HCS message: ${event.hcsMessageId}`)
      }

      // Verify IPFS content if exists
      if (event.ipfsHash) {
        try {
          await ipfsService.getMetadata(event.ipfsHash)
        } catch (error) {
          console.warn("IPFS content not accessible:", error)
          return false
        }
      }

      return true
    } catch (error) {
      console.error("Error verifying event:", error)
      return false
    }
  }

  // Get supply chain timeline for a lot
  async getSupplyChainTimeline(lotId: string): Promise<SupplyChainEvent[]> {
    try {
      const events = await this.getEventsForLot(lotId)
      return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    } catch (error) {
      console.error("Error getting supply chain timeline:", error)
      throw new Error("Failed to get supply chain timeline")
    }
  }

  // Private database methods (implement based on your database choice)
  private async storeEvent(event: SupplyChainEvent): Promise<void> {
    // Implement database storage
    console.log("Storing event:", event.id)
  }

  private async getEventById(eventId: string): Promise<SupplyChainEvent | null> {
    // Implement database query
    console.log("Getting event by ID:", eventId)
    return null
  }

  private async queryEventsByLot(lotId: string): Promise<SupplyChainEvent[]> {
    // Implement database query
    console.log("Querying events by lot:", lotId)
    return []
  }

  private async queryEventsByActor(actorDID: string): Promise<SupplyChainEvent[]> {
    // Implement database query
    console.log("Querying events by actor:", actorDID)
    return []
  }

  private async queryEventsByType(type: SupplyChainEvent["type"]): Promise<SupplyChainEvent[]> {
    // Implement database query
    console.log("Querying events by type:", type)
    return []
  }
}

export const eventService = new EventService()

import {
  type Client,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicInfoQuery,
  TopicId,
  type TopicMessage,
} from "@hashgraph/sdk"
import { getHederaClient } from "../config/hedera"

export interface SupplyChainEvent {
  id: string
  type: "planting" | "harvesting" | "processing" | "quality_check" | "shipping" | "delivery" | "certification"
  lotId: string
  actor: string // DID of the actor
  timestamp: Date
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
  metadata: Record<string, any>
  hcsMessageId?: string
  hcsTopicId?: string
  ipfsHash?: string
  signature?: string
}

export class HCSService {
  private client: Client
  private topicId: TopicId | null = null

  constructor() {
    this.client = getHederaClient()
    if (process.env.HEDERA_TOPIC_ID) {
      this.topicId = TopicId.fromString(process.env.HEDERA_TOPIC_ID)
    }
  }

  // Create new HCS topic for supply chain events
  async createTopic(memo = "AgriTrust Supply Chain Events"): Promise<string> {
    try {
      const transaction = new TopicCreateTransaction().setTopicMemo(memo).setSubmitKey(this.client.operatorPublicKey!)

      const txResponse = await transaction.execute(this.client)
      const receipt = await txResponse.getReceipt(this.client)

      const topicId = receipt.topicId!.toString()
      this.topicId = receipt.topicId!

      console.log(`Created HCS topic: ${topicId}`)
      return topicId
    } catch (error) {
      console.error("Error creating HCS topic:", error)
      throw new Error("Failed to create HCS topic")
    }
  }

  // Publish supply chain event to HCS
  async publishEvent(event: Omit<SupplyChainEvent, "hcsMessageId" | "hcsTopicId">): Promise<string> {
    try {
      if (!this.topicId) {
        throw new Error("HCS topic not initialized")
      }

      // Prepare event data for HCS
      const eventData = {
        id: event.id,
        type: event.type,
        lotId: event.lotId,
        actor: event.actor,
        timestamp: event.timestamp.toISOString(),
        location: event.location,
        metadata: event.metadata,
        ipfsHash: event.ipfsHash,
        signature: event.signature,
      }

      // Submit message to HCS topic
      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(this.topicId)
        .setMessage(JSON.stringify(eventData))

      const txResponse = await transaction.execute(this.client)
      const receipt = await txResponse.getReceipt(this.client)

      const messageId = `${receipt.topicSequenceNumber}`
      console.log(`Published event to HCS: ${messageId}`)

      return messageId
    } catch (error) {
      console.error("Error publishing event to HCS:", error)
      throw new Error("Failed to publish event to HCS")
    }
  }

  // Get topic information
  async getTopicInfo(): Promise<any> {
    try {
      if (!this.topicId) {
        throw new Error("HCS topic not initialized")
      }

      const query = new TopicInfoQuery().setTopicId(this.topicId)
      const info = await query.execute(this.client)

      return {
        topicId: info.topicId.toString(),
        topicMemo: info.topicMemo,
        sequenceNumber: info.sequenceNumber.toString(),
        runningHash: info.runningHash.toString(),
      }
    } catch (error) {
      console.error("Error getting topic info:", error)
      throw new Error("Failed to get topic info")
    }
  }

  // Subscribe to topic messages (for real-time updates)
  async subscribeToTopic(callback: (message: TopicMessage) => void, startTime?: Date): Promise<() => void> {
    try {
      if (!this.topicId) {
        throw new Error("HCS topic not initialized")
      }

      // Note: In a real implementation, you would use the Hedera Mirror Node API
      // to subscribe to topic messages. This is a placeholder for the subscription logic.
      console.log(`Subscribing to topic: ${this.topicId.toString()}`)

      // Return unsubscribe function
      return () => {
        console.log("Unsubscribed from topic")
      }
    } catch (error) {
      console.error("Error subscribing to topic:", error)
      throw new Error("Failed to subscribe to topic")
    }
  }
}

export const hcsService = new HCSService()

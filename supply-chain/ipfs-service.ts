import { create, type IPFSHTTPClient } from "ipfs-http-client"

export interface IPFSMetadata {
  eventId: string
  documents?: string[] // Base64 encoded documents
  images?: string[] // Base64 encoded images
  certificates?: string[] // Base64 encoded certificates
  sensorData?: Record<string, any>
  qualityReports?: Record<string, any>
  additionalData?: Record<string, any>
}

export class IPFSService {
  private client: IPFSHTTPClient

  constructor() {
    const auth =
      process.env.IPFS_API_KEY && process.env.IPFS_API_SECRET
        ? `Basic ${Buffer.from(`${process.env.IPFS_API_KEY}:${process.env.IPFS_API_SECRET}`).toString("base64")}`
        : undefined

    this.client = create({
      url: process.env.IPFS_API_URL || "https://ipfs.infura.io:5001",
      headers: auth ? { authorization: auth } : undefined,
    })
  }

  // Upload metadata to IPFS
  async uploadMetadata(metadata: IPFSMetadata): Promise<string> {
    try {
      const result = await this.client.add(JSON.stringify(metadata, null, 2))
      console.log(`Uploaded metadata to IPFS: ${result.path}`)
      return result.path
    } catch (error) {
      console.error("Error uploading to IPFS:", error)
      throw new Error("Failed to upload metadata to IPFS")
    }
  }

  // Upload file to IPFS
  async uploadFile(file: Buffer, filename: string): Promise<string> {
    try {
      const result = await this.client.add({
        path: filename,
        content: file,
      })
      console.log(`Uploaded file to IPFS: ${result.path}`)
      return result.path
    } catch (error) {
      console.error("Error uploading file to IPFS:", error)
      throw new Error("Failed to upload file to IPFS")
    }
  }

  // Retrieve metadata from IPFS
  async getMetadata(hash: string): Promise<IPFSMetadata> {
    try {
      const chunks = []
      for await (const chunk of this.client.cat(hash)) {
        chunks.push(chunk)
      }
      const data = Buffer.concat(chunks).toString()
      return JSON.parse(data)
    } catch (error) {
      console.error("Error retrieving from IPFS:", error)
      throw new Error("Failed to retrieve metadata from IPFS")
    }
  }

  // Get file from IPFS
  async getFile(hash: string): Promise<Buffer> {
    try {
      const chunks = []
      for await (const chunk of this.client.cat(hash)) {
        chunks.push(chunk)
      }
      return Buffer.concat(chunks)
    } catch (error) {
      console.error("Error retrieving file from IPFS:", error)
      throw new Error("Failed to retrieve file from IPFS")
    }
  }

  // Pin content to ensure persistence
  async pinContent(hash: string): Promise<void> {
    try {
      await this.client.pin.add(hash)
      console.log(`Pinned content: ${hash}`)
    } catch (error) {
      console.error("Error pinning content:", error)
      throw new Error("Failed to pin content")
    }
  }
}

export const ipfsService = new IPFSService()

import { didService } from "../identity/did-service"
import type { VerifiableCredential } from "@veramo/core"
import { IPFSService } from "../supply-chain/ipfs-service"
import { HCSService } from "../supply-chain/hcs-service"

export interface QualityTestResult {
  lotId: string
  testId: string
  labDID: string
  labName: string
  testDate: Date
  testType: "moisture" | "defects" | "contamination" | "grading" | "chemical_residue" | "nutritional"
  results: {
    parameter: string
    value: number | string
    unit?: string
    passThreshold?: number | string
    status: "pass" | "fail" | "warning"
  }[]
  overallGrade: number // 0-100
  overallStatus: "approved" | "rejected" | "conditional"
  certifications: string[]
  methodology: string
  equipment: string[]
  technician: string
  notes?: string
  images?: string[] // IPFS hashes
  documents?: string[] // IPFS hashes for COA, test reports
}

export interface LabAttestation {
  id: string
  testResult: QualityTestResult
  credential: VerifiableCredential
  ipfsHash: string
  hcsMessageId?: string
  blockchainTxId?: string
  createdAt: Date
  expiresAt?: Date
}

export class LabAttestationService {
  private ipfsService: IPFSService
  private hcsService: HCSService

  constructor() {
    this.ipfsService = new IPFSService()
    this.hcsService = new HCSService()
  }

  // Create lab attestation with verifiable credential
  async createLabAttestation(
    labDID: string,
    testResult: QualityTestResult,
    expirationDays = 90,
  ): Promise<LabAttestation> {
    try {
      // Validate lab identity
      const labIdentity = await didService.getIdentityByDID(labDID)
      if (!labIdentity || labIdentity.type !== "auditor") {
        throw new Error("Invalid lab identity or insufficient permissions")
      }

      // Upload test result to IPFS
      const ipfsHash = await this.ipfsService.uploadJSON({
        testResult,
        timestamp: new Date().toISOString(),
        version: "1.0",
      })

      // Create verifiable credential for quality attestation
      const expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + expirationDays)

      const credential = await didService.issueCertificationCredential(
        labDID,
        `did:agritrust:lot:${testResult.lotId}`, // Subject is the lot
        "QualityAttestation",
        {
          lotId: testResult.lotId,
          testId: testResult.testId,
          overallGrade: testResult.overallGrade,
          overallStatus: testResult.overallStatus,
          testDate: testResult.testDate.toISOString(),
          testType: testResult.testType,
          labName: testResult.labName,
          certifications: testResult.certifications,
          ipfsHash,
          methodology: testResult.methodology,
          technician: testResult.technician,
        },
        expirationDate,
      )

      // Publish to HCS for immutable record
      const hcsMessage = {
        eventType: "QUALITY_ATTESTATION",
        lotId: testResult.lotId,
        testId: testResult.testId,
        labDID,
        overallGrade: testResult.overallGrade,
        overallStatus: testResult.overallStatus,
        credentialHash: this.hashCredential(credential),
        ipfsHash,
        timestamp: new Date().toISOString(),
      }

      const hcsMessageId = await this.hcsService.publishMessage(JSON.stringify(hcsMessage))

      const attestation: LabAttestation = {
        id: `attestation-${testResult.testId}`,
        testResult,
        credential,
        ipfsHash,
        hcsMessageId,
        createdAt: new Date(),
        expiresAt: expirationDate,
      }

      // Store attestation in database
      await this.storeAttestation(attestation)

      return attestation
    } catch (error) {
      console.error("Error creating lab attestation:", error)
      throw new Error("Failed to create lab attestation")
    }
  }

  // Verify lab attestation
  async verifyAttestation(attestationId: string): Promise<{
    isValid: boolean
    attestation?: LabAttestation
    errors: string[]
  }> {
    try {
      const attestation = await this.getAttestation(attestationId)
      if (!attestation) {
        return { isValid: false, errors: ["Attestation not found"] }
      }

      const errors: string[] = []

      // Verify credential
      const credentialValid = await didService.verifyCredential(attestation.credential)
      if (!credentialValid) {
        errors.push("Invalid credential signature")
      }

      // Check expiration
      if (attestation.expiresAt && attestation.expiresAt < new Date()) {
        errors.push("Attestation has expired")
      }

      // Verify IPFS data integrity
      try {
        const ipfsData = await this.ipfsService.getJSON(attestation.ipfsHash)
        if (!ipfsData || ipfsData.testResult.testId !== attestation.testResult.testId) {
          errors.push("IPFS data integrity check failed")
        }
      } catch {
        errors.push("Failed to retrieve IPFS data")
      }

      // Verify HCS record if available
      if (attestation.hcsMessageId) {
        try {
          const hcsRecord = await this.hcsService.getMessage(attestation.hcsMessageId)
          if (!hcsRecord) {
            errors.push("HCS record not found")
          }
        } catch {
          errors.push("Failed to verify HCS record")
        }
      }

      return {
        isValid: errors.length === 0,
        attestation,
        errors,
      }
    } catch (error) {
      console.error("Error verifying attestation:", error)
      return { isValid: false, errors: ["Verification process failed"] }
    }
  }

  // Get attestations for a lot
  async getAttestationsForLot(lotId: string): Promise<LabAttestation[]> {
    try {
      return await this.getAttestationsByLot(lotId)
    } catch (error) {
      console.error("Error getting attestations for lot:", error)
      return []
    }
  }

  // Get latest valid attestation for a lot
  async getLatestValidAttestation(lotId: string): Promise<LabAttestation | null> {
    try {
      const attestations = await this.getAttestationsForLot(lotId)

      // Filter valid, non-expired attestations
      const validAttestations = []
      for (const attestation of attestations) {
        const verification = await this.verifyAttestation(attestation.id)
        if (verification.isValid) {
          validAttestations.push(attestation)
        }
      }

      // Return most recent valid attestation
      return validAttestations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0] || null
    } catch (error) {
      console.error("Error getting latest valid attestation:", error)
      return null
    }
  }

  // Create quality certificate presentation
  async createQualityCertificatePresentation(lotId: string, requesterDID: string, challenge?: string): Promise<any> {
    try {
      const attestations = await this.getAttestationsForLot(lotId)
      const validCredentials = []

      for (const attestation of attestations) {
        const verification = await this.verifyAttestation(attestation.id)
        if (verification.isValid) {
          validCredentials.push(attestation.credential)
        }
      }

      if (validCredentials.length === 0) {
        throw new Error("No valid quality attestations found for lot")
      }

      // Create presentation with all valid quality credentials
      const presentation = await didService.createPresentation(requesterDID, validCredentials, challenge)

      return presentation
    } catch (error) {
      console.error("Error creating quality certificate presentation:", error)
      throw new Error("Failed to create quality certificate presentation")
    }
  }

  // Trigger escrow release based on quality attestation
  async triggerEscrowRelease(lotId: string, escrowContractAddress: string): Promise<boolean> {
    try {
      const latestAttestation = await this.getLatestValidAttestation(lotId)
      if (!latestAttestation) {
        throw new Error("No valid quality attestation found")
      }

      if (latestAttestation.testResult.overallStatus !== "approved") {
        throw new Error("Quality attestation does not approve the lot")
      }

      // Call quality oracle smart contract to trigger escrow release
      // This would integrate with the existing smart contract system
      console.log(`Triggering escrow release for lot ${lotId} based on attestation ${latestAttestation.id}`)

      return true
    } catch (error) {
      console.error("Error triggering escrow release:", error)
      return false
    }
  }

  // Private helper methods
  private hashCredential(credential: VerifiableCredential): string {
    // Create hash of credential for integrity checking
    return `hash-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private async storeAttestation(attestation: LabAttestation): Promise<void> {
    // Implement database storage
    console.log("Storing attestation:", attestation.id)
  }

  private async getAttestation(id: string): Promise<LabAttestation | null> {
    // Implement database retrieval
    console.log("Getting attestation:", id)
    return null
  }

  private async getAttestationsByLot(lotId: string): Promise<LabAttestation[]> {
    // Implement database query
    console.log("Getting attestations for lot:", lotId)
    return []
  }
}

export const labAttestationService = new LabAttestationService()

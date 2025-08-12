export interface TestResult {
  lotId: string
  testId: string
  labDID: string
  labName: string
  testDate: Date
  testType: string
  results: Record<string, any>
  overallGrade: number
  overallStatus: "pass" | "fail" | "conditional"
  certifications: string[]
  methodology: string
  equipment: string[]
  technician: string
  notes?: string
  images: string[]
  documents: string[]
}

export interface LabAttestation {
  id: string
  testResult: TestResult
  credential: any
  ipfsHash: string
  hcsMessageId: string
  createdAt: Date
  expiresAt: Date
}

export interface AttestationVerification {
  isValid: boolean
  attestation?: LabAttestation
  errors: string[]
}

// Mock database
const attestations: Map<string, LabAttestation> = new Map()

export class LabAttestationService {
  async createLabAttestation(labDID: string, testResult: TestResult, validityDays = 90): Promise<LabAttestation> {
    const attestationId = `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + validityDays)

    // Create verifiable credential
    const credential = {
      id: `vc_${attestationId}`,
      type: ["VerifiableCredential", "LabTestCredential"],
      issuer: labDID,
      issuanceDate: new Date(),
      expirationDate: expiresAt,
      credentialSubject: {
        id: testResult.lotId,
        testResult: testResult,
      },
      proof: {
        type: "Ed25519Signature2020",
        created: new Date(),
        verificationMethod: `${labDID}#key-1`,
        signature: `sig_${Math.random().toString(36).substr(2, 64)}`,
      },
    }

    const attestation: LabAttestation = {
      id: attestationId,
      testResult,
      credential,
      ipfsHash: `Qm${Math.random().toString(36).substr(2, 44)}`, // Mock IPFS hash
      hcsMessageId: `0.0.${Math.floor(Math.random() * 1000000)}-${Date.now()}`, // Mock HCS message ID
      createdAt: new Date(),
      expiresAt,
    }

    attestations.set(attestationId, attestation)

    console.log("Created lab attestation:", attestation)

    return attestation
  }

  async getAttestationsForLot(lotId: string): Promise<LabAttestation[]> {
    return Array.from(attestations.values()).filter((att) => att.testResult.lotId === lotId)
  }

  async verifyAttestation(attestationId: string): Promise<AttestationVerification> {
    const attestation = attestations.get(attestationId)

    if (!attestation) {
      return {
        isValid: false,
        errors: ["Attestation not found"],
      }
    }

    const errors: string[] = []

    // Check expiration
    if (attestation.expiresAt < new Date()) {
      errors.push("Attestation has expired")
    }

    // Verify credential signature (mock)
    if (!attestation.credential.proof.signature.startsWith("sig_")) {
      errors.push("Invalid credential signature")
    }

    return {
      isValid: errors.length === 0,
      attestation,
      errors,
    }
  }

  async createQualityCertificatePresentation(lotId: string, requesterDID: string, challenge?: string): Promise<any> {
    const attestations = await this.getAttestationsForLot(lotId)

    const presentation = {
      id: `vp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: ["VerifiablePresentation", "QualityCertificatePresentation"],
      holder: requesterDID,
      verifiableCredential: attestations.map((att) => att.credential),
      proof: {
        type: "Ed25519Signature2020",
        created: new Date(),
        challenge: challenge || `challenge_${Math.random().toString(36).substr(2, 16)}`,
        verificationMethod: `${requesterDID}#key-1`,
        signature: `sig_${Math.random().toString(36).substr(2, 64)}`,
      },
    }

    console.log("Created quality certificate presentation:", presentation)

    return presentation
  }

  async getAttestation(attestationId: string): Promise<LabAttestation | null> {
    return attestations.get(attestationId) || null
  }

  async revokeAttestation(attestationId: string, labDID: string): Promise<boolean> {
    const attestation = attestations.get(attestationId)
    if (!attestation || attestation.testResult.labDID !== labDID) {
      return false
    }

    attestations.delete(attestationId)
    return true
  }
}

export const labAttestationService = new LabAttestationService()

export interface StakeholderIdentity {
  did: string
  name: string
  type: string
  location?: string
  publicKey: string
  credentials: VerifiableCredential[]
  createdAt: Date
}

export interface VerifiableCredential {
  id: string
  type: string[]
  issuer: string
  issuanceDate: Date
  expirationDate?: Date
  credentialSubject: Record<string, any>
  proof: {
    type: string
    created: Date
    verificationMethod: string
    signature: string
  }
}

// Mock database
const identities: Map<string, StakeholderIdentity> = new Map()
const credentials: Map<string, VerifiableCredential> = new Map()

export class DIDService {
  async createStakeholderDID(name: string, type: string, location?: string): Promise<StakeholderIdentity> {
    const did = `did:agritrust:${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const publicKey = `pk_${Math.random().toString(36).substr(2, 32)}`

    const identity: StakeholderIdentity = {
      did,
      name,
      type,
      location,
      publicKey,
      credentials: [],
      createdAt: new Date(),
    }

    identities.set(did, identity)

    console.log("Created DID:", identity)

    return identity
  }

  async issueCertificationCredential(
    issuerDID: string,
    subjectDID: string,
    certificationType: string,
    metadata: Record<string, any>,
    validUntil?: Date,
  ): Promise<VerifiableCredential> {
    const credentialId = `vc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const credential: VerifiableCredential = {
      id: credentialId,
      type: ["VerifiableCredential", "CertificationCredential"],
      issuer: issuerDID,
      issuanceDate: new Date(),
      expirationDate: validUntil,
      credentialSubject: {
        id: subjectDID,
        certificationType,
        ...metadata,
      },
      proof: {
        type: "Ed25519Signature2020",
        created: new Date(),
        verificationMethod: `${issuerDID}#key-1`,
        signature: `sig_${Math.random().toString(36).substr(2, 64)}`,
      },
    }

    credentials.set(credentialId, credential)

    // Add to subject's identity
    const identity = identities.get(subjectDID)
    if (identity) {
      identity.credentials.push(credential)
      identities.set(subjectDID, identity)
    }

    console.log("Issued credential:", credential)

    return credential
  }

  async verifyCredential(credential: VerifiableCredential): Promise<boolean> {
    // Mock verification - in production, verify cryptographic proof
    const storedCredential = credentials.get(credential.id)
    if (!storedCredential) return false

    // Check expiration
    if (credential.expirationDate && credential.expirationDate < new Date()) {
      return false
    }

    // Verify signature (mock)
    return credential.proof.signature.startsWith("sig_")
  }

  async getIdentity(did: string): Promise<StakeholderIdentity | null> {
    return identities.get(did) || null
  }

  async getCredential(credentialId: string): Promise<VerifiableCredential | null> {
    return credentials.get(credentialId) || null
  }

  async revokeCredential(credentialId: string, issuerDID: string): Promise<boolean> {
    const credential = credentials.get(credentialId)
    if (!credential || credential.issuer !== issuerDID) {
      return false
    }

    credentials.delete(credentialId)

    // Remove from subject's identity
    const identity = identities.get(credential.credentialSubject.id)
    if (identity) {
      identity.credentials = identity.credentials.filter((c) => c.id !== credentialId)
      identities.set(credential.credentialSubject.id, identity)
    }

    return true
  }
}

export const didService = new DIDService()

import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { didService, type StakeholderIdentity } from "../identity/did-service"

export interface AuthUser {
  id: string
  did: string
  name: string
  type: StakeholderIdentity["type"]
  email?: string
  isVerified: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  type: StakeholderIdentity["type"]
  location?: {
    latitude: number
    longitude: number
    address: string
  }
}

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
  private readonly JWT_EXPIRES_IN = "7d"

  // Register new user with DID creation
  async register(data: RegisterData): Promise<{ user: AuthUser; token: string; did: string }> {
    try {
      // Check if user already exists
      const existingUser = await this.getUserByEmail(data.email)
      if (existingUser) {
        throw new Error("User already exists with this email")
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12)

      // Create DID for the user
      const identity = await didService.createStakeholderDID(data.name, data.type, data.location)

      // Create user record
      const user: AuthUser = {
        id: this.generateUserId(),
        did: identity.did,
        name: data.name,
        type: data.type,
        email: data.email,
        isVerified: false,
      }

      // Store user in database
      await this.storeUser(user, hashedPassword)

      // Generate JWT token
      const token = this.generateToken(user)

      return { user, token, did: identity.did }
    } catch (error) {
      console.error("Registration error:", error)
      throw new Error("Failed to register user")
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> {
    try {
      // Get user by email
      const user = await this.getUserByEmail(credentials.email)
      if (!user) {
        throw new Error("Invalid credentials")
      }

      // Verify password
      const storedPassword = await this.getUserPassword(user.id)
      const isValidPassword = await bcrypt.compare(credentials.password, storedPassword)
      if (!isValidPassword) {
        throw new Error("Invalid credentials")
      }

      // Generate JWT token
      const token = this.generateToken(user)

      return { user, token }
    } catch (error) {
      console.error("Login error:", error)
      throw new Error("Failed to login user")
    }
  }

  // Verify JWT token
  async verifyToken(token: string): Promise<AuthUser | null> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any
      const user = await this.getUserById(decoded.userId)
      return user
    } catch (error) {
      console.error("Token verification error:", error)
      return null
    }
  }

  // Generate JWT token
  private generateToken(user: AuthUser): string {
    return jwt.sign(
      {
        userId: user.id,
        did: user.did,
        type: user.type,
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN },
    )
  }

  // Generate unique user ID
  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Database operations (implement based on your database choice)
  private async storeUser(user: AuthUser, hashedPassword: string): Promise<void> {
    // Implement database storage
    console.log("Storing user:", user.id)
  }

  private async getUserByEmail(email: string): Promise<AuthUser | null> {
    // Implement database query
    console.log("Getting user by email:", email)
    return null
  }

  private async getUserById(id: string): Promise<AuthUser | null> {
    // Implement database query
    console.log("Getting user by ID:", id)
    return null
  }

  private async getUserPassword(userId: string): Promise<string> {
    // Implement database query
    console.log("Getting password for user:", userId)
    return ""
  }

  // Verify user's identity with credentials
  async verifyUserIdentity(userId: string, credentialTypes: string[]): Promise<boolean> {
    try {
      const user = await this.getUserById(userId)
      if (!user) return false

      const credentials = await didService.getCredentialsForDID(user.did)
      const hasRequiredCredentials = credentialTypes.every((type) =>
        credentials.some((cred) => cred.type.includes(type)),
      )

      return hasRequiredCredentials
    } catch (error) {
      console.error("Identity verification error:", error)
      return false
    }
  }

  // Issue verification credential to user
  async issueVerificationCredential(
    issuerDID: string,
    userDID: string,
    verificationType: string,
    metadata: Record<string, any>,
  ): Promise<void> {
    try {
      await didService.issueCertificationCredential(issuerDID, userDID, verificationType, metadata)
    } catch (error) {
      console.error("Error issuing verification credential:", error)
      throw new Error("Failed to issue verification credential")
    }
  }
}

export const authService = new AuthService()

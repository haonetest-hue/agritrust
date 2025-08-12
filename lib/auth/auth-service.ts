import { hash, compare } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"

export interface User {
  id: string
  name: string
  email: string
  type: "farmer" | "cooperative" | "offtaker" | "processor" | "logistics" | "auditor"
  location?: string
  did?: string
  hederaAccountId?: string
  createdAt: Date
}

export interface RegisterData {
  name: string
  email: string
  password: string
  type: string
  location?: string
}

export interface LoginData {
  email: string
  password: string
}

// Mock database - in production, use a real database
const users: Map<string, User & { password: string }> = new Map()

class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

  async register(data: RegisterData): Promise<{ user: User; token: string; did: string }> {
    const { name, email, password, type, location } = data

    // Check if user already exists
    const existingUser = Array.from(users.values()).find((u) => u.email === email)
    if (existingUser) {
      throw new Error("User already exists")
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const did = `did:agritrust:${userId}`
    const hederaAccountId = `0.0.${Math.floor(Math.random() * 1000000)}`

    const user: User & { password: string } = {
      id: userId,
      name,
      email,
      type: type as User["type"],
      location,
      did,
      hederaAccountId,
      password: hashedPassword,
      createdAt: new Date(),
    }

    users.set(userId, user)

    // Generate JWT token
    const token = sign({ userId, email, type }, this.JWT_SECRET, { expiresIn: "7d" })

    const { password: _, ...userWithoutPassword } = user
    return { user: userWithoutPassword, token, did }
  }

  async login(data: LoginData): Promise<{ user: User; token: string }> {
    const { email, password } = data

    // Find user
    const user = Array.from(users.values()).find((u) => u.email === email)
    if (!user) {
      throw new Error("Invalid credentials")
    }

    // Verify password
    const isValid = await compare(password, user.password)
    if (!isValid) {
      throw new Error("Invalid credentials")
    }

    // Generate JWT token
    const token = sign({ userId: user.id, email, type: user.type }, this.JWT_SECRET, { expiresIn: "7d" })

    const { password: _, ...userWithoutPassword } = user
    return { user: userWithoutPassword, token }
  }

  async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = verify(token, this.JWT_SECRET) as any
      const user = users.get(decoded.userId)
      if (!user) return null

      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword
    } catch {
      return null
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    const user = users.get(userId)
    if (!user) return null

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}

export const authService = new AuthService()

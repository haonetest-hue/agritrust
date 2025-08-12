import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth/middleware"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const crop = searchParams.get("crop")
    const region = searchParams.get("region")
    const sortBy = searchParams.get("sortBy") || "interest_rate"
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // In production, query database with filters
    const mockListings = [
      {
        id: "1",
        invoiceId: "INV-001",
        lotId: "LOT-001",
        farmerName: "Budi Santoso",
        farmerDID: "did:hedera:farmer:001",
        amount: 50000000,
        agriCreditAmount: 47500000,
        qualityGrade: 92,
        dueDate: "2025-03-15",
        interestRate: 12,
        advanceRate: 80,
        crop: "Coffee",
        region: "Aceh",
        status: "available",
        createdAt: "2025-01-15",
        ipfsHash: "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
      },
      // Add more mock data as needed
    ]

    // Apply filters
    let filteredListings = mockListings
    if (crop && crop !== "all") {
      filteredListings = filteredListings.filter((l) => l.crop.toLowerCase() === crop.toLowerCase())
    }
    if (region && region !== "all") {
      filteredListings = filteredListings.filter((l) => l.region.toLowerCase() === region.toLowerCase())
    }

    // Apply sorting
    filteredListings.sort((a, b) => {
      switch (sortBy) {
        case "interest_rate":
          return a.interestRate - b.interestRate
        case "amount":
          return b.amount - a.amount
        case "quality":
          return b.qualityGrade - a.qualityGrade
        case "due_date":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        default:
          return 0
      }
    })

    // Apply pagination
    const paginatedListings = filteredListings.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      listings: paginatedListings,
      total: filteredListings.length,
      hasMore: offset + limit < filteredListings.length,
    })
  } catch (error) {
    console.error("Error fetching marketplace listings:", error)
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      invoiceId,
      lotId,
      amount,
      agriCreditAmount,
      qualityGrade,
      dueDate,
      interestRate,
      advanceRate,
      crop,
      region,
      ipfsHash,
    } = body

    // Validate required fields
    if (!invoiceId || !lotId || !amount || !dueDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In production, save to database
    const newListing = {
      id: `listing-${Date.now()}`,
      invoiceId,
      lotId,
      farmerName: authResult.user.name,
      farmerDID: authResult.user.did,
      amount,
      agriCreditAmount,
      qualityGrade: qualityGrade || 0,
      dueDate,
      interestRate: interestRate || 15,
      advanceRate: advanceRate || 80,
      crop: crop || "Unknown",
      region: region || "Unknown",
      status: "available",
      createdAt: new Date().toISOString(),
      ipfsHash: ipfsHash || "",
    }

    return NextResponse.json({
      success: true,
      listing: newListing,
    })
  } catch (error) {
    console.error("Error creating marketplace listing:", error)
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 })
  }
}

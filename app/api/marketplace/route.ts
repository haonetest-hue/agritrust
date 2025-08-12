import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth/middleware"

// Mock marketplace data
const listings: any[] = []
const orders: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")

    switch (action) {
      case "listings":
        return NextResponse.json({
          success: true,
          listings: listings.slice(0, 20), // Paginate in production
          total: listings.length,
        })

      case "orders":
        const authResult = await verifyAuth(request)
        if (!authResult.success) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const userOrders = orders.filter((order) => order.buyerDID === authResult.user!.did)
        return NextResponse.json({
          success: true,
          orders: userOrders,
        })

      case "stats":
        return NextResponse.json({
          success: true,
          stats: {
            totalListings: listings.length,
            totalOrders: orders.length,
            totalVolume: orders.reduce((sum, order) => sum + order.amount, 0),
            averagePrice:
              listings.length > 0 ? listings.reduce((sum, listing) => sum + listing.price, 0) / listings.length : 0,
          },
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Marketplace error:", error)
    return NextResponse.json({ error: error.message || "Marketplace operation failed" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const body = await request.json()

    switch (action) {
      case "create-listing": {
        const { lotId, quantity, price, description, images } = body
        if (!lotId || !quantity || !price) {
          return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const listing = {
          id: `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          lotId,
          sellerDID: authResult.user!.did,
          quantity,
          price,
          description: description || "",
          images: images || [],
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        listings.push(listing)

        return NextResponse.json({
          success: true,
          message: "Listing created successfully",
          listing,
        })
      }

      case "create-order": {
        const { listingId, quantity, offerPrice } = body
        if (!listingId || !quantity) {
          return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const listing = listings.find((l) => l.id === listingId)
        if (!listing) {
          return NextResponse.json({ error: "Listing not found" }, { status: 404 })
        }

        const order = {
          id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          listingId,
          buyerDID: authResult.user!.did,
          sellerDID: listing.sellerDID,
          quantity,
          price: offerPrice || listing.price,
          amount: (offerPrice || listing.price) * quantity,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        orders.push(order)

        return NextResponse.json({
          success: true,
          message: "Order created successfully",
          order,
        })
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Marketplace error:", error)
    return NextResponse.json({ error: error.message || "Marketplace operation failed" }, { status: 500 })
  }
}

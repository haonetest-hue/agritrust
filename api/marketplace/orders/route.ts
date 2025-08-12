import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth/middleware"

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const orderType = searchParams.get("orderType")

    // In production, query database for user's orders
    const mockOrders = [
      {
        id: "order-1",
        listingId: "listing-1",
        buyerDID: authResult.user.did,
        amount: 10000,
        price: 8000,
        orderType: "buy",
        status: "pending",
        createdAt: "2025-01-15T10:00:00Z",
        listing: {
          farmerName: "Budi Santoso",
          crop: "Coffee",
          lotId: "LOT-001",
        },
      },
    ]

    // Apply filters
    let filteredOrders = mockOrders
    if (status) {
      filteredOrders = filteredOrders.filter((o) => o.status === status)
    }
    if (orderType) {
      filteredOrders = filteredOrders.filter((o) => o.orderType === orderType)
    }

    return NextResponse.json({
      success: true,
      orders: filteredOrders,
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
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
    const { listingId, amount, orderType } = body

    // Validate required fields
    if (!listingId || !amount || !orderType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In production, validate listing exists and calculate price
    const mockListing = {
      id: listingId,
      amount: 50000000,
      advanceRate: 80,
    }

    const price = orderType === "buy" ? (mockListing.amount * mockListing.advanceRate) / 100 : amount

    const newOrder = {
      id: `order-${Date.now()}`,
      listingId,
      buyerDID: authResult.user.did,
      amount,
      price,
      orderType,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    // In production, save to database and potentially execute order
    return NextResponse.json({
      success: true,
      order: newOrder,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

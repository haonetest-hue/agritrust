import { type NextRequest, NextResponse } from "next/server"
import { paymentGateway } from "@/lib/payments/payment-gateway"
import { authMiddleware } from "@/lib/auth/middleware"

export async function POST(request: NextRequest) {
  try {
    const authResult = await authMiddleware(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, currency, walletAddress, userEmail } = await request.json()

    if (!amount || !currency || !walletAddress || !userEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const order = await paymentGateway.createFiatToUSDCOrder(amount, currency, walletAddress, userEmail)

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      paymentUrl: order.paymentUrl,
      estimatedUSDC: order.estimatedUSDC,
      amount,
      currency,
    })
  } catch (error) {
    console.error("Error creating fiat-to-USDC order:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create payment order" },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    const status = await paymentGateway.getOrderStatus(orderId)

    return NextResponse.json({
      orderId,
      ...status,
    })
  } catch (error) {
    console.error("Error getting payment order status:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get order status" },
      { status: 500 },
    )
  }
}

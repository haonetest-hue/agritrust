import { type NextRequest, NextResponse } from "next/server"
import { usdcPaymentService } from "@/lib/payments/usdc-service"
import { paymentGateway } from "@/lib/payments/payment-gateway"
import { verifyAuth } from "@/lib/auth/middleware"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const accountId = searchParams.get("accountId")

    switch (action) {
      case "balance":
        if (!accountId) {
          return NextResponse.json({ error: "Account ID is required" }, { status: 400 })
        }
        const balance = await usdcPaymentService.getUSDCBalance(accountId)
        return NextResponse.json({
          accountId,
          balance,
          currency: "USDC",
          timestamp: new Date().toISOString(),
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Payment error:", error)
    return NextResponse.json({ error: error.message || "Payment operation failed" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const body = await request.json()

    switch (action) {
      case "transfer": {
        const authResult = await verifyAuth(request)
        if (!authResult.success) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { fromAccountId, toAccountId, amount } = body
        if (!fromAccountId || !toAccountId || !amount) {
          return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }
        if (amount <= 0) {
          return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 })
        }

        const transactionId = await usdcPaymentService.transferUSDC(fromAccountId, toAccountId, amount)
        return NextResponse.json({
          success: true,
          transactionId,
          amount,
          fromAccount: fromAccountId,
          toAccount: toAccountId,
        })
      }

      case "fiat-to-usdc": {
        const authResult = await verifyAuth(request)
        if (!authResult.success) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { amount, currency, paymentMethod, paymentDetails } = body
        if (!amount || !currency || !paymentMethod) {
          return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const result = await paymentGateway.convertFiatToUSDC({
          amount,
          currency,
          userAccountId: authResult.user!.hederaAccountId || "",
          paymentMethod,
          paymentDetails,
        })

        return NextResponse.json({
          success: true,
          result,
        })
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Payment error:", error)
    return NextResponse.json({ error: error.message || "Payment operation failed" }, { status: 500 })
  }
}

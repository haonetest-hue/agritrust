import { type NextRequest, NextResponse } from "next/server"
import { usdcPaymentService } from "@/lib/payments/usdc-service"
import { authMiddleware } from "@/lib/auth/middleware"

export async function POST(request: NextRequest) {
  try {
    const authResult = await authMiddleware(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { fromAccountId, toAccountId, amount } = await request.json()

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
  } catch (error) {
    console.error("Error transferring USDC:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to transfer USDC" },
      { status: 500 },
    )
  }
}

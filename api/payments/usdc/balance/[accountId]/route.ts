import { type NextRequest, NextResponse } from "next/server"
import { usdcPaymentService } from "@/lib/payments/usdc-service"

export async function GET(request: NextRequest, { params }: { params: { accountId: string } }) {
  try {
    const { accountId } = params

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
  } catch (error) {
    console.error("Error getting USDC balance:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get USDC balance" },
      { status: 500 },
    )
  }
}

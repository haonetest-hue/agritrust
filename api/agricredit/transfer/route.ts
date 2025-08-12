import { type NextRequest, NextResponse } from "next/server"
import { AgriCreditService } from "@/lib/nft/agricredit-service"
import { verifyAuth } from "@/lib/auth/middleware"

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { toAccountId, amount, privateKey } = body

    // Validate required fields
    if (!toAccountId || !amount || !privateKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const agriCreditService = new AgriCreditService()

    const transactionId = await agriCreditService.transferAgriCredit(
      authResult.user.hederaAccountId,
      toAccountId,
      amount,
      privateKey,
    )

    return NextResponse.json({
      success: true,
      transactionId,
      from: authResult.user.hederaAccountId,
      to: toAccountId,
      amount,
    })
  } catch (error) {
    console.error("Error transferring AgriCredit:", error)
    return NextResponse.json({ error: "Failed to transfer AgriCredit tokens" }, { status: 500 })
  }
}

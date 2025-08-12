import { type NextRequest, NextResponse } from "next/server"
import { AgriCreditService } from "@/lib/nft/agricredit-service"

export async function GET(request: NextRequest, { params }: { params: { accountId: string } }) {
  try {
    const { accountId } = params

    if (!accountId) {
      return NextResponse.json({ error: "Account ID is required" }, { status: 400 })
    }

    const agriCreditService = new AgriCreditService()
    const balance = await agriCreditService.getAgriCreditBalance(accountId)
    const tokenInfo = await agriCreditService.getTokenInfo()

    return NextResponse.json({
      success: true,
      accountId,
      balance,
      tokenInfo,
    })
  } catch (error) {
    console.error("Error getting AgriCredit balance:", error)
    return NextResponse.json({ error: "Failed to get AgriCredit balance" }, { status: 500 })
  }
}

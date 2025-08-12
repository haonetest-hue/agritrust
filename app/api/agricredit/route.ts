import { type NextRequest, NextResponse } from "next/server"
import { AgriCreditService } from "@/lib/nft/agricredit-service"
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
        const agriCreditService = new AgriCreditService()
        const balance = await agriCreditService.getAgriCreditBalance(accountId)
        const tokenInfo = await agriCreditService.getTokenInfo()
        return NextResponse.json({
          success: true,
          accountId,
          balance,
          tokenInfo,
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("AgriCredit error:", error)
    return NextResponse.json({ error: error.message || "AgriCredit operation failed" }, { status: 500 })
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
      case "create": {
        const { invoiceId, lotId, amount, currency, dueDate, qualityGrade, ipfsHash } = body
        if (!invoiceId || !lotId || !amount || !dueDate) {
          return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const agriCreditService = new AgriCreditService()
        const metadata = {
          invoiceId,
          lotId,
          farmerDID: authResult.user!.did || "",
          offtakerDID: body.offtakerDID,
          amount,
          currency: currency || "USDC",
          dueDate,
          qualityGrade: qualityGrade || 0,
          ipfsHash: ipfsHash || "",
        }

        const transactionId = await agriCreditService.mintAgriCredit(amount, metadata)

        return NextResponse.json({
          success: true,
          transactionId,
          agriCreditAmount: amount,
          metadata,
        })
      }

      case "transfer": {
        const { toAccountId, amount, privateKey } = body
        if (!toAccountId || !amount || !privateKey) {
          return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const agriCreditService = new AgriCreditService()
        const transactionId = await agriCreditService.transferAgriCredit(
          authResult.user!.hederaAccountId || "",
          toAccountId,
          amount,
          privateKey,
        )

        return NextResponse.json({
          success: true,
          transactionId,
          from: authResult.user!.hederaAccountId,
          to: toAccountId,
          amount,
        })
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("AgriCredit error:", error)
    return NextResponse.json({ error: error.message || "AgriCredit operation failed" }, { status: 500 })
  }
}

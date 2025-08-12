import {
  type Client,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenMintTransaction,
  TokenBurnTransaction,
  TransferTransaction,
  AccountId,
  PrivateKey,
  Hbar,
} from "@hashgraph/sdk"
import { getHederaClient } from "../config/hedera"

export interface AgriCreditMetadata {
  invoiceId: string
  lotId: string
  farmerDID: string
  offtakerDID: string
  amount: number
  currency: string
  dueDate: string
  qualityGrade: number
  ipfsHash: string
}

export class AgriCreditService {
  private client: Client
  private tokenId: string

  constructor() {
    this.client = getHederaClient()
    this.tokenId = process.env.AGRICREDIT_TOKEN_ID || ""
  }

  // Create AgriCredit Fungible Token Collection
  async createAgriCreditToken(): Promise<string> {
    const operatorId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID!)
    const operatorKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY!)

    const tokenCreateTx = new TokenCreateTransaction()
      .setTokenName("AgriCredit")
      .setTokenSymbol("AGRC")
      .setTokenType(TokenType.FungibleCommon)
      .setSupplyType(TokenSupplyType.Infinite)
      .setInitialSupply(0)
      .setDecimals(2) // 2 decimal places for currency precision
      .setTreasuryAccountId(operatorId)
      .setSupplyKey(operatorKey)
      .setAdminKey(operatorKey)
      .setFreezeKey(operatorKey)
      .setWipeKey(operatorKey)
      .setMaxTransactionFee(new Hbar(30))

    const tokenCreateSubmit = await tokenCreateTx.execute(this.client)
    const tokenCreateReceipt = await tokenCreateSubmit.getReceipt(this.client)
    const tokenId = tokenCreateReceipt.tokenId!.toString()

    console.log(`AgriCredit Token created: ${tokenId}`)
    return tokenId
  }

  // Mint AgriCredit tokens for invoice factoring
  async mintAgriCredit(amount: number, metadata: AgriCreditMetadata): Promise<string> {
    const operatorKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY!)

    // Convert amount to token units (with 2 decimal places)
    const tokenAmount = Math.floor(amount * 100)

    const tokenMintTx = new TokenMintTransaction()
      .setTokenId(this.tokenId)
      .setAmount(tokenAmount)
      .setMaxTransactionFee(new Hbar(20))

    const tokenMintSubmit = await tokenMintTx.execute(this.client)
    const tokenMintReceipt = await tokenMintSubmit.getReceipt(this.client)

    // Store metadata in IPFS and record transaction
    const transactionId = tokenMintSubmit.transactionId!.toString()

    console.log(`Minted ${amount} AgriCredit tokens for invoice ${metadata.invoiceId}`)
    return transactionId
  }

  // Transfer AgriCredit tokens (for factoring/trading)
  async transferAgriCredit(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    fromPrivateKey: string,
  ): Promise<string> {
    const fromAccount = AccountId.fromString(fromAccountId)
    const toAccount = AccountId.fromString(toAccountId)
    const fromKey = PrivateKey.fromString(fromPrivateKey)

    // Convert amount to token units
    const tokenAmount = Math.floor(amount * 100)

    const transferTx = new TransferTransaction()
      .addTokenTransfer(this.tokenId, fromAccount, -tokenAmount)
      .addTokenTransfer(this.tokenId, toAccount, tokenAmount)
      .setMaxTransactionFee(new Hbar(10))

    const transferSubmit = await transferTx.execute(this.client)
    const transferReceipt = await transferSubmit.getReceipt(this.client)

    const transactionId = transferSubmit.transactionId!.toString()
    console.log(`Transferred ${amount} AgriCredit from ${fromAccountId} to ${toAccountId}`)

    return transactionId
  }

  // Burn AgriCredit tokens (when invoice is paid)
  async burnAgriCredit(amount: number, invoiceId: string): Promise<string> {
    const operatorKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY!)

    // Convert amount to token units
    const tokenAmount = Math.floor(amount * 100)

    const tokenBurnTx = new TokenBurnTransaction()
      .setTokenId(this.tokenId)
      .setAmount(tokenAmount)
      .setMaxTransactionFee(new Hbar(20))

    const tokenBurnSubmit = await tokenBurnTx.execute(this.client)
    const tokenBurnReceipt = await tokenBurnSubmit.getReceipt(this.client)

    const transactionId = tokenBurnSubmit.transactionId!.toString()
    console.log(`Burned ${amount} AgriCredit tokens for paid invoice ${invoiceId}`)

    return transactionId
  }

  // Get AgriCredit balance for an account
  async getAgriCreditBalance(accountId: string): Promise<number> {
    // This would typically query Hedera Mirror Node API
    // For now, return placeholder
    return 0
  }

  // Get AgriCredit token info
  async getTokenInfo() {
    // Query token information from Hedera
    return {
      tokenId: this.tokenId,
      name: "AgriCredit",
      symbol: "AGRC",
      decimals: 2,
      totalSupply: 0,
    }
  }
}

import { Client, TokenAssociateTransaction, TokenTransferTransaction, AccountId, PrivateKey } from "@hashgraph/sdk"
import { ethers } from "ethers"

export class USDCPaymentService {
  private client: Client
  private operatorKey: PrivateKey
  private operatorId: AccountId
  private usdcTokenId: string

  constructor() {
    // Initialize Hedera client
    if (process.env.HEDERA_NETWORK === "mainnet") {
      this.client = Client.forMainnet()
    } else {
      this.client = Client.forTestnet()
    }

    this.operatorId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID!)
    this.operatorKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY!)
    this.client.setOperator(this.operatorId, this.operatorKey)

    // USDC token ID on Hedera (testnet/mainnet)
    this.usdcTokenId = process.env.USDC_TOKEN_ID || "0.0.456858" // Testnet USDC
  }

  async associateUSDCToken(accountId: string): Promise<string> {
    try {
      const transaction = new TokenAssociateTransaction()
        .setAccountId(accountId)
        .setTokenIds([this.usdcTokenId])
        .freezeWith(this.client)

      const signedTx = await transaction.sign(this.operatorKey)
      const response = await signedTx.execute(this.client)
      const receipt = await response.getReceipt(this.client)

      return receipt.transactionId!.toString()
    } catch (error) {
      console.error("Error associating USDC token:", error)
      throw new Error("Failed to associate USDC token")
    }
  }

  async transferUSDC(fromAccountId: string, toAccountId: string, amount: number): Promise<string> {
    try {
      // Convert amount to smallest unit (USDC has 6 decimals)
      const transferAmount = Math.floor(amount * 1000000)

      const transaction = new TokenTransferTransaction()
        .addTokenTransfer(this.usdcTokenId, fromAccountId, -transferAmount)
        .addTokenTransfer(this.usdcTokenId, toAccountId, transferAmount)
        .freezeWith(this.client)

      const signedTx = await transaction.sign(this.operatorKey)
      const response = await signedTx.execute(this.client)
      const receipt = await response.getReceipt(this.client)

      return receipt.transactionId!.toString()
    } catch (error) {
      console.error("Error transferring USDC:", error)
      throw new Error("Failed to transfer USDC")
    }
  }

  async getUSDCBalance(accountId: string): Promise<number> {
    try {
      const query = await this.client.getAccountBalance(accountId)
      const tokenBalance = query.tokens?.get(this.usdcTokenId)

      // Convert from smallest unit to USDC (6 decimals)
      return tokenBalance ? tokenBalance.toNumber() / 1000000 : 0
    } catch (error) {
      console.error("Error getting USDC balance:", error)
      return 0
    }
  }

  async createEscrowWithUSDC(
    contractAddress: string,
    seller: string,
    amount: number,
    lotId: string,
    releaseTime: number,
    qualityOracle: string,
    revenueShare: any,
    stakeholders: string[],
  ): Promise<string> {
    try {
      const provider = new ethers.JsonRpcProvider(
        process.env.HEDERA_NETWORK === "mainnet" ? "https://mainnet.hashio.io/api" : "https://testnet.hashio.io/api",
      )
      const signer = new ethers.Wallet(process.env.HEDERA_PRIVATE_KEY!, provider)

      const contract = new ethers.Contract(contractAddress, [], signer)
      const usdcAmount = ethers.parseUnits(amount.toString(), 6) // USDC has 6 decimals

      const tx = await contract.createEscrow(
        seller,
        usdcAmount,
        this.usdcTokenId, // USDC token address
        lotId,
        releaseTime,
        qualityOracle,
        revenueShare,
        stakeholders,
      )

      const receipt = await tx.wait()
      return receipt.transactionHash
    } catch (error) {
      console.error("Error creating USDC escrow:", error)
      throw new Error("Failed to create USDC escrow")
    }
  }

  async fundEscrowWithUSDC(contractAddress: string, escrowId: number, amount: number): Promise<string> {
    try {
      const provider = new ethers.JsonRpcProvider(
        process.env.HEDERA_NETWORK === "mainnet" ? "https://mainnet.hashio.io/api" : "https://testnet.hashio.io/api",
      )
      const signer = new ethers.Wallet(process.env.HEDERA_PRIVATE_KEY!, provider)

      // First approve USDC spending
      const usdcContract = new ethers.Contract(
        this.usdcTokenId,
        ["function approve(address spender, uint256 amount) external returns (bool)"],
        signer,
      )

      const usdcAmount = ethers.parseUnits(amount.toString(), 6)
      const approveTx = await usdcContract.approve(contractAddress, usdcAmount)
      await approveTx.wait()

      // Then fund the escrow
      const escrowContract = new ethers.Contract(contractAddress, [], signer)
      const fundTx = await escrowContract.fundEscrow(escrowId)
      const receipt = await fundTx.wait()

      return receipt.transactionHash
    } catch (error) {
      console.error("Error funding USDC escrow:", error)
      throw new Error("Failed to fund USDC escrow")
    }
  }
}

export const usdcPaymentService = new USDCPaymentService()

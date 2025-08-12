import { ethers } from "ethers"

// Smart contract interaction utilities
export class ContractInteractions {
  private provider: ethers.Provider
  private signer: ethers.Signer

  constructor() {
    const rpcUrl =
      process.env.HEDERA_NETWORK === "mainnet" ? "https://mainnet.hashio.io/api" : "https://testnet.hashio.io/api"

    this.provider = new ethers.JsonRpcProvider(rpcUrl)
    this.signer = new ethers.Wallet(process.env.HEDERA_PRIVATE_KEY!, this.provider)
  }

  // Escrow Contract Interactions
  async createEscrow(
    contractAddress: string,
    seller: string,
    amount: string,
    lotId: string,
    releaseTime: number,
    qualityOracle: string,
    revenueShare: {
      farmer: number
      cooperative: number
      processor: number
      logistics: number
      platform: number
    },
    stakeholders: string[],
  ) {
    const contract = new ethers.Contract(contractAddress, [], this.signer)

    const tx = await contract.createEscrow(
      seller,
      ethers.parseEther(amount),
      ethers.ZeroAddress, // Native HBAR
      lotId,
      releaseTime,
      qualityOracle,
      revenueShare,
      stakeholders,
    )

    return await tx.wait()
  }

  async fundEscrow(contractAddress: string, escrowId: number, amount: string) {
    const contract = new ethers.Contract(contractAddress, [], this.signer)

    const tx = await contract.fundEscrow(escrowId, {
      value: ethers.parseEther(amount),
    })

    return await tx.wait()
  }

  async releaseEscrow(contractAddress: string, escrowId: number) {
    const contract = new ethers.Contract(contractAddress, [], this.signer)

    const tx = await contract.releaseEscrow(escrowId)
    return await tx.wait()
  }

  // Quality Oracle Interactions
  async submitQualityReport(contractAddress: string, lotId: string, grade: number, ipfsHash: string) {
    const contract = new ethers.Contract(contractAddress, [], this.signer)

    const tx = await contract.submitQualityReport(lotId, grade, ipfsHash)
    return await tx.wait()
  }

  async verifyQualityReport(contractAddress: string, lotId: string) {
    const contract = new ethers.Contract(contractAddress, [], this.signer)

    const tx = await contract.verifyQualityReport(lotId)
    return await tx.wait()
  }

  // Reputation System Interactions
  async registerStakeholder(contractAddress: string, stakeholderType: number) {
    const contract = new ethers.Contract(contractAddress, [], this.signer)

    const tx = await contract.registerStakeholder(stakeholderType)
    return await tx.wait()
  }

  async recordTransaction(
    contractAddress: string,
    from: string,
    to: string,
    lotId: string,
    isSuccessful: boolean,
    rating: number,
    feedback: string,
  ) {
    const contract = new ethers.Contract(contractAddress, [], this.signer)

    const tx = await contract.recordTransaction(from, to, lotId, isSuccessful, rating, feedback)

    return await tx.wait()
  }

  async getStakeholderReputation(contractAddress: string, stakeholder: string) {
    const contract = new ethers.Contract(contractAddress, [], this.signer)

    return await contract.getStakeholderReputation(stakeholder)
  }
}

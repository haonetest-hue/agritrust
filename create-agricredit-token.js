const { AgriCreditService } = require("../lib/nft/agricredit-service")

async function createAgriCreditToken() {
  try {
    console.log("Creating AgriCredit Fungible Token...")

    const agriCreditService = new AgriCreditService()
    const tokenId = await agriCreditService.createAgriCreditToken()

    console.log(`✅ AgriCredit Token created successfully!`)
    console.log(`Token ID: ${tokenId}`)
    console.log(`Add this to your .env file: AGRICREDIT_TOKEN_ID=${tokenId}`)
  } catch (error) {
    console.error("❌ Error creating AgriCredit token:", error)
    process.exit(1)
  }
}

createAgriCreditToken()

import { Client, AccountId, PrivateKey } from "@hashgraph/sdk"

export const getHederaClient = () => {
  const network = process.env.HEDERA_NETWORK || "testnet"
  const accountId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID!)
  const privateKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY!)

  let client: Client

  if (network === "mainnet") {
    client = Client.forMainnet()
  } else {
    client = Client.forTestnet()
  }

  client.setOperator(accountId, privateKey)

  return client
}

export const HEDERA_CONFIG = {
  network: process.env.HEDERA_NETWORK || "testnet",
  accountId: process.env.HEDERA_ACCOUNT_ID,
  privateKey: process.env.HEDERA_PRIVATE_KEY,
  topicId: process.env.HEDERA_TOPIC_ID, // Will be created in next phase
}

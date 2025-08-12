import {
  createAgent,
  type IDIDManager,
  type IResolver,
  type IDataStore,
  type IKeyManager,
  type ICredentialPlugin,
} from "@veramo/core"
import { DIDManager } from "@veramo/did-manager"
import { EthrDIDProvider } from "@veramo/did-provider-ethr"
import { DIDResolverPlugin } from "@veramo/did-resolver"
import { KeyManager } from "@veramo/key-manager"
import { KeyManagementSystem, SecretBox } from "@veramo/kms-local"
import { CredentialPlugin } from "@veramo/credential-w3c"
import { Resolver } from "did-resolver"
import { getResolver as ethrDidResolver } from "ethr-did-resolver"

// Database store (in production, use proper database)
const DATABASE_FILE = process.env.DATABASE_FILE || "./database.sqlite"
const KMS_SECRET_KEY = process.env.KMS_SECRET_KEY || "29739248cad1bd1a0fc4d9b75cd4d2990de535baf5caadfdf8d8f86664aa830c"

// Hedera EVM configuration for DID
const HEDERA_CHAIN_ID = process.env.HEDERA_NETWORK === "mainnet" ? 295 : 296
const HEDERA_RPC_URL =
  process.env.HEDERA_NETWORK === "mainnet" ? "https://mainnet.hashio.io/api" : "https://testnet.hashio.io/api"

export const agent = createAgent<IDIDManager & IKeyManager & IDataStore & IResolver & ICredentialPlugin>({
  plugins: [
    new KeyManager({
      store: new KeyManagementSystem(new SecretBox(KMS_SECRET_KEY)),
      kms: {
        local: new KeyManagementSystem(new SecretBox(KMS_SECRET_KEY)),
      },
    }),
    new DIDManager({
      store: new KeyManagementSystem(new SecretBox(KMS_SECRET_KEY)),
      defaultProvider: "did:ethr:hedera",
      providers: {
        "did:ethr:hedera": new EthrDIDProvider({
          defaultKms: "local",
          network: HEDERA_CHAIN_ID,
          rpcUrl: HEDERA_RPC_URL,
          gas: 1000000,
          ttl: 60 * 60 * 24 * 30 * 12, // 1 year
        }),
      },
    }),
    new DIDResolverPlugin({
      resolver: new Resolver({
        ...ethrDidResolver({
          networks: [
            {
              name: "hedera",
              chainId: HEDERA_CHAIN_ID,
              rpcUrl: HEDERA_RPC_URL,
            },
          ],
        }),
      }),
    }),
    new CredentialPlugin(),
  ],
})

// Payment gateway integration for fiat-to-USDC conversion
export class PaymentGateway {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.PAYMENT_GATEWAY_API_KEY || ""
    this.baseUrl = process.env.PAYMENT_GATEWAY_URL || "https://api.moonpay.com"
  }

  async createFiatToUSDCOrder(
    amount: number,
    currency: string,
    walletAddress: string,
    userEmail: string,
  ): Promise<{
    orderId: string
    paymentUrl: string
    estimatedUSDC: number
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/v3/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          baseCurrencyAmount: amount,
          baseCurrencyCode: currency.toLowerCase(),
          currencyCode: "usdc",
          walletAddress: walletAddress,
          email: userEmail,
          redirectURL: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create payment order")
      }

      const data = await response.json()

      return {
        orderId: data.id,
        paymentUrl: data.url,
        estimatedUSDC: data.quoteCurrencyAmount,
      }
    } catch (error) {
      console.error("Error creating fiat-to-USDC order:", error)
      throw new Error("Failed to create payment order")
    }
  }

  async getOrderStatus(orderId: string): Promise<{
    status: "pending" | "completed" | "failed"
    transactionHash?: string
    usdcAmount?: number
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/v3/transactions/${orderId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to get order status")
      }

      const data = await response.json()

      return {
        status: data.status === "completed" ? "completed" : data.status === "failed" ? "failed" : "pending",
        transactionHash: data.cryptoTransactionId,
        usdcAmount: data.quoteCurrencyAmount,
      }
    } catch (error) {
      console.error("Error getting order status:", error)
      throw new Error("Failed to get order status")
    }
  }

  async estimateConversion(
    amount: number,
    fromCurrency: string,
  ): Promise<{
    estimatedUSDC: number
    exchangeRate: number
    fees: number
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v3/currencies/usdc/quote?baseCurrencyAmount=${amount}&baseCurrencyCode=${fromCurrency.toLowerCase()}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to get conversion estimate")
      }

      const data = await response.json()

      return {
        estimatedUSDC: data.quoteCurrencyAmount,
        exchangeRate: data.quoteCurrencyPrice,
        fees: data.feeAmount,
      }
    } catch (error) {
      console.error("Error estimating conversion:", error)
      throw new Error("Failed to estimate conversion")
    }
  }
}

export const paymentGateway = new PaymentGateway()

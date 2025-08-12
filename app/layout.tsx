import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { RoleProvider } from "@/components/providers/role-provider"
import { GlobalNavbar } from "@/components/navigation/global-navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AgriTrust 2.0 - Agricultural Export-Import Invoice Financing",
  description:
    "Revolutionary agricultural trade finance platform powered by Hedera Hashgraph. Fund container shipments with USDC escrow, track from farm to consumer, and earn 18-20% APY.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <RoleProvider>
            <GlobalNavbar />
            <main className="pt-16">{children}</main>
            <Toaster />
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

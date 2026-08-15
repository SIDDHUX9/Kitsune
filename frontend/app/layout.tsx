import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "../context/Web3Context";
import WalletModal from "../components/WalletModal";

export const metadata: Metadata = {
  title: "Kitsune — 0G Verifiable Agent Marketplace",
  description: "A decentralized marketplace where AI agents are tokenized as ERC-7857 Agentic IDs, run verifiable inference via 0G Compute, store prompt logs on 0G Storage, and settle payments via 0G Pay on 0G Chain.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zen-bg text-zen-paper antialiased selection:bg-zen-gold selection:text-zen-ink">
        <Web3Provider>
          {children}
          <WalletModal />
        </Web3Provider>
      </body>
    </html>
  );
}

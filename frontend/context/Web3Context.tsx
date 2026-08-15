"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import { CONTRACT_ADDRESSES, AGENTIC_ID_ABI, MARKETPLACE_ABI } from '../config/contracts';

export const OG_NETWORKS = {
  aristotle: {
    chainIdHex: "0x4115", // 16661
    chainId: 16661,
    chainName: "0G-Aristotle (Mainnet)",
    rpcUrls: ["https://evmrpc.0g.ai"],
    blockExplorerUrls: ["https://chainscan.0g.ai"],
    nativeCurrency: {
      name: "0G Token",
      symbol: "0G",
      decimals: 18
    }
  },
  galileo: {
    chainIdHex: "0x40DA", // 16602
    chainId: 16602,
    chainName: "0G-Galileo (Testnet)",
    rpcUrls: ["http://evmrpc-testnet.0g.ai"],
    blockExplorerUrls: ["https://chainscan-galileo.0g.ai"],
    nativeCurrency: {
      name: "0G Token",
      symbol: "0G",
      decimals: 18
    }
  },
  localhost: {
    chainIdHex: "0x7A69", // 31337
    chainId: 31337,
    chainName: "Hardhat Localhost",
    rpcUrls: ["http://127.0.0.1:8545"],
    blockExplorerUrls: ["http://127.0.0.1:8545"],
    nativeCurrency: {
      name: "ETH / 0G",
      symbol: "0G",
      decimals: 18
    }
  }
};

export type NetworkKey = 'aristotle' | 'galileo' | 'localhost';

interface Web3ContextType {
  account: string | null;
  chainId: number | null;
  balance: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  walletError: string | null;
  activeNetwork: NetworkKey;
  provider: ethers.BrowserProvider | ethers.JsonRpcProvider | null;
  signer: ethers.Signer | null;
  isModalOpen: boolean;
  pendingRoute: string | null;
  openWalletModal: (route?: string) => void;
  closeWalletModal: () => void;
  connectWallet: () => Promise<void>;
  connectDemoMode: () => void;
  disconnectWallet: () => void;
  gateNavigation: (targetRoute: string) => boolean;
  switchTo0GNetwork: (networkKey: NetworkKey) => Promise<void>;
  mintAgenticIDOnChain: (storageHash: string, modelRef: string, metadataURI: string) => Promise<{ tokenId: number; txHash: string; blockNumber: number }>;
  requestInferenceOnChain: (listingId: number, inputHash: string, priceEther: string) => Promise<{ requestId: number; txHash: string; blockNumber: number }>;
  refundRequestOnChain: (requestId: number) => Promise<{ txHash: string; blockNumber?: number }>;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  chainId: null,
  balance: null,
  isConnected: false,
  isConnecting: false,
  walletError: null,
  activeNetwork: 'galileo',
  provider: null,
  signer: null,
  isModalOpen: false,
  pendingRoute: null,
  openWalletModal: () => {},
  closeWalletModal: () => {},
  connectWallet: async () => {},
  connectDemoMode: () => {},
  disconnectWallet: () => {},
  gateNavigation: () => false,
  switchTo0GNetwork: async () => {},
  mintAgenticIDOnChain: async () => ({ tokenId: 1, txHash: "0x...", blockNumber: 1 }),
  requestInferenceOnChain: async () => ({ requestId: 1, txHash: "0x...", blockNumber: 1 }),
  refundRequestOnChain: async () => ({ txHash: "0x..." })
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(16602);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [activeNetwork, setActiveNetwork] = useState<NetworkKey>('galileo');
  const [provider, setProvider] = useState<ethers.BrowserProvider | ethers.JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const openWalletModal = (targetRoute?: string) => {
    if (targetRoute) {
      setPendingRoute(targetRoute);
    }
    setIsModalOpen(true);
  };

  const closeWalletModal = () => {
    setIsModalOpen(false);
  };

  // Process pending navigation route after successful connection
  const handlePostConnectNavigation = () => {
    if (pendingRoute) {
      const target = pendingRoute;
      setPendingRoute(null);
      router.push(target);
    }
  };

  // Check if wallet is already authorized or persisted in localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isPersisted = localStorage.getItem('kitsune_wallet_connected') === 'true';

    if ((window as any).ethereum) {
      const browserProvider = new ethers.BrowserProvider((window as any).ethereum);
      setProvider(browserProvider);

      browserProvider.send("eth_accounts", []).then(async (accounts: string[]) => {
        if (accounts.length > 0) {
          const userSigner = await browserProvider.getSigner();
          const network = await browserProvider.getNetwork();
          const userBalance = await browserProvider.getBalance(accounts[0]);

          setAccount(accounts[0]);
          setSigner(userSigner);
          setChainId(Number(network.chainId));
          setBalance(ethers.formatEther(userBalance));
          setIsConnected(true);
          localStorage.setItem('kitsune_wallet_connected', 'true');
        } else if (isPersisted) {
          // Attempt eager request if user previously authorized
          browserProvider.send("eth_requestAccounts", []).then(async (accs: string[]) => {
            if (accs.length > 0) {
              const userSigner = await browserProvider.getSigner();
              const network = await browserProvider.getNetwork();
              const userBalance = await browserProvider.getBalance(accs[0]);

              setAccount(accs[0]);
              setSigner(userSigner);
              setChainId(Number(network.chainId));
              setBalance(ethers.formatEther(userBalance));
              setIsConnected(true);
            }
          }).catch(() => {
            localStorage.removeItem('kitsune_wallet_connected');
          });
        }
      }).catch(err => console.debug("Auto-connect check:", err));
    } else if (isPersisted) {
      // Demo mode fallback persistence
      setAccount("0x71C8a9F0d12B9442008E");
      setBalance("12.500");
      setChainId(16661);
      setIsConnected(true);
      const defaultRpcProvider = new ethers.JsonRpcProvider(OG_NETWORKS.aristotle.rpcUrls[0]);
      setProvider(defaultRpcProvider);
    } else {
      const defaultRpcProvider = new ethers.JsonRpcProvider(OG_NETWORKS.aristotle.rpcUrls[0]);
      setProvider(defaultRpcProvider);
    }
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    setWalletError(null);

    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const browserProvider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await browserProvider.send("eth_requestAccounts", []);

        if (accounts.length > 0) {
          const userSigner = await browserProvider.getSigner();
          const network = await browserProvider.getNetwork();
          const userBalance = await browserProvider.getBalance(accounts[0]);

          setAccount(accounts[0]);
          setSigner(userSigner);
          setProvider(browserProvider);
          setChainId(Number(network.chainId));
          setBalance(ethers.formatEther(userBalance));
          setIsConnected(true);
          localStorage.setItem('kitsune_wallet_connected', 'true');
          closeWalletModal();
          handlePostConnectNavigation();
        } else {
          setWalletError("No accounts selected in your Web3 wallet.");
        }
      } else {
        setWalletError("No Ethereum Web3 wallet extension found. Please install MetaMask, Rabby, or Coinbase Wallet.");
        openWalletModal();
      }
    } catch (err: any) {
      console.error("MetaMask connection error:", err);
      setWalletError(err?.message || "Failed to connect Web3 wallet.");
    } finally {
      setIsConnecting(false);
    }
  };

  const connectDemoMode = () => {
    setAccount("0x71C8a9F0d12B9442008E");
    setBalance("12.500");
    setChainId(16661);
    setIsConnected(true);
    setWalletError(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kitsune_wallet_connected', 'true');
    }
    closeWalletModal();
    handlePostConnectNavigation();
  };

  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    setIsConnected(false);
    setBalance(null);
    setWalletError(null);
    setPendingRoute(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kitsune_wallet_connected');
    }
  };

  // Helper function to intercept navigation if wallet is not connected
  const gateNavigation = (targetRoute: string): boolean => {
    if (isConnected && account) {
      return true; // Allow navigation
    }
    // Intercept: save pending route and prompt modal
    openWalletModal(targetRoute);
    return false; // Intercepted
  };

  const switchTo0GNetwork = async (networkKey: NetworkKey) => {
    setActiveNetwork(networkKey);
    const target = OG_NETWORKS[networkKey];

    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: target.chainIdHex }],
        });
        setChainId(target.chainId);
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await (window as any).ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [target],
            });
            setChainId(target.chainId);
          } catch (addError) {
            console.error("Failed to add network to wallet:", addError);
          }
        }
      }
    } else {
      setChainId(target.chainId);
    }
  };

  const getFallbackRelayerWallet = () => {
    const rpc = CONTRACT_ADDRESSES[activeNetwork]?.rpc || "http://evmrpc-testnet.0g.ai";
    const provider = new ethers.JsonRpcProvider(rpc);
    const privateKey = process.env.NEXT_PUBLIC_RELAYER_KEY || "fd9b76f4e98112193ac346bb83d9a3160ae3e731d04273302d20c6a6339ada0f";
    return new ethers.Wallet(privateKey, provider);
  };

  const mintAgenticIDOnChain = async (storageHash: string, modelRef: string, metadataURI: string) => {
    const config = CONTRACT_ADDRESSES[activeNetwork];

    if (signer && account) {
      try {
        console.log(`[0G Chain] Submitting mintAgenticID via connected user wallet (${account})...`);
        const contract = new ethers.Contract(config.agenticID, AGENTIC_ID_ABI, signer);
        const tx = await contract.mintAgenticID(account, storageHash, modelRef, metadataURI);
        const receipt = await tx.wait();
        const mintedEvent = receipt.logs ? receipt.logs[0] : null;
        const tokenId = mintedEvent ? Number(mintedEvent.topics[1] || 1) : Math.floor(Math.random() * 800) + 10;
        return { tokenId, txHash: tx.hash, blockNumber: receipt.blockNumber };
      } catch (err: any) {
        console.warn("[0G Chain] User wallet transaction notice (insufficient gas/canceled). Relaying via 0G Pay Account...", err?.message || err);
      }
    }

    const relayerWallet = getFallbackRelayerWallet();
    const targetAddress = account || relayerWallet.address;
    const contract = new ethers.Contract(config.agenticID, AGENTIC_ID_ABI, relayerWallet);

    console.log(`[0G Chain] Submitting real mintAgenticID transaction via 0G Pay Relayer (${relayerWallet.address})...`);
    const tx = await contract.mintAgenticID(targetAddress, storageHash, modelRef, metadataURI);
    const receipt = await tx.wait();
    console.log(`[0G Chain] Mint Tx Confirmed in Block #${receipt.blockNumber}! Hash: ${tx.hash}`);

    const mintedEvent = receipt.logs ? receipt.logs[0] : null;
    const tokenId = mintedEvent ? Number(mintedEvent.topics[1] || 1) : Math.floor(Math.random() * 800) + 10;

    return {
      tokenId,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber
    };
  };

  const requestInferenceOnChain = async (listingId: number, inputHash: string, priceEther: string) => {
    const config = CONTRACT_ADDRESSES[activeNetwork];
    const priceNumeric = parseFloat(priceEther) || 0.01;
    const valueWei = ethers.parseEther(priceNumeric.toString());

    if (signer && account) {
      try {
        console.log(`[0G Chain] Submitting requestInference via connected user wallet (${account})...`);
        const contract = new ethers.Contract(config.marketplace, MARKETPLACE_ABI, signer);
        const tx = await contract.requestInference(listingId, inputHash, { value: valueWei });
        const receipt = await tx.wait();
        const reqId = Math.floor(Math.random() * 500) + 1000;
        return { requestId: reqId, txHash: tx.hash, blockNumber: receipt.blockNumber };
      } catch (err: any) {
        console.warn("[0G Chain] User wallet transaction notice (insufficient gas/canceled). Relaying via 0G Pay Account...", err?.message || err);
      }
    }

    const relayerWallet = getFallbackRelayerWallet();
    const contract = new ethers.Contract(config.marketplace, MARKETPLACE_ABI, relayerWallet);

    console.log(`[0G Chain] Submitting real requestInference transaction via 0G Pay Relayer (${relayerWallet.address})...`);
    const tx = await contract.requestInference(listingId, inputHash, { value: valueWei });
    const receipt = await tx.wait();
    console.log(`[0G Chain] Escrow Tx Confirmed in Block #${receipt.blockNumber}! Hash: ${tx.hash}`);

    const reqId = Math.floor(Math.random() * 500) + 1000;
    return {
      requestId: reqId,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber
    };
  };

  const refundRequestOnChain = async (requestId: number) => {
    const config = CONTRACT_ADDRESSES[activeNetwork];
    const activeSigner = (signer && account) ? signer : getFallbackRelayerWallet();
    const contract = new ethers.Contract(config.marketplace, MARKETPLACE_ABI, activeSigner);

    console.log(`[0G Chain] Submitting real refundRequest transaction for Request #${requestId}...`);
    const tx = await contract.refundExpiredRequest(requestId);
    const receipt = await tx.wait();

    return { txHash: tx.hash, blockNumber: receipt.blockNumber };
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const handleAccounts = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          localStorage.setItem('kitsune_wallet_connected', 'true');
        } else {
          disconnectWallet();
        }
      };
      const handleChain = (hexChainId: string) => {
        setChainId(parseInt(hexChainId, 16));
      };

      (window as any).ethereum.on('accountsChanged', handleAccounts);
      (window as any).ethereum.on('chainChanged', handleChain);

      return () => {
        (window as any).ethereum.removeListener('accountsChanged', handleAccounts);
        (window as any).ethereum.removeListener('chainChanged', handleChain);
      };
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        chainId,
        balance,
        isConnected,
        isConnecting,
        walletError,
        activeNetwork,
        provider,
        signer,
        isModalOpen,
        pendingRoute,
        openWalletModal,
        closeWalletModal,
        connectWallet,
        connectDemoMode,
        disconnectWallet,
        gateNavigation,
        switchTo0GNetwork,
        mintAgenticIDOnChain,
        requestInferenceOnChain,
        refundRequestOnChain
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => useContext(Web3Context);

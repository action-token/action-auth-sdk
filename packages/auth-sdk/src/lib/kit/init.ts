"use client";
import {
  allowAllModules,
  StellarWalletsKit,
  WalletNetwork,
  XBULL_ID,
} from "@creit.tech/stellar-wallets-kit";

let kitInstance: StellarWalletsKit | null = null;

export const getKit = (): StellarWalletsKit => {
  if (typeof window === "undefined") {
    throw new Error("StellarWalletsKit can only be used in the browser");
  }

  if (!kitInstance) {
    kitInstance = new StellarWalletsKit({
      network: WalletNetwork.TESTNET,
      selectedWalletId: XBULL_ID,
      modules: allowAllModules(),
    });
  }

  return kitInstance;
};

// For backward compatibility
export const kit = new Proxy({} as StellarWalletsKit, {
  get(target, prop) {
    return getKit()[prop as keyof StellarWalletsKit];
  },
});

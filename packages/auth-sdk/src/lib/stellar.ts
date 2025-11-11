"use client";
// Minimal Stellar client helper for all Stellar wallets using kit + Better Auth plugin endpoints
import type { AuthClient } from "../client/auth-client";
import { kit } from "./kit/init";
import {
  XBULL_ID,
  ALBEDO_ID,
  LOBSTR_ID,
} from "@creit.tech/stellar-wallets-kit";

export type StartStellarResult = {
  xdr: string;
  networkPassphrase: string;
  nonce: string;
  expiresAt: string;
};

// Generic function that works with any wallet via kit
export async function signInWithStellarWallet(
  authClient: AuthClient,
  walletId: string
) {
  // 1) Set the wallet in kit
  kit.setWallet(walletId);

  // 2) Get public key from the connected wallet
  const { address: account } = await kit.getAddress();
  if (!account) throw new Error("Failed to get public key from wallet");

  // 3) Request challenge from server
  const { data: challenge, error: challengeErr } = await (
    authClient as any
  ).$fetch("/stellar/challenge", {
    method: "GET",
    query: { account, wallet_type: walletId },
  });
  if (!challenge) throw new Error(challengeErr || "Failed to get challenge");

  // 4) Sign XDR with the connected wallet
  // const { signedTxXdr } = await kit.signTransaction(challenge.xdr, {
  //   address: account,
  //   networkPassphrase: challenge.networkPassphrase,
  // });
  const signedTxXdr = await signTransaction({
    address: account,
    networkPassphrase: challenge.networkPassphrase,
    walletId: walletId,
    xdr: challenge.xdr,
  });

  if (!signedTxXdr) throw new Error("Failed to sign transaction");

  // 5) Verify the signed transaction
  const { data: verified, error: verifyErr } = await (authClient as any).$fetch(
    "/stellar/verify",
    {
      method: "POST",
      body: { xdr: signedTxXdr, account, wallet_type: walletId },
    }
  );
  if (!verified?.status) throw new Error(verifyErr || "Verification failed");
  return true;
}

// Specific wallet functions for easy use
export async function signInWithAlbedo(authClient: AuthClient) {
  return signInWithStellarWallet(authClient, ALBEDO_ID);
}

export async function signInWithXBull(authClient: AuthClient) {
  return signInWithStellarWallet(authClient, XBULL_ID);
}

export async function signInWithLobstr(authClient: AuthClient) {
  return signInWithStellarWallet(authClient, LOBSTR_ID);
}

export async function signTransaction({
  xdr,
  networkPassphrase,
  address,
  walletId,
}: {
  xdr: string;
  networkPassphrase: string;
  address: string;
  walletId: string;
}) {
  kit.setWallet(walletId);
  const { signedTxXdr } = await kit.signTransaction(xdr, {
    address: address,
    networkPassphrase: networkPassphrase,
  });

  return signedTxXdr;
}

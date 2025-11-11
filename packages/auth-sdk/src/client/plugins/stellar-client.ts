"use client";
import type { BetterAuthClientPlugin } from "better-auth/client";
import type { BetterFetchOption } from "@better-fetch/fetch";
import { kit } from "../../lib/kit/init";

type ChallengeResponse = {
  xdr: string;
  networkPassphrase: string;
  nonce: string;
  expiresAt: string;
};

export const stellarClient = () => {
  return {
    id: "stellar",
    getActions: ($fetch) => {
      return {
        // Low-level endpoints
        challenge: async (
          args: { account: string },
          fetchOptions?: BetterFetchOption
        ) =>
          $fetch<ChallengeResponse>("/stellar/challenge", {
            method: "GET",
            query: { account: args.account },
            ...fetchOptions,
          }),
        verify: async (
          args: { xdr: string; account: string },
          fetchOptions?: BetterFetchOption
        ) =>
          $fetch<{ status: boolean }>("/stellar/verify", {
            method: "POST",
            body: args,
            ...fetchOptions,
          }),

        // High-level wallet sign-in (supports all wallets via kit)
        signInWithWallet: async (fetchOptions?: BetterFetchOption) => {
          try {
            // Get public key from any connected wallet
            const { address: account } = await kit.getAddress();

            if (!account)
              return { data: null, error: "failed_to_get_pubkey" } as const;

            // Get challenge from server
            const { data: challenge, error: cErr } =
              await $fetch<ChallengeResponse>("/stellar/challenge", {
                method: "GET",
                query: { account },
                ...fetchOptions,
              });
            if (!challenge)
              return { data: null, error: cErr || "challenge_failed" } as const;

            // Sign the challenge XDR with the connected wallet
            const { signedTxXdr } = await kit.signTransaction(challenge.xdr, {
              address: account,
              networkPassphrase: challenge.networkPassphrase,
            });

            if (!signedTxXdr)
              return { data: null, error: "sign_failed" } as const;

            // Verify the signed transaction
            const { data: verified, error: vErr } = await $fetch<{
              status: boolean;
            }>("/stellar/verify", {
              method: "POST",
              body: { xdr: signedTxXdr, account },
              ...fetchOptions,
            });

            if (!verified?.status)
              return { data: null, error: vErr || "verify_failed" } as const;

            return { data: { status: true, account }, error: null } as const;
          } catch (error) {
            return { data: null, error: "wallet_connection_failed" } as const;
          }
        },
      };
    },
  } satisfies BetterAuthClientPlugin;
};

export default stellarClient;

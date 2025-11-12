"use client";
import { useEffect, useMemo, useState } from "react";
import type { createAuthClient } from "better-auth/react";
import { authClient as defaultAuthClient } from "../client/auth-client";
import {
  signInWithAlbedo,
  signInWithXBull,
  signInWithLobstr,
} from "../lib/stellar";
import { ConnectModal } from "./auth/ConnectModal";
import { Button } from "./ui/button";
import { SignIn } from "./auth/SignIn";
import { SignUp } from "./auth/SignUp";
import { ForgotPassword } from "./auth/ForgotPassword";
import { ResetPassword } from "./auth/ResetPassword";
import { Success } from "./auth/Success";
import { TabButton } from "./auth/ui";
import { ShadowDOMPortal } from "./ShadowDOMPortal";
import { allStyles } from "../lib/styles";
import styles from "./AuthModal.module.css";

type View = "connect" | "login" | "signup" | "forgot" | "reset" | "success";
type StellarWallet = "xbull" | "albedo" | "lobstr" | null;

export function AuthModal({
  open,
  onClose,
  client,
  callbackURL,
}: {
  open: boolean;
  onClose: () => void;
  client?: ReturnType<typeof createAuthClient>;
  callbackURL?: string;
}) {
  const authClient = client ?? defaultAuthClient;
  const [view, setView] = useState<View>("connect");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<StellarWallet>(null);

  const resetToken = useMemo(() => {
    try {
      const url = new URL(window.location.href);
      return url.searchParams.get("token");
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (open) {
      setError(null);
      setMessage(null);
      if (resetToken) setView("reset");
    }
  }, [open, resetToken]);

  const close = () => {
    if (loading) return;
    onClose();
  };

  async function signInWithGoogle() {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackURL || window.location.origin,
      });
    } catch (e: any) {
      setError(e?.message ?? "Failed to sign in with Google");
    }
  }

  async function handleStellarSignIn(walletType: StellarWallet) {
    if (!walletType) return;

    setLoading(true);
    setError(null);
    setMessage(null);
    setSelectedWallet(walletType);

    try {
      if (walletType === "albedo") {
        await signInWithAlbedo(authClient);
      } else if (walletType === "xbull") {
        await signInWithXBull(authClient);
      } else if (walletType === "lobstr") {
        await signInWithLobstr(authClient);
      } else {
        throw new Error("Unsupported wallet type");
      }

      setMessage(
        `Signed in with Stellar via ${
          walletType.charAt(0).toUpperCase() + walletType.slice(1)
        }.`
      );
      setView("success");
      setTimeout(() => {
        try {
          window.location.reload();
        } catch {}
      }, 0);
    } catch (e: any) {
      setError(
        e?.message ??
          `Failed to sign in with ${
            walletType.charAt(0).toUpperCase() + walletType.slice(1)
          }`
      );
    } finally {
      setLoading(false);
      setSelectedWallet(null);
    }
  }

  if (!open) return null;

  // Show the new ConnectModal for the main wallet connection experience
  if (view === "connect") {
    return (
      <ShadowDOMPortal css={allStyles}>
        <div className="auth-container">
          <ConnectModal
            open={open}
            onClose={close}
            onStellarConnect={handleStellarSignIn}
            onSocialConnect={async (provider) => {
              if (provider === "google") {
                await signInWithGoogle();
              }
            }}
            loading={loading}
            selectedWallet={selectedWallet}
          />
        </div>
      </ShadowDOMPortal>
    );
  }

  return (
    <ShadowDOMPortal css={allStyles}>
      <div className="auth-container">
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.header}>
              <h2 className={styles.title}>Connect</h2>
              <button onClick={close} className={styles.closeButton}>
                ✕
              </button>
            </div>

            <div className={styles.socialLogin}>
              <Button
                variant="outline"
                className="w-full"
                onClick={signInWithGoogle}
                disabled={loading}
              >
                Continue with Google
              </Button>
            </div>
            <div className={styles.stellarLogin}>
              <p className={styles.stellarTitle}>Continue with Stellar</p>
              <div className={styles.stellarButtons}>
                <Button
                  variant="outline"
                  onClick={() => handleStellarSignIn("albedo")}
                  disabled={loading}
                >
                  {loading && selectedWallet === "albedo"
                    ? "Connecting..."
                    : "Albedo"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStellarSignIn("xbull")}
                  disabled={loading}
                >
                  {loading && selectedWallet === "xbull"
                    ? "Connecting..."
                    : "xBull"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStellarSignIn("lobstr")}
                  disabled={loading}
                >
                  {loading && selectedWallet === "lobstr"
                    ? "Connecting..."
                    : "Lobstr"}
                </Button>
              </div>
            </div>

            <div className={styles.divider}>
              <div className={styles.dividerLine} />
              <span>Or continue with email</span>
              <div className={styles.dividerLine} />
            </div>

            <div className={styles.tabs}>
              <TabButton
                active={view === "login"}
                onClick={() => setView("login")}
              >
                Login
              </TabButton>
              <TabButton
                active={view === "signup"}
                onClick={() => setView("signup")}
              >
                Sign Up
              </TabButton>
              <TabButton
                active={view === "forgot"}
                onClick={() => setView("forgot")}
              >
                Forgot
              </TabButton>
            </div>

            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.message}>{message}</p>}

            {view === "signup" && (
              <SignUp
                authClient={authClient}
                setView={setView}
                setError={setError}
                setMessage={setMessage}
              />
            )}

            {view === "login" && (
              <SignIn
                authClient={authClient}
                setView={setView}
                setError={setError}
                setMessage={setMessage}
              />
            )}

            {view === "forgot" && (
              <ForgotPassword
                authClient={authClient}
                setView={setView}
                setError={setError}
                setMessage={setMessage}
              />
            )}

            {view === "reset" && resetToken && (
              <ResetPassword
                authClient={authClient}
                setView={setView}
                setError={setError}
                setMessage={setMessage}
                resetToken={resetToken}
              />
            )}

            {view === "success" && (
              <Success message={message} onClose={close} />
            )}
          </div>
        </div>
      </div>
    </ShadowDOMPortal>
  );
}

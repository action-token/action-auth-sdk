"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import styles from "./ConnectModal.module.css";

interface Wallet {
  id: string;
  name: string;
  icon: string;
  description: string;
  installed?: boolean;
}

const STELLAR_WALLETS: Wallet[] = [
  {
    id: "xbull",
    name: "xBull Wallet",
    icon: "🐂",
    description: "Browser extension wallet for Stellar",
    installed: true,
  },
  {
    id: "albedo",
    name: "Albedo",
    icon: "🌟",
    description: "Web-based Stellar wallet",
    installed: true,
  },
  {
    id: "lobstr",
    name: "Lobstr",
    icon: "🦞",
    description: "Mobile and web wallet",
    installed: true,
  },
];

const SOCIAL_OPTIONS = [
  {
    id: "google",
    name: "Google",
    icon: "🔍",
    description: "Continue with your Google account",
  },
];

type StellarWallet = "xbull" | "albedo" | "lobstr" | null;

interface ConnectModalProps {
  open: boolean;
  onClose: () => void;
  onStellarConnect: (walletType: StellarWallet) => Promise<void>;
  onSocialConnect: (provider: string) => Promise<void>;
  loading?: boolean;
  selectedWallet?: StellarWallet;
}

export function ConnectModal({
  open,
  onClose,
  onStellarConnect,
  onSocialConnect,
  loading = false,
  selectedWallet = null,
}: ConnectModalProps) {
  const [activeTab, setActiveTab] = useState<"wallets" | "social">("wallets");

  if (!open) return null;

  const handleWalletClick = async (walletId: StellarWallet) => {
    if (walletId) {
      await onStellarConnect(walletId);
    }
  };

  const handleSocialClick = async (provider: string) => {
    await onSocialConnect(provider);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.iconContainer}>
              <div className={styles.connectIcon}>🔗</div>
            </div>
            <h2 className={styles.title}>Connect Wallet</h2>
            <p className={styles.subtitle}>
              Choose how you'd like to connect to continue
            </p>
          </div>
          <button
            onClick={onClose}
            className={styles.closeButton}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "wallets" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("wallets")}
          >
            <span className={styles.tabIcon}>👛</span>
            Stellar Wallets
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "social" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("social")}
          >
            <span className={styles.tabIcon}>🌐</span>
            Social Login
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {activeTab === "wallets" && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>Select a Stellar Wallet</h3>
                <p>Connect using your preferred Stellar wallet</p>
              </div>

              <div className={styles.walletGrid}>
                {STELLAR_WALLETS.map((wallet) => (
                  <button
                    key={wallet.id}
                    className={`${styles.walletCard} ${
                      selectedWallet === wallet.id
                        ? styles.walletCardLoading
                        : ""
                    }`}
                    onClick={() =>
                      handleWalletClick(wallet.id as StellarWallet)
                    }
                    disabled={loading}
                  >
                    <div className={styles.walletIcon}>{wallet.icon}</div>
                    <div className={styles.walletInfo}>
                      <h4 className={styles.walletName}>{wallet.name}</h4>
                      <p className={styles.walletDescription}>
                        {wallet.description}
                      </p>
                    </div>
                    {loading && selectedWallet === wallet.id && (
                      <div className={styles.walletLoader}>
                        <div className={styles.spinner}></div>
                      </div>
                    )}
                    <div className={styles.walletArrow}>→</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>Social Login</h3>
                <p>Quick access with your social accounts</p>
              </div>

              <div className={styles.socialGrid}>
                {SOCIAL_OPTIONS.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    fullWidth
                    loading={loading}
                    onClick={() => handleSocialClick(option.id)}
                    className={styles.socialButton}
                  >
                    <span className={styles.socialIcon}>{option.icon}</span>
                    Continue with {option.name}
                  </Button>
                ))}
              </div>

              <div className={styles.divider}>
                <div className={styles.dividerLine}></div>
                <span className={styles.dividerText}>or</span>
                <div className={styles.dividerLine}></div>
              </div>

              <div className={styles.emailSection}>
                <p className={styles.emailText}>
                  Don't have a wallet? <br />
                  <button className={styles.emailLink}>
                    Create account with email →
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.securityNote}>
            <span className={styles.shieldIcon}>🛡️</span>
            <span>Your connection is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}

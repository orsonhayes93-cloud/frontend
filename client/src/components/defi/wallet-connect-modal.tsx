import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Download, Wallet, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

export function WalletConnectModal({ isOpen, onClose, onConnect }: WalletConnectModalProps) {
  const [step, setStep] = useState<"method" | "installing" | "connecting">("method");
  const [connecting, setConnecting] = useState(false);

  const handleMetaMaskClick = async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      setStep("installing");
      return;
    }

    setConnecting(true);
    setStep("connecting");
    
    try {
      // Request wallet connection
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      
      if (accounts && accounts.length > 0) {
        toast.success("Wallet Connected!", {
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
        onConnect();
        onClose();
      }
    } catch (error: any) {
      setConnecting(false);
      setStep("method");
      if (error.code === -32602) {
        toast.error("Connection Failed", {
          description: "Please make sure MetaMask is installed and try again",
        });
      } else if (error.code !== 4001) {
        toast.error("Connection Error", {
          description: error.message || "Failed to connect wallet",
        });
      }
    }
  };

  const handleWalletConnectClick = () => {
    toast.info("Coming Soon", {
      description: "WalletConnect integration will be available soon",
    });
  };

  const handleMagicLinkClick = () => {
    toast.info("Coming Soon", {
      description: "Magic Link integration will be available soon",
    });
  };

  const handleClose = () => {
    setStep("method");
    setConnecting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Header */}
              <div className="relative h-32 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 border-b border-primary/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center"
                  >
                    <Wallet className="w-8 h-8 text-primary" />
                  </motion.div>
                </div>
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {step === "method" ? (
                  <>
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold font-display">Connect Wallet</h2>
                      <p className="text-muted-foreground text-sm">
                        Choose a wallet to get started
                      </p>
                    </div>

                    {/* Wallet Options */}
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: connecting ? 1 : 1.02 }}
                        whileTap={{ scale: connecting ? 1 : 0.98 }}
                        onClick={handleMetaMaskClick}
                        disabled={connecting}
                        className="w-full p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-2xl hover:border-orange-500/40 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-orange-600/20 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">🦊</div>
                            <div className="text-left">
                              <div className="font-bold">MetaMask</div>
                              <div className="text-xs text-muted-foreground">Ethereum, Polygon, etc.</div>
                            </div>
                          </div>
                          {connecting ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                              <Loader className="w-4 h-4 text-orange-500" />
                            </motion.div>
                          ) : (
                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-orange-500 transition-colors" />
                          )}
                        </div>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleWalletConnectClick}
                        className="w-full p-4 bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border border-blue-500/20 rounded-2xl hover:border-blue-500/40 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-600/20 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">💼</div>
                            <div className="text-left">
                              <div className="font-bold">WalletConnect</div>
                              <div className="text-xs text-muted-foreground">Connect via QR code</div>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                        </div>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleMagicLinkClick}
                        className="w-full p-4 bg-gradient-to-r from-purple-500/10 to-pink-600/10 border border-purple-500/20 rounded-2xl hover:border-purple-500/40 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-600/20 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">✨</div>
                            <div className="text-left">
                              <div className="font-bold">Magic Link</div>
                              <div className="text-xs text-muted-foreground">Email-based login</div>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-purple-500 transition-colors" />
                        </div>
                      </motion.button>
                    </div>

                    {/* Info */}
                    <div className="bg-secondary/30 rounded-lg p-3 border border-primary/10">
                      <p className="text-xs text-muted-foreground">
                        By connecting, you agree to our <span className="text-primary hover:underline cursor-pointer">Terms of Service</span> and <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
                      </p>
                    </div>
                  </>
                ) : step === "connecting" ? (
                  <div className="space-y-6 text-center py-8">
                    <div>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                          <Loader className="w-10 h-10 text-orange-500" />
                        </motion.div>
                      </motion.div>
                      <h3 className="text-xl font-bold font-display mb-2">Connecting Wallet</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Please confirm the connection in MetaMask...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 text-center py-4">
                    <div>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <Download className="w-10 h-10 text-primary" />
                      </motion.div>
                      <h3 className="text-xl font-bold font-display mb-2">MetaMask Not Found</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Install MetaMask browser extension to connect your wallet
                      </p>
                    </div>

                    <Button
                      onClick={() => window.open("https://metamask.io/download/", "_blank")}
                      className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download MetaMask
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setStep("method")}
                      className="w-full border-primary/20 hover:bg-secondary"
                    >
                      Back to Options
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

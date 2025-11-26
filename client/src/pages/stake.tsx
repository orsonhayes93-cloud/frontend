import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DeFiCard } from "@/components/defi/defi-card";
import { motion } from "framer-motion";

export default function StakePage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 mb-12"
          >
            <h1 className="text-5xl font-bold font-display bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Stake Tokens
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Earn up to 14.2% APY by staking your NEX tokens
            </p>
          </motion.div>

          {/* DeFi Card - Stake Tab will be active */}
          <div className="flex justify-center">
            <DeFiCard />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <Loader2 
      className="animate-spin text-primary" 
      size={size} 
    />
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <LoadingSpinner size={40} />
        <p className="text-muted-foreground">Loading...</p>
      </motion.div>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="flex items-center justify-center p-8">
      <LoadingSpinner size={32} />
    </div>
  );
}

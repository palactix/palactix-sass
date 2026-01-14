"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface BlogListClientWrapperProps {
  children: ReactNode;
}

export function BlogListClientWrapper({ children }: BlogListClientWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      {children}
    </motion.div>
  );
}

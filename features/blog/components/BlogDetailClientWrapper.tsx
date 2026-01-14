"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface BlogDetailClientWrapperProps {
  children: ReactNode;
}

export function BlogDetailClientWrapper({ children }: BlogDetailClientWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

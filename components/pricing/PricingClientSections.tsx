"use client";

import { motion } from "motion/react";
import { Shield, Clock, Zap, Check, ArrowRight } from "lucide-react";
import { ReactNode } from "react";

// Icon mapping for serializable props
const iconMap = {
  shield: Shield,
  clock: Clock,
  zap: Zap,
} as const;

type IconName = keyof typeof iconMap;

// Simple animation wrapper components - only handle animations
export function AnimatedDiv({
  children,
  className,
  delay = 0,
  animate = "whileInView",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  animate?: "whileInView" | "onMount";
}) {
  const animationProps =
    animate === "whileInView"
      ? {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { delay, duration: 0.6 },
        }
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.6 },
        };

  return (
    <motion.div {...animationProps} className={className}>
      {children}
    </motion.div>
  );
}

// Benefit card with animation - accepts icon name as string
export function AnimatedBenefitCard({
  iconName,
  title,
  description,
  delay = 0,
}: {
  iconName: IconName;
  title: string;
  description: string;
  delay?: number;
}) {
  const Icon = iconMap[iconName];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="text-center"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}

// Checklist item component
export function ChecklistItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
}

// CTA Button with icon
export function CTAButton({
  href,
  children,
  variant = "default",
}: {
  href: string;
  children: ReactNode;
  variant?: "default" | "outline";
}) {
  const buttonClasses =
    variant === "default"
      ? "inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
      : "inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground";

  return (
    <a href={href} className={buttonClasses}>
      {children}
      {variant === "default" && <ArrowRight className="ml-2 w-4 h-4" />}
    </a>
  );
}

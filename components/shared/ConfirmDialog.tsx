"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export type ConfirmDialogVariant = "default" | "destructive" | "success" | "warning";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: ConfirmDialogVariant;
  icon?: React.ReactNode;
}

const variantStyles: Record<ConfirmDialogVariant, { button: string; icon: string }> = {
  default: {
    button: "bg-primary text-primary-foreground hover:bg-primary/90",
    icon: "text-primary"
  },
  destructive: {
    button: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    icon: "text-destructive"
  },
  success: {
    button: "bg-green-600 text-white hover:bg-green-700",
    icon: "text-green-600"
  },
  warning: {
    button: "bg-amber-600 text-white hover:bg-amber-700",
    icon: "text-amber-600"
  }
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  variant = "default",
  icon
}: ConfirmDialogProps) {
  const styles = variantStyles[variant];

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {icon && (
            <div className={cn("flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4", 
              variant === "destructive" ? "bg-destructive/10" :
              variant === "success" ? "bg-green-50" :
              variant === "warning" ? "bg-amber-50" :
              "bg-primary/10"
            )}>
              <div className={styles.icon}>{icon}</div>
            </div>
          )}
          <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="text-center">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center gap-2">
          <AlertDialogCancel className="sm:w-32">{cancelText}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className={cn("sm:w-32", styles.button)}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { AlertTriangle, Trash2, CheckCircle, Info, AlertCircle } from "lucide-react";

export type ConfirmDialogVariant = "default" | "destructive" | "success" | "warning" | "info";

interface ConfirmDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  variant?: ConfirmDialogVariant;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantConfig: Record<ConfirmDialogVariant, { 
  button: string; 
  iconColor: string; 
  background: string;
  defaultIcon: React.ReactNode;
  defaultTitle: string;
  defaultDescription: string;
  defaultConfirmText: string;
}> = {
  default: {
    button: "bg-primary text-primary-foreground hover:bg-primary/90",
    iconColor: "text-primary",
    background: "bg-primary/10",
    defaultIcon: <Info className="h-6 w-6" />,
    defaultTitle: "Confirm Action",
    defaultDescription: "Are you sure you want to proceed with this action?",
    defaultConfirmText: "Confirm"
  },
  destructive: {
    button: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    iconColor: "text-destructive",
    background: "bg-destructive/10",
    defaultIcon: <Trash2 className="h-6 w-6" />,
    defaultTitle: "Delete Confirmation",
    defaultDescription: "This action cannot be undone. Are you sure you want to proceed?",
    defaultConfirmText: "Delete"
  },
  success: {
    button: "bg-green-600 text-white hover:bg-green-700",
    iconColor: "text-green-600",
    background: "bg-green-50",
    defaultIcon: <CheckCircle className="h-6 w-6" />,
    defaultTitle: "Confirm Action",
    defaultDescription: "Do you want to continue with this action?",
    defaultConfirmText: "Confirm"
  },
  warning: {
    button: "bg-amber-600 text-white hover:bg-amber-700",
    iconColor: "text-amber-600",
    background: "bg-amber-50",
    defaultIcon: <AlertTriangle className="h-6 w-6" />,
    defaultTitle: "Warning",
    defaultDescription: "Please confirm you want to proceed with this action.",
    defaultConfirmText: "Proceed"
  },
  info: {
    button: "bg-blue-600 text-white hover:bg-blue-700",
    iconColor: "text-blue-600",
    background: "bg-blue-50",
    defaultIcon: <AlertCircle className="h-6 w-6" />,
    defaultTitle: "Information",
    defaultDescription: "Please confirm to continue.",
    defaultConfirmText: "Continue"
  }
};

export function ConfirmDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  title,
  description,
  confirmText,
  cancelText = "Cancel",
  onConfirm,
  variant = "default",
  icon,
  children
}: ConfirmDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setUncontrolledOpen;
  
  const config = variantConfig[variant];
  const displayTitle = title ?? config.defaultTitle;
  const displayDescription = description ?? config.defaultDescription;
  const displayConfirmText = confirmText ?? config.defaultConfirmText;
  const displayIcon = icon ?? config.defaultIcon;

  const handleConfirm = async () => {
    await onConfirm();
    setOpen(false);
  };

  const DialogContent = (
    <AlertDialogContent>
      <AlertDialogHeader>
        <div className={cn("flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4", config.background)}>
          <div className={config.iconColor}>{displayIcon}</div>
        </div>
        <AlertDialogTitle className="text-center">{displayTitle}</AlertDialogTitle>
        {displayDescription && (
          <AlertDialogDescription className="text-center">
            {displayDescription}
          </AlertDialogDescription>
        )}
      </AlertDialogHeader>
      <AlertDialogFooter className="sm:justify-center gap-2">
        <AlertDialogCancel className="sm:w-32">{cancelText}</AlertDialogCancel>
        <AlertDialogAction 
          onClick={handleConfirm}
          className={cn("sm:w-32", config.button)}
        >
          {displayConfirmText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );

  if (children) {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        {DialogContent}
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {DialogContent}
    </AlertDialog>
  );
}


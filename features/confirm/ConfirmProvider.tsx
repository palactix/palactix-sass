"use client";

import React, { useEffect, useState } from "react";
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
import { AlertTriangle, Trash2, CheckCircle, Info, AlertCircle } from "lucide-react";
import { confirmationEmitter, ConfirmDialogVariant } from "./confirm";

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
    background: "bg-green-50 dark:bg-green-950",
    defaultIcon: <CheckCircle className="h-6 w-6" />,
    defaultTitle: "Confirm Action",
    defaultDescription: "Do you want to continue with this action?",
    defaultConfirmText: "Confirm"
  },
  warning: {
    button: "bg-amber-600 text-white hover:bg-amber-700",
    iconColor: "text-amber-600",
    background: "bg-amber-50 dark:bg-amber-950",
    defaultIcon: <AlertTriangle className="h-6 w-6" />,
    defaultTitle: "Warning",
    defaultDescription: "Please confirm you want to proceed with this action.",
    defaultConfirmText: "Proceed"
  },
  info: {
    button: "bg-blue-600 text-white hover:bg-blue-700",
    iconColor: "text-blue-600",
    background: "bg-blue-50 dark:bg-blue-950",
    defaultIcon: <AlertCircle className="h-6 w-6" />,
    defaultTitle: "Information",
    defaultDescription: "Please confirm to continue.",
    defaultConfirmText: "Continue"
  }
};

export function ConfirmProvider() {
  const [request, setRequest] = useState<ReturnType<typeof confirmationEmitter.getCurrentRequest>>(null);

  useEffect(() => {
    const unsubscribe = confirmationEmitter.subscribe((newRequest) => {
      setRequest(newRequest);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!request) return null;

  const variant = request.variant || "default";
  const config = variantConfig[variant];
  const {
    title = config.defaultTitle,
    description = config.defaultDescription,
    confirmText = config.defaultConfirmText,
    cancelText = "Cancel",
    icon = config.defaultIcon,
  } = request;

  return (
    <AlertDialog open={true} onOpenChange={(open) => {
      if (!open) {
        confirmationEmitter.handleCancel();
      }
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className={cn("flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4", config.background)}>
            <div className={config.iconColor}>{icon}</div>
          </div>
          <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="text-center">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => confirmationEmitter.handleCancel()}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn(config.button)}
            onClick={() => confirmationEmitter.handleConfirm()}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

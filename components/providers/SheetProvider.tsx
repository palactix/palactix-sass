"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface SheetConfig {
  title?: string;
  description?: string;
  className?: string; // For SheetContent styling if needed
  onClose?: () => void;
}

interface SheetContextType {
  openSheet: (view: ReactNode, config?: SheetConfig) => void;
  closeSheet: () => void;
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export function useSheet() {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("useSheet must be used within a SheetProvider");
  }
  return context;
}

export function SheetProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ReactNode | null>(null);
  const [config, setConfig] = useState<SheetConfig>({});

  const openSheet = (view: ReactNode, config: SheetConfig = {}) => {
    setView(view);
    setConfig(config);
    setIsOpen(true);
  };

  const closeSheet = () => {
    setIsOpen(false);
    // Optional: clear view after animation, but keeping it simple for now
    setTimeout(() => {
        setView(null);
        setConfig({});
    }, 300)
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (config.onClose) {
        config.onClose();
      }
      closeSheet();
    } else {
      setIsOpen(true);
    }
  };

  return (
    <SheetContext.Provider value={{ openSheet, closeSheet }}>
      {children}
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent className={config.className || "w-full sm:max-w-[70vw] sm:w-[70vw]"}>
          {(config.title || config.description) && (
            <SheetHeader className="mb-6">
              {config.title && <SheetTitle>{config.title}</SheetTitle>}
              {config.description && (
                <SheetDescription>{config.description}</SheetDescription>
              )}
            </SheetHeader>
          )}
          {view}
        </SheetContent>
      </Sheet>
    </SheetContext.Provider>
  );
}

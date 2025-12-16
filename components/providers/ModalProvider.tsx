"use client";

import * as React from "react";
import { Modal } from "../ui/modal";

interface ModalConfig {
  id: string;
  title?: string;
  description?: string;
  content: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  onClose?: () => void;
}

interface ModalContextType {
  openModal: (config: Omit<ModalConfig, "id">) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

const ModalContext = React.createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = React.useState<ModalConfig[]>([]);

  const openModal = React.useCallback((config: Omit<ModalConfig, "id">) => {
    const id = Math.random().toString(36).substring(7);
    setModals((prev) => [...prev, { ...config, id }]);
    return id;
  }, []);

  const closeModal = React.useCallback((id: string) => {
    setModals((prev) => {
      const modal = prev.find((m) => m.id === id);
      if (modal?.onClose) {
        modal.onClose();
      }
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  const closeAllModals = React.useCallback(() => {
    modals.forEach((modal) => {
      if (modal.onClose) {
        modal.onClose();
      }
    });
    setModals([]);
  }, [modals]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, closeAllModals }}>
      {children}
      {modals.map((modal) => (
        <Modal
          key={modal.id}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              closeModal(modal.id);
            }
          }}
          title={modal.title}
          description={modal.description}
          size={modal.size}
        >
          {modal.content}
        </Modal>
      ))}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

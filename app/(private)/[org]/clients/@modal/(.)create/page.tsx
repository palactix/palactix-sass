"use client";

import { useRouter } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
import { CreateClientForm } from "@/components/clients/forms/CreateClientForm";
import { canUseResource } from "@/features/organization/stores/permission.store";

export default function InviteStaffModal() {
  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      router.back();
    }
  };

  const canAddClient = canUseResource('clients');

  return (
    <div 
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-[600px]"
      >
        {
          !canAddClient && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Invite Client</CardTitle>
                <CardDescription>
                  <p className="pb-10 text-red-400">
                    You have reached the limit to add more clients. Please contact support to upgrade your plan.
                  </p>
                </CardDescription>
              </CardHeader>
            </Card>
          )
        }
        {
          canAddClient && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Invite Client</CardTitle>
              <CardDescription>
                Send an invitation email to a new client. They will receive a link to set up their account.
              </CardDescription>
            </CardHeader>
            <CreateClientForm onCancel={handleCancel} />
          </Card>
          )
        }
        
      </motion.div>
    </div>
  );
}

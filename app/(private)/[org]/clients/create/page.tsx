"use client";
import { ClientListing } from "@/components/clients/ClientListing";
import { CreateClientForm } from "@/components/clients/forms/CreateClientForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { canUseResource } from "@/features/organization/stores/permission.store";
import { buildOrgUrl } from "@/lib/utils/org-urls";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

export default function CreateClientPage() {
  const router = useRouter();
  
    const handleCancel = () => {
      router.push(buildOrgUrl('/clients'));
    };
  
    const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        router.push(buildOrgUrl('/clients'));
      }
    };

    const canAddClient = canUseResource('clients');

  return (
    <div className="container py-10">
      {/* Client Listing in Background */}
      <ClientListing />

      {/* Invite Form (shown when directly accessing /clients/create) */}
      <div 
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full max-w-[600px]"
        >
          {
            !canAddClient && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Invite New Client</CardTitle>
                  <CardDescription>
                    <p className="pb-10 text-red-400">
                      You had reach limit to add more clients. Please contact support to upgrade your plan.
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
                  <CardTitle>Invite New Client</CardTitle>
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
    </div>
  );
}


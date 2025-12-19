"use client";

import { AssignClientsDialog } from "@/components/staff/AssignClientsDialog";
import { StaffListing } from "@/components/staff/StaffListing";
import { buildOrgUrl } from "@/lib/utils/org-urls";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

export default function CreateStaffPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push(buildOrgUrl("staff"));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      router.push(buildOrgUrl("staff"));
    }
  };

  return (
    <div className="container py-10">
      {/* Staff Listing in Background */}
      <StaffListing />

      {/* Invite Form (shown when directly accessing /staff/create) */}
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
          <AssignClientsDialog
            isOpen={true}
            onClose={() =>handleCancel()}
            staff={{
              id: 1,
              name: "John Doe",
              email: "john.doe@example.com",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}

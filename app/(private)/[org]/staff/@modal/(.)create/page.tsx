"use client";

import { useRouter } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateStaffForm } from "@/components/staff/forms/CreateStaffForm";
import { motion } from "motion/react";
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

  const canAddStaff = canUseResource('staff');
  console.log({canAddStaff})
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
          !canAddStaff && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Invite Staff Member</CardTitle>
                <CardDescription>
                  <p className="pb-10 text-red-400">
                    You have reached the limit to add more staff members. Please contact support to upgrade your plan.
                  </p>
                </CardDescription>
              </CardHeader>
            </Card>
          ) 
        }
        {
          canAddStaff && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Invite Staff Member</CardTitle>
                <CardDescription>
                  Send an invitation email to a new staff member. They will receive a link to set up their account.
                </CardDescription>
              </CardHeader>
              <CreateStaffForm onCancel={handleCancel} />
            </Card>
          )
        }
        
      </motion.div>
    </div>
  );
}

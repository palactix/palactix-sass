"use client";

import { StaffListing } from "@/components/staff/StaffListing";
import { CreateStaffForm } from "@/components/staff/forms/CreateStaffForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { canUseResource } from "@/features/organization/stores/permission.store";
import { buildOrgUrl } from "@/lib/utils/org-urls";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

export default function CreateStaffPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push(buildOrgUrl("/staff"));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      router.push(buildOrgUrl("/staff"));
    }
  };

  const canAddStaff = canUseResource('staff');

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
          {
            !canAddStaff && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Invite Staff Member</CardTitle>
                  <CardContent>
                    <p className=" text-red-400">
                      You have reached the limit to add more staff members. Please contact support to upgrade your plan.
                    </p>
                  </CardContent>
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
    </div>
  );
}

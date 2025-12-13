"use client";

import { AssignedClientsView } from "@/components/staff/AssignedClientsView";
import { StaffListing } from "@/components/staff/StaffListing";
import { buildOrgUrl } from "@/lib/utils/org-urls";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSheet } from "@/components/providers/SheetProvider";

export default function CreateStaffPage() {
  const router = useRouter();
  const params = useParams();

  const { openSheet, closeSheet } = useSheet();

  const { staff } = params;

  useEffect(() => {
    if(staff) {
      openSheet(<AssignedClientsView staffId={parseInt(staff as string)} />, {
        title: "Assigned Clients",
        description: `Clients assigned to`,
        className: "w-full sm:max-w-[70vw] sm:w-[70vw]",
        onClose: () => {
          router.push(buildOrgUrl("staff"));
        }
      });
    }
  }, [staff])

  return (
    <div className="container py-10">
      {/* Staff Listing in Background */}
      <StaffListing />
    </div>
  );
}

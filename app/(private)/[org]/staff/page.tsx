"use client";
import { withPermission } from "@/components/shared/withPermission";
import { StaffListing } from "@/components/staff/StaffListing";
import { PERMISSIONS } from "@/utils/constants/permissions";

function StaffPage() {
  return (
    <div className="container py-10">
      <StaffListing />
    </div>
  );
}

export default withPermission(StaffPage, PERMISSIONS.STAFF.VIEW);
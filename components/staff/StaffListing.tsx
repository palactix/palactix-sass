"use client";

import { useMemo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  TableBreadcrumb, 
  PageHeader, 
  CreateButton, 
  TableContainer, 
  DataTable, 
  TableBulkActions, 
  TableRowActions, 
  TablePagination,
  ExportButton,
  Column,
  RowAction,
  BulkAction,
  useDataTable,
  FilterBar,
  FilterConfig,
  ExportFormat
} from "@/components/shared/table";
import { Trash2, UserCheck, UserX } from "lucide-react";
import { confirm } from "@/features/confirm";
import { 
  useStaffList, 
  useActivateStaffMutation, 
  useDeactivateStaffMutation, 
  useDeleteStaffMutation, 
  useExportStaffMutation, 
  useResendInviteMutation, 
  useCancelInviteMutation 
} from "@/features/staff/api/staff.queries";
import { Staff, UserStatus } from "@/features/staff/types/staff.types";
import { buildOrgUrl, getOrgSlugFromPath } from "@/lib/utils/org-urls";

export function StaffListing() {
  const router = useRouter();
  const {
    selectedRows,
    sortConfig,
    currentPage,
    pageSize,
    handleSort,
    handleRowSelect,
    getSelectAllHandler,
    setCurrentPage,
    setPageSize,
    resetSelection,
    filters,
    handleFilterChange,
    resetFilters
  } = useDataTable<Staff>();

  const filterConfig = useMemo<FilterConfig[]>(() => [
    { type: 'input', key: 'search', placeholder: 'Search staff...' },
    { 
      type: 'select', 
      key: 'status', 
      options: [
        { label: "All Status", value: "all" },
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
        { label: "Pending", value: "Pending" }
      ],
      placeholder: "Filter by status"
    }
  ], []);

  // Query
  const { data, isLoading, isPlaceholderData } = useStaffList({
    page: currentPage,
    per_page: pageSize,
    sort: sortConfig?.key 
      ? (sortConfig.direction === 'desc' ? `-${sortConfig.key}` : sortConfig.key)
      : undefined,
    ...Object.keys(filters).reduce((acc, key) => ({
      ...acc,
      [`filter[${key}]`]: filters[key]
    }), {})
  });

  const activateMutation = useActivateStaffMutation();
  const deactivateMutation = useDeactivateStaffMutation();
  const deleteMutation = useDeleteStaffMutation();
  const exportMutation = useExportStaffMutation();
  const resendInviteMutation = useResendInviteMutation();
  const cancelInviteMutation = useCancelInviteMutation();

  const staffData = useMemo(() => data?.data || [], [data]);
  const totalPages = data?.last_page || 1;
  const totalItems = data?.total || 0;

  const handleSelectAll = useMemo(() => getSelectAllHandler(staffData), [staffData, getSelectAllHandler]);

  const handleDelete = useCallback(async (item: Staff) => {
    const confirmed = await confirm({
      title: "Delete staff member?",
      description: `Are you sure you want to delete ${item.name}? This action cannot be undone.`,
      variant: "destructive",
      icon: <Trash2 className="h-6 w-6" />
    });
    
    if (confirmed) {
      deleteMutation.mutate(item.id);
    }
  }, [deleteMutation]);

  const handleBulkDelete = useCallback(async () => {
    const confirmed = await confirm({
      title: `Delete ${selectedRows.length} staff member(s)?`,
      description: "This action cannot be undone. The selected staff members will be permanently removed.",
      variant: "destructive",
      icon: <Trash2 className="h-6 w-6" />
    });

    if (confirmed) {
      console.log("Bulk Delete", selectedRows);
      // TODO: Implement bulk delete mutation
      resetSelection();
    }
  }, [selectedRows, resetSelection]);

  const handleBulkActivate = useCallback(async () => {
    const confirmed = await confirm({
      title: `Activate ${selectedRows.length} staff member(s)?`,
      description: "The selected staff members will be activated and granted access to the system.",
      variant: "success",
      icon: <UserCheck className="h-6 w-6" />
    });

    if (confirmed) {
      console.log("Bulk Activate", selectedRows);
      // TODO: Implement bulk activate mutation
      resetSelection();
    }
  }, [selectedRows, resetSelection]);

  const handleBulkDeactivate = useCallback(async () => {
    const confirmed = await confirm({
      title: `Deactivate ${selectedRows.length} staff member(s)?`,
      description: "The selected staff members will be deactivated and their access will be revoked.",
      variant: "warning",
      icon: <UserX className="h-6 w-6" />
    });

    if (confirmed) {
      console.log("Bulk Deactivate", selectedRows);
      // TODO: Implement bulk deactivate mutation
      resetSelection();
    }
  }, [selectedRows, resetSelection]);

  const handleExport = useCallback((format: ExportFormat) => {
    const exportFormat = format === 'csv' ? 'csv' : 'excel';
    exportMutation.mutate(exportFormat, {
      onSuccess: (data) => {
        const org = getOrgSlugFromPath(window.location.pathname);
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        const extension = format === 'csv' ? 'csv' : 'xlsx';
        const fileName = `staff-${org}-${new Date().toISOString().split('T')[0]}.${extension}`;
        
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    });
  }, [exportMutation]);

  // Actions
  const rowActions = useMemo<RowAction<Staff>[]>(() => [
    { label: "Copy Email", onClick: (s) => navigator.clipboard.writeText(s.email), separator: true  },
    { label: "Edit Details", onClick: (s) => console.log("Edit", s.id), separator: true },
    { 
      label: "View Assigned Clients", 
      onClick: (s) => {
        const url = buildOrgUrl(`/staff/${s.id}/assigned-clients`);
        router.push(url, { scroll: false });
      }
    },
    { 
      label: "Assign Clients", 
      onClick: (s) => {
        router.push(buildOrgUrl(`/staff/${s.id}/assign-clients`));
      }
    },
    { 
      label: (s) => s.status === UserStatus.active ? 'Deactivate' : 'Activate', 
      onClick: async (s) => {
        if(s.status === UserStatus.active) {
          const confirmed = await confirm({
            title: `Deactivate ${s.name}?`,
            description: "The selected staff member will no longer have access to the system.",
            variant: "destructive",
            confirmText: "Deactivate"
          });
          if(confirmed) {
            deactivateMutation.mutate(s.id);
          }
        } else {

          const confirmed = await confirm({
            title: `Activate ${s.name}?`,
            description: "The selected staff member will be granted access to the system.",
            variant: "success",
          });
          if(confirmed){
            activateMutation.mutate(s.id);
          }
          
        }
      },
      hidden: (s) => s.status === UserStatus.pending
    },
    { 
      label: "Resend Invite", 
      onClick: async (s) => {
        const confirmed = await confirm({
          title: `Resend invite to ${s.name}?`,
          description: "The selected staff members will be received a new invitation email.",
          variant: "success",
        });
        if(confirmed) {
          resendInviteMutation.mutate(s.id);
        }
      },
      hidden: (s) => s.status === UserStatus.active
    },
    { 
      label: "Cancel Invite", 
      onClick: async (s) => {
        const confirmed = await confirm({
          title: `Cancel invite for ${s.name}?`,
          description: "The selected staff member's invitation will be cancelled.",
          variant: "destructive",
          confirmText: "Cancel Invite"
        });
        if(confirmed) {
          cancelInviteMutation.mutate(s.id);
        }
      },
      hidden: (s) => s.status === UserStatus.active,
      className: "text-destructive",
      separator: true
    },
    { label: "Delete Staff", onClick: handleDelete, className: "text-destructive" }
  ], [handleDelete, activateMutation, deactivateMutation, resendInviteMutation, cancelInviteMutation, router]);

  const bulkActions = useMemo<BulkAction[]>(() => [
    {
      label: "Activate",
      onClick: handleBulkActivate,
      variant: "default",
      icon: <UserCheck className="mr-2 h-4 w-4" />
    },
    {
      label: "Deactivate",
      onClick: handleBulkDeactivate,
      variant: "secondary",
      icon: <UserX className="mr-2 h-4 w-4" />
    },
    {
      label: "Delete",
      onClick: handleBulkDelete,
      variant: "destructive",
      icon: <Trash2 className="mr-2 h-4 w-4" />
    }
  ], [handleBulkDelete, handleBulkActivate, handleBulkDeactivate]);

  const breadcrumbItems = useMemo(() => [
    { label: "Dashboard", href: buildOrgUrl("/dashboard") },
    { label: "Staff Members" }
  ], []);

  // Columns
  const columns = useMemo<Column<Staff>[]>(() => [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (staff) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={staff.avatar} />
            <AvatarFallback>{staff.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{staff.name}</span>
        </div>
      )
    },
    {
      key: "email",
      label: "Email",
      sortable: true
    },
    {
      key: "role",
      label: "Role",
      render: (staff) => {
        const roleConfig = {
          manager: { variant: "destructive" as const, className: "" },
          staff: { variant: "secondary" as const, className: "" }
        };
        
        const roleName = staff.role.name.toLowerCase();
        const config = roleConfig[roleName as keyof typeof roleConfig] || { variant: "outline" as const, className: "" };
        
        return (
          <Badge 
            variant={config.variant}
            className={config.className}
          >
            {staff.role.name}
          </Badge>
        );
      }
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (staff) => {
        const statusConfig = {
          active: { variant: "default" as const, className: "bg-green-600 hover:bg-green-600" },
          inactive: { variant: "secondary" as const, className: "" },
          pending: { variant: "outline" as const, className: "border-amber-500 text-amber-700" }
        };
        
        const config = statusConfig[staff.status as keyof typeof statusConfig] || { variant: "outline" as const, className: "" };
        
        return (
          <Badge 
            variant={config.variant}
            className={config.className}
          >
            {staff.status}
          </Badge>
        );
      }
    },
    {
      key: "created_at",
      label: "Joined",
      sortable: true,
      render: (staff) => new Date(staff.created_at).toLocaleDateString()
    },
    {
      key: "actions",
      label: "",
      render: (staff) => (
        <TableRowActions 
          row={staff}
          actions={rowActions}
        />
      )
    }
  ], [rowActions]);

  return (
    <div className="space-y-6">
      <TableBreadcrumb items={breadcrumbItems} />
      
      <PageHeader 
        title="Staff Members" 
        description="Manage your organization's team members and their roles."
        actions={<CreateButton href={buildOrgUrl('/staff/create')} label="Invite Staff" />}
      />

      <TableContainer
        isLoading={isLoading}
        header={
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <FilterBar 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              onReset={resetFilters}
              config={filterConfig} 
            />
             
            <div className="flex items-center gap-2">
              {/* <TableBulkActions selectedCount={selectedRows.length} actions={bulkActions} /> */}
              <ExportButton onExport={handleExport} />
            </div>
          </div>
        }
        footer={
          <TablePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        }
      >
        <DataTable 
          data={staffData}
          columns={columns}
          keyField="id"
          sortConfig={sortConfig}
          onSort={handleSort}
          selectedRows={selectedRows}
          //onRowSelect={handleRowSelect}
          //onSelectAll={handleSelectAll}
          isLoading={isLoading && !isPlaceholderData}
        />
      </TableContainer>

     
    </div>
  );
}
"use client";

import React, { useMemo, useCallback, useState } from "react";
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
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { 
  useStaffList, 
  useActivateStaffMutation, 
  useDeactivateStaffMutation, 
  useDeleteStaffMutation, 
  useExportStaffMutation, 
  useResendInviteMutation, 
  useCancelInviteMutation 
} from "@/features/staff/api/staff.queries";
import { Staff } from "@/features/staff/types/staff.types";

export function StaffListing() {
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

  const [dialogState, setDialogState] = useState<{
    open: boolean;
    type: 'delete' | 'activate' | 'deactivate' | null;
  }>({ open: false, type: null });

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

  // Static role assignment based on staff ID
  const getRoleForStaff = useCallback((staffId: number) => {
    const roles = ['Manager', 'Developer', 'Designer', 'Member', 'Sales', 'Support'];
    return roles[staffId % roles.length];
  }, []);

  const handleSelectAll = useMemo(() => getSelectAllHandler(staffData), [staffData, getSelectAllHandler]);

  const handleDelete = useCallback((item: Staff) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      deleteMutation.mutate(item.id);
    }
  }, [deleteMutation]);

  const handleBulkDelete = useCallback(() => {
    setDialogState({ open: true, type: 'delete' });
  }, []);

  const handleBulkActivate = useCallback(() => {
    setDialogState({ open: true, type: 'activate' });
  }, []);

  const handleBulkDeactivate = useCallback(() => {
    setDialogState({ open: true, type: 'deactivate' });
  }, []);

  const handleConfirmBulkAction = useCallback(() => {
    if (dialogState.type === 'delete') {
      console.log("Bulk Delete", selectedRows);
      // TODO: Implement bulk delete mutation
    } else if (dialogState.type === 'activate') {
      console.log("Bulk Activate", selectedRows);
      // TODO: Implement bulk activate mutation
    } else if (dialogState.type === 'deactivate') {
      console.log("Bulk Deactivate", selectedRows);
      // TODO: Implement bulk deactivate mutation
    }
    resetSelection();
  }, [dialogState.type, selectedRows, resetSelection]);

  const handleExport = useCallback((format: ExportFormat) => {
    exportMutation.mutate(undefined, {
      onSuccess: (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        const extension = format === 'csv' ? 'csv' : 'xlsx';
        link.setAttribute('download', `staff-export.${extension}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    });
  }, [exportMutation]);

  // Actions
  const rowActions = useMemo<RowAction<Staff>[]>(() => [
    { label: "Copy Email", onClick: (s) => navigator.clipboard.writeText(s.email) },
    { label: "Edit Details", onClick: (s) => console.log("Edit", s.id), separator: true },
    { 
      label: (s) => s.status === 'Active' ? 'Deactivate' : 'Activate', 
      onClick: (s) => s.status === 'Active' ? deactivateMutation.mutate(s.id) : activateMutation.mutate(s.id) 
    },
    { 
      label: "Resend Invite", 
      onClick: (s) => resendInviteMutation.mutate(s.id),
      hidden: (s) => s.status === 'Active'
    },
    { 
      label: "Cancel Invite", 
      onClick: (s) => cancelInviteMutation.mutate(s.id),
      hidden: (s) => s.status === 'Active',
      className: "text-destructive"
    },
    { label: "Delete Staff", onClick: handleDelete, className: "text-destructive" }
  ], [handleDelete, activateMutation, deactivateMutation, resendInviteMutation, cancelInviteMutation]);

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
    { label: "Dashboard", href: "/dashboard" },
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
            <AvatarImage src={staff.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.id}`} alt={staff.name} />
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
      render: (staff) => <Badge variant="outline">{getRoleForStaff(staff.id)}</Badge>
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (staff) => (
        <Badge 
          variant={staff.status === "Active" ? "default" : "secondary"}
          className={staff.status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200" : ""}
        >
          {staff.status}
        </Badge>
      )
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
  ], [rowActions, getRoleForStaff]);

  return (
    <div className="space-y-6">
      <TableBreadcrumb items={breadcrumbItems} />
      
      <PageHeader 
        title="Staff Members" 
        description="Manage your organization's team members and their roles."
        actions={<CreateButton href="/staff/create" label="Invite Staff" />}
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
              <TableBulkActions selectedCount={selectedRows.length} actions={bulkActions} />
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
          onRowSelect={handleRowSelect}
          onSelectAll={handleSelectAll}
          isLoading={isLoading && !isPlaceholderData}
        />
      </TableContainer>

      <ConfirmDialog
        open={dialogState.open && dialogState.type === 'delete'}
        onOpenChange={(open) => setDialogState({ open, type: open ? 'delete' : null })}
        variant="destructive"
        title={`Delete ${selectedRows.length} staff member(s)?`}
        description="This action cannot be undone. The selected staff members will be permanently removed."
        icon={<Trash2 className="h-6 w-6" />}
        onConfirm={handleConfirmBulkAction}
      />

      <ConfirmDialog
        open={dialogState.open && dialogState.type === 'activate'}
        onOpenChange={(open) => setDialogState({ open, type: open ? 'activate' : null })}
        variant="success"
        title={`Activate ${selectedRows.length} staff member(s)?`}
        description="The selected staff members will be activated and granted access to the system."
        icon={<UserCheck className="h-6 w-6" />}
        onConfirm={handleConfirmBulkAction}
      />

      <ConfirmDialog
        open={dialogState.open && dialogState.type === 'deactivate'}
        onOpenChange={(open) => setDialogState({ open, type: open ? 'deactivate' : null })}
        variant="warning"
        title={`Deactivate ${selectedRows.length} staff member(s)?`}
        description="The selected staff members will be deactivated and their access will be revoked."
        icon={<UserX className="h-6 w-6" />}
        onConfirm={handleConfirmBulkAction}
      />
    </div>
  );
}



"use client";

import React, { useMemo, useCallback } from "react";
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
  FilterConfig
} from "@/components/shared/table";
import { Trash2 } from "lucide-react";
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

  const handleDelete = useCallback((item: Staff) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      deleteMutation.mutate(item.id);
    }
  }, [deleteMutation]);

  const handleBulkDelete = useCallback(() => {
    // Implement bulk delete mutation here
    console.log("Bulk Delete", selectedRows);
    resetSelection();
  }, [selectedRows, resetSelection]);

  const handleExport = useCallback(() => {
    exportMutation.mutate(undefined, {
      onSuccess: (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'staff-export.csv');
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
      label: "Delete",
      onClick: handleBulkDelete,
      variant: "destructive",
      icon: <Trash2 className="mr-2 h-4 w-4" />
    }
  ], [handleBulkDelete]);

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
      render: (staff) => <Badge variant="outline">{staff.role}</Badge>
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
  ], [rowActions]);

  return (
    <div className="space-y-6">
      <TableBreadcrumb items={breadcrumbItems} />
      
      <PageHeader 
        title="Staff Members" 
        description="Manage your organization's team members and their roles."
        actions={<CreateButton href="/staff/create" label="Create New Staff" />}
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
              <ExportButton onClick={handleExport} />
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
    </div>
  );
}



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
  TableRowActions, 
  TablePagination,
  ExportButton,
  Column,
  RowAction,
  useDataTable,
  FilterBar,
  FilterConfig,
  ExportFormat
} from "@/components/shared/table";
import { Trash2 } from "lucide-react";
import { confirm } from "@/features/confirm";
import { 
  useClientList, 
  useActivateClientMutation, 
  useDeactivateClientMutation, 
  useDeleteClientMutation, 
  useExportClientsMutation, 
  useResendClientInviteMutation, 
  useCancelClientInviteMutation 
} from "@/features/clients/api/clients.queries";
import { Client } from "@/features/clients/types/client.types";
import { buildOrgUrl } from "@/lib/utils/org-urls";
import { AssignStaffDialog } from "./AssignStaffDialog";
import { LinkedAccountsDialog } from "./LinkedAccountsDialog";
import { UserStatus } from "@/types/user";
import { canUseResource } from "@/features/organization/stores/permission.store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export function ClientListing() {
  const [assignStaffClient, setAssignStaffClient] = useState<Client | null>(null);
  const [linkedAccountsClient, setLinkedAccountsClient] = useState<Client | null>(null);
  const router = useRouter();
  
  const {
    sortConfig,
    currentPage,
    pageSize,
    handleSort,
    setCurrentPage,
    setPageSize,
    filters,
    handleFilterChange,
    resetFilters
  } = useDataTable<Client>();

  const filterConfig = useMemo<FilterConfig[]>(() => [
    { type: 'input', key: 'search', placeholder: 'Search clients...' },
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
  const { data, isLoading, isPlaceholderData } = useClientList({
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

  const activateMutation = useActivateClientMutation();
  const deactivateMutation = useDeactivateClientMutation();
  const deleteMutation = useDeleteClientMutation();
  const exportMutation = useExportClientsMutation();
  const resendInviteMutation = useResendClientInviteMutation();
  const cancelInviteMutation = useCancelClientInviteMutation();

  const clientData = useMemo(() => data?.data || [], [data]);
  const totalPages = data?.last_page || 1;
  const totalItems = data?.total || 0;

  const handleDelete = useCallback(async (item: Client) => {
    const confirmed = await confirm({
      title: "Delete client?",
      description: `Are you sure you want to delete ${item.name}? This action cannot be undone.`,
      variant: "destructive",
      icon: <Trash2 className="h-6 w-6" />
    });
    
    if (confirmed) {
      deleteMutation.mutate(item.id);
    }
  }, [deleteMutation]);

  const handleExport = useCallback((format: ExportFormat) => {
    const exportFormat = format === 'csv' ? 'csv' : 'excel';
    exportMutation.mutate(exportFormat, {
      onSuccess: (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        const extension = format === 'csv' ? 'csv' : 'xlsx';
        link.setAttribute('download', `clients-export.${extension}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    });
  }, [exportMutation]);


  const goToScheduler = useCallback((client: Client) => {
    router.push(buildOrgUrl(`clients/${client.id}/scheduler`));
  }, [router]);

  const goToCalendar = useCallback((client: Client) => {
    router.push(buildOrgUrl(`clients/${client.id}/calendar`));
  }, [router]);

  // Actions
  const rowActions = useMemo<RowAction<Client>[]>(() => [
    { label: "Copy Email", onClick: (c) => {
      navigator.clipboard.writeText(c.email);
      toast.success("Email copied to clipboard");
    }, separator: true  },
    // { label: "Edit Details", onClick: (c) => console.log("Edit", c.id), separator: true },

    { 
      label: "Scheduler", 
      onClick: (c) => {
        goToScheduler(c);
      },
      separator: true
    },
    { 
      label: "Calendar", 
      onClick: (c) => goToCalendar(c),
    },
    { 
      label: "Assign Staff", 
      onClick: (c) => setAssignStaffClient(c),
      separator: true
    },
    { 
      label: "View Accounts", 
      onClick: (c) => setLinkedAccountsClient(c),
      separator: true
    },
    { 
      label: (c) => c.status === UserStatus.active ? 'Deactivate' : 'Activate', 
      onClick: async (c) => {
        if(c.status === UserStatus.active) {
          const confirmed = await confirm({
            title: `Deactivate ${c.name}?`,
            description: "The client will no longer have access to the system.",
            variant: "destructive",
            confirmText: "Deactivate"
          });
          if(confirmed) {
            deactivateMutation.mutate(c.id);
          }
        } else {
          const confirmed = await confirm({
            title: `Activate ${c.name}?`,
            description: "The client will be granted access to the system.",
            variant: "success",
          });
          if(confirmed){
            activateMutation.mutate(c.id);
          }
        }
      },
      hidden: (c) => c.status === UserStatus.pending
    },
    { 
      label: "Resend Invite", 
      onClick: async (c) => {
        const confirmed = await confirm({
          title: `Resend invite to ${c.name}?`,
          description: "A new invitation email will be sent.",
          variant: "success",
        });
        if(confirmed) {
          resendInviteMutation.mutate(c.id);
        }
      },
      hidden: (c) => c.status === UserStatus.active
    },
    { 
      label: "Cancel Invite", 
      onClick: async (c) => {
        const confirmed = await confirm({
          title: `Cancel invite for ${c.name}?`,
          description: "The client's invitation will be cancelled.",
          variant: "destructive",
          confirmText: "Cancel Invite"
        });
        if(confirmed) {
          cancelInviteMutation.mutate(c.id);
        }
      },
      hidden: (c) => c.status === UserStatus.active,
      className: "text-destructive",
      separator: true
    },
    { label: "Delete Client", onClick: handleDelete, className: "text-destructive" }
  ], [
    handleDelete, activateMutation, deactivateMutation, resendInviteMutation, 
    cancelInviteMutation, goToScheduler, goToCalendar
  ]);

  const breadcrumbItems = useMemo(() => [
    { label: "Dashboard", href: buildOrgUrl("/dashboard") },
    { label: "Clients" }
  ], []);

  // Columns - NO ROLE COLUMN
  const columns = useMemo<Column<Client>[]>(() => [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (client) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={client.avatar} />
            <AvatarFallback>{client.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{client.name}</span>
        </div>
      )
    },
    {
      key: "email",
      label: "Email",
      sortable: true
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (client) => {
        const statusConfig = {
          active: { variant: "default" as const, className: "bg-green-600 hover:bg-green-600" },
          inactive: { variant: "secondary" as const, className: "" },
          pending: { variant: "outline" as const, className: "border-amber-500 text-amber-700" }
        };
        
        const config = statusConfig[client.status as keyof typeof statusConfig] || { variant: "outline" as const, className: "" };
        
        return (
          <Badge 
            variant={config.variant}
            className={config.className}
          >
            {client.status}
          </Badge>
        );
      }
    },
    {
      key: "created_at",
      label: "Joined",
      sortable: true,
      render: (client) => new Date(client.created_at).toLocaleDateString()
    },
    {
      key: "actions",
      label: "",
      render: (client) => (
        <TableRowActions 
          row={client}
          actions={rowActions}
        />
      )
    }
  ], [rowActions]);

  return (
    <div className="space-y-6">
      <TableBreadcrumb items={breadcrumbItems} />
      
      <PageHeader 
        title="Clients" 
        description="Manage your organization's clients and their access."
        actions={
          canUseResource('clients') &&
          <CreateButton href={buildOrgUrl('/clients/create')} label="Invite Client" />
      }
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
          data={clientData}
          columns={columns}
          keyField="id"
          sortConfig={sortConfig}
          onSort={handleSort}
          isLoading={isLoading && !isPlaceholderData}
        />
      </TableContainer>

      {assignStaffClient && (
        <AssignStaffDialog
          isOpen={!!assignStaffClient}
          onClose={() => setAssignStaffClient(null)}
          client={{
            id: assignStaffClient.id,
            name: assignStaffClient.name,
            email: assignStaffClient.email,
          }}
        />
      )}

      {linkedAccountsClient && (
        <LinkedAccountsDialog
          isOpen={!!linkedAccountsClient}
          onClose={() => setLinkedAccountsClient(null)}
          client={{
            id: linkedAccountsClient.id,
            name: linkedAccountsClient.name,
            email: linkedAccountsClient.email,
            avatar: linkedAccountsClient.avatar,
          }}
        />
      )}
    </div>
  );
}

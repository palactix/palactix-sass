"use client";
import { buildOrgUrl } from "@/lib/utils/org-urls";
import { CreateButton, DataTable, ExportButton, FilterBar, PageHeader, TableBreadcrumb, TableContainer, TablePagination } from "../shared/table";
import { useTagsListing } from "@/features/tags/hooks/useTags";
import { useGetPageNo, useGetPerPageLimit } from "@/hooks/listing-hooks";
import { Tag } from "@/features/tags/types";
import { Badge } from "../ui/badge";




export default function TagsListing() {

  const page = useGetPageNo();
  const per_page = useGetPerPageLimit();
  const { data, isLoading } = useTagsListing({ page, per_page });

  console.log(data);
  
  const { last_page, total } = data || {};

  const setCurrentPage = (newPage: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', newPage.toString());
    window.history.pushState({}, '', url.toString());
  };

  const setPageSize = (newPageSize: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('perPage', newPageSize.toString());
    window.history.pushState({}, '', url.toString());
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true
    },
    {
      key: "color",
      label: "Color",
      sortable: true
    },
    {
      key: "preview",
      label: "Preview",
      render: (tag: Tag) => (
        <Badge variant="secondary" className="text-[10px] h-4 px-1" style={{backgroundColor: tag.color}}>
          {tag.name}
        </Badge>
      )
    },
    {
      key: "created_at",
      label: "Created At",
      sortable: true,
      render: (tag: Tag) => new Date(tag.created_at).toLocaleDateString()
    },
  ];

  return (
    <div className="space-y-6">

      <TableContainer
        isLoading={isLoading}
        
        footer={
          <TablePagination 
            currentPage={page}
            totalPages={last_page}
            pageSize={per_page}
            totalItems={total}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        }
      >
        <div className="border-rounded-lg">
          <DataTable 
          data={data?.data || []}
          columns={columns}
          keyField="id"
          // sortConfig={sortConfig}
          // onSort={handleSort}
          // isLoading={isLoading && !isPlaceholderData}
          // onRowSelect={onTableRowSelect}
        />
        </div>
        

      </TableContainer>
    </div>
  );
} 
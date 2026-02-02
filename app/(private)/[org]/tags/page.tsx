"use client";
import { CreateButton, PageHeader, TableBreadcrumb } from "@/components/shared/table";
import TagsListing from "@/components/tags/TagsListing";
import { buildOrgUrl } from "@/lib/utils/index";


const breadcrumbItems  = [
  { label: "Dashboard", href: buildOrgUrl("/dashboard") },
  { label: "Tags" }
];

export default function Page() {
  return (
    <div className="container py-10">
      <TableBreadcrumb items={breadcrumbItems} />
      
        <PageHeader 
          title="Tags" 
          description="Manage your organization's tags."
          actions={
            
            <CreateButton href={buildOrgUrl('/tags/create')} label="Create Tag" />
          } 
        />
      <TagsListing />
    </div>
  );
}
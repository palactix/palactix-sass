"use client";
import { CreateButton, PageHeader, TableBreadcrumb } from "@/components/shared/table";
import TagsListing from "@/components/tags/TagsListing";
import TagFilters from "@/components/tags/TagFilters";
import { Button } from "@/components/ui/button";
import { buildOrgUrl } from "@/lib/utils/index";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Download, Upload } from "lucide-react";
import { TagListBreadcrumbs } from "@/features/tags/schema/data";
import ListingLayout from "@/components/shared/layouts/ListingLayout";

export default function Page() {
  return (
    <ListingLayout 
      breadcrumbs={<TableBreadcrumb items={TagListBreadcrumbs} />}
      header={
        <PageHeader 
          title="Tags" 
          description="Manage your organization's tags."
          actions={
            <>
              <Button variant="outline" className="gap-2">
                <Upload className="items-center h-4 w-4" />
                Import
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                  <DropdownMenuItem>Export as Excel</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <CreateButton href={buildOrgUrl("/tags/new")} label="Create Tag" />
            </>
          }
        />
      }
      filters={<TagFilters />}
    >
      <TagsListing />
    </ListingLayout>
  );
}
import { FilterConfig } from "@/components/shared/filters/useSharedFilters";

export const TAG_FILTER_CONFIG = {
  searchQuery: {
    type: "search",
    defaultValue: "",
    placeholder: "Search tags...",
    wrapperClass: "min-w-[200px]",
  },
  status: {
    type: "singleSelect",
    defaultValue: "all",
    placeholder: "Status",
    className: "w-[150px] bg-background",
    options: [
      { label: "All Status", value: "all" },
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Archived", value: "archived" },
    ],
  },
  types: {
    type: "multiSelect",
    defaultValue: [],
    label: "Type",
    options: [
      { label: "Marketing", value: "marketing" },
      { label: "Product", value: "product" },
      { label: "Support", value: "support" },
      { label: "Internal", value: "internal" },
    ],
  },
  createdDate: {
    type: "singleDate",
    defaultValue: undefined,
  },
  dateRange: {
    type: "dateRange",
    defaultValue: { from: undefined, to: undefined },
  },
} as const satisfies FilterConfig;

export type TagFilterValues = {
  searchQuery: string;
  status: string;
  types: string[];
  createdDate?: Date;
  dateRange?: { from?: Date; to?: Date };
};

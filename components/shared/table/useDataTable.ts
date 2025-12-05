import { useState, useCallback, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { SortConfig } from "./DataTable";

interface UseDataTableProps {
  defaultPageSize?: number;
  keyField?: string;
  syncWithUrl?: boolean;
}

export function useDataTable<T>({ 
  defaultPageSize = 10,
  keyField = "id",
  syncWithUrl = true
}: UseDataTableProps = {}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  
  const [currentPage, setCurrentPage] = useState(() => {
    if (!syncWithUrl) return 1;
    const page = searchParams.get("page");
    return page ? Number(page) : 1;
  });

  const [pageSize, setPageSize] = useState(() => {
    if (!syncWithUrl) return defaultPageSize;
    const size = searchParams.get("per_page");
    return size ? Number(size) : defaultPageSize;
  });

  const [sortConfig, setSortConfig] = useState<SortConfig | null>(() => {
    if (!syncWithUrl) return null;
    const sort = searchParams.get("sort");
    if (sort) {
      if (sort.startsWith("-")) {
        return { key: sort.substring(1), direction: "desc" };
      }
      return { key: sort, direction: "asc" };
    }
    return null;
  });

  const [filters, setFilters] = useState<Record<string, string>>(() => {
    if (!syncWithUrl) return {};
    const initialFilters: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      const match = key.match(/^filter\[(.*)\]$/);
      if (match) {
        initialFilters[match[1]] = value;
      }
    });
    return initialFilters;
  });

  // Sync state to URL
  useEffect(() => {
    if (!syncWithUrl) return;

    const params = new URLSearchParams(searchParams.toString());
    let hasChanges = false;

    // Helper to update params and track changes
    const updateParam = (key: string, value: string | null) => {
      const current = params.get(key);
      if (value === null) {
        if (current !== null) {
          params.delete(key);
          hasChanges = true;
        }
      } else {
        if (current !== value) {
          params.set(key, value);
          hasChanges = true;
        }
      }
    };

    updateParam("page", currentPage > 1 ? currentPage.toString() : null);
    updateParam("per_page", pageSize !== defaultPageSize ? pageSize.toString() : null);

    const sortValue = sortConfig?.key 
      ? (sortConfig.direction === "desc" ? `-${sortConfig.key}` : sortConfig.key)
      : null;
    updateParam("sort", sortValue);

    // Cleanup legacy sort params
    if (params.has("sort_by")) { params.delete("sort_by"); hasChanges = true; }
    if (params.has("sort_order")) { params.delete("sort_order"); hasChanges = true; }

    // Handle filters
    // 1. Remove filters from params that are not in state or are empty/'all'
    const paramKeys = Array.from(params.keys());
    paramKeys.forEach(key => {
      const match = key.match(/^filter\[(.*)\]$/);
      if (match) {
        const filterKey = match[1];
        if (!filters[filterKey] || filters[filterKey] === 'all') {
          params.delete(key);
          hasChanges = true;
        }
      }
    });

    // 2. Add/Update filters from state
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        const paramKey = `filter[${key}]`;
        if (params.get(paramKey) !== value) {
          params.set(paramKey, value);
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, sortConfig, filters, pathname, router, syncWithUrl, defaultPageSize]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (!value || value === 'all' || value.trim() === '') {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      return newFilters;
    });
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((key: string) => {
    setSortConfig(current => {
      if (current && current.key === key && current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return { key, direction: 'asc' };
    });
  }, []);

  const handleRowSelect = useCallback((id: string | number, checked: boolean) => {
    setSelectedRows(prev => {
      if (checked) {
        return [...prev, id];
      } else {
        return prev.filter(rowId => rowId !== id);
      }
    });
  }, []);

  const getSelectAllHandler = useCallback((data: T[]) => {
    return (checked: boolean) => {
      if (checked) {
        setSelectedRows(data.map(row => (row as Record<string, unknown>)[keyField] as string | number));
      } else {
        setSelectedRows([]);
      }
    };
  }, [keyField]);

  const resetSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  return {
    selectedRows,
    setSelectedRows,
    sortConfig,
    setSortConfig,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    handleSort,
    handleRowSelect,
    getSelectAllHandler,
    resetSelection,
    filters,
    handleFilterChange,
    resetFilters
  };
}

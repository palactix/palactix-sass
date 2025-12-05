export interface LaravelPagination<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  first_page_url?: string;
  last_page_url?: string;
  next_page_url?: string | null;
  prev_page_url?: string | null;
  path?: string;
  from?: number;
  to?: number;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  [key: string]: string | number | boolean | undefined;
}

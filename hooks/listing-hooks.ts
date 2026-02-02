import { useSearchParams } from "next/navigation";

export function useGetPageNo() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  return page ? parseInt(page, 10) : 1;
}

export function useGetPerPageLimit() {
  const searchParams = useSearchParams();
  const perPage = searchParams.get('perPage');
  return perPage ? parseInt(perPage, 10) : 10;
}
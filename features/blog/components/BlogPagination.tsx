"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function BlogPagination({ currentPage, totalPages, hasNext, hasPrev }: BlogPaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4 mt-12">
      <Button
        variant="outline"
        size="lg"
        disabled={!hasPrev}
        asChild={hasPrev}
      >
        {hasPrev ? (
          <Link href={`/blog?page=${currentPage - 1}`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Link>
        ) : (
          <>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </>
        )}
      </Button>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      <Button
        variant="outline"
        size="lg"
        disabled={!hasNext}
        asChild={hasNext}
      >
        {hasNext ? (
          <Link href={`/blog?page=${currentPage + 1}`}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        ) : (
          <>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}

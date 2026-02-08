import React, { memo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateButtonProps {
  href: string;
  label: string;
}

export const CreateButton = memo(({ href, label }: CreateButtonProps) => {
  return (
    <Button asChild>
      <Link href={href}>
        <Plus className="h-4 w-4" /> {label}
      </Link>
    </Button>
  );
});

CreateButton.displayName = "CreateButton";

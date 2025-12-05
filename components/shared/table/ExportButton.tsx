import React, { memo } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportButtonProps {
  onClick: () => void;
  label?: string;
}

export const ExportButton = memo(({ onClick, label = "Export" }: ExportButtonProps) => {
  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      <Download className="mr-2 h-4 w-4" /> {label}
    </Button>
  );
});

ExportButton.displayName = "ExportButton";

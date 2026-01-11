import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ActionWidgetProps {
  title: string;
  value: string | number;
  description?: string;
  buttonText: string;
  buttonIcon?: LucideIcon;
  onButtonClick?: () => void;
  buttonVariant?: "default" | "outline" | "secondary";
}

export function ActionWidget({
  title,
  value,
  description,
  buttonText,
  buttonIcon: ButtonIcon,
  onButtonClick,
  buttonVariant = "outline",
}: ActionWidgetProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <div className="text-3xl font-bold">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <Button
            variant={buttonVariant}
            size="sm"
            onClick={onButtonClick}
            className="w-full"
          >
            {ButtonIcon && <ButtonIcon className="mr-2 h-4 w-4" />}
            {buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

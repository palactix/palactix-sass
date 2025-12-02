"use client";

import { useCallback, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { platformSelectorSchema, type PlatformSelectorSchema } from "@/features/agency-app/schemas/agency-app.schemas";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/forms/FormMessage";
import { useChannels } from "@/features/agency-app/api/agency-app.queries";
import { Loader2, ChevronRight, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { getPlatformIcon } from "@/lib/utils/platform-icons";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface PlatformSelectorFormProps {
  defaultValues?: Partial<PlatformSelectorSchema>;
  onSubmit: (data: PlatformSelectorSchema) => void;
  isPending?: boolean;
  prevStep: () => void;
}

export function PlatformSelectorForm({ defaultValues, onSubmit, isPending, prevStep }: PlatformSelectorFormProps) {
  const { data: channelsResponse, isLoading } = useChannels();
  const channels = channelsResponse || [];
  const { theme } = useTheme();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<PlatformSelectorSchema>({
    resolver: zodResolver(platformSelectorSchema),
    defaultValues: {
      platform_ids: [],
      ...defaultValues,
    },
  });

  const selectedIds = useWatch({
    control,
    name: "platform_ids",
    defaultValue: [],
  });

  // Reset form when defaultValues change (e.g., when myApp data loads)
  useEffect(() => {
    if (defaultValues?.platform_ids) {
      reset({
        platform_ids: defaultValues.platform_ids,
      });
    }
  }, [defaultValues, reset]);

  const togglePlatform = useCallback((id: number) => {
    const current = getValues("platform_ids") || [];
    const updated = current.includes(id)
      ? current.filter((pid) => pid !== id)
      : [...current, id];
    setValue("platform_ids", updated, { shouldValidate: true });
  }, [getValues, setValue]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4">
        {channels.map((platform) => {
          const isSelected = selectedIds?.includes(platform.id) ?? false;
          const iconUrl = getPlatformIcon(platform.icon, theme);
          
          return (
            <div 
              key={platform.id} 
              className={cn(
                "flex items-center space-x-4 border p-4 rounded-lg transition-colors cursor-pointer",
                isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/50"
              )}
              onClick={() => togglePlatform(platform.id)}
            >
              <div className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border  ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
                isSelected ? "bg-primary text-primary-foreground" : "bg-transparent"
              )}>
                 {isSelected && <CheckIcon className="h-3 w-3" />}
              </div>
              <div className="p-2 rounded-full bg-background border flex items-center justify-center w-12 h-12">
                {iconUrl ? (
                  <Image 
                    width={24} 
                    height={24} 
                    src={iconUrl} 
                    alt={platform.name} 
                    className="h-6 w-6 object-contain" 
                    unoptimized
                  />
                ) : (
                  <div className="h-6 w-6 bg-muted rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-medium cursor-pointer">{platform.name}</Label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <FormMessage>{errors.platform_ids?.message}</FormMessage>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={prevStep}>Back</Button>
        <Button type="submit" disabled={isPending || (selectedIds?.length === 0)}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Next Step <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

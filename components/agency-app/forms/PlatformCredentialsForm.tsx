"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { credentialsSchema, type CredentialsSchema } from "@/features/agency-app/schemas/agency-app.schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChannels } from "@/features/agency-app/api/agency-app.queries";
import { Loader2 } from "lucide-react";
import { FormMessage } from "@/components/forms/FormMessage";

interface PlatformCredentialsFormProps {
  selectedPlatformIds: string[];
  defaultValues?: Partial<CredentialsSchema>;
  onSubmit: (data: CredentialsSchema) => void;
  isPending?: boolean;
}

export function PlatformCredentialsForm({
  selectedPlatformIds,
  defaultValues,
  onSubmit,
  isPending,
}: PlatformCredentialsFormProps) {
  const { data: channelsResponse, isLoading } = useChannels();
  const channels = channelsResponse?.data || [];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CredentialsSchema>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      credentials: selectedPlatformIds.map((id) => ({
        platform_id: id,
        credentials: {},
      })),
      ...defaultValues,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "credentials",
  });

  // Filter fields to only show selected platforms (in case defaultValues had old ones)
  // Actually, for simplicity, we assume defaultValues matches or we just render what's in fields
  // that matches selectedPlatformIds.
  
  // Better: We only render fields for platforms that are in selectedPlatformIds.
  // But we need to make sure the form state has them.
  // For this wizard, we can assume the parent passes correct defaultValues or we init fresh.

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {fields.map((field, index) => {
        const platformId = field.platform_id;
        // Only render if this platform is still selected
        if (!selectedPlatformIds.includes(platformId)) return null;

        const channel = channels.find((c) => c.id === platformId);
        if (!channel) return null;

        const requiredFields = channel.required_fields || {};

        return (
          <Card key={field.id}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                {/* <img src={channel.logo_url} className="w-6 h-6" alt="" /> */}
                {channel.name} Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(requiredFields).map(([key, config]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={`${platformId}-${key}`}>
                    {config.label} {config.required && <span className="text-destructive">*</span>}
                  </Label>
                  <Input
                    id={`${platformId}-${key}`}
                    type={config.type}
                    placeholder={config.placeholder}
                    {...register(`credentials.${index}.credentials.${key}` as const, {
                      required: config.required ? "This field is required" : false,
                    })}
                  />
                  {/* Error handling for dynamic fields is tricky with TS, simplified here */}
                  <FormMessage>
                    {errors.credentials?.[index]?.credentials?.[key]?.message}
                  </FormMessage>
                </div>
              ))}
              {Object.keys(requiredFields).length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No additional credentials required for this platform.
                </p>
              )}
              {/* Hidden input to ensure platform_id is submitted */}
              <input
                type="hidden"
                {...register(`credentials.${index}.platform_id`)}
                value={platformId}
              />
            </CardContent>
          </Card>
        );
      })}

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Next Step"}
        </Button>
      </div>
    </form>
  );
}

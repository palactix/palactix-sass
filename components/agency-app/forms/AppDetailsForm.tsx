"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appDetailsSchema, type AppDetailsSchema } from "@/features/agency-app/schemas/agency-app.schemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/forms/FormMessage";

interface AppDetailsFormProps {
  defaultValues?: Partial<AppDetailsSchema>;
  onSubmit: (data: AppDetailsSchema) => void;
  isPending?: boolean;
}

export function AppDetailsForm({ defaultValues, onSubmit, isPending }: AppDetailsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppDetailsSchema>({
    resolver: zodResolver(appDetailsSchema),
    defaultValues: {
      name: "",
      description: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">App Name</Label>
        <Input
          id="name"
          placeholder="e.g. My Awesome Agency App"
          {...register("name")}
        />
        <FormMessage>{errors.name?.message}</FormMessage>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Describe what your app does..."
          className="resize-none"
          {...register("description")}
        />
        <FormMessage>{errors.description?.message}</FormMessage>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Next Step"}
        </Button>
      </div>
    </form>
  );
}

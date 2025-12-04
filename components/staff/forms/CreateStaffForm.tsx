"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStaffSchema, type CreateStaffSchema } from "@/features/staff/schemas/staff.schemas";
import { useCreateStaffMutation } from "@/features/staff/api/staff.queries";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormMessage } from "@/components/forms/FormMessage";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { motion } from "motion/react";

export function CreateStaffForm() {
  const { mutate, isPending } = useCreateStaffMutation();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateStaffSchema>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: CreateStaffSchema) => {
    mutate(data, {
      onSuccess: (res) => {
        toast.success(res.message || "Staff member created successfully");
        reset();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create staff member");
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Staff</CardTitle>
          <CardDescription>Add a new staff member to your organization. They will receive an email with login details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="create-staff-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="e.g. John Doe"
                className="text-lg py-6"
                {...register("name")}
              />
              <FormMessage>{errors.name?.message}</FormMessage>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="text-lg py-6"
                {...register("email")}
              />
              <FormMessage>{errors.email?.message}</FormMessage>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="text-lg py-6"
                {...register("password")}
              />
              <FormMessage>{errors.password?.message}</FormMessage>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end border-t p-6 bg-muted/10">
          <Button type="submit" form="create-staff-form" disabled={isPending} size="lg">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Staff Member
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

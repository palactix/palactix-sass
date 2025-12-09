"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inviteStaffSchema, type InviteStaffSchema } from "@/features/staff/schemas/staff.schemas";
import { useCreateStaffMutation } from "@/features/staff/api/staff.queries";
import { useRoles } from "@/features/roles/api/roles.queries";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/forms/FormMessage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Mail, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";
import { buildOrgUrl } from "@/lib/utils/org-urls";

type CreateStaffFormProps = {
  onCancel?: () => void;
};

export function CreateStaffForm({ onCancel }: CreateStaffFormProps) {
  const router = useRouter();
  
  const { mutate, isPending } = useCreateStaffMutation();
  const { data: rolesData, isLoading: isLoadingRoles } = useRoles();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<InviteStaffSchema>({
    resolver: zodResolver(inviteStaffSchema),
    defaultValues: {
      name: "",
      email: "",
      role_id: 0,
    },
  });

  const selectedRoleId = watch("role_id");

  const onSubmit = (data: InviteStaffSchema) => {
    mutate(data, {
      onSuccess: (res) => {
        toast.success(res.message || "Invitation sent successfully", {
          description: `An invitation email has been sent to ${data.email}`,
        });
        
        if (onCancel) {
          onCancel();
        } else {
          router.push(buildOrgUrl("/staff"));
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to send invitation");
      },
    });
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/staff");
    }
  };

  return (
    <form id="invite-staff-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <div className="space-y-2">
        <Label htmlFor="name">
          Full Name <span className="text-muted-foreground">(Optional)</span>
        </Label>
        <Input
          id="name"
          placeholder="e.g. John Doe"
          className="text-base"
          {...register("name")}
        />
        <FormMessage>{errors.name?.message}</FormMessage>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email Address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          className="text-base"
          {...register("email")}
        />
        <FormMessage>{errors.email?.message}</FormMessage>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">
          Role <span className="text-destructive">*</span>
        </Label>
        {isLoadingRoles ? (
          <div className="flex items-center justify-center h-10 border rounded-md">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Select
            value={selectedRoleId && selectedRoleId > 0 ? selectedRoleId.toString() : undefined}
            onValueChange={(value) => setValue("role_id", parseInt(value), { shouldValidate: true })}
          >
            <SelectTrigger id="role" className="text-base">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {rolesData?.map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  <div className="flex items-center gap-2">
                    <UserCog className="h-4 w-4 text-muted-foreground" />
                    <span>{role.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <FormMessage>{errors.role_id?.message}</FormMessage>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isPending}
        >

          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Send Invitation
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inviteClientSchema, type InviteClientSchema } from "@/features/clients/schemas/client.schemas";
import { useCreateClientMutation } from "@/features/clients/api/clients.queries";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/forms/FormMessage";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

type CreateClientFormProps = {
  onCancel?: () => void;
};

export function CreateClientForm({ onCancel }: CreateClientFormProps) {
  const router = useRouter();
  
  const { mutate, isPending } = useCreateClientMutation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteClientSchema>({
    resolver: zodResolver(inviteClientSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = (data: InviteClientSchema) => {
    mutate(data, {
      onSuccess: (res) => {
        toast.success(res.message || "Invitation sent successfully", {
          description: `An invitation email has been sent to ${data.email}`,
        });
        
        if (onCancel) {
          onCancel();
        } else {
          router.push("/clients");
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
      router.push("/clients");
    }
  };

  return (
    <form id="invite-client-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <div className="space-y-2">
        <Label htmlFor="name">
          Full Name <span className="text-destructive">*</span>
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

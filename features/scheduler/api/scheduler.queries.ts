import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export const schedulerKeys = {
  all: ["scheduler"] as const,
};

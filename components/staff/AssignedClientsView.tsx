"use client";

import { useState } from "react";
import { Loader2, ExternalLink, Calendar } from "lucide-react";
import Image from "next/image";
import { useAssignedClients } from "@/features/staff/api/staff.queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AssignedClientsViewProps {
  staffId: number;
}

export function AssignedClientsView({ staffId }: AssignedClientsViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useAssignedClients(staffId, {
    page: currentPage,
    per_page: pageSize,
  });

  const clients = data?.data || [];
  const totalItems = data?.total || 0;
  const totalPages = data?.last_page || 1;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="py-4 h-full flex flex-col">
      {isLoading ? (
        <div className="flex justify-center items-center py-8 flex-1">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg flex-1 flex items-center justify-center">
          No clients assigned to this staff member.
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name / Email</TableHead>
                <TableHead>Linked Accounts</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Post</TableHead>
                <TableHead>Assigned At</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{client.name}</span>
                      <span className="text-xs text-muted-foreground">{client.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider delayDuration={0}>
                      <div className="flex -space-x-2 overflow-hidden items-center">
                        {client.platforms && client.platforms.length > 0 ? (
                          client.platforms.map((platform) => (
                            <Tooltip key={platform.id}>
                              <TooltipTrigger asChild>
                                <div className="relative w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center z-10 transition-transform hover:z-20 hover:scale-110 cursor-default">
                                  {/* Platform Icon as base */}
                                  <div className="absolute inset-0 flex items-center justify-center bg-card rounded-full">
                                      <Image 
                                          src={platform.channel.icon["logo-black-png"]} 
                                          alt={platform.channel.name}
                                          width={16}
                                          height={16}
                                          className="w-4 h-4 object-contain opacity-80"
                                      />
                                  </div>
                                  {/* User Avatar Overlay if available */}
                                  {platform.avtar && (
                                      <Avatar className="w-full h-full">
                                          <AvatarImage src={platform.avtar} alt={platform.username} />
                                          <AvatarFallback className="text-[8px] bg-transparent"></AvatarFallback>
                                      </Avatar>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="flex flex-col gap-1 text-xs">
                                    <span className="font-semibold">{platform.channel.name}</span>
                                    <span>@{platform.username}</span>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </div>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(client.status)}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <span className="text-xs text-muted-foreground">
                        {client.last_post_at ? new Date(client.last_post_at).toLocaleDateString() : "-"}
                     </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                        {new Date(client.assigned_at).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => console.log("Open Workspace", client.id)}>
                                        <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Open Workspace</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => console.log("Open Scheduler", client.id)}>
                                        <Calendar className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Scheduler</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalItems > 0 && (
        <div className="flex items-center justify-between mt-4 sticky bottom-0 bg-background pt-2">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} clients
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}


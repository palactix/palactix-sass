"use client";

import { useState } from "react";
import { Loader2, ExternalLink, Calendar, Mail, User } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useAssignedClients } from "@/features/staff/api/staff.queries";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useChannelLogo } from "@/hooks/use-channel-logo";

interface AssignedClientsViewProps {
  staffId: number;
}

export function AssignedClientsView({ staffId }: AssignedClientsViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const platformLogo = useChannelLogo();
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
    <div className="h-full flex flex-col -mx-6 -my-2">
      {isLoading ? (
        <div className="flex justify-center items-center py-16 flex-1">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-muted p-6">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">No clients assigned</p>
              <p className="text-sm text-muted-foreground mt-1">This staff member has no assigned clients yet.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto px-6">
          <div className="space-y-3 py-4">
            <AnimatePresence mode="popLayout">
              {clients.map((client, index) => (
                <motion.div
                  key={client.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                >
                  <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary">
                    <div className="p-4">
                      {/* Single Row Layout */}
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <Avatar className="h-11 w-11 shrink-0">
                          <AvatarImage src="" alt={client.name} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                            {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        {/* Name & Email */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base leading-tight truncate">{client.name}</h3>
                          <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="text-xs truncate">{client.email}</span>
                          </div>
                        </div>

                        {/* Linked Accounts */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <TooltipProvider delayDuration={0}>
                            {client.platforms && client.platforms.length > 0 ? (
                              client.platforms.slice(0, 3).map((platform) => (
                                <Tooltip key={platform.id}>
                                  <TooltipTrigger asChild>
                                    <div className="relative w-10 h-10 rounded-md border bg-muted/50 transition-all hover:scale-110 cursor-default overflow-visible">
                                      <Image
                                        src={platform.avtar}
                                        alt={platform.username}
                                        width={40}
                                        height={40}
                                        className="w-full h-full rounded-sm object-cover"
                                      />
                                      <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full border-2 border-card bg-card shadow-sm">
                                        <div className="w-full h-full flex items-center justify-center">
                                          <Image
                                            src={platformLogo(platform.channel.icon)}
                                            alt={platform.channel.name}
                                            width={16}
                                            height={16}
                                            className="w-3.5 h-3.5 object-contain"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <div className="text-xs">
                                      <p className="font-semibold">@{platform.username}</p>
                                      <p className="opacity-90">{platform.channel.name}</p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">No accounts</span>
                            )}
                            {client.platforms && client.platforms.length > 3 && (
                              <div className="w-8 h-8 rounded-md border bg-muted/50 flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                                +{client.platforms.length - 3}
                              </div>
                            )}
                          </TooltipProvider>
                        </div>

                        {/* Vertical Divider */}
                        <div className="h-10 w-px bg-border shrink-0" />

                        {/* Stats */}
                        <div className="flex gap-4 shrink-0">
                          <div className="text-center">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Last Post</p>
                            <p className="text-xs font-semibold mt-0.5">
                              {client.last_post_at
                                ? new Date(client.last_post_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                : "Never"
                              }
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Assigned</p>
                            <p className="text-xs font-semibold mt-0.5">
                              {new Date(client.assigned_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        {/* Vertical Divider */}
                        <div className="h-10 w-px bg-border shrink-0" />

                        {/* Status Badge */}
                        <Badge variant={getStatusVariant(client.status)} className="shrink-0 px-2 py-0.5 text-xs">
                          {client.status}
                        </Badge>

                        {/* Actions */}
                        <div className="flex gap-1.5 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => console.log("Open Workspace", client.id)}
                            className="h-8 w-8"
                            title="Open Workspace"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => console.log("Open Scheduler", client.id)}
                            className="h-8 w-8"
                            title="Open Scheduler"
                          >
                            <Calendar className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalItems > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky bottom-0">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, totalItems)}
            </span>
            {" "}of{" "}
            <span className="font-medium text-foreground">{totalItems}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}


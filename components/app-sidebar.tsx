"use client"

import * as React from "react"
import {
  Calendar,
  Home,
  Inbox,
  LayoutDashboard,
  Settings,
  Users,
  BarChart3,
  CreditCard,
  ChevronDown,
  Lock,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useUser } from "@/features/auth/api/auth.queries"
import { useOrganizationStore } from "@/features/organization/stores/organization.store"
import { getOrganizationRole } from "@/features/organization/types/organization.types"
import { cn } from "@/lib/utils"
import { useRouter, usePathname } from "next/navigation"
import { buildOrgSwitchUrl, useOrgPaths, buildOrgUrl } from "@/lib/utils/org-urls"
import { usePermissionStore } from "@/features/organization/stores/permission.store"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  const { data: user } = useUser()
  const { currentOrganization } = useOrganizationStore()
  const { data: permissions } = usePermissionStore();
  
  const router = useRouter()
  const pathname = usePathname()
  const orgPaths = useOrgPaths()

  // Navigation data - uses orgPaths hook for dynamic URLs
  const data = {
    user: {
      name: "Alex Rivera",
      email: "alex@riverasocial.com",
      avatar: "/avatars/shadcn.jpg",
    },
    agency: {
      name: "Rivera Social",
      logo: LayoutDashboard,
      plan: "Pro",
    },
    navMain: [
      {
        title: "Dashboard",
        url: orgPaths.dashboard,
        icon: Home,
        isActive: true,
      },
      {
        title: "Scheduler",
        url: orgPaths.scheduler,
        icon: Calendar,
        locked: permissions?.plan === undefined
      },
      {
        title: "Staff",
        url: buildOrgUrl('/staff'),
        icon: Users,
      },
      {
        title: "Clients",
        url: orgPaths.clients,
        icon: Users,
        badge: false
      },
      // {
      //   title: "Inbox",
      //   url: orgPaths.inbox,
      //   icon: Inbox,
      //   badge: "10",
      // },
      // {
      //   title: "Analytics",
      //   url: orgPaths.analytics,
      //   icon: BarChart3,
      // },
    ],
    navSecondary: [
      {
        title: "Agency App",
        url: orgPaths.agencyApp,
        icon: LayoutDashboard,
      },
      {
        title: "Settings",
        url: orgPaths.settings,
        icon: Settings,
      },
      {
        title: "Billing",
        url: orgPaths.billing,
        icon: CreditCard,
      },
    ],
  }

  const handleOrgChange = (org: typeof currentOrganization) => {
    if (!org) return
    
    // Use centralized URL builder to switch orgs while preserving current page
    const newUrl = buildOrgSwitchUrl(org.slug, pathname, true)
    router.push(newUrl)
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <LayoutDashboard className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {currentOrganization?.name || "Select Organization"}
                    </span>
                    <span className="truncate text-xs capitalize">
                      {currentOrganization 
                        ? getOrganizationRole(currentOrganization.pivot.role_id)
                        : "No organization"
                      }
                    </span>
                  </div>
                  {user?.organizations && user.organizations.length > 1 && (
                    <ChevronDown className="ml-auto size-4" />
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              
              {user?.organizations && user.organizations.length > 1 && (
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="start"
                  sideOffset={4}
                >
                  {user.organizations.map((org) => (
                    <DropdownMenuItem
                      key={org.id}
                      onClick={() => handleOrgChange(org)}
                      className={cn(
                        "cursor-pointer gap-2 p-2",
                        org.id === currentOrganization?.id && "bg-accent"
                      )}
                    >
                      <div className="flex size-6 items-center justify-center rounded-sm border bg-background">
                        <LayoutDashboard className="size-4 shrink-0" />
                      </div>
                      <div className="flex flex-col gap-0.5 overflow-hidden">
                        <span className="font-medium truncate">{org.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {getOrganizationRole(org.pivot.role_id)}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                    <Link href={item.locked ?  "#" : (orgPaths[item.url.slice(1) as keyof typeof orgPaths] || item.url)}>
                      <item.icon />
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto text-xs font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      { item.locked && <Lock/> }
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="sm" tooltip={item.title}>
                    <Link href={orgPaths[item.url.slice(1).replace('-', '') as keyof typeof orgPaths] || item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* Active Plan Widget */}
        <div className="p-2">
          {state === "expanded" ? (
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">Current Plan</span>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {permissions?.plan.name || "No Plan"}
                </span>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${permissions ? Math.round((permissions.limits.clients.current / (permissions.limits.clients.max || 1)) * 100) : 0}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>{permissions?.limits.clients.current}/{permissions?.limits.clients.max ?? 0} Clients</span>
                  <span> {permissions ? Math.round((permissions.limits.clients.current / (permissions.limits.clients.max || 1)) * 100) : 0} %</span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-3 h-7 text-xs">
                Upgrade Plan
              </Button>
            </div>
          ) : (
             <div className="flex justify-center py-2">
                <div className="h-2 w-2 rounded-full bg-primary" title={`${permissions?.plan.name || "No Plan"} Active`} />
             </div>
          )}
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

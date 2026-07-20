"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn, canAccessNavItem } from "@/lib/utils"
import { useSidebar } from "@/contexts/sidebar-context"
import { useCurrentUser } from "@/lib/api/hooks/use-auth"
import {
  LayoutDashboard,
  CreditCard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Smartphone,
  Wifi,
  Zap,
  Tv,
  Gift,
  Shield,
  Megaphone,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export interface NavItem {
  label: string
  href: string
  icon: any
  /** Permission slug required to see this item (maps to a backend *.scope middleware). */
  requiredPermission?: string
  /** Only super admins may see this item. */
  superAdminOnly?: boolean
  children?: { label: string; href: string; icon: any }[]
}

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: CreditCard,
    requiredPermission: "transaction-management",
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: Users,
    requiredPermission: "user-management",
  },
  {
    label: "Admins",
    href: "/dashboard/admins",
    icon: Shield,
    superAdminOnly: true,
  },
  {
    label: "Services",
    href: "/dashboard/services",
    icon: Gift,
    requiredPermission: "services-management",
    children: [
      { label: "Airtime", href: "/dashboard/services/airtime", icon: Smartphone },
      { label: "Data", href: "/dashboard/services/data", icon: Wifi },
      { label: "Electricity", href: "/dashboard/services/electricity", icon: Zap },
      { label: "TV", href: "/dashboard/services/tv", icon: Tv },
    ],
  },
  {
    label: "Marketing",
    href: "/dashboard/newsletters",
    icon: Megaphone,
    requiredPermission: "promotions-management",
    children: [
      { label: "Newsletters", href: "/dashboard/newsletters", icon: Mail },
    ],
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
    requiredPermission: "transaction-management",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed } = useSidebar()
  const user = useCurrentUser()

  return (
    <aside className={cn(
      "hidden md:flex flex-col border-r border-border bg-background sleek-sidebar transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className={cn(
        "flex items-center border-b border-border transition-all duration-300",
        isCollapsed ? "justify-center p-4" : "gap-3 p-6"
      )}>
        <img className={cn(
          "transition-all duration-300",
          isCollapsed ? "h-10 w-10" : "h-10 w-auto"
        )} src={isCollapsed ? "/transactx-icon.svg" : "/transactx.svg"} alt="TransactX Logo" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          // Hide items the admin doesn't have permission to access.
          if (!canAccessNavItem(user, item)) {
            return null
          }

          const Icon = item.icon
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg transition-all text-sm font-medium",
                  isCollapsed ? "justify-center px-3 py-2.5" : "gap-3 px-4 py-2.5",
                  isActive ? "tx-bg-primary text-white" : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={cn(
                  "transition-all duration-300",
                  isCollapsed ? "h-7 w-7" : "h-5 w-5"
                )} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>

              {/* Sub-navigation for Services */}
              {item.children && isActive && !isCollapsed && (
                <div className="ml-4 mt-1 space-y-1 border-l border-border pl-4">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon
                    const isChildActive = pathname === child.href
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm",
                          isChildActive
                            ? "tx-text-primary font-medium bg-muted"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        )}
                      >
                        <ChildIcon className="h-4 w-4" />
                        <span>{child.label}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-muted-foreground hover:text-foreground",
            isCollapsed ? "justify-center px-3" : "justify-start"
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className={cn(
            "transition-all duration-300",
            isCollapsed ? "h-7 w-7" : "h-5 w-5"
          )} />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </aside>
  )
}

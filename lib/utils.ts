import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parsePermissions(permissions: string | string[] | undefined | null): string[] {
  if (!permissions) return []
  if (Array.isArray(permissions)) return permissions
  if (typeof permissions === "string") {
    try {
      const parsed = JSON.parse(permissions)
      if (Array.isArray(parsed)) return parsed
      // Handle case where it might be a single permission string not in JSON format?
      // But based on API response "[\"*\"]", it seems to be JSON.
      // If it's just a string like "user-management", we might want to return [permissions]
      return [permissions]
    } catch {
      // If parsing fails, treat as single string permission if not empty
      return permissions ? [permissions] : []
    }
  }
  return []
}

/**
 * Whether the given user satisfies a required permission slug.
 *
 * Rules:
 * - No requirement -> always allowed.
 * - Super admins and the "*" wildcard -> allowed for everything.
 * - Otherwise the slug must be present in the user's permissions.
 *
 * Graceful degradation: while the user is still loading, or when the login
 * response did not include a permissions array (empty), we do NOT hide the
 * item. The backend scope middleware still enforces real access, and gating
 * activates automatically once permissions are available client-side.
 */
export function hasPermission(user: any, required?: string): boolean {
  if (!required) return true
  if (!user) return true
  if (user.is_super_admin) return true
  const perms = parsePermissions(user.permissions)
  if (perms.length === 0) return true
  return perms.includes("*") || perms.includes(required)
}

/**
 * Whether the user may see a nav item, honoring both permission-scoped items
 * and super-admin-only items (e.g. Admins).
 */
export function canAccessNavItem(
  user: any,
  item: { requiredPermission?: string; superAdminOnly?: boolean }
): boolean {
  if (item.superAdminOnly) {
    // Preserve existing behavior: hide only once we know the user is not a super admin.
    return !user || !!user.is_super_admin
  }
  return hasPermission(user, item.requiredPermission)
}

export const exportToCSV = (data: any[], filename: string) => {
  if (!data || !data.length) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          if (value === null || value === undefined) return ""
          if (typeof value === "object") return JSON.stringify(value).replace(/"/g, '""')
          const stringValue = String(value)
          return `"${stringValue.replace(/"/g, '""')}"`
        })
        .join(",")
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

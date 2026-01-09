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

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

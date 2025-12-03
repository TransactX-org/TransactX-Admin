import { useQuery } from "@tanstack/react-query"
import { getEmailTemplates, getEmailTemplateById } from "../services/email-template.service"

// Query keys
export const emailTemplateKeys = {
  all: ["email-templates"] as const,
  lists: () => [...emailTemplateKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...emailTemplateKeys.lists(), { filters }] as const,
  details: () => [...emailTemplateKeys.all, "detail"] as const,
  detail: (id: string) => [...emailTemplateKeys.details(), id] as const,
}

// Get all email templates
export const useEmailTemplates = (page: number = 1, perPage: number = 15) => {
  return useQuery({
    queryKey: emailTemplateKeys.list({ page, perPage }),
    queryFn: () => getEmailTemplates(page, perPage),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get single email template
export const useEmailTemplate = (id: string | null) => {
  return useQuery({
    queryKey: emailTemplateKeys.detail(id || ""),
    queryFn: () => getEmailTemplateById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}


import apiClient from "../client"
import type { ApiResponse, EmailTemplatesResponse } from "../types"

// Get all email templates with pagination
export const getEmailTemplates = async (
  page: number = 1,
  perPage: number = 15
): Promise<ApiResponse<EmailTemplatesResponse>> => {
  const response = await apiClient.get<ApiResponse<EmailTemplatesResponse>>("/admin/email-templates", {
    params: {
      page,
      per_page: perPage,
    },
  })
  return response.data
}

// Get single email template by ID (if endpoint exists)
export const getEmailTemplateById = async (id: string): Promise<ApiResponse<{ template: any }>> => {
  const response = await apiClient.get<ApiResponse<{ template: any }>>(`/admin/email-templates/${id}`)
  return response.data
}


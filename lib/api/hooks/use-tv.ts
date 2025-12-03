import { useQuery } from "@tanstack/react-query"
import { getTVProviders } from "../services/tv.service"

// Query keys
export const tvKeys = {
  all: ["tv"] as const,
  providers: () => [...tvKeys.all, "providers"] as const,
}

// Get TV providers
export const useTVProviders = () => {
  return useQuery({
    queryKey: tvKeys.providers(),
    queryFn: getTVProviders,
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}


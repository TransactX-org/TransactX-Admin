"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

/**
 * Blocks rendering of protected pages until an auth token is confirmed.
 *
 * The token lives in localStorage, which Next middleware cannot read, so the
 * check has to happen on the client. Rendering a loader (rather than the
 * children) while it resolves is what prevents an unauthenticated visitor from
 * seeing the dashboard shell before the API 401s and the axios interceptor
 * bounces them to /login.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [status, setStatus] = useState<"checking" | "authed">("checking")

  useEffect(() => {
    const token = localStorage.getItem("auth_token")

    if (!token) {
      // Preserve where they were headed so login can return them there.
      const next = pathname ? `?next=${encodeURIComponent(pathname)}` : ""
      router.replace(`/login${next}`)
      return
    }

    setStatus("authed")
  }, [router, pathname])

  if (status === "checking") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="sr-only">Checking your session</span>
      </div>
    )
  }

  return <>{children}</>
}

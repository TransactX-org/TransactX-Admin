import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { SidebarProvider } from "@/contexts/sidebar-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />

          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="w-full">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

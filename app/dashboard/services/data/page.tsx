import type { Metadata } from "next"
import { DataManagement } from "@/components/services/data-management"

export const metadata: Metadata = {
  title: "Data Management | TransactX Admin",
  description: "Manage data bundles and WiFi services",
}

export default function DataPage() {
  return <DataManagement />
}

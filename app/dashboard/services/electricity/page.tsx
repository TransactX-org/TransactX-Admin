import type { Metadata } from "next"
import { ElectricityManagement } from "@/components/services/electricity-management"

export const metadata: Metadata = {
  title: "Electricity Management | TransactX Admin",
  description: "Manage electricity bill payments",
}

export default function ElectricityPage() {
  return <ElectricityManagement />
}

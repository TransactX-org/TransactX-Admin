import type { Metadata } from "next"
import { AirtimeManagement } from "@/components/services/airtime-management"

export const metadata: Metadata = {
  title: "Airtime Management | TransactX Admin",
  description: "Manage airtime purchases and recharge cards",
}

export default function AirtimePage() {
  return <AirtimeManagement />
}

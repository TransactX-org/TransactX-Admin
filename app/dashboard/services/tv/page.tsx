import type { Metadata } from "next"
import { TvManagement } from "@/components/services/tv-management"

export const metadata: Metadata = {
  title: "TV Management | TransactX Admin",
  description: "Manage TV subscriptions and renewals",
}

export default function TvPage() {
  return <TvManagement />
}

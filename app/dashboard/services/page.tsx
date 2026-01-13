import type { Metadata } from "next"
import { Smartphone, Wifi, Zap, Tv } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Services Management | TransactX Admin",
  description: "Manage airtime, data, electricity, and TV services",
}

const services = [
  {
    title: "Airtime",
    description: "Manage airtime purchases and recharge cards",
    icon: Smartphone,
    href: "/dashboard/services/airtime",
  },
  {
    title: "Data",
    description: "Manage data bundles and WiFi services",
    icon: Wifi,
    href: "/dashboard/services/data",
  },
  {
    title: "Electricity",
    description: "Manage electricity bill payments",
    icon: Zap,
    href: "/dashboard/services/electricity",
  },
  {
    title: "TV",
    description: "Manage TV subscriptions and renewals",
    icon: Tv,
    href: "/dashboard/services/tv",
  },
]

export default function ServicesPage() {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight">Services Management</h1>
        <p className="text-muted-foreground mt-2 text-xs sm:text-base">
          Manage all service purchases including airtime, data, electricity, and TV subscriptions
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => {
          const Icon = service.icon
          return (
            <Link key={service.href} href={service.href}>
              <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg tx-bg-primary flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm sm:text-base">{service.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"

export const metadata = {
  title: "Dashboard | HAMGAB",
  description: "Manage your properties, agreements, and maintenance requests.",
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  )
}

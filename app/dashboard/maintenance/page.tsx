import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { MaintenanceRequests } from "@/components/dashboard/maintenance-requests"

export const metadata = {
  title: "Maintenance | HAMGAB",
  description: "Submit and track maintenance requests.",
}

export default function MaintenancePage() {
  return (
    <DashboardLayout>
      <MaintenanceRequests />
    </DashboardLayout>
  )
}

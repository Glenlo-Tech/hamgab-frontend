import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { PropertiesList } from "@/components/dashboard/properties-list"

export const metadata = {
  title: "My Properties | HAMGAB",
  description: "View and manage your properties.",
}

export default function PropertiesPage() {
  return (
    <DashboardLayout>
      <PropertiesList />
    </DashboardLayout>
  )
}

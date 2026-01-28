import { AdminLayout } from "@/components/admin/admin-layout"
import { PropertiesList } from "@/components/admin/properties-list"

export const metadata = {
  title: "All Properties | Admin",
  description: "View and manage all properties on the platform",
}

export default function PropertiesPage() {
  return (
    <AdminLayout>
      <PropertiesList />
    </AdminLayout>
  )
}

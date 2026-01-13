import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata = {
  title: "Admin Dashboard | HAMGAB",
  description: "Platform administration and analytics.",
}

export default function AdminPage() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  )
}

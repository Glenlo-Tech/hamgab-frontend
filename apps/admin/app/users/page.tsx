import { AdminLayout } from "@/components/admin/admin-layout"
import { UserManagement } from "@/components/admin/user-management"

export const metadata = {
  title: "User Management | HAMGAB Admin",
  description: "Manage users and agents on the platform.",
}

export default function UsersPage() {
  return (
    <AdminLayout>
      <UserManagement />
    </AdminLayout>
  )
}

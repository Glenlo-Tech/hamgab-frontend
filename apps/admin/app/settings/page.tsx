import type { Metadata } from "next"
import { AdminLayout } from "@/components/admin/admin-layout"
import Settings from "@/components/admin/settings"

export const metadata: Metadata = {
  title: "Admin Settings | HAMGAB",
  description: "Secure Settings for HAMGAB administrators.",
}

export default function AdminPage() {
  return (
    <AdminLayout>  
        <Settings />      
    </AdminLayout>
  )
}

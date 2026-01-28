import type { Metadata } from "next"
import { AdminLayout } from "@/components/admin/admin-layout"
import Analytics from "@/components/admin/analytics"

export const metadata: Metadata = {
  title: "Admin Analytics | HAMGAB",
  description: "Secure Analytics for HAMGAB administrators.",
}

export default function AdminPage() {
  return (
    <AdminLayout>  
        <Analytics />      
    </AdminLayout>
  )
}

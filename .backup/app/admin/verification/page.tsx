import { AdminLayout } from "@/components/admin/admin-layout"
import { PropertyVerification } from "@/components/admin/property-verification"

export const metadata = {
  title: "Property Verification | HAMGAB Admin",
  description: "Review and approve property listings.",
}

export default function VerificationPage() {
  return (
    <AdminLayout>
      <PropertyVerification />
    </AdminLayout>
  )
}

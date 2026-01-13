import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AgreementsList } from "@/components/dashboard/agreements-list"

export const metadata = {
  title: "Agreements | HAMGAB",
  description: "View your property agreements and contracts.",
}

export default function AgreementsPage() {
  return (
    <DashboardLayout>
      <AgreementsList />
    </DashboardLayout>
  )
}

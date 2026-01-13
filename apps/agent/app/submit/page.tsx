import { AgentLayout } from "@/components/agent/agent-layout"
import { PropertySubmissionForm } from "@/components/agent/property-submission-form"

export const metadata = {
  title: "Submit Property | HAMGAB Agent",
  description: "Submit a new property listing for approval.",
}

export default function SubmitPropertyPage() {
  return (
    <AgentLayout>
      <PropertySubmissionForm />
    </AgentLayout>
  )
}

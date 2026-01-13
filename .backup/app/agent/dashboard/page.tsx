import { AgentLayout } from "@/components/agent/agent-layout"
import { AgentDashboard } from "@/components/agent/agent-dashboard"

export const metadata = {
  title: "Agent Dashboard | HAMGAB",
  description: "Manage your property listings and submissions.",
}

export default function AgentDashboardPage() {
  return (
    <AgentLayout>
      <AgentDashboard />
    </AgentLayout>
  )
}

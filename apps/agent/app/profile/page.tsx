import { AgentLayout } from "@/components/agent/agent-layout"
import { AgentProfile } from "@/components/agent/agent-profile"

export const metadata = {
  title: "Agent Profile | HAMGAB",
  description: "Manage your profile and complete KYC verification.",
}

export default function ProfilePage() {
  return (
    <AgentLayout>
      <AgentProfile />
    </AgentLayout>
  )
}


import { AgentLayout } from "@/components/agent/agent-layout"
import { AgentListings } from "@/components/agent/agent-listings"

export const metadata = {
  title: "My Listings | HAMGAB Agent",
  description: "Manage your property listings.",
}

export default function AgentListingsPage() {
  return (
    <AgentLayout>
      <AgentListings />
    </AgentLayout>
  )
}

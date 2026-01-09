import { redirect } from "next/navigation"

export const metadata = {
  title: "Agent Dashboard | HAMGAB",
  description: "Manage your property listings and submissions.",
}

export default function AgentPage() {
  redirect("/agent/dashboard")
}

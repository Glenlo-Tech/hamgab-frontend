import { AgentLayout } from '@/components/agent/agent-layout'
import { AgentSettings } from '@/components/agent/agent-settings'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings | HAMGAB Agent Portal',
  description: 'Manage your account settings and preferences',
}

export default function SettingsPage() {
  return (
    <AgentLayout>
      <AgentSettings />
    </AgentLayout>
  )
}


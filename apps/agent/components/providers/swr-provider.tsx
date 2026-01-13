"use client"

import { SWRConfig } from "swr"
import { swrConfig } from "@/lib/swr-config"
import type { ReactNode } from "react"

interface SWRProviderProps {
  children: ReactNode
}

/**
 * SWR Provider Component
 * Wraps the app with SWR configuration for data fetching
 */
export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig value={swrConfig}>
      {children}
    </SWRConfig>
  )
}


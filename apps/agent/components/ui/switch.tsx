'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
        'dark:data-[state=unchecked]:bg-input/80',
        // Mobile: larger for better touch
        'h-7 w-12 md:h-6 md:w-11',
        // Better mobile touch target
        'relative after:absolute after:inset-[-8px] md:after:content-none',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block rounded-full shadow-lg ring-0 transition-transform',
          'bg-background',
          'dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground',
          // Mobile: larger thumb
          'h-6 w-6 md:h-5 md:w-5',
          // Adjusted translation for different sizes
          'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
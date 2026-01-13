"use client"

import { motion, type MotionProps, type Variants, AnimatePresence } from "framer-motion"
import type { ReactNode } from "react"

interface FadeInProps extends MotionProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right" | "none"
}

export function FadeIn({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  direction = "up",
  ...props
}: FadeInProps) {
  const directions = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
    none: {},
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
}: {
  children: ReactNode
  className?: string
  staggerDelay?: number
}) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  }

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}

export function ScaleIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SlideIn({
  children,
  className = "",
  delay = 0,
  direction = "left",
}: {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "left" | "right" | "up" | "down"
}) {
  const directions = {
    left: { x: -100, y: 0 },
    right: { x: 100, y: 0 },
    up: { y: -100, x: 0 },
    down: { y: 100, x: 0 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, ...directions[direction] }}
      transition={{ duration: 0.4, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function CountUp({
  value,
  duration = 1.5,
  prefix = "",
  suffix = "",
  className = "",
}: {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  return (
    <motion.span className={className} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
      <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        {prefix}
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          {value.toLocaleString()}
        </motion.span>
        {suffix}
      </motion.span>
    </motion.span>
  )
}

export function PulseOnHover({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  )
}

export function ListAnimation({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div layout className={className}>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export function ListItem({
  children,
  className = "",
  layoutId,
}: {
  children: ReactNode
  className?: string
  layoutId?: string
}) {
  return (
    <motion.div
      layout
      layoutId={layoutId}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export { StaggerContainer as StaggerChildren }

"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useTime } from "@/hooks/use-time"

interface TimeProps {
  date: Date | string
  fromNow?: boolean
  format?: string
  className?: string
}

export function Time({ date, fromNow = true, format, className }: TimeProps) {
  const [mounted, setMounted] = useState(false)
  const { formatTimeAgo, formatDate } = useTime()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <span className={cn("", className)}>...</span>
  }

  if (fromNow) {
    return (
      <span className={cn("", className)}>
        {formatTimeAgo(date)}
      </span>
    )
  }

  return (
    <span className={cn("", className)}>
      {formatDate(date, format || "MMM DD, YYYY")}
    </span>
  )
}

// Alternative component for inline usage
export function TimeAgo({ date, className }: { date: Date | string; className?: string }) {
  const [mounted, setMounted] = useState(false)
  const { formatTimeAgo } = useTime()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <span className={cn("", className)}>...</span>
  }

  return (
    <span className={cn("", className)}>
      {formatTimeAgo(date)}
    </span>
  )
}

// Component for formatted dates
export function FormattedDate({ 
  date, 
  format = "MMM DD, YYYY", 
  className 
}: { 
  date: Date | string
  format?: string
  className?: string 
}) {
  const [mounted, setMounted] = useState(false)
  const { formatDate } = useTime()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <span className={cn("", className)}>...</span>
  }

  return (
    <span className={cn("", className)}>
      {formatDate(date, format)}
    </span>
  )
} 
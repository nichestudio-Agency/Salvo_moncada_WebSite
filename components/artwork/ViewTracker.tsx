"use client"

import { useEffect, useRef } from "react"

export default function ViewTracker({ slug }: { slug: string }) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true
    fetch("/api/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    }).catch(() => {})
  }, [slug])

  return null
}

"use client"

import dynamic from "next/dynamic"

// Dynamic import for map to avoid SSR issues
const InteractiveMap = dynamic(() => import("@/consumer/interactive-map"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />,
})

interface InteractiveMapWrapperProps {
  events: any[]
}

export default function InteractiveMapWrapper({ events }: InteractiveMapWrapperProps) {
  return <InteractiveMap events={events} />
}

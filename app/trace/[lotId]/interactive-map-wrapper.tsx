"use client"

import dynamic from "next/dynamic"

const InteractiveMap = dynamic(() => import("@/consumer/interactive-map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading interactive map...</p>
      </div>
    </div>
  ),
})

interface InteractiveMapWrapperProps {
  lotId: string
}

export default function InteractiveMapWrapper({ lotId }: InteractiveMapWrapperProps) {
  return <InteractiveMap lotId={lotId} />
}

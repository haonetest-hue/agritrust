"use client"

import { useRef } from "react"

interface MapEvent {
  id: string
  eventType: string
  location: string
  coordinates?: { lat: number; lng: number }
  timestamp: string
  description: string
}

interface InteractiveMapProps {
  events: MapEvent[]
}

export default function InteractiveMap({ events }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  // For demo purposes, we'll create a visual representation
  // In production, you'd integrate with Google Maps, Mapbox, or similar
  const eventTypes = {
    planting: { color: "bg-green-500", icon: "🌱" },
    harvesting: { color: "bg-yellow-500", icon: "🌾" },
    processing: { color: "bg-orange-500", icon: "⚙️" },
    quality_check: { color: "bg-blue-500", icon: "🔍" },
    shipping: { color: "bg-purple-500", icon: "🚛" },
    delivery: { color: "bg-red-500", icon: "📦" },
  }

  return (
    <div className="relative">
      {/* Map Container */}
      <div
        ref={mapRef}
        className="h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg relative overflow-hidden"
      >
        {/* Background pattern to simulate map */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="text-gray-400">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Journey Path */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
            </marker>
          </defs>
          {events.map((_, index) => {
            if (index === events.length - 1) return null
            const x1 = 50 + ((index * 150) % 300)
            const y1 = 80 + (index % 2) * 80
            const x2 = 50 + (((index + 1) * 150) % 300)
            const y2 = 80 + ((index + 1) % 2) * 80

            return (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#3B82F6"
                strokeWidth="2"
                strokeDasharray="5,5"
                markerEnd="url(#arrowhead)"
              />
            )
          })}
        </svg>

        {/* Event Markers */}
        {events.map((event, index) => {
          const eventConfig = eventTypes[event.eventType as keyof typeof eventTypes] || eventTypes.planting
          const x = 50 + ((index * 150) % 300)
          const y = 80 + (index % 2) * 80

          return (
            <div
              key={event.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: x, top: y }}
            >
              {/* Marker */}
              <div
                className={`w-8 h-8 ${eventConfig.color} rounded-full flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110`}
              >
                <span className="text-xs">{eventConfig.icon}</span>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  <div className="font-semibold capitalize">{event.eventType.replace("_", " ")}</div>
                  <div>{new Date(event.timestamp).toLocaleDateString()}</div>
                  <div className="text-gray-300">{event.location}</div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {Object.entries(eventTypes).map(([type, config]) => (
          <div key={type} className="flex items-center space-x-1">
            <div className={`w-3 h-3 ${config.color} rounded-full`}></div>
            <span className="capitalize text-gray-600">{type.replace("_", " ")}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

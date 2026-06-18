"use client"

import dynamic from "next/dynamic"

const MapComponent = dynamic(
  () => import("./MapComponent").then(mod => ({ default: mod.MapComponent })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-[28px]">
        <span className="text-gray-500 text-sm">Loading map...</span>
      </div>
    ),
  }
)

export function SriLankaMap() {
  return (
    <div className="w-full h-full min-h-[380px]">
      <MapComponent />
    </div>
  )
}

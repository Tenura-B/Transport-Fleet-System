"use client"

import { useEffect, useState, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default marker icons in Leaflet with bundlers
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = defaultIcon

// Custom colored markers using divIcon
function createColoredIcon(color: string) {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background: ${color};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  })
}

const sriLankaCities = [
  { name: "Colombo", vehicles: 542, position: [6.9271, 79.8612] as [number, number], color: "#ef4444" },
  { name: "Kandy", vehicles: 230, position: [7.2906, 80.6337] as [number, number], color: "#22c55e" },
  { name: "Galle", vehicles: 185, position: [6.0535, 80.2210] as [number, number], color: "#f97316" },
  { name: "Jaffna", vehicles: 120, position: [9.6615, 80.0255] as [number, number], color: "#3b82f6" },
]

function MapInvalidator() {
  const { useMap } = require("react-leaflet")
  const map = useMap()
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100)
  }, [map])
  return null
}

export function MapComponent() {
  const [isMounted, setIsMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="w-full h-full min-h-[380px] bg-gray-100 flex items-center justify-center rounded-[28px]">
        <span className="text-gray-500 text-sm">Loading map...</span>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="w-full" style={{ height: "380px" }}>
      <MapContainer
        center={[7.8731, 80.7718]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        className="rounded-[28px]"
        zoomControl={false}
      >
        <MapInvalidator />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sriLankaCities.map((city) => (
          <Marker key={city.name} position={city.position} icon={createColoredIcon(city.color)}>
            <Popup>
              <div className="text-center">
                <strong>{city.name}</strong>
                <br />
                {city.vehicles} vehicles
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

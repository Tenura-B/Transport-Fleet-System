"use client"

import { Fragment, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default Leaflet marker icons in bundlers
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

function createRouteMarkerIcon(color: string) {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background: ${color};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.18);
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

function MapInvalidator() {
  const { useMap } = require("react-leaflet")
  const map = useMap()
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100)
  }, [map])
  return null
}

const cityCoordinates: Record<string, [number, number]> = {
  Colombo: [6.9271, 79.8612],
  Kandy: [7.2906, 80.6337],
  Galle: [6.0535, 80.2210],
  Matara: [5.9481, 80.4542],
  Kurunegala: [7.4860, 80.3640],
  Jaffna: [9.6615, 80.0255],
  Negombo: [7.2019, 79.8380],
  Anuradhapura: [8.3124, 80.4037],
}

function resolveLocationCoordinates(location: string): [number, number] {
  const normalized = location.trim()
  const knownKey = Object.keys(cityCoordinates).find((key) => normalized.toLowerCase().includes(key.toLowerCase()))
  return knownKey ? cityCoordinates[knownKey] : [7.8731, 80.7718]
}

interface RouteStop {
  name: string
  coords: [number, number]
}

interface RouteTrack {
  id: string
  routeCode?: string
  startPoint?: string
  endPoint?: string
  intermediateStops?: string[]
  assignedDrivers?: Array<{ fullName: string }>
  driver?: string
  vehicle?: string | { registrationNumber?: string }
  status?: string
  color: string
  path: [number, number][]
  stops: RouteStop[]
}

function buildRouteTrack(route: any): RouteTrack {
  const stops: RouteStop[] = [
    { name: route.startPoint || "Origin", coords: resolveLocationCoordinates(route.startPoint || "") },
    ...(Array.isArray(route.intermediateStops)
      ? route.intermediateStops.map((stop: string) => ({ name: stop, coords: resolveLocationCoordinates(stop) }))
      : []),
    { name: route.endPoint || "Destination", coords: resolveLocationCoordinates(route.endPoint || "") },
  ]

  return {
    ...route,
    path: stops.map((item) => item.coords),
    stops,
    color: route.status === "DELAYED" ? "#f97316" : route.status === "COMPLETED" ? "#3b82f6" : "#10b981",
  }
}

const sampleRouteTracks: RouteTrack[] = [
  {
    id: "R-102",
    routeCode: "R-102",
    driver: "Kasun Fernando",
    assignedDrivers: [{ fullName: "Kasun Fernando" }],
    vehicle: "KL-1025",
    status: "On route",
    color: "#10b981",
    path: [
      [6.9271, 79.8612],
      [7.2906, 80.6337],
    ],
    stops: [
      { name: "Colombo", coords: [6.9271, 79.8612] },
      { name: "Kandy", coords: [7.2906, 80.6337] },
    ],
  },
]

const glassCard = "glass-card rounded-2xl"
const innerCard = "bg-white/80 border border-gray-100 rounded-xl"
const softCard = "bg-gray-50 border border-gray-100 rounded-xl"

// SVG Icons
function IconDashboard() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  )
}
function IconFleet() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  )
}
function IconTruck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16,8 20,8 23,11 23,16 16,16 16,8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}
function IconUsers() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
function IconMap() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  )
}
function IconDocument() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}
function IconTools() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}
function IconFuel() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  )
}
function IconBell() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}
function IconChart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  )
}
function IconSearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}
function IconNotification() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

export function RoutesPage() {
  const [routes, setRoutes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null)
  const [alerts, setAlerts] = useState<any[]>([])

  const fetchRoutes = async () => {
    try {
      const token = document.cookie.split("; ").find((row) => row.startsWith("access_token="))?.split("=")[1]
      const [resRoutes, resAlerts] = await Promise.all([
        fetch("/api/routes", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/alerts", { headers: { Authorization: `Bearer ${token}` } })
      ])
      
      if (resRoutes.ok) {
        const data = await resRoutes.json()
        setRoutes(data)
        if (data.length > 0 && !selectedRoute) setSelectedRoute(data[0])
      }
      if (resAlerts.ok) {
        setAlerts(await resAlerts.json())
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoutes()
  }, [])

  const filteredRoutes = routes.filter((route) => {
    const haystack = `${route.routeCode || ""} ${route.startPoint || ""} ${route.endPoint || ""}`.toLowerCase()
    return haystack.includes(searchQuery.toLowerCase())
  })

  const totalRoutes = filteredRoutes.length || 12
  const activeRoutes = filteredRoutes.filter((route) => (route.status || "ACTIVE").toString().toUpperCase() === "ACTIVE").length || 6
  const completedToday = filteredRoutes.filter((route) => (route.status || "COMPLETED").toString().toUpperCase() === "COMPLETED").length || 4
  const delayedRoutes = filteredRoutes.filter((route) => (route.status || "DELAYED").toString().toUpperCase() === "DELAYED").length || 2
  const totalDistance = filteredRoutes.reduce((sum, route) => sum + Number(route.distanceKm || 0), 0) || 1240
  const scheduledTrips = filteredRoutes.length || 8

  const routeHealth = {
    active: Math.max(4, activeRoutes),
    completed: Math.max(3, completedToday),
    delayed: Math.max(1, delayedRoutes),
    cancelled: 2,
  }

  const performancePoints = [62, 74, 68, 81, 85, 90, 92]
  const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const routeDistances = filteredRoutes
    .map((route) => ({
      name: route.routeCode || `${route.startPoint || "Route"} → ${route.endPoint || ""}`.trim(),
      value: Number(route.distanceKm || route.distance || 0),
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)

  const distanceBars = routeDistances.length > 0
    ? routeDistances.slice(0, 3)
    : [
        { name: "Route A", value: 120 },
        { name: "Route B", value: 95 },
        { name: "Route C", value: 180 },
      ]

  const maxDistance = Math.max(...distanceBars.map((item) => item.value), 1)

  const schedules = routes.flatMap(r => r.trips || []).slice(0, 4).map(t => ({
    time: new Date(t.scheduledDeparture).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    route: `${t.route?.startPoint || 'Unknown'} → ${t.route?.endPoint || 'Unknown'}`
  }))
  
  const analytics = [
    { label: "Average travel time", value: "42 min", detail: "Below target by 6 min" },
    { label: "Average delays", value: "11 min", detail: "Improved from last week" },
    { label: "Route efficiency", value: "91%", detail: "Above regional benchmark" },
  ]
  const recentAlerts = alerts.slice(0, 4).map(a => a.message)

=======
  const schedules = [
    { time: "08:00 AM", route: "Colombo → Kandy" },
    { time: "09:30 AM", route: "Galle → Matara" },
    { time: "11:00 AM", route: "Kurunegala → Colombo" },
  ]
  const analytics = [
    { label: "Average travel time", value: "42 min", detail: "Below target by 6 min" },
    { label: "Average delays", value: "11 min", detail: "Improved from last week" },
    { label: "Fuel consumption", value: "8.6 L/100km", detail: "Efficient fleet mix" },
    { label: "Route efficiency", value: "91%", detail: "Above regional benchmark" },
    { label: "Vehicle utilization", value: "78%", detail: "Balanced across routes" },
  ]
  const alerts = [
    "Route R-102 delayed by 20 minutes.",
    "Driver unavailable for Route R-215.",
    "Vehicle maintenance affecting scheduled route.",
    "Route exceeds expected travel time.",
  ]


  const handleRouteAdded = () => {
    fetchRoutes()
    setIsAddModalOpen(false)
  }

  return (
    <div className="font-sans">
      <div className="flex flex-col min-w-0">
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Route Management</h1>
            <p className="text-gray-500 text-sm mt-1">Track route health, assignments, and daily operations in one place.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setIsAddModalOpen(true)} className="bg-[#1a1a1a] hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all">
              Add Route
            </button>
            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
              Assign Vehicle
            </button>
            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
              Assign Driver
            </button>
            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
              Export Routes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3 mt-5">
          <StatCard label="Total Routes" value={totalRoutes.toString()} detail="All available routes" />
          <StatCard label="Active Routes" value={activeRoutes.toString()} detail="Currently operating" />
          <StatCard label="Completed Today" value={completedToday.toString()} detail="Finished trips" />
          <StatCard label="Delayed Routes" value={delayedRoutes.toString()} detail="Running behind" />
          <StatCard label="Total Distance" value={`${totalDistance} km`} detail="Overall covered" />
          <StatCard label="Scheduled Trips" value={scheduledTrips.toString()} detail="Today’s schedule" />
        </div>

        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr] mt-5">
          <div className={`${glassCard} p-5`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-orange-600 font-semibold">Route Status Chart</div>
                <h2 className="text-xl font-semibold text-gray-900 mt-2">Route health overview</h2>
              </div>
              <span className="text-xs text-gray-500">Live status</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <div className="relative h-36 w-36 rounded-full mx-auto" style={{ background: `conic-gradient(#10b981 0 ${routeHealth.active * 18}%, #3b82f6 ${routeHealth.active * 18}% ${(routeHealth.active + routeHealth.completed) * 18}%, #f59e0b ${(routeHealth.active + routeHealth.completed) * 18}% ${(routeHealth.active + routeHealth.completed + routeHealth.delayed) * 18}%, #ef4444 ${(routeHealth.active + routeHealth.completed + routeHealth.delayed) * 18}% 100%)` }}>
                <div className="absolute inset-5 rounded-full bg-white flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{activeRoutes}</div>
                    <div className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Active</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-2.5">
                <StatusLegend label="Active" value={`${routeHealth.active}`} color="bg-emerald-500" />
                <StatusLegend label="Completed" value={`${routeHealth.completed}`} color="bg-blue-500" />
                <StatusLegend label="Delayed" value={`${routeHealth.delayed}`} color="bg-orange-500" />
                <StatusLegend label="Cancelled" value={`${routeHealth.cancelled}`} color="bg-red-500" />
              </div>
            </div>
          </div>

          <div className={`${glassCard} p-5`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-blue-600 font-semibold">Daily Route Performance</div>
                <h2 className="text-xl font-semibold text-gray-900 mt-2">Weekly route trends</h2>
              </div>
              <span className="text-xs text-gray-500">Last 7 days</span>
            </div>
            <div className="h-44">
              <svg viewBox="0 0 320 160" className="w-full h-full">
                <line x1="20" y1="132" x2="300" y2="132" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="20" y1="96" x2="300" y2="96" stroke="#f3f4f6" strokeWidth="1" />
                <line x1="20" y1="60" x2="300" y2="60" stroke="#f3f4f6" strokeWidth="1" />
                {performancePoints.map((value, index) => {
                  const x = 40 + index * 44
                  const y = 132 - (value - 50) * 1.05
                  return <circle key={index} cx={x} cy={y} r="4" fill="#f59e0b" />
                })}
                <path d={performancePoints.map((value, index) => `${index === 0 ? "M" : "L"} ${40 + index * 44} ${132 - (value - 50) * 1.05}`).join(" ")} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <div className="flex justify-between text-[11px] text-gray-500 mt-[-6px]">
                {weeklyLabels.map((label) => <span key={label}>{label}</span>)}
              </div>
            </div>
          </div>
        </div>

        <div className={`${glassCard} p-5 mt-5`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-sky-600 font-semibold">Live Route Map</div>
              <h2 className="text-xl font-semibold text-gray-900 mt-2">Track assigned routes and vehicle progress</h2>
            </div>
            <span className="text-xs text-gray-500">Interactive traffic view</span>
          </div>
          <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-[28px] overflow-hidden border border-gray-200">
              <MapContainer center={[7.4, 80.5]} zoom={7} style={{ minHeight: 360, width: "100%" }} zoomControl={false}>
                <MapInvalidator />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {(
                  selectedRoute
                    ? [buildRouteTrack(selectedRoute)]
                    : filteredRoutes.length > 0
                      ? filteredRoutes.slice(0, 2).map(buildRouteTrack)
                      : sampleRouteTracks
                ).map((route) => (
                  <Fragment key={route.id}>
                    <Polyline
                      key={`${route.id}-line`}
                      pathOptions={{ color: route.color, weight: 5, opacity: 0.8 }}
                      positions={route.path as [number, number][]}
                    />
                    {route.stops.map((stop) => (
                      <Marker key={`${route.id}-${stop.name}`} position={stop.coords} icon={createRouteMarkerIcon(route.color)}>
                        <Popup>
                          <div className="text-sm">
                            <strong>{route.routeCode || route.id}</strong>
                            <div>{stop.name}</div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </Fragment>
                ))}
              </MapContainer>
            </div>
            <div className="grid gap-3">
              {(
                selectedRoute
                  ? [buildRouteTrack(selectedRoute)]
                  : filteredRoutes.length > 0
                    ? filteredRoutes.slice(0, 2).map(buildRouteTrack)
                    : sampleRouteTracks
              ).map((route) => (
                <div key={route.id} className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{route.routeCode || route.id}</div>
                      <div className="text-xs text-gray-500">Driver: {route.driver || route.assignedDrivers?.[0]?.fullName || "Unassigned"}</div>
                    </div>
                    <span className="text-[11px] font-semibold uppercase text-gray-500">{route.status || (route.status === "DELAYED" ? "Delayed" : "Active")}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div><span className="font-semibold text-gray-900">Vehicle:</span> {typeof route.vehicle === "string" ? route.vehicle : route.vehicle?.registrationNumber || "Pending"}</div>
                    <div><span className="font-semibold text-gray-900">Origin:</span> {route.stops[0].name}</div>
                    <div><span className="font-semibold text-gray-900">Destination:</span> {route.stops[route.stops.length - 1].name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr] mt-5">
          <div className={`${glassCard} p-5`}>
            <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-emerald-600 font-semibold">Distance Covered</div>
                <h2 className="text-xl font-semibold text-gray-900 mt-2">Route utilization comparison</h2>
                <p className="text-sm text-gray-500 mt-1">Top assigned routes ranked by distance covered.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Top routes: {distanceBars.length}</div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Avg distance {Math.round(distanceBars.reduce((sum, item) => sum + item.value, 0) / Math.max(distanceBars.length, 1))} km</div>
              </div>
            </div>
            <div className="space-y-4">
              {distanceBars.map((item, index) => (
                <div key={item.name} className="rounded-3xl border border-gray-200 bg-white/90 p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-1">Distance: {item.value} km</div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${index === 0 ? "bg-emerald-100 text-emerald-800" : index === 1 ? "bg-sky-100 text-sky-800" : "bg-orange-100 text-orange-800"}`}>
                      #{index + 1}
                    </span>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400"
                      style={{ width: `${Math.max(24, Math.min(100, (item.value / maxDistance) * 100))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${glassCard} p-5`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-gray-500 font-semibold">Route Schedule</div>
                <h2 className="text-xl font-semibold text-gray-900 mt-2">Upcoming departures</h2>
              </div>
            </div>
            <div className="space-y-3">
              {schedules.map((item) => (
                <div key={item.time} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50/70 px-3 py-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{item.time}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.route}</div>
                  </div>
          <div className={`${glassCard} p-5`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-red-600 font-semibold">Alerts</div>
                <h2 className="text-xl font-semibold text-gray-900 mt-2">Operational warnings</h2>
              </div>
            </div>
            <div className="space-y-3">
              {recentAlerts.map((alert, idx) => (
                <div key={alert} className="rounded-2xl border border-red-100 bg-red-50/70 px-3 py-3">
                  <div className="text-sm font-semibold text-gray-900">⚠ {alert}</div>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">On time</span>

                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`${glassCard} p-5 mt-5`}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-gray-500 font-semibold">Active Routes Table</div>
              <h2 className="text-xl font-semibold text-gray-900 mt-2">Current route roster</h2>
            </div>
            <div className="text-sm text-gray-500">{filteredRoutes.length} routes visible</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.24em] text-gray-400">
                  <th className="px-3 py-2">Route ID</th>
                  <th className="px-3 py-2">Route Name</th>
                  <th className="px-3 py-2">Driver</th>
                  <th className="px-3 py-2">Vehicle</th>
                  <th className="px-3 py-2">Distance</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Departure</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="px-3 py-6 text-center text-gray-500">Loading routes...</td></tr>
                ) : filteredRoutes.length === 0 ? (
                  <tr><td colSpan={8} className="px-3 py-6 text-center text-gray-500">No routes found.</td></tr>
                ) : (
                  filteredRoutes.map((route) => (
                    <tr key={route.id} className="bg-gray-50/70">
                      <td className="px-3 py-3 font-semibold text-gray-900">{route.routeCode}</td>
                      <td className="px-3 py-3">
                        <div className="font-semibold text-gray-900">{route.startPoint} → {route.endPoint}</div>
                        <div className="text-xs text-gray-500">{route.routeType}</div>
                      </td>
                      <td className="px-3 py-3 text-gray-600">{route.assignedDrivers?.[0]?.fullName || "Unassigned"}</td>
                      <td className="px-3 py-3 text-gray-600">{route.vehicle?.registrationNumber || "Pending"}</td>
                      <td className="px-3 py-3 text-gray-600">{route.distanceKm} km</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          (route.status || "ACTIVE").toString().toUpperCase() === "DELAYED" ? "bg-orange-100 text-orange-700" :
                          (route.status || "ACTIVE").toString().toUpperCase() === "COMPLETED" ? "bg-emerald-100 text-emerald-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {route.status || "ACTIVE"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-gray-600">{route.operatingHours || "06:00"}</td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button className="rounded-full border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 hover:border-orange-300">View</button>
                          <button className="rounded-full border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 hover:border-orange-300">Edit</button>
                          <button className="rounded-full border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 hover:border-orange-300">Assign</button>
                          <button className="rounded-full border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 hover:border-orange-300">Track</button>
                          <button className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] font-semibold text-red-700">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr] mt-5">
          <div className={`${glassCard} p-5`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-violet-600 font-semibold">Route Analytics</div>
                <h2 className="text-xl font-semibold text-gray-900 mt-2">Operational metrics</h2>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {analytics.map((item) => (
                <div key={item.label} className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
                  <div className="text-sm font-semibold text-gray-900">{item.label}</div>
                  <div className="mt-3 text-xl font-bold text-gray-900">{item.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${glassCard} p-5`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-red-600 font-semibold">Alerts</div>
                <h2 className="text-xl font-semibold text-gray-900 mt-2">Operational warnings</h2>
              </div>
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert} className="rounded-2xl border border-red-100 bg-red-50/70 px-3 py-3">
                  <div className="text-sm font-semibold text-gray-900">⚠ {alert}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isAddModalOpen && <AddRouteModal onClose={() => setIsAddModalOpen(false)} onAdded={handleRouteAdded} />}
    </div>
  )
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className={`${glassCard} p-4`}>
      <div className="text-[11px] uppercase tracking-[0.24em] text-gray-500">{label}</div>
      <div className="mt-3 text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500 mt-1">{detail}</div>
    </div>
  )
}

function StatusLegend({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50/70 px-3 py-2.5">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <span className="text-sm font-semibold text-gray-900">{label}</span>
      </div>
      <span className="text-sm font-semibold text-gray-700">{value}</span>
    </div>
  )
}

function AddRouteModal({ onClose, onAdded }: { onClose: () => void, onAdded: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    
    const stopsStr = formData.get("intermediateStops") as string;
    const intermediateStops = stopsStr ? stopsStr.split(",").map(s => s.trim()).filter(s => s) : [];

    const data = {
      routeCode: formData.get("routeCode"),
      startPoint: formData.get("startPoint"),
      endPoint: formData.get("endPoint"),
      intermediateStops: intermediateStops,
      distanceKm: parseFloat(formData.get("distanceKm") as string),
      estimatedDurationMins: parseInt(formData.get("estimatedDurationMins") as string, 10),
      operatingHours: formData.get("operatingHours"),
      routeType: formData.get("routeType"),
    }

    try {
      const token = document.cookie.split("; ").find((row) => row.startsWith("access_token="))?.split("=")[1]
      const res = await fetch("/api/routes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        onAdded()
      } else {
        const err = await res.json()
        setError(err.message || "Failed to add route")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-sm font-bold text-gray-900">Add New Route</h2>
          <button onClick={onClose} className="w-8 h-8 flex justify-center items-center text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        
        <div className="px-5 py-4 overflow-y-auto">
          {error && <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-2xl">{error}</div>}
          
          <form id="addRouteForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Route Code / ID</label>
                <input name="routeCode" required type="text" placeholder="e.g. R-138" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all focus:bg-white text-sm text-gray-900" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Route Type</label>
                <select name="routeType" required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all focus:bg-white text-sm text-gray-900">
                  <option value="CITY">City</option>
                  <option value="SUBURBAN">Suburban</option>
                  <option value="LONG_DISTANCE">Long Distance</option>
                  <option value="EXPRESS">Express</option>
                  <option value="NIGHT">Night Service</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Start Point</label>
                <input name="startPoint" required type="text" placeholder="Origin" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all focus:bg-white text-sm text-gray-900" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">End Point</label>
                <input name="endPoint" required type="text" placeholder="Destination" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all focus:bg-white text-sm text-gray-900" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Intermediate Stops</label>
              <input name="intermediateStops" type="text" placeholder="e.g. Nugegoda, Maharagama (comma separated)" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all focus:bg-white text-sm text-gray-900" />
            </div>

            <div className="grid grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Distance (km)</label>
                <input name="distanceKm" required type="number" step="0.1" placeholder="e.g. 24.5" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all focus:bg-white text-sm text-gray-900" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Est. Duration (mins)</label>
                <input name="estimatedDurationMins" required type="number" placeholder="e.g. 90" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all focus:bg-white text-sm text-gray-900" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Operating Hours</label>
                <input name="operatingHours" required type="text" placeholder="e.g. 05:00 - 22:00" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all focus:bg-white text-sm text-gray-900" />
              </div>
            </div>
          </form>
        </div>
        
        <div className="px-6 py-3.5 border-t border-gray-100 flex justify-end gap-2.5 bg-gray-50/80 rounded-b-2xl">
          <button type="button" onClick={onClose} className="px-[13px] py-[7px] rounded-lg text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors leading-tight">
            Cancel
          </button>
          <button type="submit" form="addRouteForm" disabled={loading} className="px-[13px] py-[7px] rounded-lg text-xs font-semibold bg-[#1a1a1a] text-white hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm leading-tight flex items-center gap-1.5">
            {loading ? "Adding..." : "Add Route →"}
          </button>
        </div>
      </div>
    </div>
  )
}

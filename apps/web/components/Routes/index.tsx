"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

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

const glassCard = "glass-card rounded-2xl"
const innerCard = "bg-white/80 border border-gray-100 rounded-xl"
const softCard = "bg-gray-50 border border-gray-100 rounded-xl"

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

<<<<<<< Updated upstream
  const filteredRoutes = routes.filter(r => 
    r.routeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.startPoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.endPoint.toLowerCase().includes(searchQuery.toLowerCase())
  )
=======
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
    active: activeRoutes,
    completed: completedToday,
    delayed: delayedRoutes,
    cancelled: filteredRoutes.filter((route) => (route.status || "").toString().toUpperCase() === "CANCELLED").length || 0,
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
>>>>>>> Stashed changes

  const handleRouteAdded = () => {
    fetchRoutes()
    setIsAddModalOpen(false)
  }

  return (
    <div className="font-sans">
      <div className="flex flex-col min-w-0">
          
          <div className="mt-4 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Route Management</h1>
              <p className="text-gray-500 text-sm mt-1">Manage fleet routes, tracking, and operational coverage.</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#1a1a1a] hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
              Add Route
            </button>
          </div>

          <div className="grid lg:grid-cols-12 gap-5 mt-4">
            {/* Routes List */}
            <div className={`lg:col-span-5 ${glassCard} p-4 flex flex-col h-[calc(100vh-250px)]`}>
              <div className="font-semibold text-gray-900 mb-4">All Routes ({filteredRoutes.length})</div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {loading ? (
                  <div className="text-center py-10 text-gray-400">Loading routes...</div>
                ) : filteredRoutes.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">No routes found.</div>
                ) : (
                  filteredRoutes.map((route) => (
                    <div
                      key={route.id}
                      onClick={() => setSelectedRoute(route)}
                      className={`${innerCard} p-4 cursor-pointer transition-all ${
                        selectedRoute?.id === route.id ? 'ring-2 ring-blue-500 shadow-md scale-[1.01]' : 'hover:shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-gray-900 text-lg">{route.routeCode}</div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          route.routeType === 'CITY' ? 'bg-blue-50 text-blue-700' :
                          route.routeType === 'EXPRESS' ? 'bg-orange-50 text-orange-700' :
                          route.routeType === 'NIGHT' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {route.routeType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium mb-3">
                        <span>{route.startPoint}</span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        <span>{route.endPoint}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><IconMap /> {route.distanceKm} km</span>
                        <span className="flex items-center gap-1"><IconDashboard /> {route.estimatedDurationMins} mins</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

<<<<<<< Updated upstream
            {/* Route Details Panel */}
            <div className="lg:col-span-7">
              {selectedRoute ? (
                <div className={`${glassCard} p-8`}>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl font-bold text-gray-900">{selectedRoute.routeCode}</h2>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          selectedRoute.routeType === 'CITY' ? 'bg-blue-50 text-blue-700' :
                          selectedRoute.routeType === 'EXPRESS' ? 'bg-orange-50 text-orange-700' :
                          selectedRoute.routeType === 'NIGHT' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {selectedRoute.routeType}
                        </span>
                      </div>
                      <p className="text-gray-500">Operating Hours: {selectedRoute.operatingHours}</p>
                    </div>
                    <button className="text-blue-600 text-sm font-semibold hover:text-blue-700">Edit Route</button>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className={`${softCard} p-5`}>
                      <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Origin</div>
                      <div className="text-xl font-bold text-gray-900">{selectedRoute.startPoint}</div>
                    </div>
                    <div className={`${softCard} p-5`}>
                      <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Destination</div>
                      <div className="text-xl font-bold text-gray-900">{selectedRoute.endPoint}</div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Journey Details</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className={`${innerCard} p-4 text-center`}>
                        <div className="text-2xl font-bold text-blue-600">{selectedRoute.distanceKm}</div>
                        <div className="text-[10px] text-gray-500 uppercase font-semibold mt-1">Kilometers</div>
                      </div>
                      <div className={`${innerCard} p-4 text-center`}>
                        <div className="text-2xl font-bold text-orange-600">{Math.floor(selectedRoute.estimatedDurationMins / 60)}h {selectedRoute.estimatedDurationMins % 60}m</div>
                        <div className="text-[10px] text-gray-500 uppercase font-semibold mt-1">Est. Duration</div>
                      </div>
                      <div className={`${innerCard} p-4 text-center`}>
                        <div className="text-2xl font-bold text-green-600">{selectedRoute.punctualityScore}%</div>
                        <div className="text-[10px] text-gray-500 uppercase font-semibold mt-1">Punctuality</div>
                      </div>
                      <div className={`${innerCard} p-4 text-center`}>
                        <div className="text-2xl font-bold text-red-600">{selectedRoute.safetyIncidents}</div>
                        <div className="text-[10px] text-gray-500 uppercase font-semibold mt-1">Incidents</div>
                      </div>
                    </div>
                  </div>

                  {selectedRoute.intermediateStops && selectedRoute.intermediateStops.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-base font-semibold text-gray-900 mb-3">Intermediate Stops</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedRoute.intermediateStops.map((stop: string, i: number) => (
                          <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                            {stop}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-base font-semibold text-gray-900">Assigned Drivers ({selectedRoute.assignedDrivers?.length || 0})</h3>
                    </div>
                    {selectedRoute.assignedDrivers && selectedRoute.assignedDrivers.length > 0 ? (
                      <div className="space-y-3">
                        {selectedRoute.assignedDrivers.map((driver: any) => (
                          <div key={driver.id} className={`${innerCard} p-4 flex items-center justify-between`}>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                                {driver.fullName.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{driver.fullName}</div>
                                <div className="text-xs text-gray-500">{driver.licenseNumber}</div>
                              </div>
                            </div>
                            <span className="text-xs font-semibold px-2 py-1 bg-green-50 text-green-700 rounded-full">
                              Active
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`${innerCard} p-6 text-center text-gray-500 text-sm`}>
                        No drivers are currently assigned to this route.
                      </div>
                    )}
                  </div>
=======
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
>>>>>>> Stashed changes
                </div>
              ) : (
                <div className={`${glassCard} p-12 text-center text-gray-400 flex flex-col items-center justify-center h-full`}>
                  <IconMap />
                  <p className="mt-4">Select a route from the list to view details.</p>
                </div>
              )}
            </div>
          </div>
      </div>
      
      {isAddModalOpen && <AddRouteModal onClose={() => setIsAddModalOpen(false)} onAdded={handleRouteAdded} />}
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

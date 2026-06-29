"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"

const glassCard = "glass-card rounded-2xl"
const softCard = "soft-card rounded-xl"
const innerCard = "soft-card rounded-lg"



const statusColors: Record<string, string> = {
  active: "bg-green-500",
  maintenance: "bg-orange-500",
  idle: "bg-gray-400",
  retired: "bg-red-500",
}

const statusTones: Record<string, string> = {
  active: "bg-green-50 text-green-700",
  maintenance: "bg-orange-50 text-orange-700",
  idle: "bg-gray-100 text-gray-600",
  retired: "bg-red-50 text-red-700",
}

const statusLabels: Record<string, string> = {
  active: "Active",
  maintenance: "In Maintenance",
  idle: "Idle",
  retired: "Retired",
}

const filters = ["All", "Active", "In Maintenance", "Idle", "Retired"]

const dummyBuses = [
  {
    id: "LHR-001",
    dbId: 1,
    type: "Volvo 9700",
    capacity: 45,
    route: "Route 10",
    depot: "North Depot",
    status: "active",
    driver: "A. Perera",
    conductor: "R. Silva",
    shift: "Morning",
    km: 18240,
    fuel: 14.8,
    revenue: "Rs 48,200",
    trips: 18,
    onTime: "92%",
    passengers: 1420,
    ac: true,
    cctv: true,
    gps: true,
    wheelchair: true,
    year: 2022,
    insurance: "2026-12-10",
    fitness: "2026-09-12",
    emission: "2026-04-15",
    license: "2026-11-20",
    lastServiceDate: "2026-06-18",
    nextServiceDate: "2026-07-15",
  },
  {
    id: "LHR-002",
    dbId: 2,
    type: "Scania K410",
    capacity: 40,
    route: "Route 04",
    depot: "Central Depot",
    status: "maintenance",
    driver: "N. Fernando",
    conductor: "K. Jayasuriya",
    shift: "Evening",
    km: 15420,
    fuel: 16.2,
    revenue: "Rs 31,100",
    trips: 11,
    onTime: "84%",
    passengers: 980,
    ac: true,
    cctv: false,
    gps: true,
    wheelchair: false,
    year: 2021,
    insurance: "2026-08-25",
    fitness: "2026-10-05",
    emission: "2026-03-20",
    license: "2026-07-30",
    lastServiceDate: "2026-05-21",
    nextServiceDate: "2026-06-29",
  },
]

export function VehiclesPage() {
  const [buses, setBuses] = useState<any[]>(dummyBuses)
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("All")
  const [selectedBus, setSelectedBus] = useState<string | null>(null)
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const token = localStorage.getItem("access_token") || document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
        const res = await fetch("/api/vehicles", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          const mappedBuses = data.map((v: any) => {
            const assignedDriver = v.drivers && v.drivers.length > 0 ? v.drivers[0].fullName : "—";
            const routeName = v.drivers && v.drivers.length > 0 && v.drivers[0].assignedRouteId ? "Assigned via Driver" : "Unassigned"; 
            
            return {
              id: v.registrationNumber,
              dbId: v.id,
              type: `${v.make} ${v.model}`,
              capacity: v.capacity || 40,
              route: routeName,
              depot: "—",
              status: v.status === "IN_USE" ? "active" : v.status === "MAINTENANCE" ? "maintenance" : v.status === "RETIRED" ? "retired" : "idle",
              driver: assignedDriver,
              conductor: "—",
              shift: "—",
              km: v.mileageKm || 0,
              fuel: v.fuelUsageAvg || 0,
              revenue: "Rs 0", // Mock
              trips: 0, // Mock
              onTime: "—", // Mock
              passengers: 0, // Mock
              ac: v.features?.includes("AC") || false,
              cctv: v.features?.includes("CCTV") || false,
              gps: v.features?.includes("GPS") || false,
              wheelchair: v.features?.includes("WHEELCHAIR") || false,
              year: v.year,
              insurance: v.insuranceExpiry ? new Date(v.insuranceExpiry).toLocaleDateString() : "—",
              fitness: v.roadworthinessExpiry ? new Date(v.roadworthinessExpiry).toLocaleDateString() : "—",
              emission: "—",
              license: v.registrationExpiry ? new Date(v.registrationExpiry).toLocaleDateString() : "—",
              lastServiceDate: v.lastServiceDate ? new Date(v.lastServiceDate).toLocaleDateString() : "—",
              nextServiceDate: v.nextServiceDate ? new Date(v.nextServiceDate).toLocaleDateString() : "—"
            }
          })
          const sortedBuses = mappedBuses.sort((a: any, b: any) => a.id.localeCompare(b.id))
          setBuses(sortedBuses.length > 0 ? sortedBuses : dummyBuses)
          if (sortedBuses.length > 0) {
            setSelectedBus(sortedBuses[0].id)
          }
        } else {
          setBuses(dummyBuses)
          setSelectedBus(dummyBuses[0].id)
        }
      } catch (e) {
        console.error(e)
        setBuses(dummyBuses)
        setSelectedBus(dummyBuses[0].id)
      } finally {
        setLoading(false)
      }
    }
    fetchVehicles()
  }, [])

  const baseFiltered = activeFilter === "All" ? buses : buses.filter(b => statusLabels[b.status] === activeFilter)
  const filtered = baseFiltered.filter(b => b.id.toLowerCase().includes(searchText.toLowerCase()) || b.route.toLowerCase().includes(searchText.toLowerCase()))
  const selected = buses.find(b => b.id === selectedBus)

  const totalBuses = buses.length
  const activeBuses = buses.filter(b => b.status === "active").length
  const maintBuses = buses.filter(b => b.status === "maintenance").length
  const avgUtil = Math.round(buses.filter(b => b.status === "active").reduce((s, b) => s + (b.passengers / 60) * 100, 0) / activeBuses)
  const avgFuel = Math.round(buses.filter(b => b.status === "active").reduce((s, b) => s + b.fuel, 0) / activeBuses)

  return (
    <div className="relative">
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Fleet Management</h1>
              <p className="text-gray-500 text-sm mt-2 max-w-2xl">
                Monitor fleet assets, vehicle readiness, and route status from one polished operations panel.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2 text-sm text-gray-600 shadow-sm">
                <div className="text-[10px] uppercase tracking-[0.24em] text-gray-400">Snapshot date</div>
                <div className="font-semibold text-gray-900">June 28, 2026</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Total Buses" value={totalBuses.toString()} color="text-gray-900" />
            <StatCard label="Active" value={activeBuses.toString()} color="text-green-600" />
            <StatCard label="Maintenance" value={maintBuses.toString()} color="text-orange-600" />
            <StatCard label="Avg Fuel" value={`${avgFuel} L/trip`} color="text-purple-600" />
          </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className={`${glassCard} p-5`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-orange-600 font-semibold">Fleet Status Charts</div>
                <h2 className="text-xl font-semibold text-gray-900 mt-2">Fleet readiness</h2>
              </div>
              <span className="text-xs text-gray-500">Last 7 days</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <StatusChartCard label="Active" value="72%" width="72%" color="bg-green-500" />
              <StatusChartCard label="Maintenance" value="18%" width="18%" color="bg-orange-500" />
              <StatusChartCard label="Idle" value="10%" width="10%" color="bg-gray-400" />
            </div>
          </div>

          <div className={`${glassCard} p-5`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-blue-600 font-semibold">Performance Analytics</div>
                <h2 className="text-xl font-semibold text-gray-900 mt-2">Service efficiency</h2>
              </div>
              <span className="text-xs text-gray-500">This month</span>
            </div>
            <div className="space-y-3">
              <AnalyticsRow label="Avg. utilization" value="84%" detail="Up 6%" />
              <AnalyticsRow label="Fuel efficiency" value="13.2 L/100km" detail="Stable" />
              <AnalyticsRow label="On-time trips" value="91%" detail="+4 pts" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className={`${glassCard} p-5 w-full`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-gray-500 font-semibold">Vehicle Table</div>
                <h2 className="text-xl font-semibold text-gray-900 mt-2">Fleet vehicles</h2>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <SearchIcon />
                  </span>
                  <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search vehicle"
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.map(f => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`px-3 py-2 rounded-full text-xs font-semibold transition-all ${
                        activeFilter === f ? "bg-[#1a1a1a] text-white shadow-sm" : "text-gray-600 bg-white border border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2 text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.24em] text-gray-400">
                    <th className="px-3 py-2">Vehicle</th>
                    <th className="px-3 py-2">Route</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Driver</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-6 text-center text-gray-500">Loading vehicles...</td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-6 text-center text-gray-500">No vehicles match your current filters.</td>
                    </tr>
                  ) : (
                    filtered.map(bus => (
                      <tr key={bus.id} className="rounded-2xl bg-gray-50/70">
                        <td className="px-3 py-3">
                          <div className="font-semibold text-gray-900">{bus.id}</div>
                          <div className="text-xs text-gray-500">{bus.type}</div>
                        </td>
                        <td className="px-3 py-3 text-gray-600">{bus.route}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusTones[bus.status]}`}>
                            {statusLabels[bus.status]}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-gray-600">{bus.driver}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className={`${glassCard} p-4`}>
              <div className="text-[11px] uppercase tracking-[0.24em] text-orange-600 font-semibold">Maintenance Section</div>
              <h2 className="text-lg font-semibold text-gray-900 mt-2">Upcoming service</h2>
              <div className="mt-3 space-y-2.5">
                <MaintenanceItem title="LHR-002 brake inspection" detail="Due in 1 day" tone="bg-orange-50 text-orange-700" />
                <MaintenanceItem title="LHR-001 oil service" detail="Due in 3 days" tone="bg-blue-50 text-blue-700" />
              </div>
            </div>

            <div className={`${glassCard} p-4`}>
              <div className="text-[11px] uppercase tracking-[0.24em] text-red-600 font-semibold">Alerts</div>
              <h2 className="text-lg font-semibold text-gray-900 mt-2">Priority alerts</h2>
              <div className="mt-3 space-y-2.5">
                <AlertItem title="Fuel anomaly detected" detail="LHR-001 reported 12% higher usage" />
                <AlertItem title="Route delay" detail="Route 04 is running 8 min behind" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`${softCard} p-3 min-h-[84px] flex flex-col justify-between`}>
      <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-[0.24em]">{label}</div>
      <div className={`text-xl font-bold ${color} mt-2 leading-tight`}>{value}</div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className={`${innerCard} px-3 py-3 text-center`}> 
      <div className="text-sm font-bold text-gray-900">{value}</div>
      <div className="text-[10px] text-gray-500 uppercase font-semibold mt-1">{label}</div>
    </div>
  )
}

function FeatureBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <span className={`text-[10px] font-semibold px-3 py-1 rounded-full ${active ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-400"}`}>
      {label}
    </span>
  )
}

function PulseRow({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-3">
      <div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-gray-400">{label}</div>
        <div className="text-sm font-semibold text-gray-900 mt-1">{value}</div>
      </div>
      <div className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${tone}`}>Live</div>
    </div>
  )
}

function TagLabel({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
      <span className="font-semibold text-gray-900">{label}:</span>
      <span>{value}</span>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function BusDetailPanel({ bus }: { bus: any }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`${glassCard} p-5`}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div>
            <div className="text-2xl font-bold text-gray-900">{bus.id}</div>
            <div className="text-sm text-gray-500 mt-1">{bus.type} • {bus.capacity} seats • {bus.year}</div>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusTones[bus.status]}`}>
            {statusLabels[bus.status]}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <DetailRow label="Route" value={bus.route} />
          <DetailRow label="Depot" value={bus.depot} />
          <DetailRow label="Driver" value={bus.driver} />
          <DetailRow label="Conductor" value={bus.conductor} />
          <DetailRow label="Shift" value={bus.shift} />
          <DetailRow label="Passengers" value={bus.passengers.toString()} />
        </div>
      </div>

      {/* Operational Metrics */}
      {bus.status === "active" && (
        <div className={`${glassCard} p-5`}>
          <div className="text-base font-semibold text-gray-900 mb-3">Today&apos;s Performance</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard label="Kilometers" value={`${bus.km} km`} color="text-blue-600" />
            <MetricCard label="Fuel Used" value={`${bus.fuel} L`} color="text-orange-600" />
            <MetricCard label="Revenue" value={bus.revenue} color="text-green-600" />
            <MetricCard label="Trips" value={bus.trips.toString()} color="text-purple-600" />
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[11px] text-gray-500 mb-1">
              <span>Schedule Adherence</span>
              <span className="font-semibold text-gray-800">{bus.onTime}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: bus.onTime }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance & Compliance */}
      <div className={`${glassCard} p-5`}>
        <div className="text-base font-semibold text-gray-900 mb-3">Maintenance & Compliance</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ComplianceRow label="Insurance" value={bus.insurance} status="ok" />
          <ComplianceRow label="Revenue License" value={bus.license} status="ok" />
          <ComplianceRow label="Emission Test" value={bus.emission} status="ok" />
          <ComplianceRow label="Fitness Certificate" value={bus.fitness} status="ok" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`${glassCard} p-5`}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-base font-semibold text-gray-900">Quick Actions</div>
          <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-gray-400">Operations</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <ActionButton label="Assign Route" icon="🛣️" />
          <ActionButton label="Assign Driver" icon="👤" />
          <ActionButton label="Mark Maintenance" icon="🛠️" />
          <ActionButton label="Trip History" icon="🧾" />
          <ActionButton label="Download Report" icon="⬇️" />
          {bus.status === "maintenance" && <ActionButton label="Return to Service" variant="primary" icon="✓" />}
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={`${innerCard} p-3`}>
      <div className="text-[10px] text-gray-500 uppercase font-semibold tracking-wide">{label}</div>
      <div className="text-sm font-medium text-gray-900 mt-1">{value}</div>
    </div>
  )
}

function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`${innerCard} p-3 text-center`}>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-[10px] text-gray-500 uppercase font-semibold mt-1">{label}</div>
    </div>
  )
}

function ComplianceRow({ label, value, status }: { label: string; value: string; status: string }) {
  return (
    <div className={`${innerCard} p-3 flex items-center justify-between gap-3`}>
      <div>
        <div className="text-xs font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-500 mt-0.5">Expires: {value}</div>
      </div>
      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${status === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
        {status === "ok" ? "Valid" : "Expired"}
      </span>
    </div>
  )
}

function ActionButton({ label, variant = "default", icon }: { label: string; variant?: "default" | "primary"; icon?: string }) {
  return (
    <button className={`flex items-center justify-between rounded-2xl border px-3.5 py-3 text-left text-sm font-semibold transition-all shadow-sm ${
      variant === "primary"
        ? "border-blue-200 bg-blue-600 text-white hover:bg-blue-700"
        : "border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50 hover:text-gray-900"
    }`}>
      <span>{label}</span>
      <span className={`text-base ${variant === "primary" ? "text-blue-100" : "text-gray-400"}`}>{icon ?? "→"}</span>
    </button>
  )
}

function StatusChartCard({ label, value, width, color }: { label: string; value: string; width: string; color: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{label}</span>
        <span className="font-semibold text-gray-900">{value}</span>
      </div>
      <div className="mt-3 h-2.5 rounded-full bg-gray-200">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width }} />
      </div>
    </div>
  )
}

function AnalyticsRow({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50/70 px-3 py-3">
      <div>
        <div className="text-sm font-semibold text-gray-900">{label}</div>
        <div className="text-xs text-gray-500">{detail}</div>
      </div>
      <div className="text-sm font-semibold text-gray-900">{value}</div>
    </div>
  )
}

function MaintenanceItem({ title, detail, tone }: { title: string; detail: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-gray-900">{title}</div>
          <div className="text-xs text-gray-500 mt-1">{detail}</div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone}`}>Scheduled</span>
      </div>
    </div>
  )
}

function AlertItem({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50/70 p-3">
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      <div className="text-xs text-gray-600 mt-1">{detail}</div>
    </div>
  )
}

function IconDashboard({ className }: { className?: string }) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> }
function IconFleet({ className }: { className?: string }) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> }
function IconTruck({ className }: { className?: string }) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><rect x="1" y="3" width="15" height="13"/><polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> }
function IconUsers({ className }: { className?: string }) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
function IconMap({ className }: { className?: string }) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg> }
function IconDocument({ className }: { className?: string }) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> }
function IconTools({ className }: { className?: string }) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> }
function IconFuel({ className }: { className?: string }) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg> }
function IconBell({ className }: { className?: string }) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> }
function IconChart({ className }: { className?: string }) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg> }
function IconSearch({ className }: { className?: string }) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function IconNotification({ className }: { className?: string }) { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> }



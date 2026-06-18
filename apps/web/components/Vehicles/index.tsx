"use client"

import React, { useState } from "react"
import Link from "next/link"

const glassCard = "glass-card rounded-[36px]"
const softCard = "soft-card rounded-[24px]"
const innerCard = "soft-card rounded-[20px]"

const buses = [
  { id: "WP-ABC-1234", type: "Long Route", capacity: "45+15", route: "Colombo → Kandy", depot: "Colombo Central", status: "active", driver: "Nimal Perera", conductor: "Saman K.", shift: "Morning", km: 245, fuel: 42, revenue: "Rs 48,200", trips: 4, onTime: "94%", passengers: 52, ac: true, cctv: true, gps: true, wheelchair: false, year: 2021, insurance: "Dec 2026", license: "Mar 2027", emission: "Sep 2026", fitness: "Jun 2027" },
  { id: "WP-DEF-5678", type: "Short Route", capacity: "35+10", route: "Colombo → Galle", depot: "Galle Depot", status: "active", driver: "Kasun Silva", conductor: "Ruwan P.", shift: "Afternoon", km: 180, fuel: 38, revenue: "Rs 32,500", trips: 6, onTime: "88%", passengers: 38, ac: true, cctv: true, gps: true, wheelchair: true, year: 2022, insurance: "Aug 2026", license: "Jan 2027", emission: "Nov 2026", fitness: "Apr 2027" },
  { id: "SP-GHI-9012", type: "Luxury", capacity: "40+0", route: "Colombo → Jaffna", depot: "Colombo North", status: "maintenance", driver: "—", conductor: "—", shift: "—", km: 0, fuel: 0, revenue: "Rs 0", trips: 0, onTime: "—", passengers: 0, ac: true, cctv: true, gps: true, wheelchair: false, year: 2020, insurance: "Oct 2026", license: "May 2027", emission: "Jul 2026", fitness: "Feb 2027" },
  { id: "CP-JKL-3456", type: "Mini Bus", capacity: "25+8", route: "Kandy → Nuwara Eliya", depot: "Kandy Depot", status: "active", driver: "Tharindu J.", conductor: "Amila R.", shift: "Morning", km: 120, fuel: 28, revenue: "Rs 18,600", trips: 5, onTime: "91%", passengers: 28, ac: false, cctv: true, gps: true, wheelchair: false, year: 2019, insurance: "Apr 2026", license: "Feb 2027", emission: "Aug 2026", fitness: "Dec 2026" },
  { id: "WP-MNO-7890", type: "Semi-Luxury", capacity: "42+12", route: "Colombo → Matara", depot: "Colombo South", status: "active", driver: "Dinesh Kumar", conductor: "Pradeep W.", shift: "Night", km: 310, fuel: 55, revenue: "Rs 62,800", trips: 3, onTime: "85%", passengers: 48, ac: true, cctv: false, gps: true, wheelchair: false, year: 2023, insurance: "Jan 2027", license: "Jun 2027", emission: "Oct 2026", fitness: "Aug 2027" },
  { id: "SG-PQR-2345", type: "Long Route", capacity: "50+18", route: "Galle → Kandy", depot: "Galle Depot", status: "idle", driver: "Saman B.", conductor: "—", shift: "—", km: 0, fuel: 0, revenue: "Rs 0", trips: 0, onTime: "—", passengers: 0, ac: true, cctv: true, gps: true, wheelchair: true, year: 2021, insurance: "Nov 2026", license: "Apr 2027", emission: "Jun 2026", fitness: "Jan 2027" },
]

const statusColors: Record<string, string> = {
  active: "bg-green-500",
  maintenance: "bg-orange-500",
  idle: "bg-gray-400",
}

const statusTones: Record<string, string> = {
  active: "bg-green-50 text-green-700",
  maintenance: "bg-orange-50 text-orange-700",
  idle: "bg-gray-100 text-gray-600",
}

const statusLabels: Record<string, string> = {
  active: "Active",
  maintenance: "In Maintenance",
  idle: "Idle",
}

const filters = ["All", "Active", "In Maintenance", "Idle"]

export function VehiclesPage() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [selectedBus, setSelectedBus] = useState<string | null>(null)

  const filtered = activeFilter === "All" ? buses : buses.filter(b => statusLabels[b.status] === activeFilter)
  const selected = buses.find(b => b.id === selectedBus)

  const totalBuses = buses.length
  const activeBuses = buses.filter(b => b.status === "active").length
  const maintBuses = buses.filter(b => b.status === "maintenance").length
  const avgUtil = Math.round(buses.filter(b => b.status === "active").reduce((s, b) => s + (b.passengers / 60) * 100, 0) / activeBuses)
  const avgFuel = Math.round(buses.filter(b => b.status === "active").reduce((s, b) => s + b.fuel, 0) / activeBuses)

  return (
    <div className="min-h-screen flex fleet-bg">
      <div className="flex flex-col items-center pl-5 pt-8 flex-shrink-0">
        <div className="mb-4 shrink-0">
          <Link href="/dashboard" className="text-xl font-bold tracking-tight text-gray-800">CeyTrex</Link>
        </div>
        <Sidebar current="vehicles" />
      </div>
      <main className="flex-1 p-6 pr-8 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Vehicles</h1>
            <p className="text-gray-500 text-sm mt-1">Manage and monitor your bus fleet</p>
          </div>
          <button className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
            + Add Vehicle
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatCard label="Total Buses" value={totalBuses.toString()} color="text-gray-900" />
          <StatCard label="Active" value={activeBuses.toString()} color="text-green-600" />
          <StatCard label="Maintenance" value={maintBuses.toString()} color="text-orange-600" />
          <StatCard label="Avg Utilization" value={`${avgUtil}%`} color="text-blue-600" />
          <StatCard label="Avg Fuel" value={`${avgFuel} L/trip`} color="text-purple-600" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => { setActiveFilter(f); setSelectedBus(null) }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === f ? "bg-gray-900 text-white shadow-md" : "text-gray-600 hover:bg-white/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bus Grid */}
          <div className="lg:col-span-5 space-y-4">
            {filtered.map(bus => (
              <div
                key={bus.id}
                onClick={() => setSelectedBus(bus.id === selectedBus ? null : bus.id)}
                className={`${glassCard} p-5 cursor-pointer transition-all hover:shadow-lg ${selectedBus === bus.id ? "ring-2 ring-blue-500" : ""}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-base font-bold text-gray-900">{bus.id}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{bus.type} • {bus.capacity} seats</div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusTones[bus.status]}`}>
                    {statusLabels[bus.status]}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>{bus.route}</span>
                </div>
                {bus.status === "active" && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <MiniStat label="km" value={bus.km.toString()} />
                    <MiniStat label="Trips" value={bus.trips.toString()} />
                    <MiniStat label="On-time" value={bus.onTime} />
                  </div>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <FeatureBadge active={bus.ac} label="AC" />
                  <FeatureBadge active={bus.cctv} label="CCTV" />
                  <FeatureBadge active={bus.gps} label="GPS" />
                  <FeatureBadge active={bus.wheelchair} label="♿" />
                </div>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-7">
            {selected ? (
              <BusDetailPanel bus={selected} />
            ) : (
              <div className={`${glassCard} p-12 flex items-center justify-center min-h-[500px]`}>
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <rect x="1" y="3" width="15" height="13"/><polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                  <p className="text-gray-500 text-sm">Select a bus to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`${softCard} p-4`}>
      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${color}`}>{value}</div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className={`${innerCard} px-3 py-2 text-center`}>
      <div className="text-sm font-bold text-gray-900">{value}</div>
      <div className="text-[10px] text-gray-500 uppercase font-semibold">{label}</div>
    </div>
  )
}

function FeatureBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${active ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-400"}`}>
      {label}
    </span>
  )
}

function BusDetailPanel({ bus }: { bus: typeof buses[0] }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${glassCard} p-6`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-gray-900">{bus.id}</div>
            <div className="text-sm text-gray-500">{bus.type} • {bus.capacity} seats • {bus.year}</div>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusTones[bus.status]}`}>
            {statusLabels[bus.status]}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
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
        <div className={`${glassCard} p-6`}>
          <div className="text-base font-semibold text-gray-900 mb-4">Today&apos;s Performance</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard label="Kilometers" value={`${bus.km} km`} color="text-blue-600" />
            <MetricCard label="Fuel Used" value={`${bus.fuel} L`} color="text-orange-600" />
            <MetricCard label="Revenue" value={bus.revenue} color="text-green-600" />
            <MetricCard label="Trips" value={bus.trips.toString()} color="text-purple-600" />
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
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
      <div className={`${glassCard} p-6`}>
        <div className="text-base font-semibold text-gray-900 mb-4">Maintenance & Compliance</div>
        <div className="grid grid-cols-2 gap-3">
          <ComplianceRow label="Insurance" value={bus.insurance} status="ok" />
          <ComplianceRow label="Revenue License" value={bus.license} status="ok" />
          <ComplianceRow label="Emission Test" value={bus.emission} status="ok" />
          <ComplianceRow label="Fitness Certificate" value={bus.fitness} status="ok" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`${glassCard} p-6`}>
        <div className="text-base font-semibold text-gray-900 mb-4">Quick Actions</div>
        <div className="flex flex-wrap gap-2">
          <ActionButton label="Assign Route" />
          <ActionButton label="Assign Driver" />
          <ActionButton label="Mark Maintenance" />
          <ActionButton label="Trip History" />
          <ActionButton label="Download Report" />
          {bus.status === "maintenance" && <ActionButton label="Return to Service" variant="primary" />}
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={`${innerCard} px-4 py-3`}>
      <div className="text-[10px] text-gray-500 uppercase font-semibold tracking-wide">{label}</div>
      <div className="text-sm font-medium text-gray-900 mt-0.5">{value}</div>
    </div>
  )
}

function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`${innerCard} p-4 text-center`}>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-[10px] text-gray-500 uppercase font-semibold mt-1">{label}</div>
    </div>
  )
}

function ComplianceRow({ label, value, status }: { label: string; value: string; status: string }) {
  return (
    <div className={`${innerCard} px-4 py-3 flex items-center justify-between`}>
      <div>
        <div className="text-xs font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-500 mt-0.5">Expires: {value}</div>
      </div>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
        {status === "ok" ? "Valid" : "Expired"}
      </span>
    </div>
  )
}

function ActionButton({ label, variant = "default" }: { label: string; variant?: "default" | "primary" }) {
  return (
    <button className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
      variant === "primary" ? "bg-blue-600 text-white hover:bg-blue-700" : `${softCard} text-gray-700 hover:text-gray-900`
    }`}>
      {label}
    </button>
  )
}

function Sidebar({ current }: { current: string }) {
  const items = [
    { icon: <IconDashboard />, label: "Dashboard", href: "/dashboard" },
    { icon: <IconFleet />, label: "Fleet Overview", href: "#" },
    { icon: <IconTruck />, label: "Vehicles", href: "/dashboard/vehicles", active: current === "vehicles" },
    { icon: <IconUsers />, label: "Drivers", href: "#" },
    { icon: <IconMap />, label: "Routes", href: "#" },
    { icon: <IconDocument />, label: "Trips", href: "#" },
    { icon: <IconTools />, label: "Maintenance", href: "#" },
    { icon: <IconFuel />, label: "Fuel Management", href: "#" },
    { icon: <IconBell />, label: "Alerts", href: "#" },
    { icon: <IconChart />, label: "Reports", href: "#" },
  ]

  return (
    <aside className="glass-panel w-[72px] rounded-[40px] py-5 px-3 flex flex-col items-center min-h-[650px]">
      <nav className="flex flex-col items-center gap-1.5 flex-1">
        {items.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            title={item.label}
            className={`w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200 ${
              item.active
                ? "bg-gray-900 text-white shadow-md scale-105"
                : "text-gray-500 hover:bg-white/55 hover:text-gray-800"
            }`}
          >
            {item.icon}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

/* ── Icons ── */
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

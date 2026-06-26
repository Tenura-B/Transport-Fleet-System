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

import { useSearchParams } from "next/navigation"

export function VehiclesPage() {
  const [buses, setBuses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("All")
  const [selectedBus, setSelectedBus] = useState<string | null>(null)
  
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""

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
          setBuses(sortedBuses)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchVehicles()
  }, [])

  const baseFiltered = activeFilter === "All" ? buses : buses.filter(b => statusLabels[b.status] === activeFilter)
  const filtered = baseFiltered.filter(b => b.id.toLowerCase().includes(searchQuery.toLowerCase()) || b.route.toLowerCase().includes(searchQuery.toLowerCase()))
  const selected = buses.find(b => b.id === selectedBus)

  const totalBuses = buses.length
  const activeBuses = buses.filter(b => b.status === "active").length
  const maintBuses = buses.filter(b => b.status === "maintenance").length
  const avgUtil = Math.round(buses.filter(b => b.status === "active").reduce((s, b) => s + (b.passengers / 60) * 100, 0) / activeBuses)
  const avgFuel = Math.round(buses.filter(b => b.status === "active").reduce((s, b) => s + b.fuel, 0) / activeBuses)

  return (
    <div className="relative">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Fleet Management</h1>
            <p className="text-gray-500 text-sm mt-1">Monitor live operations, capacity, and active status of all vehicles</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <StatCard label="Total Buses" value={totalBuses.toString()} color="text-gray-900" />
          <StatCard label="Active" value={activeBuses.toString()} color="text-green-600" />
          <StatCard label="Maintenance" value={maintBuses.toString()} color="text-orange-600" />
          <StatCard label="Avg Utilization" value={`${avgUtil}%`} color="text-blue-600" />
          <StatCard label="Avg Fuel" value={`${avgFuel} L/trip`} color="text-purple-600" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => { setActiveFilter(f); setSelectedBus(null) }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === f ? "bg-[#1a1a1a] text-white shadow-sm" : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Bus Grid */}
          <div className="lg:col-span-5 space-y-3">
            {filtered.map(bus => (
              <div
                key={bus.id}
                onClick={() => setSelectedBus(bus.id === selectedBus ? null : bus.id)}
                className={`${glassCard} p-4 cursor-pointer transition-all hover:shadow-lg ${selectedBus === bus.id ? "ring-2 ring-blue-500" : ""}`}
              >
                <div className="flex items-start justify-between mb-2">
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
              <div className={`${glassCard} p-8 flex items-center justify-center min-h-[500px]`}>
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
      </div>
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



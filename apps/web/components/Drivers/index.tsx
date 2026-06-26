"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"

const glassCard = "glass-card rounded-2xl"
const softCard = "soft-card rounded-xl"
const innerCard = "soft-card rounded-lg"

const statusTones: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-700",
  ON_LEAVE: "bg-orange-50 text-orange-700",
  SUSPENDED: "bg-red-50 text-red-700",
  INACTIVE: "bg-gray-100 text-gray-600",
}

const statusLabels: Record<string, string> = {
  ACTIVE: "Active",
  ON_LEAVE: "On Leave",
  SUSPENDED: "Suspended",
  INACTIVE: "Inactive",
}

const filters = ["All", "Active", "On Leave", "Inactive"]

import { useSearchParams } from "next/navigation"

export function DriversPage() {
  const [drivers, setDrivers] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [routes, setRoutes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("All")
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("access_token") || document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
        
        const [driversRes, vehiclesRes, routesRes] = await Promise.all([
          fetch("/api/drivers", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/vehicles", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/routes", { headers: { Authorization: `Bearer ${token}` } })
        ])

        if (driversRes.ok) {
          const data = await driversRes.json()
          setDrivers(data.sort((a: any, b: any) => a.fullName.localeCompare(b.fullName)))
        }
        if (vehiclesRes.ok) {
          const vData = await vehiclesRes.json()
          setVehicles(vData)
        }
        if (routesRes.ok) {
          const rData = await routesRes.json()
          setRoutes(rData)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const baseFiltered = activeFilter === "All" ? drivers : drivers.filter(d => statusLabels[d.status] === activeFilter)
  const filtered = baseFiltered.filter(d => d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || d.nationalId.toLowerCase().includes(searchQuery.toLowerCase()))
  const selected = drivers.find(d => d.id === selectedDriver)

  const totalDrivers = drivers.length
  const activeDrivers = drivers.filter(d => d.status === "ACTIVE").length
  const onLeaveDrivers = drivers.filter(d => d.status === "ON_LEAVE").length

  return (
    <div className="relative">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Drivers</h1>
            <p className="text-gray-500 text-sm mt-1">Manage driver credentials and assignments</p>
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-[#1a1a1a] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            + Register Driver
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <StatCard label="Total Drivers" value={totalDrivers.toString()} color="text-gray-900" />
          <StatCard label="Active" value={activeDrivers.toString()} color="text-green-600" />
          <StatCard label="On Leave" value={onLeaveDrivers.toString()} color="text-orange-600" />
          <StatCard label="Unassigned" value={drivers.filter(d => !d.assignedVehicleId).length.toString()} color="text-purple-600" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => { setActiveFilter(f); setSelectedDriver(null) }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === f ? "bg-[#1a1a1a] text-white shadow-sm" : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Driver Grid */}
          <div className="lg:col-span-5 space-y-3">
            {filtered.map(driver => (
              <div
                key={driver.id}
                onClick={() => setSelectedDriver(driver.id === selectedDriver ? null : driver.id)}
                className={`${glassCard} p-4 cursor-pointer transition-all hover:shadow-lg ${selectedDriver === driver.id ? "ring-2 ring-blue-500" : ""}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold overflow-hidden shrink-0">
                      {driver.photoUrl ? <img src={driver.photoUrl} alt="profile" className="w-full h-full object-cover" /> : driver.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-base font-bold text-gray-900">{driver.fullName}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{driver.nationalId}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusTones[driver.status]} shrink-0`}>
                    {statusLabels[driver.status]}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 mt-4 flex-wrap">
                  <span className="font-medium text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md">Exp: {driver.experienceYears} Years</span>
                  <span className="font-medium text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md ml-auto">
                    {driver.assignedVehicle?.registrationNumber || "No Vehicle"}
                  </span>
                  <span className="font-medium text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-md">
                    {driver.assignedRoute?.routeCode || "No Route"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-7">
            {selected ? (
              <DriverDetailPanel driver={selected} />
            ) : (
              <div className={`${glassCard} p-8 flex items-center justify-center min-h-[500px]`}>
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Select a driver to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <AddDriverModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} vehicles={vehicles} routes={routes} />
    </div>
  )
}

function DriverDetailPanel({ driver }: { driver: any }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${glassCard} p-6`}>
        <div className="flex items-start justify-between mb-2.5">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-2xl overflow-hidden shrink-0">
              {driver.photoUrl ? <img src={driver.photoUrl} alt="profile" className="w-full h-full object-cover" /> : driver.fullName.charAt(0)}
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{driver.fullName}</div>
              <div className="text-sm text-gray-500">{driver.contactNumber} • {driver.email}</div>
            </div>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusTones[driver.status]}`}>
            {statusLabels[driver.status]}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm mt-6">
          <DetailRow label="DOB" value={new Date(driver.dateOfBirth).toLocaleDateString()} />
          <DetailRow label="National ID" value={driver.nationalId} />
          <DetailRow label="Address" value={driver.address} />
          <DetailRow label="Assigned Vehicle" value={driver.assignedVehicle?.registrationNumber || "None"} />
          <DetailRow label="Assigned Route" value={driver.assignedRoute?.routeCode ? `${driver.assignedRoute.routeCode} (${driver.assignedRoute.startPoint} to ${driver.assignedRoute.endPoint})` : "None"} />
        </div>
      </div>

      {/* Professional Credentials */}
      <div className={`${glassCard} p-6`}>
        <div className="text-base font-semibold text-gray-900 mb-2.5">Professional Credentials</div>
        <div className="grid grid-cols-2 gap-3 mb-2.5">
          <DetailRow label="License No" value={driver.licenseNumber} />
          <DetailRow label="License Type" value={driver.licenseType} />
          <DetailRow label="License Expiry" value={new Date(driver.licenseExpiry).toLocaleDateString()} />
          <DetailRow label="Experience" value={`${driver.experienceYears} Years`} />
        </div>
        <div className={`${innerCard} px-4 py-3 mb-3`}>
          <div className="text-[10px] text-gray-500 uppercase font-semibold tracking-wide">Route Familiarity</div>
          <div className="text-sm font-medium text-gray-900 mt-0.5">{driver.routeFamiliarity || "—"}</div>
        </div>
        <div className={`${innerCard} px-4 py-3 mb-3`}>
          <div className="text-[10px] text-gray-500 uppercase font-semibold tracking-wide">Previous Employers</div>
          <div className="text-sm font-medium text-gray-900 mt-0.5">{driver.previousEmployers || "—"}</div>
        </div>
        {driver.trainingCerts && driver.trainingCerts.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {driver.trainingCerts.map((cert: string) => (
              <span key={cert} className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-medium">{cert}</span>
            ))}
          </div>
        )}
      </div>

      {/* Legal & Compliance */}
      <div className={`${glassCard} p-6`}>
        <div className="text-base font-semibold text-gray-900 mb-2.5">Legal & Compliance</div>
        <div className="grid grid-cols-2 gap-3">
          <ComplianceRow label="Police Clearance" status={driver.policeClearance ? "ok" : "warn"} />
          <ComplianceRow label="Medical Fitness" status={driver.medicalFitness ? "ok" : "warn"} />
          <ComplianceRow label="Insurance Coverage" status={driver.insuranceCoverage ? "ok" : "warn"} />
          <ComplianceRow label="Transport Approval" status={driver.transportApproval ? "ok" : "warn"} />
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={`${innerCard} px-4 py-3`}>
      <div className="text-[10px] text-gray-500 uppercase font-semibold tracking-wide">{label}</div>
      <div className="text-sm font-medium text-gray-900 mt-0.5">{value}</div>
    </div>
  )
}

function ComplianceRow({ label, status }: { label: string; status: string }) {
  return (
    <div className={`${innerCard} px-4 py-3 flex items-center justify-between`}>
      <div className="text-sm font-medium text-gray-900">{label}</div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${status === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
        {status === "ok" ? "Verified" : "Missing"}
      </span>
    </div>
  )
}

function AddDriverModal({ isOpen, onClose, vehicles, routes }: { isOpen: boolean; onClose: () => void; vehicles: any[]; routes: any[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    
    // Parse certs as array
    const certsStr = formData.get("trainingCerts") as string;
    const trainingCerts = certsStr ? certsStr.split(",").map(c => c.trim()).filter(c => c) : [];

    const data = {
      fullName: formData.get("fullName"),
      dateOfBirth: new Date(formData.get("dateOfBirth") as string).toISOString(),
      address: formData.get("address"),
      contactNumber: formData.get("contactNumber"),
      email: formData.get("email"),
      nationalId: formData.get("nationalId"),
      licenseNumber: formData.get("licenseNumber"),
      licenseType: formData.get("licenseType"),
      licenseExpiry: new Date(formData.get("licenseExpiry") as string).toISOString(),
      experienceYears: parseInt(formData.get("experienceYears") as string, 10),
      previousEmployers: formData.get("previousEmployers") || undefined,
      routeFamiliarity: formData.get("routeFamiliarity") || undefined,
      trainingCerts: trainingCerts,
      assignedVehicleId: formData.get("assignedVehicleId") || undefined,
      assignedRouteId: formData.get("assignedRouteId") || undefined,
      policeClearance: formData.get("policeClearance") === "on",
      medicalFitness: formData.get("medicalFitness") === "on",
      insuranceCoverage: formData.get("insuranceCoverage") === "on",
      transportApproval: formData.get("transportApproval") === "on",
    };

    try {
      const token = localStorage.getItem("access_token") || document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
      const res = await fetch("/api/drivers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to register driver.");
      }
      onClose();
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Sticky Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-orange-500 flex items-center justify-center">
              <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24" width="12" height="12"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </div>
            <h2 className="text-sm font-bold text-gray-900">Register New Driver</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        
        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto thin-scrollbar px-5 py-3.5">
          {error && <div className="mb-6 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>}

          <form id="addDriverForm" onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Details */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Personal Details</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name <span className="text-red-400">*</span></label>
                  <input name="fullName" required type="text" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all text-sm text-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Email <span className="text-red-400">*</span></label>
                  <input name="email" required type="email" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all text-sm text-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Date of Birth <span className="text-red-400">*</span></label>
                  <input name="dateOfBirth" required type="date" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all text-sm text-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Contact Number <span className="text-red-400">*</span></label>
                  <input name="contactNumber" required type="text" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all text-sm text-gray-900" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Address <span className="text-red-400">*</span></label>
                  <input name="address" required type="text" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all text-sm text-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">National ID / Passport <span className="text-red-400">*</span></label>
                  <input name="nationalId" required type="text" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all text-sm text-gray-900" />
                </div>
              </div>
            </div>

            {/* Professional Credentials */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Professional Credentials</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">License Number <span className="text-red-400">*</span></label>
                  <input name="licenseNumber" required type="text" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all text-sm text-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">License Type <span className="text-red-400">*</span></label>
                  <select name="licenseType" required className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all text-sm text-gray-900">
                    <option value="">Select type</option>
                    <option value="Light Vehicle">Light Vehicle</option>
                    <option value="Heavy Vehicle">Heavy Vehicle</option>
                    <option value="Passenger Transport">Passenger Transport</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">License Expiry Date <span className="text-red-400">*</span></label>
                  <input name="licenseExpiry" required type="date" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all text-sm text-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Experience (Years) <span className="text-red-400">*</span></label>
                  <input name="experienceYears" required type="number" min="0" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all text-sm text-gray-900" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Previous Employers</label>
                  <input name="previousEmployers" type="text" placeholder="Optional" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all text-sm text-gray-900" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Route Familiarity</label>
                  <input name="routeFamiliarity" type="text" placeholder="e.g. Colombo, Kandy (Optional)" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all text-sm text-gray-900" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Training Certificates</label>
                  <input name="trainingCerts" type="text" placeholder="e.g. Defensive Driving, First Aid (Comma separated)" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all text-sm text-gray-900" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Assigned Vehicle</label>
                  <select name="assignedVehicleId" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all text-sm text-gray-900">
                    <option value="">None (Unassigned)</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.registrationNumber} - {v.make} {v.model}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Assigned Route</label>
                  <select name="assignedRouteId" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all text-sm text-gray-900">
                    <option value="">None (Unassigned)</option>
                    {routes.map(r => (
                      <option key={r.id} value={r.id}>{r.routeCode} - {r.startPoint} to {r.endPoint}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Legal & Compliance */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Legal &amp; Compliance</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 cursor-pointer transition-all">
                  <input type="checkbox" name="policeClearance" className="w-4 h-4 accent-orange-500 rounded" />
                  <span className="text-sm font-medium text-gray-700">Police Clearance Verified</span>
                </label>
                <label className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 cursor-pointer transition-all">
                  <input type="checkbox" name="medicalFitness" className="w-4 h-4 accent-orange-500 rounded" />
                  <span className="text-sm font-medium text-gray-700">Medical Fitness Certificate</span>
                </label>
                <label className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 cursor-pointer transition-all">
                  <input type="checkbox" name="insuranceCoverage" className="w-4 h-4 accent-orange-500 rounded" />
                  <span className="text-sm font-medium text-gray-700">Personal Insurance Coverage</span>
                </label>
                <label className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-all">
                  <input type="checkbox" name="policeClearance" className="w-4 h-4 accent-[#1a1a1a] rounded" />
                  <span className="text-sm font-semibold text-gray-600">Police Clearance Verified</span>
                </label>
                <label className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-all">
                  <input type="checkbox" name="medicalFitness" className="w-4 h-4 accent-[#1a1a1a] rounded" />
                  <span className="text-sm font-semibold text-gray-600">Medical Fitness Certificate</span>
                </label>
                <label className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-all">
                  <input type="checkbox" name="insuranceCoverage" className="w-4 h-4 accent-[#1a1a1a] rounded" />
                  <span className="text-sm font-semibold text-gray-600">Personal Insurance Coverage</span>
                </label>
                <label className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-all">
                  <input type="checkbox" name="transportApproval" className="w-4 h-4 accent-[#1a1a1a] rounded" />
                  <span className="text-sm font-semibold text-gray-600">Transport Board Approval</span>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Sticky Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm shrink-0">
          <button type="button" onClick={onClose} className="px-[13px] py-[7px] rounded-lg text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors leading-tight">Cancel</button>
          <button type="submit" form="addDriverForm" disabled={loading} className="bg-[#1a1a1a] text-white px-[13px] py-[7px] rounded-lg text-xs font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm leading-tight">
            {loading && <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
            {loading ? "Saving..." : "Register Driver →"}
          </button>
        </div>

      </div>
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





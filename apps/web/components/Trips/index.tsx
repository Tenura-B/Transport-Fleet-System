"use client"

import { useState } from "react"

const glassCard = "glass-card rounded-2xl"
const softCard = "soft-card rounded-xl"

const statusTones: Record<string, string> = {
  "In Progress": "bg-blue-50 text-blue-700",
  "Completed": "bg-green-50 text-green-700",
  "Scheduled": "bg-purple-50 text-purple-700",
  "Delayed": "bg-orange-50 text-orange-700",
  "Cancelled": "bg-red-50 text-red-700",
}

const statusLabels = ["All", "In Progress", "Completed", "Scheduled", "Delayed", "Cancelled"]

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusTones[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  )
}

// Statistics Card Component
function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={`${softCard} p-3.5 border flex flex-col gap-1`}>
      <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold truncate">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  )
}

// Active Trips Summary
function ActiveTripsPanel() {
  const activeTrips = [
    { id: "TRP-201", route: "Colombo → Kandy", progress: 65 },
    { id: "TRP-202", route: "Galle → Matara", progress: 45 },
    { id: "TRP-203", route: "Kurunegala → Negombo", progress: 80 },
  ]

  return (
    <div className={`${glassCard} p-5`}>
      <h2 className="text-base font-bold text-gray-900 mb-4">Active Trips</h2>
      <div className="space-y-3">
        {activeTrips.map((trip) => (
          <div key={trip.id} className={`${softCard} p-3 border-l-4 border-blue-500`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-sm text-gray-900">{trip.id}</p>
                <p className="text-xs text-gray-600 mt-0.5">{trip.route}</p>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${trip.progress}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1.5">{trip.progress}% completed</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Recent Activities
function RecentActivities() {
  const activities = [
    { icon: "✅", message: "Trip TRP-201 completed successfully", time: "10 min ago" },
    { icon: "🚀", message: "Vehicle V102 started trip TRP-202", time: "25 min ago" },
    { icon: "👤", message: "Driver assigned to trip TRP-203", time: "1 hour ago" },
    { icon: "⏳", message: "Trip TRP-205 delayed by 15 minutes", time: "2 hours ago" },
  ]

  return (
    <div className={`${glassCard} p-5`}>
      <h2 className="text-base font-bold text-gray-900 mb-4">Recent Activities</h2>
      <div className="space-y-3">
        {activities.map((activity, idx) => (
          <div key={idx} className={`${softCard} p-3 flex gap-3`}>
            <div className="text-lg flex-shrink-0">{activity.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700">{activity.message}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Alerts Section
function AlertsSection() {
  const alerts = [
    { icon: "⏳", message: "Trip TRP-205 delayed by 15 minutes", severity: "warning" },
    { icon: "⚠️", message: "Vehicle V110 mechanical breakdown", severity: "critical" },
    { icon: "⚠️", message: "Driver Mike Johnson unavailable", severity: "warning" },
  ]

  const severityColors = {
    warning: "border-orange-200 bg-orange-50",
    critical: "border-red-200 bg-red-50",
    info: "border-blue-200 bg-blue-50",
  } as Record<string, string>

  return (
    <div className={`${glassCard} p-5`}>
      <h2 className="text-base font-bold text-gray-900 mb-4">Alerts</h2>
      <div className="space-y-2">
        {alerts.map((alert, idx) => (
          <div key={idx} className={`${softCard} p-3 border-l-4 ${severityColors[alert.severity]}`}>
            <p className="text-sm font-medium text-gray-800">
              <span className="mr-2">{alert.icon}</span>
              {alert.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Trips() {
  const [activeFilter, setActiveFilter] = useState("All")

  const trips = [
    {
      id: "TRP-201",
      route: "Colombo → Kandy",
      vehicle: "V102",
      driver: "John Doe",
      departure: "08:30 AM",
      arrival: "10:45 AM",
      status: "Completed",
    },
    {
      id: "TRP-202",
      route: "Galle → Matara",
      vehicle: "V105",
      driver: "Jane Smith",
      departure: "09:15 AM",
      arrival: "11:20 AM",
      status: "In Progress",
    },
    {
      id: "TRP-203",
      route: "Kurunegala → Negombo",
      vehicle: "V108",
      driver: "Mike Johnson",
      departure: "07:00 AM",
      arrival: "09:30 AM",
      status: "Completed",
    },
    {
      id: "TRP-204",
      route: "Matara → Galle",
      vehicle: "V110",
      driver: "Sarah Williams",
      departure: "02:00 PM",
      arrival: "03:15 PM",
      status: "Scheduled",
    },
    {
      id: "TRP-205",
      route: "Negombo → Colombo",
      vehicle: "V112",
      driver: "Tom Brown",
      departure: "04:30 PM",
      arrival: "—",
      status: "Delayed",
    },
  ]

  const filteredTrips = activeFilter === "All" ? trips : trips.filter((t) => t.status === activeFilter)

  const totalTrips = trips.length
  const activeTrips = trips.filter((t) => t.status === "In Progress").length
  const completedTrips = trips.filter((t) => t.status === "Completed").length
  const scheduledTrips = trips.filter((t) => t.status === "Scheduled").length

  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Trips Management</h1>
            <p className="text-gray-500 text-sm mt-2">Monitor and manage all fleet trips in real-time</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Total Trips" value={totalTrips} />
          <StatCard label="Active Trips" value={activeTrips} />
          <StatCard label="Completed" value={completedTrips} />
          <StatCard label="Scheduled" value={scheduledTrips} />
        </div>

        {/* Active Trips and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActiveTripsPanel />
          <AlertsSection />
        </div>

        {/* Recent Activities */}
        <RecentActivities />

        {/* Trips Table */}
        <div className={`${glassCard} p-5`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
            <h2 className="text-base font-bold text-gray-900">All Trips</h2>
            <div className="flex gap-2 flex-wrap">
              {statusLabels.map((label) => (
                <button
                  key={label}
                  onClick={() => setActiveFilter(label)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeFilter === label
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Trip ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Route</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Vehicle</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Driver</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Departure</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Arrival</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrips.length > 0 ? (
                  filteredTrips.map((trip) => (
                    <tr key={trip.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-gray-900">{trip.id}</td>
                      <td className="py-3 px-4 text-gray-700 text-sm">{trip.route}</td>
                      <td className="py-3 px-4 text-gray-700 text-sm">{trip.vehicle}</td>
                      <td className="py-3 px-4 text-gray-700 text-sm">{trip.driver}</td>
                      <td className="py-3 px-4 text-gray-700 text-sm">{trip.departure}</td>
                      <td className="py-3 px-4 text-gray-700 text-sm">{trip.arrival}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={trip.status} />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800 font-semibold text-xs">View</button>
                          <button className="text-green-600 hover:text-green-800 font-semibold text-xs">Track</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      No trips found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

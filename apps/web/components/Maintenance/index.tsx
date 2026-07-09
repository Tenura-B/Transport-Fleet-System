"use client"

import { useState, useEffect } from "react"

const glassCard = "glass-card rounded-2xl"
const softCard = "soft-card rounded-xl"

const statusTones: Record<string, string> = {
  "Operational": "bg-green-50 text-green-700",
  "Under Maintenance": "bg-blue-50 text-blue-700",
  "Scheduled": "bg-purple-50 text-purple-700",
  "Completed": "bg-green-50 text-green-700",
  "Overdue": "bg-red-50 text-red-700",
  "Out of Service": "bg-gray-50 text-gray-700",
}

const statusLabels = ["All", "Operational", "Under Maintenance", "Scheduled", "Overdue", "Out of Service"]

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

// Maintenance Status Donut Chart
function MaintenanceStatusChart() {
  const data = [
    { label: "Operational", value: 28, color: "#10b981" },
    { label: "Under Maintenance", value: 8, color: "#3b82f6" },
    { label: "Scheduled Service", value: 5, color: "#f59e0b" },
    { label: "Out of Service", value: 2, color: "#ef4444" },
  ]

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className={`${glassCard} p-5`}>
      <h2 className="text-base font-bold text-gray-900 mb-4">Maintenance Status</h2>
      <div className="flex items-center justify-center">
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {data.map((item, idx) => {
              let startAngle = 0
              for (let i = 0; i < idx; i++) {
                startAngle += (data[i].value / total) * 360
              }
              const endAngle = startAngle + (item.value / total) * 360
              const radius = 30
              const circumference = 2 * Math.PI * radius
              const offset = circumference - (item.value / total) * circumference

              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{
                    transform: `rotate(${startAngle}deg)`,
                    transformOrigin: "50% 50%",
                    transition: "stroke-dashoffset 0.35s",
                  }}
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{total}</p>
              <p className="text-xs text-gray-600">Vehicles</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
            <p className="text-xs text-gray-700">
              {item.label}: {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Monthly Maintenance Trend Chart
function MonthlyTrendChart() {
  const data = [
    { month: "Jan", jobs: 12 },
    { month: "Feb", jobs: 15 },
    { month: "Mar", jobs: 18 },
    { month: "Apr", jobs: 14 },
    { month: "May", jobs: 22 },
    { month: "Jun", jobs: 19 },
  ]

  const maxJobs = Math.max(...data.map((d) => d.jobs))
  const minJobs = Math.min(...data.map((d) => d.jobs))
  const avgJobs = Math.round(data.reduce((sum, d) => sum + d.jobs, 0) / data.length)
  const chartHeight = 180
  const padding = 30

  // Generate SVG path for line chart
  const points = data.map((item, idx) => {
    const x = (idx / (data.length - 1)) * (100 - padding)
    const y = 100 - ((item.jobs - minJobs) / (maxJobs - minJobs)) * 80
    return { x: x + padding / 2, y, jobs: item.jobs }
  })

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
  const fillPath = `${pathD} L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z`

  return (
    <div className={`${glassCard} p-6`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-base font-bold text-gray-900">Monthly Maintenance Trend</h2>
          <p className="text-xs text-gray-600 mt-1">Service jobs over the last 6 months</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-600">Average</p>
          <p className="text-lg font-bold text-blue-600">{avgJobs} jobs</p>
        </div>
      </div>

      <div className="relative" style={{ height: `${chartHeight}px` }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((line) => (
            <line
              key={`grid-${line}`}
              x1="0"
              y1={line}
              x2="100"
              y2={line}
              stroke="#f0f0f0"
              strokeWidth="0.5"
            />
          ))}
          {/* Area fill */}
          <path d={fillPath} fill="url(#areaGradient)" opacity="0.2" />
          {/* Line */}
          <path d={pathD} stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Data points */}
          {points.map((point, idx) => (
            <circle key={`dot-${idx}`} cx={point.x} cy={point.y} r="1.5" fill="#3b82f6" />
          ))}
        </svg>
      </div>

      {/* Legend and data points */}
      <div className="mt-6 grid grid-cols-6 gap-2">
        {data.map((item, idx) => (
          <div key={item.month} className="text-center">
            <p className="text-xs font-semibold text-gray-700">{item.month}</p>
            <div className="mt-1 px-2 py-1 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm font-bold text-blue-700">{item.jobs}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-600">Highest</p>
          <p className="text-lg font-bold text-gray-900">{maxJobs} jobs</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Average</p>
          <p className="text-lg font-bold text-blue-600">{avgJobs} jobs</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Lowest</p>
          <p className="text-lg font-bold text-gray-900">{minJobs} jobs</p>
        </div>
      </div>
    </div>
  )
}

// Maintenance Cost Chart
function MaintenanceCostChart() {
  const data = [
    { service: "Engine Repairs", cost: 4200, color: "red", bgColor: "bg-red-50", borderColor: "border-red-200", textColor: "text-red-700", icon: "🔧" },
    { service: "Oil Changes", cost: 1800, color: "blue", bgColor: "bg-blue-50", borderColor: "border-blue-200", textColor: "text-blue-700", icon: "🛢️" },
    { service: "Tire Replacements", cost: 2400, color: "purple", bgColor: "bg-purple-50", borderColor: "border-purple-200", textColor: "text-purple-700", icon: "🛞" },
    { service: "Brake Services", cost: 2100, color: "orange", bgColor: "bg-orange-50", borderColor: "border-orange-200", textColor: "text-orange-700", icon: "🛑" },
  ]

  const maxCost = Math.max(...data.map((d) => d.cost))
  const totalCost = data.reduce((sum, d) => sum + d.cost, 0)

  const gradients = {
    red: "linear-gradient(to right, rgb(220, 38, 38), rgb(239, 68, 68))",
    blue: "linear-gradient(to right, rgb(37, 99, 235), rgb(59, 130, 246))",
    purple: "linear-gradient(to right, rgb(147, 51, 234), rgb(168, 85, 247))",
    orange: "linear-gradient(to right, rgb(194, 65, 12), rgb(234, 88, 12))",
  }

  return (
    <div className={`${glassCard} p-5`}>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-base font-bold text-gray-900">Maintenance Costs</h2>
          <p className="text-xs text-gray-600 mt-0.5">Service breakdown</p>
        </div>
        <div className={`${softCard} px-3 py-2 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200`}>
          <p className="text-xs text-blue-600 font-bold">Total</p>
          <p className="text-lg font-bold text-blue-900">Rs {totalCost.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item) => {
          const percentage = (item.cost / totalCost) * 100
          return (
            <div key={item.service} className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-2">
                    <p className="text-xs font-semibold text-gray-700 truncate">{item.service}</p>
                    <div className="flex items-baseline gap-1.5 flex-shrink-0">
                      <p className="text-xs font-bold text-gray-900">Rs {item.cost.toLocaleString()}</p>
                      <p className={`text-xs font-bold ${item.textColor} ${item.bgColor} px-2 py-0.5 rounded-full`}>{percentage.toFixed(0)}%</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden ml-6">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    background: gradients[item.color as keyof typeof gradients],
                  }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-4 gap-2 text-center">
        {data.map((item) => {
          return (
            <div key={item.service}>
              <p className="text-xs text-gray-600">{item.service.split(" ")[0]}</p>
              <p className="text-sm font-bold text-gray-900 mt-1">Rs {(item.cost / 1000).toFixed(1)}k</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Upcoming Services Panel
function UpcomingServicesPanel({ records }: { records: any[] }) {
  const upcoming = records.filter(r => r.status === "Scheduled").slice(0, 3).map(r => ({
    vehicle: r.vehicle,
    service: r.serviceType,
    dueIn: r.lastService,
    urgency: "normal"
  }))

  const urgencyColors = {
    high: "border-red-300 bg-red-50",
    normal: "border-orange-300 bg-orange-50",
    low: "border-blue-300 bg-blue-50",
  } as Record<string, string>

  return (
    <div className={`${glassCard} p-5`}>
      <h2 className="text-base font-bold text-gray-900 mb-4">Upcoming Services</h2>
      <div className="space-y-2">
        {upcoming.map((item, idx) => (
          <div key={idx} className={`${softCard} p-3 border-l-4 ${urgencyColors[item.urgency]}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-sm text-gray-900">{item.vehicle}</p>
                <p className="text-xs text-gray-600 mt-0.5">{item.service}</p>
              </div>
            </div>
            <p className="text-xs text-gray-700 mt-2 font-medium">{item.dueIn}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Recent Activities
function RecentActivities({ records }: { records: any[] }) {
  const activities = records.slice(0, 4).map(r => ({
    icon: r.status === "Operational" ? "✅" : r.status === "Scheduled" ? "📋" : "🔧",
    message: `${r.vehicle} ${r.serviceType} ${r.status}`,
    time: r.lastService
  }))

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
function AlertsSection({ alerts }: { alerts: any[] }) {
  const mappedAlerts = alerts.slice(0, 4).map(a => ({
    icon: a.severity === "CRITICAL" ? "⚠️" : a.severity === "WARNING" ? "🔍" : "ℹ️",
    message: a.message,
    severity: a.severity.toLowerCase()
  }))

  const severityColors = {
    warning: "border-orange-200 bg-orange-50",
    critical: "border-red-200 bg-red-50",
    info: "border-blue-200 bg-blue-50",
  } as Record<string, string>

  return (
    <div className={`${glassCard} p-5`}>
      <h2 className="text-base font-bold text-gray-900 mb-4">Alerts</h2>
      <div className="space-y-2">
        {mappedAlerts.map((alert, idx) => (
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



export function Maintenance() {
  const [activeFilter, setActiveFilter] = useState("All")

  const [maintenanceRecords, setMaintenanceRecords] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMaintenanceRecords() {
      try {
        const token = localStorage.getItem("access_token") || document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
        const [resMaintenance, resAlerts] = await Promise.all([
          fetch("/api/maintenance", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/alerts", { headers: { Authorization: `Bearer ${token}` } })
        ])

        if (resMaintenance.ok) {
          const data = await resMaintenance.json()
          const mappedRecords = data.map((r: any) => ({
            id: r.id.slice(0, 8).toUpperCase(),
            vehicle: r.vehicle?.registrationNumber || "Unknown",
            serviceType: r.type || "Service",
            lastService: new Date(r.dateScheduled).toLocaleDateString(),
            nextService: r.dateCompleted ? new Date(r.dateCompleted).toLocaleDateString() : "Pending",
            status: r.status === "COMPLETED" ? "Operational" : r.status === "IN_PROGRESS" ? "Under Maintenance" : "Scheduled",
            cost: `Rs ${r.cost.toLocaleString()}`,
          }))
          setMaintenanceRecords(mappedRecords)
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
    fetchMaintenanceRecords()
  }, [])

  const filteredRecords = activeFilter === "All" ? maintenanceRecords : maintenanceRecords.filter((r) => r.status === activeFilter)

  const totalVehicles = 43
  const underMaintenance = maintenanceRecords.filter((r) => r.status === "Under Maintenance").length
  const upcomingServices = maintenanceRecords.filter((r) => r.status === "Scheduled").length
  const overdue = maintenanceRecords.filter((r) => r.status === "Overdue").length
  const totalCost = "Rs 10,500"

  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Maintenance Management</h1>
            <p className="text-gray-500 text-sm mt-2">Track vehicle maintenance, schedule services, and monitor costs</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
              Schedule Service
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
              Create Work Order
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
              Add Record
            </button>
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
              Generate Report
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <StatCard label="Total Vehicles" value={totalVehicles} />
          <StatCard label="Under Maintenance" value={underMaintenance} />
          <StatCard label="Upcoming Services" value={upcomingServices} />
          <StatCard label="Overdue Services" value={overdue} />
          <StatCard label="Total Maintenance Cost" value={totalCost} />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MaintenanceStatusChart />
          <MonthlyTrendChart />
        </div>
        {/* Maintenance Cost Chart */}
        <MaintenanceCostChart />

        {/* Upcoming Services and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <UpcomingServicesPanel records={maintenanceRecords} />
          <RecentActivities records={maintenanceRecords} />
          <AlertsSection alerts={alerts} />
        </div>

        {/* Maintenance Records Table */}
        <div className={`${glassCard} p-5`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
            <h2 className="text-base font-bold text-gray-900">Maintenance Records</h2>
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
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">MR ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Vehicle</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Service Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Last Service</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Next Service</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Cost</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-gray-900">{record.id}</td>
                      <td className="py-3 px-4 text-gray-700 text-sm font-semibold">{record.vehicle}</td>
                      <td className="py-3 px-4 text-gray-700 text-sm">{record.serviceType}</td>
                      <td className="py-3 px-4 text-gray-700 text-sm">{record.lastService}</td>
                      <td className="py-3 px-4 text-gray-700 text-sm">{record.nextService}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={record.status} />
                      </td>
                      <td className="py-3 px-4 text-gray-900 font-semibold text-sm">{record.cost}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800 font-semibold text-xs">View</button>
                          <button className="text-orange-600 hover:text-orange-800 font-semibold text-xs">Edit</button>
                          <button className="text-green-600 hover:text-green-800 font-semibold text-xs">Invoice</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      No records found
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

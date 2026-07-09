"use client"

import { useState, useEffect } from "react"

const glassCard = "bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg"
const softCard = "bg-white/50 backdrop-blur-sm rounded-xl border border-white/40"

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const statusTones: Record<string, string> = {
    normal: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-orange-50 text-orange-700 border-orange-200",
    critical: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-blue-50 text-blue-700 border-blue-200",
  }

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusTones[status] || statusTones.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// Stat Card Component
function StatCard({ label, value, unit }: { icon?: string; label: string; value: string | number; unit?: string }) {
  return (
    <div className={`${softCard} p-3.5 border flex flex-col gap-1.5`}>
      <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold truncate">{label}</p>
      <p className="text-lg font-bold text-gray-900">
        {value}
        {unit && <span className="text-xs text-gray-500 ml-1.5 font-medium">{unit}</span>}
      </p>
    </div>
  )
}

// Fuel Consumption Trend Chart
function FuelConsumptionChart() {
  const data = [
    { week: "Week 1", consumption: 350, label: "350L" },
    { week: "Week 2", consumption: 420, label: "420L" },
    { week: "Week 3", consumption: 380, label: "380L" },
    { week: "Week 4", consumption: 450, label: "450L" },
  ]

  const maxConsumption = Math.max(...data.map((d) => d.consumption))
  const avgConsumption = Math.round(data.reduce((sum, d) => sum + d.consumption, 0) / data.length)
  const totalConsumption = data.reduce((sum, d) => sum + d.consumption, 0)

  return (
    <div className={`${glassCard} p-5`}>
      <h2 className="text-base font-bold text-gray-900 mb-4">Fuel Consumption Trend</h2>
      <svg viewBox="0 0 300 150" className="w-full h-32">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1="0" y1="30" x2="300" y2="30" stroke="rgb(229, 231, 235)" strokeWidth="1" strokeDasharray="4" />
        <line x1="0" y1="60" x2="300" y2="60" stroke="rgb(229, 231, 235)" strokeWidth="1" strokeDasharray="4" />
        <line x1="0" y1="90" x2="300" y2="90" stroke="rgb(229, 231, 235)" strokeWidth="1" strokeDasharray="4" />

        {/* Area fill */}
        <path
          d={`M 20 ${120 - (data[0].consumption / maxConsumption) * 100} L ${20 + 85} ${120 - (data[1].consumption / maxConsumption) * 100} L ${20 + 170} ${120 - (data[2].consumption / maxConsumption) * 100} L ${20 + 255} ${120 - (data[3].consumption / maxConsumption) * 100} L ${20 + 255} 120 L 20 120 Z`}
          fill="url(#lineGradient)"
        />

        {/* Line */}
        <polyline
          points={`20,${120 - (data[0].consumption / maxConsumption) * 100} ${20 + 85},${120 - (data[1].consumption / maxConsumption) * 100} ${20 + 170},${120 - (data[2].consumption / maxConsumption) * 100} ${20 + 255},${120 - (data[3].consumption / maxConsumption) * 100}`}
          fill="none"
          stroke="rgb(59, 130, 246)"
          strokeWidth="2"
        />

        {/* Data points */}
        {data.map((item, idx) => (
          <circle
            key={idx}
            cx={20 + idx * 85}
            cy={120 - (item.consumption / maxConsumption) * 100}
            r="3"
            fill="rgb(59, 130, 246)"
          />
        ))}

        {/* X-axis labels */}
        {data.map((item, idx) => (
          <text key={idx} x={20 + idx * 85} y="135" textAnchor="middle" className="text-xs fill-gray-600" fontSize="11">
            {item.week}
          </text>
        ))}
      </svg>

      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-xs">
        <div>
          <p className="text-gray-600">Average</p>
          <p className="font-bold text-gray-900">{avgConsumption}L</p>
        </div>
        <div>
          <p className="text-gray-600">Total</p>
          <p className="font-bold text-gray-900">{totalConsumption}L</p>
        </div>
        <div>
          <p className="text-gray-600">Peak</p>
          <p className="font-bold text-gray-900">{maxConsumption}L</p>
        </div>
      </div>
    </div>
  )
}

// Fuel Cost Analysis Chart
function FuelCostAnalysisChart() {
  const costData = [
    { type: "Diesel", cost: 28500, percentage: 65, color: "bg-blue-500" },
    { type: "Petrol", cost: 12300, percentage: 28, color: "bg-orange-500" },
    { type: "CNG", cost: 3200, percentage: 7, color: "bg-green-500" },
  ]

  const totalCost = costData.reduce((sum, d) => sum + d.cost, 0)

  return (
    <div className={`${glassCard} p-5`}>
      <h2 className="text-base font-bold text-gray-900 mb-4">Fuel Cost Analysis</h2>

      {/* Horizontal bars */}
      <div className="space-y-4">
        {costData.map((item) => (
          <div key={item.type}>
            <div className="flex justify-between items-center mb-1.5">
              <p className="text-xs font-semibold text-gray-700">{item.type}</p>
              <span className="text-xs font-bold text-gray-900">Rs {item.cost.toLocaleString()}</span>
            </div>
            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div className={`${item.color} h-full transition-all duration-500`} style={{ width: `${item.percentage}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{item.percentage}% of total</p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600">Total Fuel Cost</p>
        <p className="text-lg font-bold text-gray-900">Rs {totalCost.toLocaleString()}</p>
      </div>
    </div>
  )
}

// Vehicle Fuel Usage Chart
function VehicleFuelUsageChart() {
  const vehicleData = [
    { vehicle: "V-101", consumption: 120, efficiency: "14 km/L", color: "bg-blue-500" },
    { vehicle: "V-102", consumption: 90, efficiency: "16 km/L", color: "bg-purple-500" },
    { vehicle: "V-103", consumption: 150, efficiency: "12 km/L", color: "bg-red-500" },
    { vehicle: "V-104", consumption: 110, efficiency: "15 km/L", color: "bg-orange-500" },
    { vehicle: "V-105", consumption: 95, efficiency: "17 km/L", color: "bg-green-500" },
  ]

  const maxUsage = Math.max(...vehicleData.map((v) => v.consumption))

  return (
    <div className={`${glassCard} p-5`}>
      <h2 className="text-base font-bold text-gray-900 mb-4">Vehicle Fuel Usage</h2>

      <div className="space-y-2.5">
        {vehicleData.map((item) => {
          const percentage = (item.consumption / maxUsage) * 100
          return (
            <div key={item.vehicle}>
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-semibold text-gray-700">{item.vehicle}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900">{item.consumption}L</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{item.efficiency}</span>
                </div>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className={`${item.color} h-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Recent Transactions Panel
function RecentTransactionsPanel({ records }: { records: any[] }) {
  const transactions = records.slice(0, 3).map(r => ({
    id: r.id, vehicle: r.vehicle, liters: r.quantity, cost: r.cost, time: r.date, icon: "⛽"
  }))

  return (
    <div className={`${glassCard} p-5`}>
      <h2 className="text-base font-bold text-gray-900 mb-4">Recent Transactions</h2>
      <div className="space-y-2.5">
        {transactions.map((tx) => (
          <div key={tx.id} className={`${softCard} p-3 border flex justify-between items-center`}>
            <div className="flex items-center gap-3">
              <span className="text-lg">{tx.icon}</span>
              <div>
                <p className="text-xs font-semibold text-gray-900">{tx.vehicle}</p>
                <p className="text-xs text-gray-500">{tx.time}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-900">{tx.liters}L</p>
              <p className="text-xs font-semibold text-blue-600">Rs {tx.cost.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Alerts Section
function AlertsSection({ alerts }: { alerts: any[] }) {
  const mappedAlerts = alerts.slice(0, 3).map(a => ({
    id: a.id,
    message: a.message,
    severity: a.severity.toLowerCase(),
    icon: a.severity === "CRITICAL" ? "🚨" : "⚠️"
  }))

  const alertColors = {
    critical: "border-red-300 bg-red-50",
    warning: "border-orange-300 bg-orange-50",
    info: "border-blue-300 bg-blue-50",
  } as Record<string, string>

  return (
    <div className={`${glassCard} p-5`}>
      <h2 className="text-base font-bold text-gray-900 mb-4">Alerts</h2>
      <div className="space-y-2">
        {mappedAlerts.map((alert) => (
          <div key={alert.id} className={`${softCard} p-3 border-l-4 ${alertColors[alert.severity]}`}>
            <div className="flex items-start gap-2">
              <span className="text-lg flex-shrink-0">{alert.icon}</span>
              <p className="text-xs text-gray-700">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Fuel Efficiency Ranking
function EfficiencyRankingPanel() {
  const ranking = [
    { rank: 1, vehicle: "V-105", efficiency: "17 km/L", badge: "🥇" },
    { rank: 2, vehicle: "V-102", efficiency: "16 km/L", badge: "🥈" },
    { rank: 3, vehicle: "V-104", efficiency: "15 km/L", badge: "🥉" },
  ]

  return (
    <div className={`${glassCard} p-5`}>
      <h2 className="text-base font-bold text-gray-900 mb-4">Efficiency Ranking</h2>
      <div className="space-y-2.5">
        {ranking.map((item) => (
          <div key={item.rank} className={`${softCard} p-3 border flex justify-between items-center`}>
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.badge}</span>
              <div>
                <p className="text-xs font-semibold text-gray-900">{item.vehicle}</p>
                <p className="text-xs text-gray-500">Rank #{item.rank}</p>
              </div>
            </div>
            <p className="text-sm font-bold text-green-600">{item.efficiency}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Fuel Records Table
function FuelRecordsTable({ records }: { records: any[] }) {

  const [activeFilter, setActiveFilter] = useState<string>("all")

  const fuelTypes = ["all", "Diesel", "Petrol", "CNG"]
  const filteredRecords = activeFilter === "all" ? records : records.filter((r) => r.fuelType === activeFilter)

  return (
    <div className={`${glassCard} p-5`}>
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900 mb-3">Fuel Records</h2>
        <div className="flex gap-2 flex-wrap">
          {fuelTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === type ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 uppercase">ID</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 uppercase">Vehicle</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 uppercase">Driver</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 uppercase">Fuel Type</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 uppercase">Qty (L)</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 uppercase">Cost</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 uppercase">Date</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2.5 px-3 text-xs font-semibold text-gray-900">{record.id}</td>
                <td className="py-2.5 px-3 text-xs text-gray-700">{record.vehicle}</td>
                <td className="py-2.5 px-3 text-xs text-gray-700">{record.driver}</td>
                <td className="py-2.5 px-3 text-xs">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                    {record.fuelType}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-xs font-semibold text-gray-900">{record.quantity}</td>
                <td className="py-2.5 px-3 text-xs font-bold text-gray-900">Rs {record.cost.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-xs text-gray-600">{record.date}</td>
                <td className="py-2.5 px-3 text-xs">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800 font-semibold">View</button>
                    <button className="text-orange-600 hover:text-orange-800 font-semibold">Edit</button>
                    <button className="text-red-600 hover:text-red-800 font-semibold">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Main Fuel Management Component
export default function FuelManagement() {
  const [records, setRecords] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("access_token") || document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
        const [resFuel, resAlerts] = await Promise.all([
          fetch("/api/fuel", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/alerts", { headers: { Authorization: `Bearer ${token}` } })
        ])

        if (resFuel.ok) {
          const data = await resFuel.json()
          const mappedRecords = data.map((r: any) => ({
            id: r.id.slice(0, 8).toUpperCase(),
            vehicle: r.vehicle?.registrationNumber || "Unknown",
            driver: r.vehicle?.drivers?.[0]?.fullName || "Unknown",
            fuelType: "Diesel", // hardcoded default
            quantity: r.liters,
            cost: r.cost,
            date: new Date(r.date).toLocaleDateString(),
          }))
          setRecords(mappedRecords)
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
    fetchData()
  }, [])
  return (
    <div className="flex-1 min-w-0">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fuel Management</h1>
            <p className="text-gray-600 text-sm mt-1">Monitor fuel consumption, costs, and efficiency</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm transition-colors">
              Add Fuel Record
            </button>
            <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-sm transition-colors">
              Generate Report
            </button>
            <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm transition-colors">
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <StatCard icon="🛢" label="Total Consumed" value="1,600" unit="L" />
        <StatCard icon="💰" label="Total Cost" value="44,000" unit="Rs" />
        <StatCard icon="🚗" label="Avg Efficiency" value="15.2" unit="km/L" />
        <StatCard icon="⛽" label="Entries Today" value="8" />
        <StatCard icon="📊" label="Monthly Usage" value="4,850" unit="L" />
        <StatCard icon="⚠" label="High Consumption" value="2" unit="Vehicles" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <FuelConsumptionChart />
        <FuelCostAnalysisChart />
      </div>

      {/* Vehicle Usage Chart */}
      <div className="mb-6">
        <VehicleFuelUsageChart />
      </div>

      {/* Transactions and Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <RecentTransactionsPanel records={records} />
        </div>
        <div className="lg:col-span-1">
          <EfficiencyRankingPanel />
        </div>
        <div className="lg:col-span-1">
          <AlertsSection alerts={alerts} />
        </div>
      </div>

      {/* Fuel Records Table */}
      <FuelRecordsTable records={records} />
    </div>
  )
}

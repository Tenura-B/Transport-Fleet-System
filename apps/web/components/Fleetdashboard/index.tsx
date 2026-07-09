<<<<<<< Updated upstream
import React from "react"
import Link from "next/link"
=======
import React, { useEffect, useState } from "react"
>>>>>>> Stashed changes
import { SriLankaMap } from "./SriLankaMap"

const glassCard = "glass-card rounded-2xl"
const softCard = "soft-card rounded-xl"
const innerCard = "soft-card rounded-lg"

export function FleetDashboard() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("access_token") || document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
        const res = await fetch("/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          setStats(await res.json())
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchStats()
  }, [])
  return (
    <div className="space-y-5">
      <DashboardTitle />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 flex">
          <div className="w-full flex flex-col">
            <KPICards stats={stats} />
          </div>
        </div>
        <div className="lg:col-span-7 flex">
          <div className="w-full flex flex-col">
            <FleetCoverageCard stats={stats} />
          </div>
        </div>
      </div>
<<<<<<< Updated upstream
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 space-y-5">
          <AlertsFeed />
        </div>
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FleetStatusPie />
            <FuelBreakdownPie />
          </div>
          <FuelTrendChart />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <TripStatusPanel />
        <RevenueSummaryCard />
=======
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <FleetStatusPie stats={stats} />
        <FuelBreakdownPie />
        <TripStatusPanel stats={stats} />
>>>>>>> Stashed changes
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <MaintenanceSchedule />
        <DriverStatusGrid />
      </div>
    </div>
  )
}



function DashboardTitle() {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Fleet Operations</h1>
        <p className="text-gray-500 text-sm mt-2 max-w-xl">
          Monitor vehicles, drivers, routes, fuel consumption, and fleet performance in real time.
        </p>
      </div>
      <div className={`${softCard} px-4 py-2.5 text-right shrink-0`}>
        <div className="text-xs text-gray-400 uppercase tracking-wide">Created on</div>
        <div className="text-sm font-semibold text-gray-800 mt-0.5">August 20, 2024</div>
      </div>
    </div>
  )
}

function KPICards({ stats }: { stats: any }) {
  const kpis = [
    {
      icon: <IconTruck />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      label: "Total Vehicles",
      value: stats?.vehicles?.total || "1,284",
      change: "+12%",
      positive: true,
    },
    {
      icon: <IconUsers />,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      label: "Active Drivers",
      value: stats?.drivers?.active || "856",
      change: "+8%",
      positive: true,
    },
    {
      icon: <IconRoute />,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      label: "Active Routes",
      value: stats?.routes?.total || "156",
      change: "+24%",
      positive: true,
    },
    {
      icon: <IconFuel />,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      label: "Active Trips",
      value: stats?.trips?.active || "92",
      change: "-3%",
      positive: false,
    },
  ]

  return (
    <div className={`${glassCard} p-4 flex-1 flex flex-col`}>
      <div className="text-base font-semibold text-gray-900 mb-3">Fleet Overview</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 ${kpi.iconBg} rounded-lg flex items-center justify-center ${kpi.iconColor}`}>
                {kpi.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${kpi.positive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {kpi.change}
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{kpi.label}</div>
              <div className="text-xl font-bold text-gray-900 mt-0.5">{kpi.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FleetCoverageCard({ stats }: { stats: any }) {
  return (
    <div className={`${glassCard} overflow-hidden flex-1 flex flex-col`}>
      <div className="flex flex-col lg:flex-row flex-1">
        {/* Left: Analytics */}
        <div className="lg:w-1/3 p-4 border-b lg:border-b-0 lg:border-r border-white/40">
          <div>
            <div className="text-lg font-bold text-gray-900">Fleet Coverage</div>
            <div className="text-sm text-gray-500 mt-1">Real-time vehicle tracking</div>
          </div>

          <div className="mt-2 text-center">
            <div className="text-4xl font-extrabold text-orange-500">95%</div>
            <div className="text-sm text-gray-500 mt-1">Coverage</div>
          </div>

          <div className="mt-3 space-y-2">
            <div className={`${innerCard} p-3`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <IconTruck className="text-orange-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{stats?.vehicles?.total || "1,284"}</div>
                  <div className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Total Vehicles</div>
                </div>
              </div>
            </div>
            <div className={`${innerCard} p-3`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <IconMap className="text-green-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{stats?.routes?.total || "156"}</div>
                  <div className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Active Routes</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <IconRefresh className="w-4 h-4" />
              <span>Updated 2 min ago</span>
            </div>
          </div>
        </div>

        {/* Right: Map */}
        <div className="lg:w-2/3 relative min-h-[300px] m-4 lg:m-5 rounded-xl overflow-hidden">
          <div className="absolute inset-0">
            <SriLankaMap />
          </div>
          
          {/* Location pins overlay */}
          <div className="absolute top-4 left-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <div className="mt-2 soft-card px-3 py-1.5 rounded-full text-xs font-semibold text-gray-800">
                Colombo - 542
              </div>
            </div>
          </div>
          
          <div className="absolute top-8 right-8">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div className="mt-2 soft-card px-3 py-1.5 rounded-full text-xs font-semibold text-gray-800">
                Kandy - 230
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-12 left-8">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-3.5 h-3.5 bg-white rounded-full"></div>
              </div>
              <div className="mt-2 soft-card px-3 py-1.5 rounded-full text-xs font-semibold text-gray-800">
                Galle - 185
              </div>
            </div>
          </div>
          
          <div className="absolute top-4 right-4">
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              </div>
              <div className="mt-2 soft-card px-3 py-1.5 rounded-full text-xs font-semibold text-gray-800">
                Jaffna - 120
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4">
            <button className="text-sm font-semibold text-gray-800 hover:text-gray-900 flex items-center gap-1 soft-card px-5 py-2.5 rounded-full">
              View Full Map
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfluencerDriversTable() {
  const drivers = [
    { name: "Nimal Perera", trips: "254", score: "98%", avatar: "NP", scoreTone: "bg-green-50 text-green-700" },
    { name: "Kasun Silva", trips: "221", score: "95%", avatar: "KS", scoreTone: "bg-blue-50 text-blue-700" },
    { name: "Ruwan Fernando", trips: "198", score: "93%", avatar: "RF", scoreTone: "bg-green-50 text-green-700" },
    { name: "Tharindu Jayasena", trips: "182", score: "91%", avatar: "TJ", scoreTone: "bg-orange-50 text-orange-700" },
    { name: "Dinesh Kumar", trips: "170", score: "88%", avatar: "DK", scoreTone: "bg-red-50 text-red-700" },
  ]

  return (
    <div className={`${glassCard} p-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-base font-semibold text-gray-900">Influencer Drivers</div>
        <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 soft-card px-4 py-2 rounded-full hover:text-gray-900 transition-colors">
          <IconPlus />
          Add Driver
        </button>
      </div>
      <div className="space-y-2">
        {drivers.map((driver, idx) => (
          <div
            key={idx}
            className={`${softCard} px-5 py-4 flex items-center justify-between gap-4 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                {driver.avatar}
              </div>
              <div className="font-medium text-gray-900 text-sm truncate">{driver.name}</div>
            </div>
            <div className="text-sm text-gray-600 font-medium shrink-0">{driver.trips} trips</div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${driver.scoreTone}`}>
              {driver.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FleetStatusPie({ stats }: { stats: any }) {
  const data = [
    { label: "Active", value: stats?.vehicles?.active || 842, color: "#22c55e", pct: 66 },
    { label: "Idle", value: (stats?.vehicles?.total || 1052) - (stats?.vehicles?.active || 842), color: "#f59e0b", pct: 16 },
    { label: "Maintenance", value: 132, color: "#ef4444", pct: 10 },
    { label: "Offline", value: 100, color: "#94a3b8", pct: 8 },
  ]
  const total = data.reduce((s, d) => s + d.value, 0)
  let cumulative = 0
  const radius = 70
  const cx = 100
  const cy = 100
  const stroke = 28

  return (
    <div className={`${glassCard} p-4`}>
      <div className="text-base font-semibold text-gray-900 mb-3">Fleet Status</div>
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg viewBox="0 0 200 200" className="w-44 h-44">
            {data.map((d, i) => {
              const start = cumulative
              cumulative += d.pct
              const startAngle = (start / 100) * 360 - 90
              const endAngle = (cumulative / 100) * 360 - 90
              const largeArc = d.pct > 50 ? 1 : 0
              const x1 = cx + radius * Math.cos((startAngle * Math.PI) / 180)
              const y1 = cy + radius * Math.sin((startAngle * Math.PI) / 180)
              const x2 = cx + radius * Math.cos((endAngle * Math.PI) / 180)
              const y2 = cy + radius * Math.sin((endAngle * Math.PI) / 180)
              return (
                <path key={i} d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`} fill="none" stroke={d.color} strokeWidth={stroke} strokeLinecap="round" />
              )
            })}
            <text x={cx} y={cy - 6} textAnchor="middle" className="text-2xl font-bold" fill="#111827" fontSize="24">{total}</text>
            <text x={cx} y={cy + 14} textAnchor="middle" fill="#6b7280" fontSize="11">Total</text>
          </svg>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }}></span>
              <span className="text-gray-600">{d.label}</span>
              <span className="font-semibold text-gray-800 ml-auto">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FuelBreakdownPie() {
  const data = [
    { label: "Diesel", value: 45, color: "#3b82f6" },
    { label: "Petrol", value: 25, color: "#8b5cf6" },
    { label: "Electric", value: 18, color: "#22c55e" },
    { label: "Hybrid", value: 12, color: "#f59e0b" },
  ]
  const total = data.reduce((s, d) => s + d.value, 0)
  let cumulative = 0
  const radius = 70
  const cx = 100
  const cy = 100
  const stroke = 28

  return (
    <div className={`${glassCard} p-4`}>
      <div className="text-base font-semibold text-gray-900 mb-3">Fuel Breakdown</div>
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg viewBox="0 0 200 200" className="w-44 h-44">
            {data.map((d, i) => {
              const pct = (d.value / total) * 100
              const start = cumulative
              cumulative += pct
              const startAngle = (start / 100) * 360 - 90
              const endAngle = (cumulative / 100) * 360 - 90
              const largeArc = pct > 50 ? 1 : 0
              const x1 = cx + radius * Math.cos((startAngle * Math.PI) / 180)
              const y1 = cy + radius * Math.sin((startAngle * Math.PI) / 180)
              const x2 = cx + radius * Math.cos((endAngle * Math.PI) / 180)
              const y2 = cy + radius * Math.sin((endAngle * Math.PI) / 180)
              return (
                <path key={i} d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`} fill="none" stroke={d.color} strokeWidth={stroke} strokeLinecap="round" />
              )
            })}
            <text x={cx} y={cy - 6} textAnchor="middle" className="text-2xl font-bold" fill="#111827" fontSize="24">{total}%</text>
            <text x={cx} y={cy + 14} textAnchor="middle" fill="#6b7280" fontSize="11">Usage</text>
          </svg>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }}></span>
              <span className="text-gray-600">{d.label}</span>
              <span className="font-semibold text-gray-800 ml-auto">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TripStatusPanel({ stats }: { stats: any }) {
  const trips = [
    { status: "Active", count: stats?.trips?.active || 47, color: "bg-blue-500", tone: "bg-blue-50 text-blue-700" },
    { status: "Completed", count: 182, color: "bg-green-500", tone: "bg-green-50 text-green-700" },
    { status: "Delayed", count: 12, color: "bg-orange-500", tone: "bg-orange-50 text-orange-700" },
    { status: "Cancelled", count: 5, color: "bg-red-500", tone: "bg-red-50 text-red-700" },
  ]

  return (
    <div className="lg:col-span-5">
      <div className={`${glassCard} p-4`}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-base font-semibold text-gray-900">Trip Status</div>
          <span className="text-xs text-gray-500">Today</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {trips.map((t, i) => (
            <div key={i} className={`${innerCard} p-4 text-center`}>
              <div className={`w-3 h-3 ${t.color} rounded-full mx-auto mb-2`}></div>
              <div className="text-2xl font-bold text-gray-900">{t.count}</div>
              <div className={`text-xs font-semibold mt-1 px-2 py-0.5 rounded-full inline-block ${t.tone}`}>{t.status}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <IconRefresh className="w-3.5 h-3.5" />
          <span>246 total trips today</span>
        </div>
      </div>
    </div>
  )
}

function FuelTrendChart() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const values = [3200, 2800, 3500, 3100, 3800, 2600, 3400]
  const max = Math.max(...values)
  const h = 120
  const w = 400
  const padding = 30
  const stepX = (w - padding * 2) / (days.length - 1)

  const points = values.map((v, i) => ({
    x: padding + i * stepX,
    y: h - padding - ((v - 2000) / (max - 2000)) * (h - padding * 2),
  }))

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
  const area = `${line} L ${points[points.length - 1].x} ${h - padding} L ${points[0].x} ${h - padding} Z`

  return (
    <div className={`${glassCard} p-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-base font-semibold text-gray-900">Fuel Consumption Trend</div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-green-50 text-green-700`}>-8% vs last week</span>
      </div>
      <div className={`${softCard} p-4`}>
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-32">
          <defs>
            <linearGradient id="fuelGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[2000, 2500, 3000, 3500].map((v, i) => {
            const y = h - padding - ((v - 2000) / (max - 2000)) * (h - padding * 2)
            return <line key={i} x1={padding} y1={y} x2={w - padding} y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
          })}
          <path d={area} fill="url(#fuelGrad)" />
          <path d={line} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#3b82f6" stroke="white" strokeWidth="2" />
          ))}
          {days.map((d, i) => (
            <text key={i} x={padding + i * stepX} y={h - 5} textAnchor="middle" fill="#9ca3af" fontSize="9">{d}</text>
          ))}
        </svg>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>Avg: 3,200 L/day</span>
        <span>Peak: Fri (3,800 L)</span>
      </div>
    </div>
  )
}

function AlertsFeed() {
  const alerts = [
    { type: "speed", msg: "Vehicle KL-2345 exceeded 100 km/h", time: "2 min ago", tone: "bg-red-50 text-red-600", icon: "!" },
    { type: "fuel", msg: "Low fuel alert: Bus WP-5678", time: "8 min ago", tone: "bg-orange-50 text-orange-600", icon: "F" },
    { type: "geofence", msg: "Truck SP-1234 left Colombo zone", time: "15 min ago", tone: "bg-blue-50 text-blue-600", icon: "G" },
    { type: "maint", msg: "Van GQ-9012 service due tomorrow", time: "1 hr ago", tone: "bg-yellow-50 text-yellow-700", icon: "M" },
    { type: "safe", msg: "Harsh braking detected: KL-4567", time: "2 hr ago", tone: "bg-red-50 text-red-600", icon: "B" },
  ]

  return (
    <div className={`${glassCard} p-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-base font-semibold text-gray-900">Live Alerts</div>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          5 new
        </span>
      </div>
      <div className="space-y-2">
        {alerts.map((a, i) => (
          <div key={i} className={`${softCard} px-4 py-3 flex items-start gap-3 hover:shadow-md transition-shadow`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${a.tone}`}>{a.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-800 font-medium truncate">{a.msg}</div>
              <div className="text-xs text-gray-400 mt-0.5">{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RevenueSummaryCard() {
  return (
    <div className="lg:col-span-7">
      <div className={`${glassCard} p-4`}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-base font-semibold text-gray-900">Revenue Summary</div>
          <span className="text-xs text-gray-500">This month</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${innerCard} p-4`}>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Revenue</div>
            <div className="text-xl font-bold text-gray-900 mt-1">Rs 4.2M</div>
            <div className="text-xs font-semibold text-green-600 mt-1">+18%</div>
          </div>
          <div className={`${innerCard} p-4`}>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Expenses</div>
            <div className="text-xl font-bold text-gray-900 mt-1">Rs 2.8M</div>
            <div className="text-xs font-semibold text-red-600 mt-1">+5%</div>
          </div>
          <div className={`${innerCard} p-4`}>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Profit</div>
            <div className="text-xl font-bold text-green-600 mt-1">Rs 1.4M</div>
            <div className="text-xs font-semibold text-green-600 mt-1">+32%</div>
          </div>
          <div className={`${innerCard} p-4`}>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Target</div>
            <div className="text-xl font-bold text-gray-900 mt-1">Rs 5M</div>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "84%" }}></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">84% achieved</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MaintenanceSchedule() {
  const vehicles = [
    { id: "TRK-1234", type: "Truck", service: "Oil Change", date: "Jun 18", urgency: "urgent", tone: "bg-red-50 text-red-700" },
    { id: "BUS-5678", type: "Bus", service: "Tire Rotation", date: "Jun 20", urgency: "soon", tone: "bg-orange-50 text-orange-700" },
    { id: "VAN-9012", type: "Van", service: "Brake Check", date: "Jun 22", urgency: "scheduled", tone: "bg-blue-50 text-blue-700" },
    { id: "TRK-3456", type: "Truck", service: "Engine Tune-up", date: "Jun 25", urgency: "scheduled", tone: "bg-blue-50 text-blue-700" },
  ]

  return (
    <div className="lg:col-span-6">
      <div className={`${glassCard} p-4`}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-base font-semibold text-gray-900">Maintenance Schedule</div>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 soft-card px-4 py-2 rounded-full hover:text-gray-900 transition-colors">
            <IconTools className="w-3.5 h-3.5" />
            View All
          </button>
        </div>
        <div className="space-y-2">
          {vehicles.map((v, i) => (
            <div key={i} className={`${softCard} px-5 py-4 flex items-center justify-between gap-4`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                  <IconTruck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{v.id}</div>
                  <div className="text-xs text-gray-500">{v.service}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">{v.date}</div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${v.tone}`}>{v.urgency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DriverStatusGrid() {
  const drivers = [
    { name: "Nimal P.", status: "online", avatar: "NP", trips: 12 },
    { name: "Kasun S.", status: "online", avatar: "KS", trips: 9 },
    { name: "Ruwan F.", status: "driving", avatar: "RF", trips: 11 },
    { name: "Tharindu J.", status: "driving", avatar: "TJ", trips: 8 },
    { name: "Dinesh K.", status: "break", avatar: "DK", trips: 6 },
    { name: "Amila R.", status: "online", avatar: "AR", trips: 10 },
    { name: "Saman B.", status: "offline", avatar: "SB", trips: 0 },
    { name: "Pradeep W.", status: "driving", avatar: "PW", trips: 7 },
  ]
  const statusColors: Record<string, string> = {
    online: "bg-green-500",
    driving: "bg-blue-500",
    break: "bg-yellow-500",
    offline: "bg-gray-300",
  }

  return (
    <div className="lg:col-span-6">
      <div className={`${glassCard} p-4`}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-base font-semibold text-gray-900">Driver Status</div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span>Online</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full"></span>Driving</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-500 rounded-full"></span>Break</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-gray-300 rounded-full"></span>Offline</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {drivers.map((d, i) => (
            <div key={i} className={`${softCard} p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow`}>
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-semibold">{d.avatar}</div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${statusColors[d.status]} rounded-full border-2 border-white`}></div>
              </div>
              <div className="mt-2 text-sm font-medium text-gray-900">{d.name}</div>
              <div className="text-xs text-gray-500">{d.trips > 0 ? `${d.trips} trips` : "Off duty"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function IconLogo({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M3 15a4 4 0 0 0 4 4h9a5 5 0 1 0-.1-9.999 5.002 5.002 0 1 0-9.78 2.096A4.001 4.001 0 0 0 3 15z" />
    </svg>
  )
}

function IconDashboard({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  )
}

function IconFleet({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  )
}

function IconTruck({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16,8 20,8 23,11 23,16 16,16 16,8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

function IconUsers({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconMap({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  )
}

function IconDocument({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function IconTools({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

function IconFuel({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  )
}

function IconBell({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function IconChart({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  )
}

function IconSettings({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function IconNotification({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function IconRoute({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconAnalytics({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}

function IconRefresh({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  )
}

function IconPlus({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function IconHelp({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}



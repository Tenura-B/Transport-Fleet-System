"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

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
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
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
      <path d="M3 22v-8c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v8" />
      <path d="M11 22H3" />
      <path d="M14 10V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v6" />
      <path d="M21 12.5V22" />
      <path d="M21 12.5a2.5 2.5 0 0 0-5 0V22" />
      <path d="M16 22h5" />
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
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}

export function DashboardSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { icon: <IconDashboard />, label: "Dashboard", href: "/dashboard", activeMatch: "^/dashboard$" },
    { icon: <IconFleet />, label: "Register Asset", href: "/dashboard/vehicles/register", activeMatch: "^/dashboard/vehicles/register" },
    { icon: <IconTruck />, label: "Fleet Management", href: "/dashboard/vehicles", activeMatch: "^/dashboard/vehicles(?!/register)" },
    { icon: <IconUsers />, label: "Drivers", href: "/dashboard/drivers", activeMatch: "^/dashboard/drivers" },
    { icon: <IconMap />, label: "Routes", href: "/dashboard/routes", activeMatch: "^/dashboard/routes" },
    { icon: <IconDocument />, label: "Trips", href: "/dashboard/trips", activeMatch: "^/dashboard/trips" },
    { icon: <IconTools />, label: "Maintenance", href: "/dashboard/maintenance", activeMatch: "^/dashboard/maintenance" },
    { icon: <IconFuel />, label: "Fuel Management", href: "/dashboard/fuel", activeMatch: "^/dashboard/fuel" },
    { icon: <IconBell />, label: "Alerts", href: "#", activeMatch: "^/dashboard/alerts", comingSoon: true },
    { icon: <IconChart />, label: "Reports", href: "#", activeMatch: "^/dashboard/reports", comingSoon: true },
  ]

  return (
    <aside className="glass-panel w-[72px] rounded-2xl py-4 px-3 flex flex-col items-center min-h-[500px]">
      <nav className="flex flex-col items-center gap-1.5 flex-1">
        {menuItems.map((item, idx) => {
          const isActive = new RegExp(item.activeMatch).test(pathname)
          const label = item.comingSoon ? `${item.label} - Coming soon` : item.label

          if (item.comingSoon) {
            return (
              <button
                key={idx}
                type="button"
                title={label}
                aria-label={label}
                disabled
                className="w-9 h-9 flex items-center justify-center rounded-full text-gray-300 cursor-not-allowed opacity-70"
              >
                {item.icon}
              </button>
            )
          }
          
          return (
            <Link
              key={idx}
              href={item.href}
              title={label}
              aria-label={label}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
                isActive
                  ? "bg-[#1a1a1a] text-white shadow-md scale-105"
                  : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              {item.icon}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

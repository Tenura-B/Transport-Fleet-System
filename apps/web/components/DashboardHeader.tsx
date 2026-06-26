"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "./AuthProvider"
import { useState, useRef, useEffect } from "react"
import { logout } from "@/lib/auth"

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

function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconLogout() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

export function DashboardHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const navTabs = [
    { label: "Overview", href: "/dashboard", exactMatch: true },
    { label: "Fleet Management", href: "/dashboard/vehicles", exactMatch: false },
    { label: "Drivers", href: "/dashboard/drivers", exactMatch: false },
    { label: "Routes", href: "/dashboard/routes", exactMatch: false },
    { label: "Reports", href: "#", exactMatch: false },
  ]

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U"

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="space-y-2">
      <div className="relative flex items-center justify-between gap-4">
        
        {/* Dynamic Company Branding - Placed next to nav links for wide screens */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/40 px-3 py-1.5 rounded-lg shadow-sm border border-white/20">
            {user?.company.logoUrl ? (
              <img src={user.company.logoUrl} alt={user.company.name} className="w-6 h-6 object-contain rounded" />
            ) : (
              <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-rose-500 rounded flex items-center justify-center text-white text-[10px] font-bold">
                {user?.company.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-semibold text-gray-800 text-sm hidden sm:block">{user?.company.name}</span>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1.5 flex-wrap">
            {navTabs.map((tab) => {
              const isActive = tab.exactMatch ? pathname === tab.href : pathname.startsWith(tab.href)
              
              return (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#1a1a1a] text-white shadow-sm"
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  {tab.label}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button className="w-9 h-9 rounded-lg glass-panel flex items-center justify-center text-gray-500 hover:text-orange-600 transition-colors">
            <IconSearch />
          </button>
          <button className="w-9 h-9 rounded-lg glass-panel flex items-center justify-center text-gray-500 hover:text-orange-600 transition-colors">
            <IconNotification />
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm cursor-pointer hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#F4F6FB]" 
              title={user?.email}
            >
              {userInitial}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-900 truncate">{user?.email}</p>
                  <p className="text-[10px] text-gray-500 capitalize">{user?.role.toLowerCase()}</p>
                </div>
                
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center gap-2">
                    <IconUser />
                    User Profile
                  </button>
                </div>
                
                <div className="py-1 border-t border-gray-100">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <IconLogout />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="relative max-w-md mx-auto">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <IconSearch />
        </div>
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => {
            const url = new URL(window.location.href);
            if (e.target.value) {
              url.searchParams.set("search", e.target.value);
            } else {
              url.searchParams.delete("search");
            }
            window.history.replaceState({}, "", url.toString());
            window.dispatchEvent(new Event("popstate"));
          }}
          className="w-full pl-12 pr-5 py-2 glass-panel rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        />
      </div>
    </div>
  )
}


"use client"

import { AuthProvider } from "@/components/AuthProvider"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { DashboardHeader } from "@/components/DashboardHeader"

function IconSettings() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function IconHelp() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex fleet-bg text-[13px]">
        {/* Left Global Sidebar Panel */}
        <div className="flex flex-col items-center pl-5 pt-5 flex-shrink-0">
          <div className="mb-3 shrink-0">
            {/* The dynamic logo is shown in the header now, but we can keep the static platform logo here, or remove it. 
                Let's use a subtle icon for the platform home */}
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg text-white font-bold text-xl">
              C
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center pt-5">
            <DashboardSidebar />
            
            <div className="flex flex-col items-center gap-2 mt-3 mb-5">
              <button
                title="Settings"
                className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-white/55 hover:text-gray-800 transition-all duration-200"
              >
                <IconSettings />
              </button>
              <button
                title="Help"
                className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-white/55 hover:text-gray-800 transition-all duration-200"
              >
                <IconHelp />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col p-4 pr-8 min-w-0">
          {/* Global Header */}
          <DashboardHeader />
          
          {/* Page Specific Content */}
          <div className="mt-5 flex-1 w-full">
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}

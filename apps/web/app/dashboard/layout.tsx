"use client"

import { AuthProvider } from "@/components/AuthProvider"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { DashboardHeader } from "@/components/DashboardHeader"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="h-screen overflow-hidden flex fleet-bg text-[13px]">
        {/* Sidebar */}
        <div className="pl-5 pt-5 pb-5 flex-shrink-0 h-full sticky top-0 flex flex-col">
          <DashboardSidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col p-4 pr-8 min-w-0 h-full overflow-hidden">
          <div className="shrink-0">
            <DashboardHeader />
          </div>
          
          <div className="mt-5 flex-1 w-full overflow-y-auto pr-2">
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}

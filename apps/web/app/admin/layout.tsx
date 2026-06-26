"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { getCurrentUser, AuthUser } from "@/lib/auth"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function checkAuth() {
      const currentUser = await getCurrentUser()
      if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
        router.push("/login")
      } else {
        setUser(currentUser)
      }
      setLoading(false)
    }
    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  const glassNav = "bg-white/5 border-white/10 backdrop-blur-xl"

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`w-64 border-r border-white/10 flex flex-col ${glassNav} relative z-20`}>
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-wide">Developer</h1>
              <p className="text-xs text-blue-400">Platform Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {[
            { name: "Companies", path: "/admin/companies", icon: "🏢" },
            { name: "Global Users", path: "/admin/users", icon: "👥" },
            { name: "Settings", path: "/admin/settings", icon: "⚙️" },
          ].map((item) => {
            const isActive = pathname.startsWith(item.path)
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]" 
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/5">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-medium">
              {user?.email[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.email}</p>
              <p className="text-xs text-gray-500 truncate">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Top Header */}
        <header className={`h-20 border-b border-white/10 flex items-center justify-between px-8 ${glassNav}`}>
          <div>
            <h2 className="text-xl font-semibold text-white">System Management</h2>
            <p className="text-sm text-gray-400">Manage all platform tenants and global configurations</p>
          </div>
          
          <button 
            onClick={() => {
              document.cookie = "access_token=; path=/; max-age=0";
              localStorage.removeItem("access_token");
              router.push("/login");
            }}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
          >
            Sign out
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

"use client"
import { useState, useEffect } from "react"
import { getToken } from "@/lib/auth"
import { CompanyModal } from "./CompanyModal"

type Company = {
  id: string
  name: string
  domain: string | null
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE"
  logoUrl?: string | null
  createdAt: string
  _count: {
    users: number
    vehicles: number
    drivers: number
    routes: number
  }
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)

  const fetchCompanies = async () => {
    try {
      const token = getToken()
      const res = await fetch("/api/companies", {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error("Failed to fetch companies")
      const data = await res.json()
      setCompanies(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE"
      const token = getToken()
      const res = await fetch(`/api/companies/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) throw new Error("Failed to update status")
      fetchCompanies()
    } catch (e: any) {
      alert(e.message)
    }
  }

  const handleOpenModal = (company?: Company) => {
    setEditingCompany(company || null)
    setIsModalOpen(true)
  }

  const glassCard = "bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md"

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Companies</h1>
          <p className="text-gray-400 mt-1">Manage tenant organizations</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          + Onboard Company
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          {error}
        </div>
      )}

      <div className={`${glassCard} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="p-4 font-medium text-gray-400 text-sm">Company Name</th>
                <th className="p-4 font-medium text-gray-400 text-sm">Domain</th>
                <th className="p-4 font-medium text-gray-400 text-sm">Resources</th>
                <th className="p-4 font-medium text-gray-400 text-sm">Status</th>
                <th className="p-4 font-medium text-gray-400 text-sm">Joined</th>
                <th className="p-4 font-medium text-gray-400 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {company.logoUrl ? (
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center p-1">
                          <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center shadow-inner">
                          <span className="text-lg font-bold text-gray-300">{company.name.charAt(0)}</span>
                        </div>
                      )}
                      <span className="font-semibold text-white">{company.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">
                    {company.domain || "N/A"}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-white/5 rounded-md text-xs text-gray-400 border border-white/5" title="Users">
                        👥 {company._count.users}
                      </span>
                      <span className="px-2 py-1 bg-white/5 rounded-md text-xs text-gray-400 border border-white/5" title="Vehicles">
                        🚌 {company._count.vehicles}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      company.status === 'ACTIVE' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                        : company.status === 'SUSPENDED'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                        : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}>
                      {company.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">
                    {new Date(company.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(company)}
                        className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => toggleStatus(company.id, company.status)}
                        className={`text-sm font-medium transition-colors ${
                          company.status === 'ACTIVE' 
                            ? 'text-red-400 hover:text-red-300' 
                            : 'text-emerald-400 hover:text-emerald-300'
                        }`}
                      >
                        {company.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {companies.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No companies found.
            </div>
          )}
        </div>
      </div>

      <CompanyModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        company={editingCompany}
        onSuccess={fetchCompanies}
      />
    </div>
  )
}

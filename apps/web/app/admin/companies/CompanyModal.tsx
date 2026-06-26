"use client"
import { useState, useRef, useEffect } from "react"
import { getToken } from "@/lib/auth"

type Company = {
  id?: string
  name: string
  domain: string | null
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE"
  logoUrl?: string | null
}

export function CompanyModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  company 
}: { 
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  company: Company | null
}) {
  const [formData, setFormData] = useState<Company>({
    name: "",
    domain: "",
    status: "ACTIVE",
    logoUrl: null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (company) {
      setFormData(company)
    } else {
      setFormData({
        name: "",
        domain: "",
        status: "ACTIVE",
        logoUrl: null
      })
    }
  }, [company, isOpen])

  if (!isOpen) return null

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be less than 2MB")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, logoUrl: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const token = getToken()
      const isEdit = !!company?.id
      
      const url = isEdit ? `/api/companies/${company.id}` : "/api/companies"
      const method = isEdit ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || "Failed to save company")
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/[0.02]">
          <h2 className="text-xl font-semibold text-white">
            {company?.id ? "Edit Company" : "Onboard New Company"}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Company Logo</label>
            <div className="flex items-center gap-6">
              <div 
                className="w-24 h-24 rounded-xl border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-white/10 transition-colors group relative"
                onClick={() => fileInputRef.current?.click()}
              >
                {formData.logoUrl ? (
                  <>
                    <img src={formData.logoUrl} alt="Logo preview" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white text-xs font-medium">Change</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <svg className="w-8 h-8 text-gray-500 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="text-xs text-gray-500">Upload</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-2">Upload a transparent PNG or JPG logo. Max size 2MB.</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors"
                >
                  Browse Files
                </button>
                <input 
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Company Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="e.g. Express Logistics"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Domain <span className="text-gray-500 font-normal">(Optional)</span></label>
              <input
                type="text"
                value={formData.domain || ""}
                onChange={e => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="e.g. expresslogistics.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
              >
                <option value="ACTIVE" className="bg-gray-800">Active</option>
                <option value="SUSPENDED" className="bg-gray-800">Suspended</option>
                <option value="INACTIVE" className="bg-gray-800">Inactive</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : company?.id ? "Save Changes" : "Create Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

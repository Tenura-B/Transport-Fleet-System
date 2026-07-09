"use client"
import { useState, useEffect } from "react"
import { getToken } from "@/lib/auth"
import { TestimonialModal } from "./TestimonialModal"

type Testimonial = {
  id: string
  authorName: string
  authorRole: string
  content: string
  rating: number
  isActive: boolean
  createdAt: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)

  const fetchTestimonials = async () => {
    try {
      const token = getToken()
      const res = await fetch("/api/testimonials", {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error("Failed to fetch testimonials")
      const data = await res.json()
      setTestimonials(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return
    try {
      const token = getToken()
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error("Failed to delete")
      fetchTestimonials()
    } catch (e: any) {
      setError(e.message || "Failed to delete testimonial")
    }
  }

  const toggleStatus = async (id: string, isActive: boolean) => {
    try {
      const token = getToken()
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !isActive })
      })
      if (!res.ok) throw new Error("Failed to update status")
      fetchTestimonials()
    } catch (e: any) {
      setError(e.message || "Failed to update status")
    }
  }

  const handleOpenModal = (testimonial?: Testimonial) => {
    setEditingTestimonial(testimonial || null)
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
          <h1 className="text-3xl font-bold text-white tracking-tight">Testimonials</h1>
          <p className="text-gray-400 mt-1">Manage public testimonials for the login page</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          + Add Testimonial
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
                <th className="p-4 font-medium text-gray-400 text-sm">Author</th>
                <th className="p-4 font-medium text-gray-400 text-sm">Content</th>
                <th className="p-4 font-medium text-gray-400 text-sm">Rating</th>
                <th className="p-4 font-medium text-gray-400 text-sm">Status</th>
                <th className="p-4 font-medium text-gray-400 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="font-semibold text-white">{t.authorName}</div>
                    <div className="text-xs text-gray-400 mt-1">{t.authorRole}</div>
                  </td>
                  <td className="p-4 text-gray-300 text-sm max-w-md truncate">
                    {t.content}
                  </td>
                  <td className="p-4 text-orange-400 text-sm">
                    {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleStatus(t.id, t.isActive)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        t.isActive 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:bg-emerald-500/20' 
                          : 'bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20'
                      }`}
                    >
                      {t.isActive ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(t)}
                        className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(t.id)}
                        className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {testimonials.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No testimonials found.
            </div>
          )}
        </div>
      </div>

      <TestimonialModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        testimonial={editingTestimonial}
        onSuccess={fetchTestimonials}
      />
    </div>
  )
}

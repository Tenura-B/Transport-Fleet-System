"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const glassCard = "glass-card rounded-2xl"
const softCard = "soft-card rounded-xl"
const innerCard = "bg-white/80 border border-gray-100 rounded-xl"

export function RegisterVehiclePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const formData = new FormData(e.currentTarget);
    const letters = (formData.get("plateLetters") as string).toUpperCase();
    const digits = formData.get("plateDigits") as string;
    
    const features = [];
    if (formData.get("feat_ac")) features.push("AC");
    if (formData.get("feat_cctv")) features.push("CCTV");
    if (formData.get("feat_gps")) features.push("GPS");
    if (formData.get("feat_wheelchair")) features.push("WHEELCHAIR");

    const data: any = {
      make: formData.get("make"),
      model: formData.get("model"),
      year: parseInt(formData.get("year") as string, 10),
      registrationNumber: `${letters}-${digits}`,
      capacity: parseInt(formData.get("capacity") as string, 10) || 40,
      features,
    };

    if (formData.get("insuranceExpiry")) data.insuranceExpiry = new Date(formData.get("insuranceExpiry") as string).toISOString();
    if (formData.get("roadworthinessExpiry")) data.roadworthinessExpiry = new Date(formData.get("roadworthinessExpiry") as string).toISOString();
    if (formData.get("registrationExpiry")) data.registrationExpiry = new Date(formData.get("registrationExpiry") as string).toISOString();

    try {
      const token = localStorage.getItem("access_token") || document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to add vehicle. You might not have the correct permissions.");
      }
      setSuccess("Vehicle registered successfully!");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Register Asset</h1>
          <p className="text-gray-500 text-sm mt-1">Register new vehicles and manage compliance details</p>
        </div>
        <button onClick={() => router.push("/dashboard/vehicles")} className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          View Fleet Management →
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6">
        <div className={`lg:col-span-8 ${glassCard} p-6`}>
          {error && <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">{error}</div>}
          {success && <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm rounded-xl border border-green-100">{success}</div>}
          
          <form id="addVehicleForm" onSubmit={handleSubmit} className="space-y-8">
            {/* Vehicle Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full">Vehicle Information</span>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Make <span className="text-red-400">*</span></label>
                    <input name="make" required type="text" placeholder="e.g. Ashok Leyland" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all text-sm text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Model <span className="text-red-400">*</span></label>
                    <input name="model" required type="text" placeholder="e.g. Viking" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all text-sm text-gray-900" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Year <span className="text-red-400">*</span></label>
                    <input name="year" required type="number" min="1900" max={new Date().getFullYear()} placeholder="e.g. 2021" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all text-sm text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Capacity <span className="text-red-400">*</span></label>
                    <input name="capacity" required type="number" min="1" placeholder="e.g. 42" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all text-sm text-gray-900" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Registration Number <span className="text-red-400">*</span></label>
                  <div className="flex items-center gap-2">
                    <input name="plateLetters" required pattern="^[A-Za-z]{2,3}$" title="2 or 3 English letters" maxLength={3} minLength={2} type="text" placeholder="WP" className="w-1/3 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all text-sm uppercase tracking-widest font-bold" />
                    <span className="text-gray-300 font-bold text-lg">—</span>
                    <input name="plateDigits" required pattern="^\d{4}$" title="Exactly 4 digits" maxLength={4} minLength={4} type="text" placeholder="1234" className="w-2/3 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all text-sm font-mono font-medium" />
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full">Hardware & Features</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[{name:"feat_ac",label:"Air Conditioning"},{name:"feat_cctv",label:"CCTV Camera"},{name:"feat_gps",label:"GPS Tracker"},{name:"feat_wheelchair",label:"Wheelchair Access"}].map(f => (
                  <label key={f.name} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 cursor-pointer transition-all bg-gray-50/50">
                    <input type="checkbox" name={f.name} className="w-4 h-4 accent-orange-500 rounded shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{f.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Compliance Dates */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full">Compliance Dates</span>
                <span className="text-xs font-medium text-gray-400 ml-1">(optional)</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Insurance Expiry</label>
                  <input name="insuranceExpiry" type="date" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 text-sm transition-all text-gray-900" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Roadworthiness Expiry</label>
                    <input name="roadworthinessExpiry" type="date" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 text-sm transition-all text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Registration Expiry</label>
                    <input name="registrationExpiry" type="date" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 text-sm transition-all text-gray-900" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" disabled={loading} className="bg-[#1a1a1a] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md">
                {loading && <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                {loading ? "Registering..." : "Register Asset →"}
              </button>
            </div>
          </form>
        </div>
        
        <div className="lg:col-span-4">
          <div className={`${glassCard} p-6 h-full`}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Registration Guidelines</h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">1</span>
                <p>Ensure the <b>Make and Model</b> match the physical manufacturer registration card.</p>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">2</span>
                <p>The <b>Registration Number</b> format should be exactly 2-3 uppercase letters followed by 4 digits (e.g. NA-1234).</p>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">3</span>
                <p>Check all physical <b>Hardware Features</b> so dispatchers know if the bus supports wheelchair access or AC.</p>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-bold shrink-0">!</span>
                <p><b>Compliance Dates</b> are optional during creation but must be added before assigning the vehicle to active routes to prevent legal infractions.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

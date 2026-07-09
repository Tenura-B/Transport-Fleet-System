"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type FeatureKey = "ac" | "cctv" | "gps" | "wheelchair"

interface OwnerForm {
  fullName: string
  idNumber: string
  contactNumber: string
  address: string
}

interface VehicleFeatures {
  ac: boolean
  cctv: boolean
  gps: boolean
  wheelchair: boolean
}

interface VehicleForm {
  make: string
  model: string
  year: string
  capacity: string
  plateLetters: string
  plateDigits: string
  features: VehicleFeatures
  insuranceExpiry: string
  roadworthinessExpiry: string
  registrationExpiry: string
}

const glassCard = "glass-card rounded-2xl"

const featureOptions: { key: FeatureKey; label: string }[] = [
  { key: "ac", label: "Air Conditioning" },
  { key: "cctv", label: "CCTV Camera" },
  { key: "gps", label: "GPS Tracker" },
  { key: "wheelchair", label: "Wheelchair Access" },
]

export function RegisterVehiclePage() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const [owner, setOwner] = useState<OwnerForm>({ fullName: "", idNumber: "", contactNumber: "", address: "" })
  const [vehicle, setVehicle] = useState<VehicleForm>({
    make: "",
    model: "",
    year: "",
    capacity: "",
    plateLetters: "",
    plateDigits: "",
    features: { ac: false, cctv: false, gps: false, wheelchair: false },
    insuranceExpiry: "",
    roadworthinessExpiry: "",
    registrationExpiry: "",
  })
  const [documents, setDocuments] = useState<File[]>([])

  function next() {
    setError("")
    if (step === 0) {
      if (!owner.fullName || !owner.contactNumber) {
        return setError("Please fill the owner name and contact number.")
      }
    }
    if (step === 1) {
      if (!vehicle.make || !vehicle.model || !vehicle.year || !vehicle.capacity || !vehicle.plateLetters || !vehicle.plateDigits) {
        return setError("Please complete all vehicle details before proceeding.")
      }
      if (!/^[A-Za-z]{2,3}$/.test(vehicle.plateLetters)) {
        return setError("Plate letters must be 2-3 letters.")
      }
      if (!/^\d{4}$/.test(vehicle.plateDigits)) {
        return setError("Plate digits must be exactly 4 digits.")
      }
    }
    setStep((currentStep) => Math.min(currentStep + 1, 2))
  }

  function back() {
    setError("")
    setStep((currentStep) => Math.max(currentStep - 1, 0))
  }

  async function submit() {
    setLoading(true)
    setError("")
    setSuccess("")

    const features = [] as string[]
    if (vehicle.features.ac) features.push("AC")
    if (vehicle.features.cctv) features.push("CCTV")
    if (vehicle.features.gps) features.push("GPS")
    if (vehicle.features.wheelchair) features.push("WHEELCHAIR")

    const data = {
      owner,
      make: vehicle.make,
      model: vehicle.model,
      year: parseInt(vehicle.year || "0", 10) || undefined,
      registrationNumber: `${vehicle.plateLetters.toUpperCase()}-${vehicle.plateDigits}`,
      capacity: parseInt(vehicle.capacity || "0", 10) || 0,
      features,
      insuranceExpiry: vehicle.insuranceExpiry ? new Date(vehicle.insuranceExpiry).toISOString() : undefined,
      roadworthinessExpiry: vehicle.roadworthinessExpiry ? new Date(vehicle.roadworthinessExpiry).toISOString() : undefined,
      registrationExpiry: vehicle.registrationExpiry ? new Date(vehicle.registrationExpiry).toISOString() : undefined,
    }

    try {
      const token = localStorage.getItem("access_token") || document.cookie.split('; ').find((row) => row.startsWith('access_token='))?.split('=')[1]
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ message: undefined }))
        throw new Error(errData.message || "Failed to register vehicle")
      }
      setSuccess("Vehicle registered successfully!")
      setOwner({ fullName: "", idNumber: "", contactNumber: "", address: "" })
      setVehicle({
        make: "",
        model: "",
        year: "",
        capacity: "",
        plateLetters: "",
        plateDigits: "",
        features: { ac: false, cctv: false, gps: false, wheelchair: false },
        insuranceExpiry: "",
        roadworthinessExpiry: "",
        registrationExpiry: "",
      })
      setDocuments([])
      setStep(0)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to register vehicle")
    } finally {
      setLoading(false)
    }
  }

  const steps = ["Owner Details", "Vehicle Details", "Documents"]

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Vehicle Registration</h1>
          <p className="text-gray-500 text-sm mt-1">A guided multi-step form to register vehicles</p>
        </div>
        <button onClick={() => router.push("/dashboard/vehicles")} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          View Fleet
        </button>
      </div>

      <div className="mt-6 space-y-5">
        <div className={`${glassCard} p-6 w-full`}>
          {error && <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">{error}</div>}
          {success && <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm rounded-xl border border-green-100">{success}</div>}

          <div className="mb-6">
            <div className="flex items-center gap-4">
              {steps.map((stepLabel, index) => (
                <div key={stepLabel} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${index === step ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {index + 1}
                  </div>
                  <div className="hidden md:block">
                    <div className={`text-sm font-semibold ${index === step ? 'text-gray-900' : 'text-gray-500'}`}>{stepLabel}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {step === 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full">Owner Details</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                    <input value={owner.fullName} onChange={(e) => setOwner({ ...owner, fullName: e.target.value })} type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="e.g. Jonathan Ari" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">NIC / ID Number</label>
                    <input value={owner.idNumber} onChange={(e) => setOwner({ ...owner, idNumber: e.target.value })} type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="e.g. 199012345678" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contact Number <span className="text-red-400">*</span></label>
                    <input value={owner.contactNumber} onChange={(e) => setOwner({ ...owner, contactNumber: e.target.value })} type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="e.g. +1 (555) 000-0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Address</label>
                    <textarea value={owner.address} onChange={(e) => setOwner({ ...owner, address: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" placeholder="Enter complete residential address..."></textarea>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full">Vehicle Details</span>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Make</label>
                      <input value={vehicle.make} onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })} type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Model</label>
                      <input value={vehicle.model} onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })} type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Year</label>
                      <input value={vehicle.year} onChange={(e) => setVehicle({ ...vehicle, year: e.target.value })} type="number" min={1900} max={new Date().getFullYear()} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Capacity</label>
                      <input value={vehicle.capacity} onChange={(e) => setVehicle({ ...vehicle, capacity: e.target.value })} type="number" min={1} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Registration Number</label>
                    <div className="flex items-center gap-2">
                      <input value={vehicle.plateLetters} onChange={(e) => setVehicle({ ...vehicle, plateLetters: e.target.value.toUpperCase() })} maxLength={3} className="w-1/3 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm uppercase font-bold" />
                      <span className="text-gray-300 font-bold text-lg">�</span>
                      <input value={vehicle.plateDigits} onChange={(e) => setVehicle({ ...vehicle, plateDigits: e.target.value })} maxLength={4} className="w-2/3 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-mono" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hardware & Features</label>
                    <div className="grid grid-cols-2 gap-3">
                      {featureOptions.map((feature) => (
                        <label key={feature.key} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 cursor-pointer bg-gray-50">
                          <input
                            type="checkbox"
                            checked={vehicle.features[feature.key]}
                            onChange={(e) => setVehicle({
                              ...vehicle,
                              features: {
                                ...vehicle.features,
                                [feature.key]: e.target.checked,
                              },
                            })}
                            className="w-4 h-4 accent-orange-500 rounded"
                          />
                          <span className="text-sm font-medium text-gray-700">{feature.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Compliance Dates (optional)</label>
                    <div className="grid grid-cols-3 gap-4">
                      <input value={vehicle.insuranceExpiry} onChange={(e) => setVehicle({ ...vehicle, insuranceExpiry: e.target.value })} type="date" className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" />
                      <input value={vehicle.roadworthinessExpiry} onChange={(e) => setVehicle({ ...vehicle, roadworthinessExpiry: e.target.value })} type="date" className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" />
                      <input value={vehicle.registrationExpiry} onChange={(e) => setVehicle({ ...vehicle, registrationExpiry: e.target.value })} type="date" className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full">Document Upload</span>
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">Upload copies of registration, insurance, and roadworthiness documents. (Optional)</p>
                  <input type="file" multiple onChange={(e) => setDocuments(Array.from(e.target.files || []))} className="w-full" />
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Review</h4>
                    <div className="p-4 bg-white/60 border border-gray-100 rounded-xl text-sm text-gray-700">
                      <div><b>Owner:</b> {owner.fullName} � {owner.contactNumber}</div>
                      <div><b>Vehicle:</b> {vehicle.make} {vehicle.model} ({vehicle.year})</div>
                      <div><b>Reg:</b> {vehicle.plateLetters}-{vehicle.plateDigits}</div>
                      <div className="mt-2"><b>Files:</b> {documents.length} selected</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="pt-4 flex items-center justify-between">
              <div>
                {step > 0 && <button onClick={back} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Back</button>}
              </div>
              <div className="flex items-center gap-3">
                {step < 2 && <button onClick={next} className="bg-[#1a1a1a] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">Next Step ?</button>}
                {step === 2 && <button onClick={submit} disabled={loading} className="bg-[#1a1a1a] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50">{loading ? 'Registering...' : 'Save & Finish'}</button>}
              </div>
            </div>
          </div>
        </div>
        <div className={`${glassCard} p-6 w-full`}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full">Registration Guidelines</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
              <div className="text-sm font-semibold text-gray-900 mb-2">Vehicle details</div>
              <p className="text-sm text-gray-600">Ensure the make, model, and registration number match the official documents before you continue.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
              <div className="text-sm font-semibold text-gray-900 mb-2">Accessibility & features</div>
              <p className="text-sm text-gray-600">Select the right hardware features so dispatchers and drivers can plan routes accurately.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
              <div className="text-sm font-semibold text-gray-900 mb-2">Compliance</div>
              <p className="text-sm text-gray-600">Add compliance dates before assigning the vehicle to active routes to reduce operational risk.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
              <div className="text-sm font-semibold text-gray-900 mb-2">Documents</div>
              <p className="text-sm text-gray-600">Upload supporting files when available to keep the fleet record complete and audit-friendly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

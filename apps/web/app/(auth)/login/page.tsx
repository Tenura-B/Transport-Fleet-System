"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // TODO: Implement login logic here
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="w-full max-w-6xl">
      <Card className="overflow-hidden min-h-[700px]">
        <div className="grid lg:grid-cols-2">
          {/* Left: Login Form */}
          <div className="p-8 lg:p-16 flex flex-col justify-center">
            {/* Logo */}
            <div className="mb-12">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-rose-400 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white mb-3">Welcome back</h1>
            <p className="text-white/70 text-lg mb-10">Please Enter your Account details</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-white/80 text-sm mb-2 ml-1">Email</label>
                <Input
                  type="email"
                  placeholder="Johndoe@gmail.com"
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2 ml-1">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/30 bg-transparent text-orange-400 focus:ring-orange-400"
                  />
                  <span className="text-white/70 text-sm">Keep me loged in</span>
                </label>

                <Link href="/forgot-password" className="text-white text-sm underline hover:text-orange-300 transition-colors">
                  Forgot Password
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-4"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            {/* Social Login */}
            <div className="mt-8">
              <div className="flex items-center justify-center gap-6">
                <button className="w-11 h-11 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>

                <button className="w-11 h-11 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </button>

                <button className="w-11 h-11 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
              </div>

              <p className="text-center text-white/70 text-sm mt-8">
                Don't have an account?{" "}
                <Link href="/register" className="text-white font-medium underline hover:text-orange-300 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Right: Testimonial Section */}
          <div className="hidden lg:block bg-gradient-to-br from-black/80 to-black/60 p-16 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/20 to-rose-500/20 rounded-bl-full" />
            <div className="absolute bottom-20 right-20">
              <svg className="w-64 h-64 text-purple-500/40" viewBox="0 0 200 200">
                <polygon points="100,10 40,198 190,78 10,78 160,198" fill="currentColor" />
              </svg>
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-8 leading-tight">
                What's our <br /> Fleet Managers Said.
              </h2>

              <div className="mb-8">
                <svg className="w-10 h-10 text-orange-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p className="text-white/80 text-lg leading-relaxed mb-6">
                  "Managing our fleet has never been easier. The dashboard gives us complete visibility and control over all our vehicles and drivers."
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-white font-semibold text-lg mb-1">John Anderson</h3>
                <p className="text-white/60">Fleet Manager at Logistics Pro</p>
              </div>

              <div className="flex gap-3">
                <button className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-400 to-rose-400 flex items-center justify-center hover:opacity-90 transition-opacity">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Bottom Card */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-3xl p-6 w-[400px] shadow-2xl">
              <h3 className="text-black font-semibold text-lg mb-3">Get your fleet managed right now</h3>
              <p className="text-gray-600 text-sm mb-4">
                Join thousands of fleet managers who trust our system to run their business efficiently.
              </p>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                  <img src="https://i.pravatar.cc/32?img=1" alt="User" className="rounded-full" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                  <img src="https://i.pravatar.cc/32?img=2" alt="User" className="rounded-full" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                  <img src="https://i.pravatar.cc/32?img=3" alt="User" className="rounded-full" />
                </div>
                <div className="w-8 h-8 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-orange-600 text-xs font-semibold">
                  +42
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

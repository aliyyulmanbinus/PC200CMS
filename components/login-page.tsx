"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Toaster } from "@/components/ui/toaster"
import { Lock, Mail } from "lucide-react"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate inputs
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Attempt login
    const success = login(email, password)

    if (success) {
      toast({
        title: "Success",
        description: "Login successful! Redirecting...",
      })
      // Page will re-render automatically due to auth state change
    } else {
      toast({
        title: "Error",
        description: "Invalid email or password",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Equipment CMS</h1>
          <p className="text-slate-400">Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader className="space-y-2">
            <CardTitle className="text-white">Admin Login</CardTitle>
            <CardDescription className="text-slate-400">Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-200">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-200">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 h-10"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
              <p className="text-xs font-semibold text-slate-300 mb-2">Demo Credentials:</p>
              <p className="text-xs text-slate-400">
                <span className="text-slate-300">Email:</span> admin@gmail.com
              </p>
              <p className="text-xs text-slate-400">
                <span className="text-slate-300">Password:</span> admin123
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">© 2025 Equipment CMS. All rights reserved.</p>
      </div>

      <Toaster />
    </div>
  )
}

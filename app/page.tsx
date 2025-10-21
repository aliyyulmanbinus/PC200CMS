"use client"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LoginPage } from "@/components/login-page"
import { Dashboard } from "@/components/dashboard-wrapper"

export default function Home() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return <Dashboard />
}

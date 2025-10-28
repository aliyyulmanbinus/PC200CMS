"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export function Header() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { logout } = useAuth()

  useEffect(() => {
    setMounted(true)
    // Check if dark mode is already enabled
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    if (!mounted) return

    const html = document.documentElement
    if (isDark) {
      html.classList.remove("dark")
      setIsDark(false)
      localStorage.setItem("theme", "light")
    } else {
      html.classList.add("dark")
      setIsDark(true)
      localStorage.setItem("theme", "dark")
    }
  }

  if (!mounted) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo/Title */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">PC200 CMS</h1>
          </div>

          {/* Center: Admin Info */}
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span>Admin:</span>
            <span className="font-medium text-foreground">admin@gmail.com</span>
          </div>

          {/* Right: Theme Toggle & Logout */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={logout} className="rounded-full" title="Logout">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile: Admin Info */}
        <div className="md:hidden mt-3 text-xs text-muted-foreground">
          <span>Admin: </span>
          <span className="font-medium text-foreground">admin@gmail.com</span>
        </div>
      </div>
    </header>
  )
}

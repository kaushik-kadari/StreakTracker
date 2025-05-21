"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Sun, Moon, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const router = useRouter()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="bg-gradient-to-b from-[#d5d4d2] to-[#fffdfa] border-b dark:border-b-slate-700 border-blue-100/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            className="h-20 w-20 rounded-lg flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image src="/StreakTracker_logo.png" alt="StreakTracker Logo" width={64} height={64} className="rounded-xl m-2" />
          </motion.div>
          <Link href="/dashboard" className="font-bold text-lg">
            StreakTracker
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {mounted && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

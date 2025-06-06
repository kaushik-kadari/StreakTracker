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
      <div className="container flex max-w-7xl items-center justify-between px-4 py-2 md:px-6">
        <div className="flex flex-1 items-center gap-2">
          <motion.div
            className="h-20 w-20 rounded-lg flex items-center justify-center md:h-24 md:w-24"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image src="/StreakTracker_logo.png" alt="StreakTracker Logo" width={64} height={64} className="rounded-xl m-2" />
          </motion.div>
          <Link href="/dashboard" className="font-bold text-lg md:text-2xl">
            StreakTracker
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {mounted && (
            <Button 
              variant="ghost" 
              size="lg"
              className="!h-10 !w-10 !p-0 flex items-center justify-center"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="!h-6 !w-6" style={{ fontSize: '1.75rem' }} />
              ) : (
                <Moon className="!h-6 !w-6" style={{ fontSize: '1.75rem' }} />
              )}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="lg" className="!h-10 !w-10 !p-0 flex items-center justify-center">
                <User className="!h-6 !w-6" style={{ fontSize: '1.75rem' }} />
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

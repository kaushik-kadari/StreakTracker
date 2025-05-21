'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"

export function SiteHeader() {
  const { token, isLoading } = useAuth()

  return (
    <header className="border-b border-indigo-100/30 bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm w-full">
      <div className="container flex h-16 sm:h-20 items-center justify-between px-3 sm:px-4 lg:px-6 w-full">
        <Link href="/">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 relative rounded-full bg-gradient-to-br shadow-lg hover:scale-110 transition-all duration-300">
              <Image
                src="/StreakTracker_logo.png"
                alt="StreakTracker"
                width={64}
                height={64}
                className="rounded-md cursor-default"
              />
            </div>
            <div className="font-bold text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:scale-110 transition-all duration-300">
              StreakTracker
            </div>
          </div>
        </Link>
        {!isLoading && !token && (
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg hover:text-white transform hover:-translate-y-0.5 transition-all duration-300 border-0 whitespace-nowrap"
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="text-xs sm:text-sm px-2 sm:px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border-0 whitespace-nowrap">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
        {!isLoading && token && (
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border-0">
              Go to Dashboard
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
}

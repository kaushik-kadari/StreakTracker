"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import AuthRedirect from "@/components/auth-redirect"

export default function LoginPage() {
  const router = useRouter()
  const { toastSuccess, toastError } = useToast()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!email || !password) {
      toastError("Please fill in all fields")
      return
    }
    
    setIsLoading(true)

    try {
      const { success, message } = await login(email, password)

      if (success) {
        toastSuccess(message || "Login successful")
        // Use replace instead of push to prevent going back to login page with browser back button
        window.location.href = "/dashboard"
        return
      } else {
        toastError(message || "Login failed. Please try again.")
      }
    } catch (error) {
      console.error("Login error:", error)
      toastError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthRedirect>
      <div className="flex h-screen w-screen bg-gray-50 dark:bg-gray-900 flex-col items-center justify-center">
      <Card className="mx-auto w-full shadow-md max-w-md bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>Enter your email and password to sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button className="w-full hover:-translate-y-1 transition-all duration-300" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-center text-sm w-full">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline font-medium">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
      </div>
    </AuthRedirect>
  )
}

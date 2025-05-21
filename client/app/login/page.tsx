"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { X, Eye, EyeOff, Loader2 } from "lucide-react"
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
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [touched, setTouched] = useState({
    email: false,
    password: false
  })

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePassword = (password: string) => {
    if (!password) return "Password is required"
    // if (password.length < 8) return "Password must be at least 8 characters"
    return ""
  }

  const validateForm = () => {
    if (!email || !password) {
      toastError("Please fill in all fields")
      return false
    }

    if (!validateEmail(email)) {
      toastError("Please enter a valid email address")
      return false
    }

    const passwordValidation = validatePassword(password)
    if (passwordValidation) {
      setPasswordError(passwordValidation)
      return false
    }

    return true
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setPasswordError("")
    
    if (!validateForm()) {
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
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (touched.email && !validateEmail(e.target.value)) {
                    toastError("Please enter a valid email address")
                  }
                }}
                onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                className={touched.email && !validateEmail(email) ? "border-red-500" : ""}
                required
              />
              {touched.email && !validateEmail(email) && (
                <p className="text-sm text-red-500 mt-1">Please enter a valid email address</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (passwordError) {
                      const error = validatePassword(e.target.value)
                      setPasswordError(error)
                    }
                  }}
                  onBlur={() => {
                    setTouched(prev => ({ ...prev, password: true }))
                    const error = validatePassword(password)
                    setPasswordError(error)
                  }}
                  className={`pr-20 ${passwordError && touched.password ? "border-red-500" : ""}`}
                  required
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 
                      <EyeOff className="h-4 w-4" /> : 
                      <Eye className="h-4 w-4" />
                    }
                  </button>
                  {password && (
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600 p-1"
                      onClick={() => setPassword("")}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              {passwordError && touched.password && (
                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
              )}
            </div>
            <Button className="w-full hover:-translate-y-1 transition-all duration-300 dark:text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
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

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import AuthRedirect from "@/components/auth-redirect"

export default function RegisterPage() {
  const router = useRouter()
  const { toastSuccess, toastError } = useToast()
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter"
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number"
    }
    if (!/[!@#$%^&*_]/.test(password)) {
      return "Password must contain at least one special character (!@#$%^&*_)"
    }
    return ""
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setPasswordError("")
    
    const passwordValidationError = validatePassword(password)
    if (passwordValidationError) {
      setPasswordError(passwordValidationError)
      return
    }

    setIsLoading(true)

    try {
      const { success, message } = await register(name, email, password)

      if (success) {
        toastSuccess(message)
        router.push("/login")
      } else {
        toastError(message)
      }
    } catch (error) {
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
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your details to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (passwordError) {
                      const error = validatePassword(e.target.value)
                      setPasswordError(error)
                    }
                  }}
                  onBlur={() => setPasswordError(validatePassword(password))}
                  className={`pr-20 ${passwordError ? "border-red-500" : ""}`}
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
              {passwordError && (
                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
              )}
            </div>
            <Button className="w-full dark:text-white hover:-translate-y-1 transition-all duration-300" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-center text-sm w-full">
            Already have an account?{" "}
            <Link href="/login" className="underline font-medium">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
      </div>
    </AuthRedirect>
  )
}

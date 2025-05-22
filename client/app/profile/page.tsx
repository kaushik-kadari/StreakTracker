"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, X, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/header"
import ProtectedRoute from "@/components/protected-route"

function ProfileContent() {
  const { user, isLoading, updateProfile } = useAuth()
  const router = useRouter()
  const { toastSuccess, toastError } = useToast()

  // Form states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Loading states
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Validation states
  const [passwordError, setPasswordError] = useState("")
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: "" })

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return { isValid: false, message: "Password must be at least 8 characters long" }
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: "Password must contain at least one uppercase letter" }
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: "Password must contain at least one lowercase letter" }
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: "Password must contain at least one number" }
    }
    if (!/[!@#$%^&*_]/.test(password)) {
      return { isValid: false, message: "Password must contain at least one special character (!@#$%^&*_)" }
    }
    return { isValid: true, message: "" }
  }

  const checkPasswordStrength = (password: string) => {
    let score = 0
    let feedback = []
    
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[!@#$%^&*]/.test(password)) score++
    
    // Provide feedback based on score
    if (score <= 2) feedback.push("Weak password")
    else if (score <= 4) feedback.push("Moderate password")
    else feedback.push("Strong password")
    
    setPasswordStrength({ score, feedback: feedback.join(". ") })
  }

  // Set form data when user is loaded
  useEffect(() => {
    if (user) {
      // Populate form with current user data
      setName(user.name || '')
      setEmail(user.email || '')
    }
  }, [user])

  const handleProfileUpdate = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsUpdatingProfile(true)

    try {
      const success = await updateProfile({ name, email })

      if (success) {
        toastSuccess("Pr    ofile updated successfully")
      } else {
        toastError("Failed to update profile")
      }
    } catch (error) {
      toastError("Something went wrong. Please try again.")
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handlePasswordUpdate = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setPasswordError("")

    // Validate current password
    if (!currentPassword) {
      setPasswordError("Current password is required")
      return
    }

    // Validate new passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    // Validate new password strength
    const { isValid, message } = validatePassword(newPassword)
    if (!isValid) {
      setPasswordError(message)
      return
    }

    // Additional check for common passwords or patterns
    if (newPassword.toLowerCase().includes('password') || newPassword.toLowerCase().includes('123')) {
      setPasswordError("Please choose a stronger password")
      return
    }

    // Check if new password is different from current
    if (newPassword === currentPassword) {
      setPasswordError("New password must be different from current password")
      return
    }

    setIsUpdatingPassword(true)

    try {
      const success = await updateProfile({ 
        currentPassword,
        newPassword 
      })


      if (success) {
        toastSuccess("Password updated successfully")

        // Reset form
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        toastError("Failed to update password. Please check your current password.")
      }
    } catch (error: any) {
      toastError(error.message || "Something went wrong. Please try again.")
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  if (isLoading) {
    return <div className="container py-10">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/20 via-amber-50/20 to-amber-50/20 dark:from-gray-900/20 dark:via-gray-800/20 dark:to-gray-700/20">
      <Header />
      <main className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isUpdatingProfile}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isUpdatingProfile}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={isUpdatingProfile} className="dark:text-white hover:scale-105 transition-all duration-300">
                      {isUpdatingProfile ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Profile"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => {
                            setCurrentPassword(e.target.value)
                            if (passwordError) setPasswordError("")
                          }}
                          disabled={isUpdatingPassword}
                          className={`pr-20 ${passwordError && !currentPassword ? "border-red-500" : ""}`}
                          required
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600 p-1"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? 
                              <EyeOff className="h-4 w-4" /> : 
                              <Eye className="h-4 w-4" />
                            }
                          </button>
                          {currentPassword && (
                            <button
                              type="button"
                              className="text-gray-400 hover:text-gray-600 p-1"
                              onClick={() => setCurrentPassword("")}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      {passwordError && !currentPassword && (
                        <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value)
                            checkPasswordStrength(e.target.value)
                            if (passwordError) setPasswordError("")
                          }}
                          onBlur={() => {
                            const { isValid, message } = validatePassword(newPassword)
                            if (!isValid && newPassword) {
                              setPasswordError(message)
                            }
                          }}
                          disabled={isUpdatingPassword}
                          className={`pr-20 ${passwordError && newPassword ? "border-red-500" : ""}`}
                          required
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600 p-1"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? 
                              <EyeOff className="h-4 w-4" /> : 
                              <Eye className="h-4 w-4" />
                            }
                          </button>
                          {newPassword && (
                            <button
                              type="button"
                              className="text-gray-400 hover:text-gray-600 p-1"
                              onClick={() => setNewPassword("")}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      {newPassword && (
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div 
                              className={`h-2.5 rounded-full ${
                                passwordStrength.score <= 2 ? 'bg-red-500' : 
                                passwordStrength.score <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                              }`} 
                              style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {passwordStrength.feedback}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value)
                            if (passwordError) setPasswordError("")
                          }}
                          onBlur={() => {
                            if (newPassword !== confirmPassword) {
                              setPasswordError("Passwords do not match")
                            }
                          }}
                          disabled={isUpdatingPassword}
                          className={`pr-20 ${passwordError && confirmPassword && newPassword !== confirmPassword ? "border-red-500" : ""}`}
                          required
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600 p-1"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? 
                              <EyeOff className="h-4 w-4" /> : 
                              <Eye className="h-4 w-4" />
                            }
                          </button>
                          {confirmPassword && (
                            <button
                              type="button"
                              className="text-gray-400 hover:text-gray-600 p-1"
                              onClick={() => setConfirmPassword("")}
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

                    <Button 
                      type="submit" 
                      disabled={isUpdatingPassword}
                      className="dark:text-white hover:scale-105 transition-all duration-300"
                    >
                      {isUpdatingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}


"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

  // Loading states
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Validation states
  const [passwordError, setPasswordError] = useState("")

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (user) {
      // Populate form with current user data
      setName(user.name)
      setEmail(user.email)
    }
  }, [user, isLoading, router])

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

    // Validate new passwords
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters")
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
    <div className="min-h-screen bg-background">
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

                    <Button type="submit" disabled={isUpdatingProfile}>
                      {isUpdatingProfile ? "Saving..." : "Save Changes"}
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
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        disabled={isUpdatingPassword}
                        required
                      />
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isUpdatingPassword}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isUpdatingPassword}
                        required
                      />
                      {passwordError && <p className="text-sm text-destructive mt-1">{passwordError}</p>}
                    </div>

                    <Button type="submit" disabled={isUpdatingPassword}>
                      {isUpdatingPassword ? "Updating..." : "Update Password"}
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


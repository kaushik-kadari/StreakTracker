"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuthPersistence } from "./use-auth-persistence"
import { api } from "./api"

interface AuthContextType {
  token: string | null
  user: any | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{success: boolean, message: string}>
  register: (name: string, email: string, password: string) => Promise<{success: boolean, message: string}>
  logout: () => void
  updateProfile: (data: { 
    name?: string; 
    email?: string; 
    currentPassword?: string; 
    newPassword?: string;
  }) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, updateToken] = useAuthPersistence()
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true) // Start with true to indicate initial loading

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch user data when token changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (token && !user) {
        try {
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // If the token is invalid, clear it
            updateToken(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          updateToken(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token, user, updateToken]);

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await api.login({ email, password })

      if(response.message) return {success: false, message: response.message}

      updateToken(response.token)
      setUser(response.user)
      
      return {success: true, message: "Login successful"}
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await api.register({ name, email, password })

      if (response.message) {
        return {success: false, message: response.message}
      }

      updateToken(response.token)
      setUser(response.user)

      return {success: true, message: "Registration successful"}
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    updateToken(null)
    setUser(null)
    setIsLoading(false)
    // Clear any stored tokens
    try {
      localStorage.removeItem('authToken')
    } catch (error) {
      console.error('Error clearing auth token:', error)
    }
  }

  const updateProfile = async (data: { 
    name?: string; 
    email?: string; 
    currentPassword?: string; 
    newPassword?: string;
  }) => {
    if (!token) return false
    
    try {
      // Prepare the data to send to the API
      const updateData: any = {}
      if (data.name) updateData.name = data.name
      if (data.email) updateData.email = data.email
      if (data.newPassword) {
        updateData.currentPassword = data.currentPassword
        updateData.newPassword = data.newPassword
      }

      const response = await (api as any).updateProfile(updateData, token)
      
      if (response.user) {
        setUser(response.user)
        // Update the token if it's returned (for email changes or password updates)
        if (response.token) {
          updateToken(response.token)
        }
        return true
      }
      
      return false
    } catch (error: any) {
      console.error('Update profile error:', error)
      throw error // Re-throw to handle in the component
    }
  }

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

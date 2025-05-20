"use client"

import { useEffect, useState } from "react"

const AUTH_TOKEN_KEY = 'authToken'

export function useAuthPersistence() {
  const [token, setToken] = useState<string | null>(null)

  // Only run on the client side
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(AUTH_TOKEN_KEY)
      setToken(savedToken ? JSON.parse(savedToken) : null)
    } catch (error) {
      console.error('Error reading token from localStorage:', error)
      setToken(null)
    }
  }, []) // Empty dependency array means this runs once on mount

  // Function to update token in both state and localStorage
  const updateToken = (newToken: string | null) => {
    try {
      if (typeof window !== 'undefined') {
        if (newToken) {
          localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(newToken))
        } else {
          localStorage.removeItem(AUTH_TOKEN_KEY)
        }
      }
      setToken(newToken)
    } catch (error) {
      console.error('Error updating token in localStorage:', error)
    }
  }

  return [token, updateToken] as const
}
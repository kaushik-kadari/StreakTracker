"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export interface Streak {
  id: string;
  name: string;
  description: string;
  currentStreak: number;
  bestStreak: number;
  history: string[];
  lastCompleted: string | null;
}

// Mock data for streaks
const initialStreaks: Streak[] = [
  {
    id: "1",
    name: "Daily Exercise",
    description: "30 minutes of physical activity",
    currentStreak: 5,
    bestStreak: 14,
    history: [
      "2025-05-15T00:00:00.000Z",
      "2025-05-16T00:00:00.000Z",
      "2025-05-17T00:00:00.000Z",
      "2025-05-18T00:00:00.000Z",
      "2025-05-19T00:00:00.000Z",
    ],
    lastCompleted: new Date().toDateString(),
  },
  {
    id: "2",
    name: "Learn Spanish",
    description: "Practice vocabulary for 15 minutes",
    currentStreak: 12,
    bestStreak: 30,
    history: Array.from({ length: 12 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString()
    }),
    lastCompleted: new Date().toDateString(),
  },
  {
    id: "3",
    name: "Meditate",
    description: "10 minutes of mindfulness",
    currentStreak: 3,
    bestStreak: 21,
    history: ["2025-05-17T00:00:00.000Z", "2025-05-18T00:00:00.000Z", "2025-05-19T00:00:00.000Z"],
    lastCompleted: new Date().toDateString(),
  },
] as const

interface UseStreaksReturn {
  streaks: Streak[];
  addStreak: (streak: Omit<Streak, 'id' | 'currentStreak' | 'bestStreak' | 'history' | 'lastCompleted'>) => void;
  updateStreak: (id: string, updates: Partial<Omit<Streak, 'id'>>) => void;
  completeStreak: (id: string) => void;
  deleteStreak: (id: string) => void;
}

export function useStreaks(): UseStreaksReturn {
  const [streaks, setStreaks] = useState<Streak[]>([])
  const { toastSuccess, toastError, toastInfo } = useToast()

  // Load streaks from localStorage on mount
  useEffect(() => {
    const savedStreaks = localStorage.getItem("streaks")
    if (savedStreaks) {
      setStreaks(JSON.parse(savedStreaks))
    } else {
      // Use mock data if no saved streaks
      setStreaks(initialStreaks)
      localStorage.setItem("streaks", JSON.stringify(initialStreaks))
    }
  }, [])

  // Save streaks to localStorage whenever they change
  useEffect(() => {
    if (streaks.length > 0) {
      localStorage.setItem("streaks", JSON.stringify(streaks))
    }
  }, [streaks])

  // Add a new streak
  const addStreak = (streakData: Omit<Streak, 'id' | 'currentStreak' | 'bestStreak' | 'history' | 'lastCompleted'>) => {
    const newStreak: Streak = {
      ...streakData,
      id: Date.now().toString(),
      currentStreak: 0,
      bestStreak: 0,
      history: [],
      lastCompleted: null,
    }

    setStreaks((prev) => [...prev, newStreak])

    toastSuccess(`Streak "${streakData.name}" added successfully!`)
  }

  // Update a streak
  const updateStreak = (id: string, updates: Partial<Omit<Streak, 'id'>>) => {
    setStreaks((prev) =>
      prev.map((streak) =>
        streak.id === id
          ? {
              ...streak,
              ...updates,
              currentStreak: updates.currentStreak ?? streak.currentStreak,
              bestStreak: updates.bestStreak ?? streak.bestStreak,
              history: updates.history ?? streak.history,
              lastCompleted: updates.lastCompleted ?? streak.lastCompleted,
            }
          : streak
      )
    )

    toastInfo(`Streak "${updates.name}" updated successfully!`)
  }

  // Complete a streak for today
  const completeStreak = (id: string) => {
    const today = new Date().toISOString()

    setStreaks((prev) =>
      prev.map((streak) => {
        if (streak.id === id) {
          // Check if already completed today
          if (streak.lastCompleted === new Date().toDateString()) {
            return streak
          }

          // Update streak count
          const newCurrentStreak = streak.currentStreak + 1
          const newBestStreak = Math.max(newCurrentStreak, streak.bestStreak)

          // Add celebration animation if milestone reached
          if (newCurrentStreak % 5 === 0) {
            // Milestone reached - toast is handled in the Dashboard component
          }

          return {
            ...streak,
            currentStreak: newCurrentStreak,
            bestStreak: newBestStreak,
            history: [...streak.history, today],
            lastCompleted: new Date().toDateString(),
          }
        }
        return streak
      }),
    )

    toastSuccess("Great job! Keep up the good work!")
  }

  // Delete a streak
  const deleteStreak = (id: string) => {
    const streakToDelete = streaks.find((streak) => streak.id === id)
    if (streakToDelete) {
      setStreaks((prev) => prev.filter((streak) => streak.id !== id))
      toastError(`Streak "${streakToDelete.name}" has been removed successfully!`)
    }
  }

  return {
    streaks,
    addStreak,
    updateStreak,
    completeStreak,
    deleteStreak,
  }
}

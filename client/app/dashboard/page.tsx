"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Header from "@/components/header"
import StreakList from "@/components/streak-list"
import TaskList from "@/components/task-list"
import NewStreakDialog from "@/components/new-streak-dialog"
import { useStreaks } from "@/lib/useStreaks"
import { useTasks } from "@/lib/useTasks"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import ProtectedRoute from "@/components/protected-route"

interface Streak {
  id: string;
  name: string;
  description: string;
  currentStreak: number;
  bestStreak: number;
  history: string[];
  lastCompleted: string | null;
}

// Move the callback outside the component to avoid hook order issues
const useAddStreakHandler = (
  editingStreak: Streak | null,
  updateStreak: (id: string, updates: { name: string; description: string }) => Promise<void>,
  createStreak: (name: string, description: string) => Promise<void>,
  setEditingStreak: (streak: Streak | null) => void
) => {
  return useCallback((name: string, description: string) => {
    if (editingStreak) {
      updateStreak(editingStreak.id, { name, description });
      setEditingStreak(null);
    } else {
      createStreak(name, description);
    }
  }, [editingStreak, updateStreak, createStreak, setEditingStreak]);
};

// Custom hook to handle the streaks effect
const useStreakAchievements = (streaks: Streak[], toastSuccess: (message: string) => void) => {
  useEffect(() => {
    if (streaks && streaks.length > 0) {
      streaks.forEach((streak) => {
        if (
          streak.currentStreak > 0 &&
          streak.currentStreak % 5 === 0 &&
          streak.lastCompleted === new Date().toDateString()
        ) {
          toastSuccess(`You've maintained your "${streak.name}" streak for ${streak.currentStreak} days!`);
        }
      });
    }
  }, [streaks, toastSuccess]);
};

function DashboardContent() {
  // Initialize all hooks unconditionally at the top level
  const router = useRouter();
  const { toastSuccess } = useToast();
  const { user, isLoading: authLoading, token } = useAuth();
  
  // State
  const [newStreakOpen, setNewStreakOpen] = useState(false);
  const [editingStreak, setEditingStreak] = useState<Streak | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Data hooks - always called but may not fetch if no token
  const { 
    streaks = [], 
    createStreak, 
    updateStreak, 
    completeStreak, 
    deleteStreak 
  } = useStreaks(token || '');
  
  const { 
    tasks = [], 
    createTask, 
    updateTask, 
    toggleTask, 
    deleteTask 
  } = useTasks(token || '');
  
  // Memoized handlers
  const handleAddStreak = useAddStreakHandler(
    editingStreak,
    updateStreak,
    createStreak,
    setEditingStreak
  );
  
  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Handle streak achievements
  useStreakAchievements(streaks, toastSuccess);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ece9e9] via-[#fff] to-[#f5f5f5] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <main className="container py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Track your progress and manage your tasks</p>
              </div>
              
              {user?.name && (
                <div 
                  className="bg-gradient-to-br from-[#fff] via-[#fafafa] to-[#ece9e9] dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-4 rounded-xl shadow-md transform transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                      <span className="text-2xl animate-bounce">👋</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black dark:text-gray-300">
                        Welcome back,
                      </p>
                      <h3 className="text-lg font-bold text-black dark:text-gray-100">
                        {user.name.split(' ')[0]}!
                      </h3>
                    </div>
                  </div>
                </div>
              )}
            </div>
              <style jsx>{`
                @keyframes fadeIn {
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
            </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Streaks</h2>
              <Button onClick={() => setNewStreakOpen(true)} className="dark:text-white">
                <Plus className="mr-2 h-4 w-4 dark:text-white" /> New Streak
              </Button>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <StreakList 
                streaks={streaks} 
                onComplete={completeStreak} 
                onEdit={(id: string) => {
                  // Find the streak by ID
                  const streak = streaks.find(s => s.id === id)
                  if (streak) {
                    // Set the editing streak with all its current data
                    const editingData = {
                      id: streak.id,
                      name: streak.name,
                      description: streak.description,
                      currentStreak: streak.currentStreak,
                      bestStreak: streak.bestStreak,
                      history: streak.history,
                      lastCompleted: streak.lastCompleted
                    };

                    setEditingStreak(editingData)
                    setNewStreakOpen(true)
                  }
                }}
                onDelete={deleteStreak}
              />
            </motion.div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
            <TaskList tasks={tasks} onAdd={createTask} onUpdate={updateTask} onComplete={toggleTask} onDelete={deleteTask} />
          </div>
        </div>
      </main>

      <NewStreakDialog 
        open={newStreakOpen} 
        onOpenChange={(open: boolean) => {
          setNewStreakOpen(open)
          if (!open) setEditingStreak(null)
        }} 
        onAdd={handleAddStreak}
        initialData={editingStreak}
      />
    </div>
  )
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

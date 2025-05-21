"use client"

import { useState, useEffect } from "react"
import { Flame, Calendar, Edit, Trash2, CheckCircle, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import StreakCalendar from "@/components/streak-calendar"
import { motion } from "framer-motion"
import { Streak } from "@/hooks/use-streaks"
import Celebration from "./celebration"
import DeleteConfirmationDialog from "./delete-confirmation-dialog"

interface StreakListProps {
  streaks: Streak[]
  onComplete: (id: string) => void
  onEdit: (id: string, updates: Partial<Streak>) => void
  onDelete: (id: string) => void
}

interface StreakCardProps {
  streak: Streak
  onComplete: (id: string) => void
  onEdit: (id: string, updates: Partial<Streak>) => void
  onDelete: (id: string) => void
  index: number
}

export default function StreakList({ streaks, onComplete, onEdit, onDelete }: StreakListProps) {
  if (!streaks.length) {
    return (
      <div className="text-center p-12 border rounded-lg">
        <p className="text-muted-foreground">You don't have any streaks yet.</p>
        <p className="mt-2">Create your first streak to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {streaks.map((streak, index) => (
        <StreakCard 
          key={streak.id} 
          streak={streak} 
          onComplete={onComplete} 
          onEdit={onEdit}
          onDelete={onDelete}
          index={index} 
        />
      ))}
    </div>
  )
}

function StreakCard({ streak, onComplete, onEdit, onDelete, index }: StreakCardProps) {
  const [isCelebrating, setIsCelebrating] = useState(false)
  const [celebratingId, setCelebratingId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTargetStreak, setDeleteTargetStreak] = useState<Streak | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  // Function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  // Parse the last completed date
  const parseDate = (dateStr: string | null): Date | null => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('/').map(Number);
    
    return new Date(year, month - 1, day);
  };

  const today = new Date();
  const lastCompletedDate = parseDate(streak.lastCompleted);
  
  // Check if the streak was completed today
  const isCompletedToday = lastCompletedDate ? isSameDay(today, lastCompletedDate) : false;
  
  const progressPercentage = Math.min((streak.currentStreak / 30) * 100, 100)
  const isStreakCelebrating = celebratingId === streak.id
  const descriptionLines = streak.description?.split('\n') || []
  const hasMultipleLines = descriptionLines.length > 1
  const descriptionNeedsToggle = Boolean(streak.description && (hasMultipleLines || streak.description.length > 50))
  
  const toggleDescription = () => {
    setIsExpanded(prev => !prev)
  }

  const handleComplete = () => {
    if (!isCompletedToday) {
      setCelebratingId(streak.id)
      setIsCelebrating(true)
      onComplete(streak.id)
      // Stop celebration after 3 seconds
      setTimeout(() => {
        setIsCelebrating(false)
        setTimeout(() => setCelebratingId(null), 1000)
      }, 3000)
    }
  }

  const handleDelete = () => {
    setDeleteTargetStreak(streak)
    setDeleteDialogOpen(true)
  }

  return (
    <motion.div
      key={streak.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="h-full flex"
    >
      <Card className="relative overflow-hidden shadow-md hover:shadow-xl bg-gradient-to-br from-[#ece9e9] via-[#fff] to-[#f5f5f5] dark:from-gray-800/70 dark:via-gray-800/70 dark:to-gray-900/70 border border-blue-100 dark:border-slate-700 hover:border-blue-100 dark:hover:border-slate-500 transition-all duration-300 group flex flex-col w-full self-start max-w-full">
        {celebratingId === streak.id && <Celebration isActive={isStreakCelebrating} />}

        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={() => {
            if (deleteTargetStreak) {
              onDelete(deleteTargetStreak.id)
            }
            setDeleteTargetStreak(null)
          }}
          title="Delete Streak"
          description={`Are you sure you want to delete "${deleteTargetStreak?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
        />
        <CardHeader className={`pb-2 relative ${isCompletedToday ? 'pt-3' : ''}`}>
          {isCompletedToday && (
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/30 dark:to-blue-900/20 -z-10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.1),transparent_70%)]"></div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 rounded-t-lg" />
          <div className="flex flex-col w-full">
            <div className="flex items-start w-full gap-2">
              {isCompletedToday && (
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                    <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
                  </div>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 
                  className={`font-semibold text-lg truncate ${isCompletedToday ? 'text-emerald-700 dark:text-emerald-300' : 'text-black dark:text-white'}`}
                  title={streak.name}
                >
                  {streak.name}
                </h3>
              </div>
              <div className="flex-shrink-0 flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-blue-500 hover:bg-blue-100/50 dark:hover:bg-blue-900/20 flex-shrink-0"
                  onClick={() => onEdit(streak.id, {})}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:bg-red-100/50 dark:hover:bg-red-900/20 flex-shrink-0"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-3">
              <div className="relative">
                <div className="relative group">
                  <div className="relative">
                    <div 
                      className={cn(
                        "text-sm text-slate-600 dark:text-slate-300 transition-all duration-200 break-words min-h-[1.25rem] bg-gradient-to-r from-blue-500/5 to-cyan-500/5 px-2 py-1 rounded",
                        !isExpanded ? 'line-clamp-1' : 'whitespace-pre-wrap',
                        !streak.description && 'text-slate-400 dark:text-slate-500 italic',
                        'pr-6'
                      )}
                    >
                      {streak.description || 'No description'}
                    </div>
                    {descriptionNeedsToggle && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-5 w-5 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors group-hover:opacity-100 bg-background/80 backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleDescription()
                        }}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 px-3 py-1 text-orange-500 dark:text-orange-300 border border-orange-200/50 dark:border-orange-800/30 shadow-sm">
              {isCompletedToday ? (
                <Flame className="h-4 w-4 fill-current" />
              ) : (
                <Flame className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {streak.currentStreak} {streak.currentStreak === 1 ? "day" : "days"}
              </span>
            </span>
            <div className="relative group">
              <div className="relative inline-flex items-center overflow-hidden rounded-lg p-[1px]">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400 animate-gradient-x"></div>
                <div className="relative flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white/90 dark:bg-gray-800/95 backdrop-blur-sm rounded-[5px] w-full h-full group-hover:shadow-[0_0_20px_-3px_rgba(56,189,248,0.4)] transition-all duration-300">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                  </span>
                  <span className="text-muted-foreground">Best:</span>
                  <span className="font-semibold text-blue-600 dark:text-cyan-400">
                    {streak.bestStreak} {streak.bestStreak === 1 ? 'day' : 'days'}
                  </span>
                </div>
              </div>
              <style jsx>{`
                @keyframes gradient-x {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                .animate-gradient-x {
                  background-size: 200% 200%;
                  animation: gradient-x 3s ease infinite;
                }
              `}</style>
            </div>
          </div>

          <div className="mt-4">
            <StreakCalendar streak={streak} />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant={isCompletedToday ? 'outline' : 'default'}
            onClick={handleComplete}
            disabled={isCompletedToday}
            className={`w-full gap-2 transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis ${
              isCompletedToday 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 border-green-200 dark:border-green-800/50 hover:bg-green-50 dark:hover:bg-green-900/30' 
                : 'bg-gradient-to-r from-green-400 to-lime-400 hover:from-green-500 hover:to-lime-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {isCompletedToday ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Completed Today
              </>
            ) : (
              "Complete for Today"
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

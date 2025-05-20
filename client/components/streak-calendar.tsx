"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Streak } from "@/hooks/use-streaks"

interface StreakCalendarProps {
  streak: Streak
}

export default function StreakCalendar({ streak }: StreakCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Get days in month
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()

  // Get first day of month
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  // Create calendar days
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)


  // Add empty cells for days before first day of month
  const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => null)

  // Combine empty cells and days
  const calendarDays = [...emptyCells, ...days]

  // Get completed days for this month from streak history
  const completedDays = streak.history
    ? streak.history
        .filter((date: string) => {
          const dateObj = new Date(date)
          return dateObj.getMonth() === currentMonth.getMonth() && dateObj.getFullYear() === currentMonth.getFullYear()
        })
        .map((date: string) => new Date(date).getDate())
    : []

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">
          {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={i} className="h-6 flex items-center justify-center font-medium">
            {day}
          </div>
        ))}

        {calendarDays.map((day, i) => {
          const today = new Date()
          const isCompleted = day && completedDays.includes(day)
          const isToday = day === today.getDate() && 
                        currentMonth.getMonth() === today.getMonth() && 
                        currentMonth.getFullYear() === today.getFullYear()
          const isPastDay = day && new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
          const isMissed = isPastDay && !isCompleted

          return (
            <div
              key={i}
              className={cn(
                "h-8 w-8 flex items-center justify-center rounded-full text-xs font-medium mx-auto",
                day ? "cursor-default" : "invisible",
                isCompleted && "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300",
                isToday && !isCompleted && "border border-orange-500",
                isMissed && "text-muted-foreground/30",
                "relative"
              )}
            >
              {day ? (
                isCompleted ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <CheckCircle2 className="h-5 w-5 text-orange-500" strokeWidth={2} />
                  </motion.span>
                ) : (
                  <span className={cn(
                    isMissed && "text-muted-foreground/30",
                    isToday && "font-bold text-orange-500"
                  )}>
                    {day}
                  </span>
                )
              ) : (
                ""
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

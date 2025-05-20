"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface Task {
  id: string
  text: string
  completed: boolean
}

interface TaskUpdate {
  id: string
  text?: string
  completed?: boolean
}

// Mock data for tasks
const initialTasks: Task[] = [
  {
    id: "1",
    text: "Grocery shopping",
    completed: false,
  },
  {
    id: "2",
    text: "Schedule dentist appointment",
    completed: true,
  },
  {
    id: "3",
    text: "Update resume",
    completed: false,
  },
]

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const { toastSuccess, toastError, toastInfo } = useToast()

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      // Use mock data if no saved tasks
      setTasks(initialTasks)
      localStorage.setItem("tasks", JSON.stringify(initialTasks))
      // No need for toast notification on initial load
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks))
    }
  }, [tasks])

  // Add a new task
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
    }

    setTasks((prev) => [...prev, newTask])
    toastSuccess(`Task "${newTask.text}" added successfully!`)
  }

  // Update a task
  const updateTask = (id: string, updates: Omit<TaskUpdate, 'id'>) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const updatedTask = { ...task, ...updates }
          return updatedTask
        }
        return task
      })
    )
    const updatedTask = tasks.find(task => task.id === id)
    if (updatedTask) {
      toastInfo(`Task "${updatedTask.text}" updated successfully!`)
    }
  }

  // Toggle task completion
  const completeTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const completed = !task.completed
          return { ...task, completed }
        }
        return task
      })
    )
  }

  // Delete a task
  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find((task) => task.id === id)
    if (taskToDelete) {
      setTasks((prev) => prev.filter((task) => task.id !== id))
      toastError(`Task "${taskToDelete.text}" has been removed successfully!`)
    }
  }

  return {
    tasks,
    addTask,
    updateTask,
    completeTask,
    deleteTask,
  } as const
}
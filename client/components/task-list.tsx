"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Save, X, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  task: string
  completed: boolean
}

interface TaskListProps {
  tasks: Task[]
  onAdd: (task : string, completed : boolean) => void
  onUpdate: (id: string, updates: {task : string, completed : boolean}) => void
  onComplete: (id: string) => void
  onDelete: (id: string) => void
}

export default function TaskList({ tasks, onAdd, onUpdate, onComplete, onDelete }: TaskListProps) {
  const MAX_TASK_LENGTH = 100
  
  const [newTask, setNewTask] = useState("")
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [taskError, setTaskError] = useState("")

  const handleAddTask = () => {
    const trimmedTask = newTask.trim()
    
    if (!trimmedTask) {
      setTaskError('Task cannot be empty')
      return
    }
    
    if (trimmedTask.length > MAX_TASK_LENGTH) {
      setTaskError(`Task must be ${MAX_TASK_LENGTH} characters or less`)
      return
    }
    
    setTaskError("")
    onAdd(trimmedTask, false)
    setNewTask("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask()
    }
  }

  const handleEditStart = (task: Task) => {
    setEditingTaskId(task.id)
    setEditText(task.task)
  }

  const handleEditSave = (id: string) => {
    const trimmedText = editText.trim()
    
    if (!trimmedText) {
      setTaskError('Task cannot be empty')
      return
    }
    
    if (trimmedText.length > MAX_TASK_LENGTH) {
      setTaskError(`Task must be ${MAX_TASK_LENGTH} characters or less`)
      return
    }
    
    setTaskError("")
    onUpdate(id, {
      task: trimmedText, 
      completed: tasks.find((task) => task.id === id)!.completed,
    })
    setEditingTaskId(null)
    setEditText("")
  }

  const handleEditCancel = () => {
    setEditingTaskId(null)
    setEditText("")
  }

  return (
    <Card className="bg-gradient-to-br from-[#f5f5f5] to-white/90 dark:from-gray-700/70 dark:to-gray-800/70 backdrop-blur-sm border border-blue-100/50 dark:border-slate-700 overflow-hidden">
      <CardHeader className="relative bg-gradient-to-r from-[#fafafa] to-[#f0f0f0] dark:from-slate-700/60 dark:to-slate-700/40 border-b border-blue-100/50 dark:border-slate-700/30">
        <div 
          className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%236366f1\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '60px 60px'
          }}
        />
        <div className="relative">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Today's Tasks</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Manage your daily tasks and to-dos</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2 relative z-10">
          <div className="relative flex-1">
            <div className="w-full">
              <Input
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_TASK_LENGTH) {
                    setNewTask(e.target.value)
                    if (taskError) setTaskError("")
                  }
                }}
                onKeyDown={handleKeyDown}
                className={`bg-white/80 dark:bg-slate-800/50 mt-2 border-blue-100 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-1 transition-shadow ${taskError ? 'border-red-500' : ''}`}
                maxLength={MAX_TASK_LENGTH}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  {newTask.length}/{MAX_TASK_LENGTH} characters
                </span>
                {taskError && <span className="text-xs text-red-500">{taskError}</span>}
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-transparent w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <Button 
            size="icon" 
            onClick={handleAddTask}
            className="bg-gradient-to-br mt-2 from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <AnimatePresence>
          {tasks.length > 0 ? (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <motion.li
                  key={task.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="group relative p-3 bg-white/50 dark:bg-slate-800/30 border border-blue-50/50 dark:border-slate-700/30 rounded-lg hover:bg-white dark:hover:bg-slate-800/50 hover:shadow-sm transition-all duration-200"
                >
                  {editingTaskId === task.id ? (
                    <div className="flex flex-col w-full">
                      <div className="flex items-start gap-2 w-full">
                        <div className="flex-1 min-w-0">
                          <Input
                            value={editText}
                            onChange={(e) => {
                              if (e.target.value.length <= MAX_TASK_LENGTH) {
                                setEditText(e.target.value)
                                if (taskError) setTaskError("")
                              }
                            }}
                            className="w-full"
                            maxLength={MAX_TASK_LENGTH}
                          />
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-muted-foreground">
                              {editText.length}/{MAX_TASK_LENGTH} characters
                            </span>
                            {taskError && <span className="text-xs text-red-500">{taskError}</span>}
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-green-500 hover:text-green-600 dark:hover:text-white"
                            onClick={() => handleEditSave(task.id)}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500 hover:text-red-600 dark:hover:text-white"
                            onClick={handleEditCancel}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="flex items-start gap-3 border-b border-blue-100/50 dark:border-slate-700">
                        <div className="relative flex-shrink-0 mt-0.5">
                          <Checkbox
                            id={`task-${task.id}`}
                            checked={task.completed}
                            onCheckedChange={() => onComplete(task.id)}
                            className={cn(
                              "h-5 w-5 rounded-full border-2 border-green-200 data-[state=checked]:bg-green-400 data-[state=checked]:border-green-400 data-[state=checked]:text-white",
                              "focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                            )}
                          >
                            {task.completed && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </Checkbox>
                          {task.completed && (
                            <div className="absolute inset-0 rounded-full bg-green-500/10 animate-ping opacity-0" />
                          )}
                        </div>
                        <label
                          htmlFor={`task-${task.id}`}
                          className={`flex-1 text-sm min-w-0 ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}
                          title={task.task.length > 50 ? task.task : ''}
                        >
                          <div className="whitespace-pre-wrap break-words">
                            {task.task}
                          </div>
                        </label>
                        <div className="flex-shrink-0 flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover:text-blue-600 dark:text-blue-400 dark:hover:text-white"
                            onClick={() => handleEditStart(task)}
                          >
                            <Edit className="h-4 w-4 opacity-70 hover:opacity-100 transition-opacity" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500 hover:text-red-600 dark:hover:text-white"
                            onClick={() => onDelete(task.id)}
                          >
                            <Trash2 className="h-4 w-4 opacity-70 hover:opacity-100 transition-opacity" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.li>
              ))}
            </ul>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-center text-sm text-muted-foreground py-4"
            >
              No tasks for today. Add one to get started!
            </motion.p>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
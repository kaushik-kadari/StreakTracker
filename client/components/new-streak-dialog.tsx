"use client"

import { useState, useEffect, ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface StreakData {
  id?: string;
  name: string;
  description: string;
  currentStreak?: number;
  bestStreak?: number;
  history?: string[];
  lastCompleted?: string | null;
}

interface NewStreakDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (name: string, description: string) => void;
  initialData?: StreakData | null;
}

export default function NewStreakDialog({ open, onOpenChange, onAdd, initialData }: NewStreakDialogProps) {
  const { toastError } = useToast()
  const MAX_NAME_LENGTH = 30
  const MAX_DESCRIPTION_LENGTH = 100
  
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [nameError, setNameError] = useState("")
  const [descriptionError, setDescriptionError] = useState("")

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setDescription(initialData.description)
    } else {
      setName("")
      setDescription("")
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset errors
    setNameError("")
    setDescriptionError("")
    
    let isValid = true
    
    // Validate name
    if (!name.trim()) {
      setNameError('Name is required')
      isValid = false
    } else if (name.length > MAX_NAME_LENGTH) {
      setNameError(`Name must be ${MAX_NAME_LENGTH} characters or less`)
      isValid = false
    }
    
    // Validate description
    if (!description.trim()) {
      setDescriptionError('Description is required')
      isValid = false
    } else if (description.length > MAX_DESCRIPTION_LENGTH) {
      setDescriptionError(`Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`)
      isValid = false
    }
    
    if (isValid) {
      onAdd(name, description)

      // Reset form
      if (!initialData?.id) {
        setName("")
        setDescription("")
      }
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{initialData?.id ? 'Edit' : 'Create new'} streak</DialogTitle>
            <DialogDescription>
              {initialData?.id 
                ? 'Update your habit or activity.' 
                : 'Add a new habit or activity you want to track consistently.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g., Daily Exercise"
                value={name}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_NAME_LENGTH) {
                    setName(e.target.value)
                    if (nameError) setNameError("")
                  }
                }}
                maxLength={MAX_NAME_LENGTH}
                className={nameError ? 'border-red-500' : ''}
                required
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  {name.length}/{MAX_NAME_LENGTH} characters
                </span>
                {nameError && <span className="text-xs text-red-500">{nameError}</span>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="e.g., 30 minutes of physical activity"
                value={description}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                    setDescription(e.target.value)
                    if (descriptionError) setDescriptionError("")
                  }
                }}
                maxLength={MAX_DESCRIPTION_LENGTH}
                className={`min-h-[100px] ${descriptionError ? 'border-red-500' : ''}`}
                rows={3}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  {description.length}/{MAX_DESCRIPTION_LENGTH} characters
                </span>
                {descriptionError && <span className="text-xs text-red-500">{descriptionError}</span>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{initialData?.id ? 'Update' : 'Create'} Streak</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  ) as ReactNode
}

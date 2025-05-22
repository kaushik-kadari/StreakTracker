"use client"

import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-slate-900 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="border dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 "
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 dark:text-white"
          >
            {loading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

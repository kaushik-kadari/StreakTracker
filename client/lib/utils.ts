import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date to readable string
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// Generate confetti elements
export function generateConfetti(container: HTMLElement, count = 50) {
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement("div")
    confetti.classList.add("confetti")

    // Random position
    confetti.style.left = `${Math.random() * 100}%`

    // Random color
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]

    // Random size
    const size = Math.random() * 10 + 5
    confetti.style.width = `${size}px`
    confetti.style.height = `${size}px`

    // Random rotation
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`

    // Random animation duration
    confetti.style.animationDuration = `${Math.random() * 2 + 1}s`

    container.appendChild(confetti)

    // Remove after animation
    setTimeout(() => {
      confetti.remove()
    }, 3000)
  }
}

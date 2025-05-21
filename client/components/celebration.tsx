"use client"

import { motion, AnimatePresence } from "framer-motion"

export default function Celebration({ isActive }: { isActive: boolean }) {
  // Create particles for the celebration
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 10 + 5,
    color: [
      '#FF6B6B', // Red
      '#4ECDC4', // Teal
      '#45B7D1', // Blue
      '#96CEB4', // Green
      '#FFEEAD', // Yellow
      '#FF6F61', // Coral
      '#6B5B95', // Purple
      '#88B04B'  // Green
    ][Math.floor(Math.random() * 8)],
    x: Math.random() * window.innerWidth,
    y: window.innerHeight + 100,
    rotation: Math.random() * 360,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 3
  }))

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                x: particle.x,
                y: particle.y,
                rotate: particle.rotation
              }}
              initial={{ y: window.innerHeight + 100, opacity: 1 }}
              animate={{
                y: -200,
                x: particle.x + (Math.random() - 0.5) * 100,
                opacity: [1, 1, 0],
                scale: [0.5, 1.2, 0.5]
              }}
              transition={{
                y: { duration: particle.duration, ease: "easeOut" },
                x: { duration: particle.duration, ease: "easeInOut" },
                opacity: { duration: particle.duration, times: [0, 0.8, 1] },
                scale: { duration: particle.duration, times: [0, 0.5, 1] },
                delay: particle.delay
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}
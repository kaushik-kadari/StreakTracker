"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect } from "react"

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  animationType?: "fade" | "slide" | "scale" | "stagger"
  delay?: number
  duration?: number
  once?: boolean
}

const animationVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slide: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
  },
  stagger: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  },
}

const childVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function AnimatedSection({
  children,
  className,
  animationType = "slide",
  delay = 0,
  duration = 0.6,
  once = true,
}: AnimatedSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: "0px 0px -100px 0px" })

  const selectedVariant = animationVariants[animationType]

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={selectedVariant.initial}
      animate={isInView ? selectedVariant.animate : selectedVariant.initial}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1], // Custom cubic-bezier for smooth easing
      }}
      whileHover={
        animationType !== "stagger"
          ? { scale: 1.02, transition: { duration: 0.3 } }
          : undefined
      }
      variants={animationType === "stagger" ? animationVariants.stagger : undefined}
    >
      {animationType === "stagger" ? (
        <motion.div variants={childVariants}>{children}</motion.div>
      ) : (
        children
      )}
    </motion.div>
  )
}
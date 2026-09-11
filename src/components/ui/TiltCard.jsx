import { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * TiltCard — Warm Editorial 3D Perspective Tilt Card with Cursor Spotlight
 * Inspired by Speak.com & Claude design aesthetics
 */
export default function TiltCard({
  children,
  className,
  intensity = 8,
  spotlightColor = 'rgba(224, 109, 83, 0.08)',
  glowBorder = true,
  onClick,
  ...props
}) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const xRatio = useMotionValue(0)
  const yRatio = useMotionValue(0)

  const springConfig = { stiffness: 350, damping: 26, mass: 0.5 }
  const smoothX = useSpring(xRatio, springConfig)
  const smoothY = useSpring(yRatio, springConfig)

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [intensity, -intensity])
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-intensity, intensity])

  const handleMouseMove = useCallback(
    (e) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setMousePos({ x, y })
      xRatio.set((x / rect.width) - 0.5)
      yRatio.set((y / rect.height) - 0.5)
    },
    [xRatio, yRatio]
  )

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    xRatio.set(0)
    yRatio.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        'relative overflow-hidden rounded-3xl border border-[#EAE5DE] bg-white p-6 shadow-[0_4px_24px_rgba(28,26,23,0.04)] transition-all duration-200',
        glowBorder && isHovered && 'border-[#E06D53]/40 shadow-[0_12px_36px_rgba(28,26,23,0.08)]',
        className
      )}
      {...props}
    >
      {/* 1. Dynamic Cursor Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-3xl"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />

      {/* 2. Card Content Layer */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

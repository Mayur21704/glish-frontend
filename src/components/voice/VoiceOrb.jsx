import { useEffect, useRef } from 'react'
import { ORB_STATES } from '@/lib/constants'

/**
 * VoiceOrb — Apple Intelligence / Siri-inspired Fluid Nebula Core
 * Features:
 * - Dynamic harmonic multi-lobe fluid contour (smooth mathematical liquid deformation)
 * - Swirling multi-chromatic gradient aura (Bioluminescent Cyan, Electric Indigo, Solar Amber)
 * - Ambient stardust particle cloud responding to audio volume
 * - 60fps GPU-accelerated canvas rendering with zero frame stutter
 */
export default function VoiceOrb({
  state = ORB_STATES.IDLE,
  micVolume = 0,
  aiVolume = 0,
  isAiSpeaking = false,
}) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const phaseRef = useRef(0)
  const energyRef = useRef(0.15)
  const particlesRef = useRef(
    Array.from({ length: 24 }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: 50 + Math.random() * 60,
      speed: 0.005 + Math.random() * 0.015,
      radius: 1 + Math.random() * 2,
      alpha: 0.2 + Math.random() * 0.6,
    }))
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    const width = 380
    const height = 280
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    const centerX = width / 2
    const centerY = height / 2

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Audio Energy smoothing
      const targetEnergy = isAiSpeaking
        ? Math.min(1, 0.25 + (aiVolume / 100) * 0.85)
        : state === ORB_STATES.LISTENING
        ? Math.min(1, 0.2 + (micVolume / 100) * 0.8)
        : 0.12

      energyRef.current += (targetEnergy - energyRef.current) * 0.1
      const energy = energyRef.current
      phaseRef.current += 0.025 + energy * 0.045
      const phase = phaseRef.current

      // Palette Configuration based on state
      // AI: Luminous Indigo + Warm Amber flare
      // User Listening: Bioluminescent Cyan + Mint
      // Idle: Deep Cerulean + Velvet Indigo
      const primaryR = isAiSpeaking ? 129 : state === ORB_STATES.LISTENING ? 45 : 45
      const primaryG = isAiSpeaking ? 140 : state === ORB_STATES.LISTENING ? 212 : 180
      const primaryB = isAiSpeaking ? 248 : state === ORB_STATES.LISTENING ? 191 : 230

      const secondaryR = isAiSpeaking ? 245 : 6
      const secondaryG = isAiSpeaking ? 158 : 182
      const secondaryB = isAiSpeaking ? 11 : 212

      // 1. Ambient Outer Halo Glow
      const haloGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        20,
        centerX,
        centerY,
        130 + energy * 30
      )
      haloGrad.addColorStop(0, `rgba(${primaryR}, ${primaryG}, ${primaryB}, ${0.35 + energy * 0.35})`)
      haloGrad.addColorStop(0.5, `rgba(${secondaryR}, ${secondaryG}, ${secondaryB}, ${0.15 + energy * 0.2})`)
      haloGrad.addColorStop(1, 'rgba(12, 16, 26, 0)')

      ctx.fillStyle = haloGrad
      ctx.beginPath()
      ctx.arc(centerX, centerY, 130 + energy * 30, 0, Math.PI * 2)
      ctx.fill()

      // 2. Swirling Stardust Particle Cloud
      particlesRef.current.forEach((p) => {
        p.angle += p.speed * (1 + energy * 2)
        const currentDist = p.dist + Math.sin(phase * 2 + p.angle) * (6 + energy * 18)
        const px = centerX + Math.cos(p.angle) * currentDist
        const py = centerY + Math.sin(p.angle) * currentDist

        ctx.beginPath()
        ctx.arc(px, py, p.radius * (0.8 + energy * 0.6), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${primaryR}, ${primaryG}, ${primaryB}, ${p.alpha * (0.5 + energy * 0.5)})`
        ctx.fill()
      })

      // 3. Multi-Harmonic Organic Liquid Nebula Layers
      const renderHarmonicBlob = (baseR, lobes, harmonicPhase, alpha, fillGrad) => {
        const points = 120
        ctx.beginPath()
        for (let i = 0; i <= points; i++) {
          const theta = (i / points) * Math.PI * 2
          // Complex organic fluid deformation formula
          const r =
            baseR +
            Math.sin(theta * lobes[0] + harmonicPhase) * (8 + energy * 26) +
            Math.cos(theta * lobes[1] - harmonicPhase * 1.2) * (5 + energy * 18) +
            Math.sin(theta * lobes[2] + harmonicPhase * 0.8) * (4 + energy * 12)

          const x = centerX + Math.cos(theta) * r
          const y = centerY + Math.sin(theta) * r

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()
        ctx.fillStyle = fillGrad
        ctx.globalAlpha = alpha
        ctx.fill()
        ctx.globalAlpha = 1.0
      }

      // Layer A: Secondary Fluid Plasma
      const plasmaGradA = ctx.createLinearGradient(
        centerX - 70,
        centerY - 70,
        centerX + 70,
        centerY + 70
      )
      plasmaGradA.addColorStop(0, `rgba(${secondaryR}, ${secondaryG}, ${secondaryB}, 0.85)`)
      plasmaGradA.addColorStop(1, `rgba(${primaryR}, ${primaryG}, ${primaryB}, 0.4)`)
      renderHarmonicBlob(54 + energy * 12, [3, 5, 2], phase * 1.3, 0.75, plasmaGradA)

      // Layer B: Primary Chromatic Core Liquid
      const plasmaGradB = ctx.createLinearGradient(
        centerX + 60,
        centerY - 60,
        centerX - 60,
        centerY + 60
      )
      plasmaGradB.addColorStop(0, `rgba(${primaryR}, ${primaryG}, ${primaryB}, 0.95)`)
      plasmaGradB.addColorStop(0.6, `rgba(${secondaryR}, ${secondaryG}, ${secondaryB}, 0.75)`)
      plasmaGradB.addColorStop(1, 'rgba(18, 24, 38, 0.9)')
      renderHarmonicBlob(48 + energy * 10, [4, 2, 6], -phase * 0.9, 0.85, plasmaGradB)

      // Layer C: High-Luminance Center Fusion Core
      const coreR = 26 + energy * 10
      const centerGrad = ctx.createRadialGradient(
        centerX - 4,
        centerY - 6,
        1,
        centerX,
        centerY,
        coreR
      )
      centerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
      centerGrad.addColorStop(0.35, `rgba(${primaryR}, ${primaryG}, ${primaryB}, 0.9)`)
      centerGrad.addColorStop(0.8, `rgba(${secondaryR}, ${secondaryG}, ${secondaryB}, 0.4)`)
      centerGrad.addColorStop(1, 'transparent')

      ctx.beginPath()
      ctx.arc(centerX, centerY, coreR, 0, Math.PI * 2)
      ctx.fillStyle = centerGrad
      ctx.fill()

      // 4. Specular Curved Light Sheen
      ctx.save()
      ctx.beginPath()
      ctx.arc(centerX - 3, centerY - 5, coreR * 0.65, -Math.PI * 0.75, -Math.PI * 0.15)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.stroke()
      ctx.restore()

      animRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [isAiSpeaking, state, micVolume, aiVolume])

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-2">
      {/* High-Precision Fluid Nebula Canvas */}
      <div className="relative flex items-center justify-center w-[380px] h-[270px]">
        <canvas
          ref={canvasRef}
          style={{ width: 380, height: 270 }}
          className="pointer-events-none"
        />

        {/* Live Audio Energy Beacon Wave */}
        {state === ORB_STATES.LISTENING && micVolume > 15 && (
          <div className="absolute inset-0 m-auto w-48 h-48 rounded-full border border-[#2DD4BF]/30 animate-ping pointer-events-none" />
        )}
      </div>

      {/* Awwwards Telemetry Glass Capsule */}
      <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#111726]/80 border border-white/[0.08] text-[11px] font-mono text-[#94A3B8] shadow-lg backdrop-blur-xl -mt-2">
        <span className="flex items-center gap-1.5 font-medium">
          <span
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              isAiSpeaking
                ? 'bg-[#818CF8] shadow-[0_0_8px_#818CF8]'
                : state === ORB_STATES.LISTENING
                ? 'bg-[#2DD4BF] shadow-[0_0_8px_#2DD4BF] animate-pulse'
                : 'bg-slate-500'
            }`}
          />
          <span className="text-[#F1F5F9] font-medium">
            {isAiSpeaking ? 'AI SYNTHESIS' : state === ORB_STATES.LISTENING ? 'LISTENING LIVE' : 'AURA STANDBY'}
          </span>
        </span>
        <span className="text-white/20">•</span>
        <span className="text-white/60">48kHz HD</span>
        <span className="text-white/20">•</span>
        <span className="text-[#2DD4BF]">
          {isAiSpeaking
            ? `${aiVolume}% GAIN`
            : state === ORB_STATES.LISTENING
            ? `${micVolume}% MIC`
            : 'READY'}
        </span>
      </div>
    </div>
  )
}

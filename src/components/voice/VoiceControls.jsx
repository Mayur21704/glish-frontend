import { motion } from 'framer-motion'
import { Mic, MicOff, Square, Play, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function VoiceControls({
  isSessionActive,
  isMuted,
  isCalibrating,
  calibrated,
  sessionDuration = '00:00',
  onStart,
  onEnd,
  onToggleMute,
  onCalibrate,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="flex items-center gap-2 sm:gap-3 bg-[#111726]/85 border border-white/[0.1] p-2 rounded-full shadow-2xl backdrop-blur-2xl"
    >
      {!isSessionActive ? (
        <>
          {/* Calibrate Ambient Noise Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCalibrate}
            disabled={isCalibrating}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer',
              calibrated
                ? 'bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30 shadow-[0_0_12px_rgba(45,212,191,0.15)]'
                : 'bg-[#162035] text-[#94A3B8] border border-white/[0.08] hover:text-[#F1F5F9] hover:border-[#2DD4BF]/30'
            )}
            title="Sample background room noise to calibrate AI speech detection"
          >
            <Sparkles size={13} className={isCalibrating ? 'animate-spin text-amber-400' : 'text-[#2DD4BF]'} />
            <span className="text-[11px] font-medium hidden sm:inline">
              {isCalibrating ? 'Sampling Room (3s)...' : calibrated ? 'Room Calibrated' : 'Calibrate Mic'}
            </span>
            <span className="text-[11px] font-medium sm:hidden">
              {isCalibrating ? 'Calibrating...' : calibrated ? 'Calibrated' : 'Calibrate'}
            </span>
          </motion.button>

          {/* Primary Start Practice Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            className="btn-glow flex items-center gap-2 px-6 py-2.5 cursor-pointer shadow-lg"
          >
            <Play size={14} className="fill-[#080C14]" />
            <span className="font-semibold text-xs sm:text-sm">Start Practice Session</span>
          </motion.button>
        </>
      ) : (
        <>
          {/* Mute Microphone Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleMute}
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-full transition-colors cursor-pointer',
              isMuted
                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                : 'bg-[#162035] text-[#F1F5F9] border border-white/[0.1] hover:bg-[#2DD4BF]/10 hover:text-[#2DD4BF]'
            )}
            title={isMuted ? 'Unmute microphone (M)' : 'Mute microphone (M)'}
          >
            {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
          </motion.button>

          {/* Live Mic & Timer Capsule */}
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0C101A]/80 border border-white/[0.08] text-xs">
            <span className={cn('h-2 w-2 rounded-full', isMuted ? 'bg-rose-500' : 'bg-[#2DD4BF] animate-pulse')} />
            <span className="font-mono text-[12px] text-[#F1F5F9] font-semibold tracking-wider">
              {sessionDuration}
            </span>
            <span className="text-[10px] text-[#94A3B8] hidden sm:inline">
              {isMuted ? '(Muted)' : 'Live Stream'}
            </span>
          </div>

          {/* Stop / Finish Session Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onEnd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold cursor-pointer transition-colors shadow-sm"
          >
            <Square size={12} className="fill-rose-400" />
            <span>Finish Session</span>
          </motion.button>
        </>
      )}
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import { Mic, MicOff, Square, Play, Sparkles, Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * FloatingVoiceDock — Speak.com-style sleek floating acoustic controller
 * Replaces the heavy 3D canvas orb with a clean, tactile bottom bar.
 */
export default function FloatingVoiceDock({
  isSessionActive,
  isMuted,
  isAiSpeaking,
  micVolume = 0,
  aiVolume = 0,
  sessionDuration = '00:00',
  isCalibrating,
  calibrated,
  onStart,
  onEnd,
  onToggleMute,
  onCalibrate,
  onInterrupt,
}) {
  const isSpeaking = isAiSpeaking || (isSessionActive && !isMuted && micVolume > 10)

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 sm:gap-4 px-4 py-2.5 rounded-full bg-white/95 border border-[#EAE5DE] shadow-[0_12px_40px_rgba(28,26,23,0.12)] backdrop-blur-xl"
    >
      {!isSessionActive ? (
        <>
          {/* Calibrate Button with Fan Filter Explanation */}
          <div className="relative group">
            <button
              onClick={onCalibrate}
              disabled={isCalibrating}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer border',
                calibrated
                  ? 'bg-[#4A7C59]/10 text-[#4A7C59] border-[#4A7C59]/30'
                  : 'bg-[#F4EFEA] text-[#6B645C] border-[#EAE5DE] hover:text-[#1C1A17]'
              )}
            >
              <Sparkles size={13} className={isCalibrating ? 'animate-spin text-[#E06D53]' : ''} />
              <span className="hidden sm:inline">
                {isCalibrating ? 'Sampling Room...' : calibrated ? 'Fan Hum Filtered' : 'Calibrate Mic'}
              </span>
            </button>

            {/* Explanatory Tooltip Popover */}
            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 rounded-xl bg-white border border-[#EAE5DE] shadow-xl text-[11px] text-[#6B645C] opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 text-center leading-relaxed">
              <span className="font-bold text-[#1C1A17] block mb-0.5">Fan & Noise Calibration</span>
              Samples 2s of quiet room noise to ignore computer/ceiling fans so glish listens only to your voice.
            </div>
          </div>

          {/* Primary Start Conversation Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="btn-terracotta flex items-center gap-2 py-2 px-5 text-xs sm:text-sm font-semibold cursor-pointer shadow-md"
          >
            <Mic size={15} />
            <span>Start Live Conversation</span>
          </motion.button>
        </>
      ) : (
        <>
          {/* Interrupt AI Button (or Mute Button when AI is silent) */}
          {isAiSpeaking ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onInterrupt}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              title="Click or press Spacebar to stop AI and speak"
            >
              <Square size={11} className="fill-white" />
              <span>Interrupt <span className="opacity-80 text-[10px] font-mono hidden sm:inline">(Space)</span></span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleMute}
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full transition-all duration-150 cursor-pointer border',
                isMuted
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-[#F4EFEA] border-[#EAE5DE] text-[#1C1A17] hover:bg-[#EDE7DE]'
              )}
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMuted ? <MicOff size={16} /> : <Mic size={16} className="text-[#E06D53]" />}
            </motion.button>
          )}

          {/* Acoustic Terracotta Wave Equalizer (Reacts to voice volume) */}
          <div className="flex items-center gap-1 h-5 px-2">
            <div
              className={cn(
                'w-[3px] rounded-full transition-all duration-150',
                isSpeaking ? 'bg-[#E06D53] wave-bar-1' : 'bg-[#DFD8CE] h-2'
              )}
            />
            <div
              className={cn(
                'w-[3px] rounded-full transition-all duration-150',
                isSpeaking ? 'bg-[#E06D53] wave-bar-2' : 'bg-[#DFD8CE] h-3'
              )}
            />
            <div
              className={cn(
                'w-[3px] rounded-full transition-all duration-150',
                isSpeaking ? 'bg-[#D95D39] wave-bar-3' : 'bg-[#DFD8CE] h-1.5'
              )}
            />
            <div
              className={cn(
                'w-[3px] rounded-full transition-all duration-150',
                isSpeaking ? 'bg-[#E06D53] wave-bar-4' : 'bg-[#DFD8CE] h-3.5'
              )}
            />
            <div
              className={cn(
                'w-[3px] rounded-full transition-all duration-150',
                isSpeaking ? 'bg-[#D95D39] wave-bar-5' : 'bg-[#DFD8CE] h-2'
              )}
            />
          </div>

          {/* Conversational Telemetry Status */}
          <div className="flex items-center gap-2 px-2">
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                isAiSpeaking
                  ? 'bg-indigo-500 animate-pulse'
                  : isMuted
                  ? 'bg-rose-500'
                  : 'bg-[#E06D53] animate-pulse'
              )}
            />
            <span className="text-xs font-semibold text-[#1C1A17] hidden sm:inline">
              {isAiSpeaking ? 'AI Speaking...' : isMuted ? 'Muted' : 'Listening...'}
            </span>
            <span className="text-xs font-mono font-medium text-[#6B645C] border-l border-[#EAE5DE] pl-2">
              {sessionDuration}
            </span>
          </div>

          {/* Finish Session Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onEnd}
            className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold cursor-pointer transition-colors"
          >
            <Square size={11} className="fill-rose-500" />
            <span>Finish</span>
          </motion.button>
        </>
      )}
    </motion.div>
  )
}

import { motion, AnimatePresence } from 'framer-motion'
import { Award, Clock, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react'

export default function SessionReportModal({ isOpen, onClose, sessionStats }) {
  if (!isOpen || !sessionStats) return null

  const {
    duration = '0m 00s',
    wordsSpoken = 0,
    wpm = 0,
    grammarAccuracy = 100,
    cefrLevel = 'B2',
    cefrDesc = 'Upper-Intermediate',
    summary = 'Great job practicing spoken English today! Your rhythm and fluency are developing well.',
  } = sessionStats

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1A17]/40 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
          className="w-full max-w-md bg-white border border-[#EAE5DE] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#EAE5DE] pb-3.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1C1A17]">
              <Award size={16} className="text-[#E06D53]" />
              <span>Session Scorecard</span>
            </div>
            <button
              onClick={onClose}
              className="text-[#6B645C] hover:text-[#1C1A17] text-sm font-mono cursor-pointer transition-colors p-1"
            >
              ✕
            </button>
          </div>

          {/* CEFR Level Hero Badge */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#F4EFEA] border border-[#EAE5DE] text-center relative overflow-hidden">
            <span className="font-heading text-5xl font-extrabold text-[#E06D53] tracking-tight">
              {cefrLevel}
            </span>
            <span className="text-sm font-semibold text-[#1C1A17] mt-1">
              {cefrDesc} Fluency
            </span>
            <span className="text-[11px] text-[#6B645C] mt-1 max-w-[240px]">
              Evaluated on pacing, vocabulary density, and syntax correctness
            </span>
          </div>

          {/* 4 Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#EAE5DE]">
              <div className="flex items-center gap-1.5 text-[11px] text-[#6B645C] mb-1">
                <MessageSquare size={13} className="text-[#E06D53]" />
                <span>Spoken Words</span>
              </div>
              <div className="font-mono text-lg font-bold text-[#1C1A17]">
                {wordsSpoken}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#EAE5DE]">
              <div className="flex items-center gap-1.5 text-[11px] text-[#6B645C] mb-1">
                <Clock size={13} className="text-[#D97706]" />
                <span>Speaking Rate</span>
              </div>
              <div className="font-mono text-lg font-bold text-[#1C1A17]">
                {wpm} <span className="text-xs font-normal text-[#6B645C]">WPM</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#EAE5DE]">
              <div className="flex items-center gap-1.5 text-[11px] text-[#6B645C] mb-1">
                <CheckCircle size={13} className="text-[#4A7C59]" />
                <span>Accuracy</span>
              </div>
              <div className="font-mono text-lg font-bold text-[#4A7C59]">
                {grammarAccuracy}%
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#EAE5DE]">
              <div className="flex items-center gap-1.5 text-[11px] text-[#6B645C] mb-1">
                <Clock size={13} className="text-[#6B645C]" />
                <span>Duration</span>
              </div>
              <div className="font-mono text-lg font-bold text-[#1C1A17]">
                {duration}
              </div>
            </div>
          </div>

          {/* Key Insights Summary */}
          <div className="p-3.5 rounded-2xl bg-[#F4EFEA] border border-[#EAE5DE] text-xs text-[#6B645C] leading-relaxed">
            <p className="font-semibold text-[#1C1A17] mb-1 text-[11px]">Tutor Feedback</p>
            <p className="text-[11px] leading-relaxed">{summary}</p>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="btn-terracotta w-full py-3 text-xs font-bold justify-center cursor-pointer shadow-md"
            >
              <span>Continue Learning</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

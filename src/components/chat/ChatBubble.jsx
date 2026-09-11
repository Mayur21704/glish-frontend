import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Sparkles, ChevronDown, ChevronUp, Check, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ChatBubble({ message, onReplay, relatedFeedback, onSaveFeedback }) {
  const isUser = message.role === 'user'
  const [isFeedbackExpanded, setIsFeedbackExpanded] = useState(false)
  const [saved, setSaved] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      className={cn(
        'flex gap-3 max-w-[92%] sm:max-w-[82%] my-3',
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto flex-row'
      )}
    >
      {/* Speaker Avatar Icon */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-mono font-bold shadow-xs mt-1 border',
          isUser
            ? 'bg-[#E06D53]/15 border-[#E06D53]/30 text-[#E06D53]'
            : 'bg-[#1C1A17] border-[#1C1A17] text-white shadow-sm'
        )}
      >
        {isUser ? 'YOU' : <Sparkles size={13} className="fill-[#E06D53] text-[#E06D53]" />}
      </div>

      {/* Main Message Content Column */}
      <div className="flex flex-col space-y-2">
        <div
          className={cn(
            'px-5 py-3.5 rounded-2xl text-sm sm:text-base leading-relaxed relative group transition-all',
            isUser
              ? 'bg-[#F4EFEA] border border-[#EAE5DE] text-[#1C1A17] rounded-tr-xs shadow-xs'
              : 'bg-white border border-[#EAE5DE] text-[#1C1A17] rounded-tl-xs shadow-[0_4px_20px_rgba(28,26,23,0.04)]'
          )}
        >
          <p className="whitespace-pre-wrap leading-relaxed font-normal">{message.text}</p>

          {/* AI Message Action Footer */}
          {!isUser && onReplay && (
            <div className="mt-2.5 pt-2 border-t border-[#EAE5DE]/60 flex items-center justify-between">
              <button
                onClick={() => onReplay(message.text)}
                className="flex items-center gap-1.5 text-xs font-medium text-[#E06D53] hover:text-[#C85032] cursor-pointer transition-colors"
                title="Replay pronunciation"
              >
                <Volume2 size={13} />
                <span>Listen to pronunciation</span>
              </button>
            </div>
          )}
        </div>

        {/* Inline Feedback Chip attached directly to user turn (Speak.com style) */}
        {isUser && relatedFeedback && (
          <div className="flex flex-col items-end space-y-1.5">
            <button
              onClick={() => setIsFeedbackExpanded(!isFeedbackExpanded)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#E06D53]/10 text-[#E06D53] border border-[#E06D53]/25 hover:bg-[#E06D53]/15 transition-colors cursor-pointer shadow-xs"
            >
              <span>💡 {relatedFeedback.type === 'grammar' ? 'Grammar Tip' : 'Native Vocab Upgrade'}</span>
              {isFeedbackExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {/* Expandable Diff Card */}
            <AnimatePresence>
              {isFeedbackExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full max-w-md p-3.5 rounded-xl bg-white border border-[#EAE5DE] shadow-md space-y-2 text-left"
                >
                  <div className="space-y-1 text-xs">
                    <div className="text-rose-600 line-through bg-rose-50 px-2 py-1 rounded border border-rose-200">
                      "{relatedFeedback.data?.original_phrase}"
                    </div>
                    <div className="text-[#4A7C59] font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                      "{relatedFeedback.data?.corrected_phrase || relatedFeedback.data?.upgraded_phrase}"
                    </div>
                    {relatedFeedback.data?.explanation && (
                      <p className="text-[11px] text-[#6B645C] pt-1">
                        {relatedFeedback.data?.explanation}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <button
                      onClick={() => {
                        onSaveFeedback?.(relatedFeedback)
                        setSaved(true)
                      }}
                      disabled={saved}
                      className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-[#F4EFEA] text-[#1C1A17] border border-[#EAE5DE] hover:bg-[#EDE6DE] transition-colors cursor-pointer"
                    >
                      {saved ? <Check size={11} className="text-[#4A7C59]" /> : <Bookmark size={11} />}
                      <span>{saved ? 'Saved' : 'Save to Lexicon'}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  )
}

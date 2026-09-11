import { useEffect, useRef } from 'react'
import ChatBubble from './ChatBubble'
import LiveDraftBubble from './LiveDraftBubble'
import { Sparkles, MessageSquare } from 'lucide-react'

export default function ChatPanel({
  messages = [],
  draftText = '',
  onReplay,
  feedbackCards = [],
  onSaveFeedback,
}) {
  const scrollBottomRef = useRef(null)

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, draftText])

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
      {messages.length === 0 && !draftText ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F4EFEA] border border-[#EAE5DE] flex items-center justify-center text-[#E06D53] shadow-xs">
            <MessageSquare size={22} />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-lg font-bold text-[#1C1A17]">
              Voice Conversation Arena
            </h3>
            <p className="text-xs sm:text-sm text-[#6B645C] max-w-sm leading-relaxed">
              Tap the microphone below to start speaking. The AI will respond in real time, and helpful grammar and vocabulary upgrades will appear directly under your speech.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 pb-24">
          {messages.map((m, idx) => {
            // Check if there is feedback matching this turn
            const isLastUserMessage =
              m.role === 'user' &&
              messages.slice(idx + 1).every((nextMsg) => nextMsg.role !== 'user')

            const latestFeedback = isLastUserMessage && feedbackCards.length > 0
              ? feedbackCards[feedbackCards.length - 1]
              : null

            return (
              <ChatBubble
                key={m.id || idx}
                message={m}
                onReplay={onReplay}
                relatedFeedback={latestFeedback}
                onSaveFeedback={onSaveFeedback}
              />
            )
          })}
          <LiveDraftBubble text={draftText} />
          <div ref={scrollBottomRef} />
        </div>
      )}
    </div>
  )
}

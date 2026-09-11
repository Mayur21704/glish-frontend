import { useState, useEffect, useRef } from 'react'
import ChatBubble from './ChatBubble'
import LiveDraftBubble from './LiveDraftBubble'
import { MessageSquare, Send, ArrowUp } from 'lucide-react'

export default function ChatPanel({
  messages = [],
  draftText = '',
  onReplay,
  feedbackCards = [],
  onSaveFeedback,
  isSessionActive = false,
  onSendMessage,
  onSendDraft,
}) {
  const [textInput, setTextInput] = useState('')
  const scrollBottomRef = useRef(null)

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, draftText])

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const trimmed = textInput.trim()
    if (!trimmed || !isSessionActive) return
    onSendMessage?.(trimmed)
    setTextInput('')
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
        {messages.length === 0 && !draftText ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3 min-h-[300px]">
            <div className="w-12 h-12 rounded-2xl bg-[#F4EFEA] border border-[#EAE5DE] flex items-center justify-center text-[#E06D53] shadow-xs">
              <MessageSquare size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold text-[#1C1A17]">
                Live Conversational Studio
              </h3>
              <p className="text-xs sm:text-sm text-[#6B645C] max-w-sm leading-relaxed">
                Click "Start Live Conversation" below to begin speaking. You can speak naturally through your microphone or type messages at any time.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {messages.map((m, idx) => {
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
            <LiveDraftBubble text={draftText} onSendNow={onSendDraft} />
            <div ref={scrollBottomRef} />
          </div>
        )}
      </div>

      {/* Direct Text Fallback Bar (When Session is Active) */}
      {isSessionActive && (
        <div className="px-4 py-2.5 bg-white/80 border-t border-[#EAE5DE] backdrop-blur-md">
          <form onSubmit={handleFormSubmit} className="flex items-center gap-2 max-w-2xl mx-auto">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type a message or continue speaking naturally..."
              className="flex-1 px-4 py-2 rounded-full bg-[#F4EFEA] border border-[#EAE5DE] text-xs sm:text-sm text-[#1C1A17] placeholder:text-[#9C948A] focus:outline-hidden focus:border-[#E06D53] focus:ring-1 focus:ring-[#E06D53] transition-all"
            />
            <button
              type="submit"
              disabled={!textInput.trim()}
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#E06D53] disabled:bg-[#EAE5DE] text-white disabled:text-[#9C948A] transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
              title="Send message"
            >
              <ArrowUp size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

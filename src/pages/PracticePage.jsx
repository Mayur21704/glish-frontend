import { useState, useCallback, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import FloatingVoiceDock from '@/components/voice/FloatingVoiceDock'
import ScenarioSelector from '@/components/voice/ScenarioSelector'
import ChatPanel from '@/components/chat/ChatPanel'
import FeedbackDrawer from '@/components/feedback/FeedbackDrawer'
import SessionReportModal from '@/components/session/SessionReportModal'
import useWebSocket from '@/hooks/useWebSocket'
import useAudioEngine from '@/hooks/useAudioEngine'
import useSpeechRecognition from '@/hooks/useSpeechRecognition'
import { formatDuration, formatWPM, getCefrLevel } from '@/lib/utils'
import { Sparkles, PanelRightOpen, PanelRightClose, BookOpen } from 'lucide-react'

function mapScenarioToKey(name = '') {
  const lower = (name || '').toLowerCase()
  if (lower.includes('system') || lower.includes('design') || lower.includes('scale')) return 'systemdesign'
  if (lower.includes('devops') || lower.includes('cloud') || lower.includes('docker') || lower.includes('full-stack')) return 'devops'
  if (lower.includes('interview')) return 'interview'
  if (lower.includes('business') || lower.includes('meeting')) return 'business'
  if (lower.includes('cafe') || lower.includes('coffee')) return 'cafe'
  if (lower.includes('ielts')) return 'ielts'
  return 'free'
}

export default function PracticePage() {
  const location = useLocation()
  const [selectedScenario, setSelectedScenario] = useState('systemdesign')
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [showReportModal, setShowReportModal] = useState(false)
  const [sessionReportStats, setSessionReportStats] = useState(null)
  const [showSideFeedback, setShowSideFeedback] = useState(false)
  const [resumedSession, setResumedSession] = useState(null)
  
  const wordsCountRef = useRef(0)
  const [totalWords, setTotalWords] = useState(0)

  // 1. Live Session Timer
  useEffect(() => {
    if (!isSessionActive) return
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isSessionActive])

  const formattedTimer = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:${String(elapsedSeconds % 60).padStart(2, '0')}`

  // 2. WebSocket Hook
  const {
    connect,
    disconnect,
    sendMessage,
    restoreHistory,
    sendHistoryToServer,
    messages,
    feedbackCards,
    clearMessages,
  } = useWebSocket()

  // 3. Audio Engine Hook
  const {
    startAudio,
    stopAudio,
    toggleMute,
    isMuted,
    isAiSpeaking,
    micVolume,
    aiVolume,
    enqueueTts,
    clearTtsQueue,
    calibrateRoom,
    isCalibrating,
    calibrated,
  } = useAudioEngine({})

  const [currentAiText, setCurrentAiText] = useState('')

  // Interruption handler: Halts AI speech immediately and starts listening to the user
  const handleInterrupt = useCallback(() => {
    console.log('[PracticePage] 🛑 Halting AI speech on user interrupt!')
    clearTtsQueue()
    setCurrentAiText('')
  }, [clearTtsQueue])

  // 4. Speech Recognition (with real-time voice barge-in)
  const handleFinalTranscript = useCallback((text) => {
    if (!text || !text.trim()) return

    const words = text.trim().split(/\s+/).length
    wordsCountRef.current += words
    setTotalWords(wordsCountRef.current)

    sendMessage(text)
  }, [sendMessage])

  const speechRec = useSpeechRecognition({
    onFinalTranscript: handleFinalTranscript,
    isAiSpeaking,
    onInterrupt: handleInterrupt,
    currentAiText,
  })

  // Global Spacebar shortcut to interrupt AI speech
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && isSessionActive && isAiSpeaking) {
        if (e.target === document.body || e.target.tagName !== 'INPUT') {
          e.preventDefault()
          handleInterrupt()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSessionActive, isAiSpeaking, handleInterrupt])

  // 5. Automatically speak incoming AI messages
  const lastSpokenMsgIdRef = useRef(null)
  useEffect(() => {
    if (!isSessionActive || messages.length === 0) return
    const lastMsg = messages[messages.length - 1]
    const msgKey = lastMsg.id || `${lastMsg.timestamp}-${lastMsg.text}`
    if (lastMsg.role === 'tutor' && lastMsg.text && lastSpokenMsgIdRef.current !== msgKey) {
      lastSpokenMsgIdRef.current = msgKey
      setCurrentAiText(lastMsg.text)
      enqueueTts(lastMsg.text)
    }
  }, [messages, isSessionActive, enqueueTts])

  // Resume conversation from HistoryPage if requested
  useEffect(() => {
    if (location.state?.resumeSession) {
      const s = location.state.resumeSession
      setResumedSession(s)
      const mappedKey = mapScenarioToKey(s.scenario)
      setSelectedScenario(mappedKey)
      if (Array.isArray(s.transcript) && s.transcript.length > 0) {
        restoreHistory(s.transcript)
      }
    }
  }, [location.state, restoreHistory])

  const handleStartFresh = () => {
    setResumedSession(null)
    clearMessages()
  }

  // Start Conversation Session
  const handleStart = async () => {
    if (!resumedSession) {
      clearMessages()
    }
    wordsCountRef.current = 0
    setTotalWords(0)
    setElapsedSeconds(0)
    setSessionStartTime(Date.now())

    const audioOk = await startAudio()
    if (!audioOk) {
      alert('Microphone access denied or unavailable.')
      return
    }

    connect(selectedScenario, 'Aoede')
    if (resumedSession && messages.length > 0) {
      setTimeout(() => {
        sendHistoryToServer(messages)
      }, 500)
    }
    speechRec.startListening()
    setIsSessionActive(true)
  }

  // End Conversation Session & Generate Report
  const handleEnd = () => {
    const durationMs = Date.now() - sessionStartTime
    const formattedDuration = formatDuration(durationMs)
    const paceWpm = formatWPM(wordsCountRef.current, durationMs)
    const mistakesCount = feedbackCards.filter(c => c.type === 'grammar').length
    const accuracy = Math.max(70, Math.round(100 - (mistakesCount * 6)))
    const { level, desc } = getCefrLevel(accuracy, wordsCountRef.current, mistakesCount)

    const scenarioTitle =
      selectedScenario === 'systemdesign' ? 'System Design & Scalability'
      : selectedScenario === 'devops' ? 'Full-Stack & DevOps Discussion'
      : selectedScenario === 'interview' ? 'Tech Job Interview (Lead Engineer)'
      : selectedScenario === 'business' ? 'Engineering Roadmap & Architecture Sync'
      : selectedScenario === 'cafe' ? 'Coffee Break & Casual Chat'
      : selectedScenario === 'ielts' ? 'IELTS English Fluency Prep'
      : 'Free Spoken Discussion'

    setSessionReportStats({
      duration: formattedDuration,
      wordsSpoken: wordsCountRef.current,
      wpm: paceWpm,
      grammarAccuracy: accuracy,
      cefrLevel: level,
      cefrDesc: desc,
      summary: `You spoke ${wordsCountRef.current} words in ${formattedDuration} during ${scenarioTitle} practice. You received ${mistakesCount} grammar corrections and ${feedbackCards.filter(c => c.type === 'vocab').length} vocabulary upgrades.`,
    })

    // Automatically save session to persistent DB
    const finalSession = {
      scenario: scenarioTitle,
      started_at: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration_seconds: Math.max(15, Math.round(durationMs / 1000)),
      words_spoken: wordsCountRef.current,
      cefr_level: level,
      accuracy_percent: accuracy,
      transcript: messages.map(m => ({ role: m.role, text: m.text })),
    }

    fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalSession)
    }).catch(e => console.warn('[Session] Save error:', e))

    speechRec.stopListening()
    stopAudio()
    disconnect()
    setIsSessionActive(false)
    setShowReportModal(true)
  }

  const handleListenText = (text) => {
    enqueueTts(text)
  }

  const handleSaveVocab = async (vocabItem) => {
    try {
      await fetch('/api/vocab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vocabItem),
      })
    } catch (e) {
      console.warn('Failed to save to backend API:', e)
    }
  }

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-100px)] min-h-[640px] max-w-5xl mx-auto w-full relative pb-16">
      {/* 1. Top Bar: Scenario Selector or Active Session Ribbon */}
      <div className="mb-4">
        {!isSessionActive ? (
          <ScenarioSelector
            selectedScenario={selectedScenario}
            onSelect={setSelectedScenario}
            disabled={isSessionActive}
          />
        ) : (
          <div className="flex items-center justify-between px-5 py-2.5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#E06D53] animate-pulse" />
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#6B645C]">Active Track:</span>
                <span className="font-semibold text-[#1C1A17] capitalize">{selectedScenario}</span>
              </div>
              <span className="text-[#DFD8CE]">•</span>
              <span className="text-xs font-mono font-semibold text-[#E06D53]">{totalWords} words spoken</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSideFeedback(!showSideFeedback)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EFEA] hover:bg-[#EDE6DE] text-xs font-medium text-[#1C1A17] border border-[#EAE5DE] transition-colors cursor-pointer"
              >
                {showSideFeedback ? <PanelRightClose size={13} /> : <PanelRightOpen size={13} />}
                <span>{feedbackCards.length} Coaching Tips</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Resumed Conversation Context Banner */}
      {resumedSession && (
        <div className="mb-3 px-4 py-2.5 rounded-2xl bg-[#F4EFEA] border border-[#EAE5DE] flex items-center justify-between text-xs text-[#6B645C] shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E06D53] animate-pulse" />
            <span>
              Resumed from History: <strong className="text-[#1C1A17]">{resumedSession.scenario}</strong> ({messages.length} previous messages loaded)
            </span>
          </div>
          <button
            onClick={handleStartFresh}
            className="text-[11px] font-semibold text-[#E06D53] hover:underline cursor-pointer"
          >
            Start Fresh Session
          </button>
        </div>
      )}

      {/* 2. Central Conversational Timeline (THE HERO STAGE) */}
      <div className="flex-1 flex gap-4 overflow-hidden relative rounded-3xl bg-white border border-[#EAE5DE] shadow-[0_4px_24px_rgba(28,26,23,0.04)]">
        {/* Main Chat Stream */}
        <div className="flex-1 flex flex-col h-full relative overflow-hidden">
          <ChatPanel
            messages={messages}
            draftText={speechRec.interimText}
            onReplay={handleListenText}
            feedbackCards={feedbackCards}
            onSaveFeedback={handleSaveVocab}
          />
        </div>

        {/* Optional Collapsible Side Feedback Panel */}
        <AnimatePresence>
          {showSideFeedback && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full border-l border-[#EAE5DE] bg-[#FBF9F5] overflow-hidden flex flex-col shrink-0"
            >
              <div className="p-4 border-b border-[#EAE5DE] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1C1A17]">
                  <BookOpen size={14} className="text-[#E06D53]" />
                  <span>Session Coaching Insights</span>
                </div>
                <button
                  onClick={() => setShowSideFeedback(false)}
                  className="text-xs text-[#6B645C] hover:text-[#1C1A17] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <FeedbackDrawer
                  cards={feedbackCards}
                  onListen={handleListenText}
                  onSave={handleSaveVocab}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Speak.com-Style Sleek Floating Voice Dock */}
      <FloatingVoiceDock
        isSessionActive={isSessionActive}
        isMuted={isMuted}
        isAiSpeaking={isAiSpeaking}
        micVolume={micVolume}
        aiVolume={aiVolume}
        sessionDuration={formattedTimer}
        isCalibrating={isCalibrating}
        calibrated={calibrated}
        onStart={handleStart}
        onEnd={handleEnd}
        onToggleMute={toggleMute}
        onCalibrate={calibrateRoom}
        onInterrupt={handleInterrupt}
      />

      {/* Post-Session CEFR Scorecard Modal */}
      <SessionReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        sessionStats={sessionReportStats}
      />
    </div>
  )
}

import { useState, useRef, useCallback, useEffect } from 'react'

const HANGING_CONNECTORS = new Set([
  'and', 'but', 'or', 'so', 'because', 'that', 'which', 'who', 'with',
  'to', 'for', 'in', 'on', 'at', 'by', 'the', 'a', 'an', 'like', 'if',
  'when', 'while', 'as', 'since', 'also', 'then', 'than', 'my', 'your',
  'our', 'their', 'we', 'i', 'you', 'they', 'he', 'she', 'it', 'is', 'are', 'was', 'were'
])

/**
 * Robust Speech Recognition Engine with Strict Hardware Turn-Taking
 * 
 * CORE GUARANTEE:
 * When AI is speaking through laptop speakers, the browser microphone is HARD STOPPED.
 * It is physically impossible for the AI's audio to enter the microphone or loop back.
 */
export default function useSpeechRecognition({
  onFinalTranscript,
  onInterimTranscript,
  isAiSpeaking = false,
  onInterrupt,
  currentAiText = '',
  headphonesMode = false,
}) {
  const [isListening, setIsListening] = useState(false)
  const [interimText, setInterimText] = useState('')

  const recognizerRef = useRef(null)
  const shouldListenRef = useRef(false)
  const isStartingRef = useRef(false)
  const isRecognizingRef = useRef(false)
  const restartTimerRef = useRef(null)

  const accumulatedTranscriptRef = useRef('')
  const lastInterimRef = useRef('')
  const debounceTimerRef = useRef(null)

  const isAiSpeakingRef = useRef(isAiSpeaking)
  const currentAiTextRef = useRef(currentAiText)
  const headphonesModeRef = useRef(headphonesMode)

  useEffect(() => {
    headphonesModeRef.current = headphonesMode
  }, [headphonesMode])

  const getDynamicPauseDelay = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return 1100

    const words = trimmed.split(/\s+/)
    const lastWord = words[words.length - 1].toLowerCase().replace(/[^\w]/g, '')

    if (HANGING_CONNECTORS.has(lastWord)) return 1600
    if (words.length <= 2) return 1300
    return 1100
  }

  const flushAccumulator = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }

    const fullUtterance = (accumulatedTranscriptRef.current + ' ' + lastInterimRef.current).trim()

    // NEVER dispatch if AI is speaking or if utterance is empty
    if (fullUtterance.length > 0 && !isAiSpeakingRef.current) {
      console.log('[STT Engine] 🎙️ Finalized user utterance:', fullUtterance)
      onFinalTranscript?.(fullUtterance)
      accumulatedTranscriptRef.current = ''
      lastInterimRef.current = ''
      setInterimText('')
    }
  }, [onFinalTranscript])

  const scheduleFlush = useCallback((currentText) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    const delay = getDynamicPauseDelay(currentText)
    debounceTimerRef.current = setTimeout(() => {
      flushAccumulator()
    }, delay)
  }, [flushAccumulator])

  const startListening = useCallback(() => {
    const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)
    if (!SpeechRecognition) {
      console.warn('[STT Engine] Web Speech API not supported.')
      return
    }

    shouldListenRef.current = true

    // If AI is currently speaking in speaker mode, DO NOT START!
    if (isAiSpeakingRef.current && !headphonesModeRef.current) {
      return
    }

    // Prevent starting if already active or starting
    if (isRecognizingRef.current || isStartingRef.current) {
      return
    }

    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current)
      restartTimerRef.current = null
    }

    try {
      isStartingRef.current = true
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        isStartingRef.current = false
        isRecognizingRef.current = true
        setIsListening(true)
      }

      recognition.onresult = (event) => {
        // If AI started speaking while processing result, drop immediately
        if (isAiSpeakingRef.current && !headphonesModeRef.current) {
          accumulatedTranscriptRef.current = ''
          lastInterimRef.current = ''
          setInterimText('')
          return
        }

        let sessionFinal = ''
        let sessionInterim = ''

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i]
          const transcript = res[0]?.transcript || ''
          if (res.isFinal) {
            sessionFinal += transcript + ' '
          } else {
            sessionInterim += transcript
          }
        }

        const rawSpoken = (sessionFinal || sessionInterim).trim()
        if (!rawSpoken) return

        if (sessionFinal.trim().length > 0) {
          const cleanFinal = sessionFinal.trim()
          const prev = accumulatedTranscriptRef.current.trim()
          accumulatedTranscriptRef.current = prev ? `${prev} ${cleanFinal}` : cleanFinal
          lastInterimRef.current = ''
        } else {
          lastInterimRef.current = sessionInterim.trim()
        }

        const currentCombined = (accumulatedTranscriptRef.current + ' ' + lastInterimRef.current).trim()
        if (currentCombined) {
          setInterimText(currentCombined)
          onInterimTranscript?.(currentCombined)
          scheduleFlush(currentCombined)
        }
      }

      recognition.onerror = (event) => {
        isStartingRef.current = false
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          console.warn('[STT Engine] Event notice:', event.error)
        }
        if (event.error === 'not-allowed') {
          console.error('[STT Engine] Mic permission denied')
          shouldListenRef.current = false
        }
      }

      recognition.onend = () => {
        isStartingRef.current = false
        isRecognizingRef.current = false
        setIsListening(false)
        recognizerRef.current = null

        // Only revive if session is active AND AI is not currently speaking
        if (shouldListenRef.current && !isAiSpeakingRef.current) {
          if (restartTimerRef.current) clearTimeout(restartTimerRef.current)
          restartTimerRef.current = setTimeout(() => {
            if (shouldListenRef.current && !isAiSpeakingRef.current && !isRecognizingRef.current) {
              startListening()
            }
          }, 80)
        }
      }

      recognition.start()
      recognizerRef.current = recognition
    } catch (err) {
      isStartingRef.current = false
      isRecognizingRef.current = false
      if (shouldListenRef.current && !isAiSpeakingRef.current) {
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current)
        restartTimerRef.current = setTimeout(() => {
          if (shouldListenRef.current && !isAiSpeakingRef.current) startListening()
        }, 250)
      }
    }
  }, [scheduleFlush, onInterimTranscript])

  const stopListening = useCallback(() => {
    shouldListenRef.current = false
    isStartingRef.current = false
    isRecognizingRef.current = false

    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current)
      restartTimerRef.current = null
    }

    flushAccumulator()

    if (recognizerRef.current) {
      try {
        recognizerRef.current.onend = null
        recognizerRef.current.onerror = null
        recognizerRef.current.abort()
      } catch (e) {}
      recognizerRef.current = null
    }
    setIsListening(false)
  }, [flushAccumulator])

  // HARD TURN-TAKING MIC GATE:
  // When AI speaks -> ABORT mic immediately.
  // When AI finishes -> START mic after 350ms room decay.
  useEffect(() => {
    isAiSpeakingRef.current = isAiSpeaking
    currentAiTextRef.current = currentAiText

    if (isAiSpeaking && !headphonesModeRef.current) {
      // 🛑 AI IS SPEAKING: ABORT MIC
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
      accumulatedTranscriptRef.current = ''
      lastInterimRef.current = ''
      setInterimText('')

      if (recognizerRef.current) {
        try {
          recognizerRef.current.onend = null
          recognizerRef.current.onerror = null
          recognizerRef.current.abort()
        } catch (e) {}
        recognizerRef.current = null
      }
      isStartingRef.current = false
      isRecognizingRef.current = false
      setIsListening(false)
    } else if (!isAiSpeaking && shouldListenRef.current) {
      // 🎙️ AI FINISHED: Re-open mic after 350ms acoustic decay
      const decayTimer = setTimeout(() => {
        if (shouldListenRef.current && !isAiSpeakingRef.current && !isRecognizingRef.current) {
          startListening()
        }
      }, 350)
      return () => clearTimeout(decayTimer)
    }
  }, [isAiSpeaking, startListening])

  const restartListening = useCallback(() => {
    if (recognizerRef.current) {
      try {
        recognizerRef.current.onend = null
        recognizerRef.current.onerror = null
        recognizerRef.current.abort()
      } catch (e) {}
      recognizerRef.current = null
    }
    isStartingRef.current = false
    isRecognizingRef.current = false
    accumulatedTranscriptRef.current = ''
    lastInterimRef.current = ''
    setInterimText('')
    startListening()
  }, [startListening])

  // Watchdog: revive only if AI is NOT speaking and session is active
  useEffect(() => {
    const watchdog = setInterval(() => {
      if (shouldListenRef.current && !isAiSpeakingRef.current && !isRecognizingRef.current && !isStartingRef.current) {
        startListening()
      }
    }, 2500)
    return () => clearInterval(watchdog)
  }, [startListening])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      shouldListenRef.current = false
      isStartingRef.current = false
      isRecognizingRef.current = false
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current)
      if (recognizerRef.current) {
        try {
          recognizerRef.current.onend = null
          recognizerRef.current.abort()
        } catch (e) {}
      }
    }
  }, [])

  return {
    isListening,
    interimText,
    startListening,
    stopListening,
    restartListening,
    flushBuffer: flushAccumulator,
  }
}

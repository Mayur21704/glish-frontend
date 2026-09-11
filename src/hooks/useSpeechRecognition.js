import { useState, useRef, useCallback, useEffect } from 'react'

/**
 * Robust Continuous Speech Recognition Hook with Auto-Recovery
 * Designed for Chromium browsers to prevent stream freeze after multi-turn conversations
 */
export default function useSpeechRecognition({
  onFinalTranscript,
  onInterimTranscript,
  isAiSpeaking = false,
  onInterrupt,
  currentAiText = '',
}) {
  const [isListening, setIsListening] = useState(false)
  const [interimText, setInterimText] = useState('')
  const recognizerRef = useRef(null)
  const transcriptBufferRef = useRef('')
  const debounceTimerRef = useRef(null)
  const isAiSpeakingRef = useRef(isAiSpeaking)
  const shouldListenRef = useRef(false)
  const currentAiTextRef = useRef(currentAiText)
  const restartTimerRef = useRef(null)

  const PAUSE_DELAY_MS = 1800 // 1.8s natural pause before sending sentence

  const flushBuffer = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
    const fullText = transcriptBufferRef.current.trim()
    if (fullText.length > 0) {
      console.log('[STT] Sending complete transcript:', fullText)
      onFinalTranscript?.(fullText)
      transcriptBufferRef.current = ''
      setInterimText('')
    }
  }, [onFinalTranscript])

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.warn('[STT] Web Speech API not supported in this browser.')
      return
    }

    shouldListenRef.current = true

    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current)
      restartTimerRef.current = null
    }

    // Cleanly tear down any prior instance so it doesn't cause state collisions
    if (recognizerRef.current) {
      try {
        recognizerRef.current.onend = null
        recognizerRef.current.onerror = null
        recognizerRef.current.abort()
      } catch (e) {
        // ignore
      }
      recognizerRef.current = null
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      // Use Indian English acoustic model for accurate Indian-accented technical English
      recognition.lang = 'en-IN'

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event) => {
        let currentInterim = ''
        let currentFinal = ''

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            currentFinal += transcript + ' '
          } else {
            currentInterim += transcript
          }
        }

        const spokenWords = (currentFinal || currentInterim).trim().toLowerCase()

        // VOICE INTERRUPTION CHECK: If user speaks while AI is speaking
        if (isAiSpeakingRef.current && spokenWords.length > 0) {
          const aiText = (currentAiTextRef.current || '').toLowerCase()
          
          const isInterrupt =
            spokenWords.includes('wait') ||
            spokenWords.includes('stop') ||
            spokenWords.includes('hold on') ||
            spokenWords.includes('actually') ||
            spokenWords.includes('no') ||
            spokenWords.includes('listen') ||
            !aiText ||
            !aiText.includes(spokenWords)

          if (isInterrupt) {
            console.log('[STT] 🛑 Voice interruption detected:', spokenWords)
            onInterrupt?.()
          }
        }

        if (currentInterim) {
          setInterimText(currentInterim)
          onInterimTranscript?.(currentInterim)
        }

        if (currentFinal.trim().length > 0) {
          const cleanText = currentFinal.trim()
          transcriptBufferRef.current += (transcriptBufferRef.current ? ' ' : '') + cleanText
          setInterimText(transcriptBufferRef.current)
          onInterimTranscript?.(transcriptBufferRef.current)

          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
          }

          debounceTimerRef.current = setTimeout(() => {
            flushBuffer()
          }, PAUSE_DELAY_MS)
        }
      }

      recognition.onerror = (event) => {
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          console.warn('[STT] Recognition event warning:', event.error)
        }
      }

      recognition.onend = () => {
        setIsListening(false)
        recognizerRef.current = null

        // Auto-recreate fresh recognizer if session is active
        if (shouldListenRef.current) {
          restartTimerRef.current = setTimeout(() => {
            if (shouldListenRef.current) {
              startListening()
            }
          }, 150)
        }
      }

      recognition.start()
      recognizerRef.current = recognition
    } catch (err) {
      console.error('[STT] Start failed, scheduling retry:', err)
      if (shouldListenRef.current) {
        restartTimerRef.current = setTimeout(() => {
          if (shouldListenRef.current) startListening()
        }, 500)
      }
    }
  }, [flushBuffer, onInterimTranscript, onInterrupt])

  // Sync isAiSpeaking and auto-revive recognizer when AI finishes speaking
  useEffect(() => {
    isAiSpeakingRef.current = isAiSpeaking
    currentAiTextRef.current = currentAiText

    if (!isAiSpeaking && shouldListenRef.current && !recognizerRef.current) {
      console.log('[STT] AI speech concluded, reviving listener.')
      startListening()
    }
  }, [isAiSpeaking, currentAiText, startListening])

  const stopListening = useCallback(() => {
    shouldListenRef.current = false
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current)
      restartTimerRef.current = null
    }
    flushBuffer()
    if (recognizerRef.current) {
      try {
        recognizerRef.current.onend = null
        recognizerRef.current.onerror = null
        recognizerRef.current.abort()
      } catch (e) {
        // ignore
      }
      recognizerRef.current = null
    }
    setIsListening(false)
  }, [flushBuffer])

  // Stop recognition on unmount
  useEffect(() => {
    return () => {
      shouldListenRef.current = false
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current)
      }
      if (recognizerRef.current) {
        try {
          recognizerRef.current.onend = null
          recognizerRef.current.abort()
        } catch (e) {
          // ignore
        }
      }
    }
  }, [])

  return {
    isListening,
    interimText,
    startListening,
    stopListening,
    flushBuffer,
  }
}

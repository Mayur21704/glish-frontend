import { useState, useRef, useCallback, useEffect } from 'react'
import useNoiseSuppression from './useNoiseSuppression'

/**
 * useAudioEngine — Coordinates audio I/O, Web Audio Context, TTS Speech Queue,
 * AudioWorklet / Biquad filtering, and Barge-In interruption.
 */
export default function useAudioEngine({ onUserSpeechStart, onUserSpeechEnd, onVoiceCommand }) {
  const [isAiSpeaking, setIsAiSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [micVolume, setMicVolume] = useState(0)
  const [aiVolume, setAiVolume] = useState(0)
  
  const audioCtxRef = useRef(null)
  const playbackCtxRef = useRef(null)
  const micStreamRef = useRef(null)
  const animFrameRef = useRef(null)
  const ttsQueueRef = useRef([])
  const isTtsPlayingRef = useRef(false)
  const aiSpeakingRef = useRef(false)
  const activeUtteranceRef = useRef(null) // Prevent GC in Chrome/Edge
  const aiSpeechStartTimeRef = useRef(0)
  const consecutiveLoudFramesRef = useRef(0)

  const {
    getMicStream,
    buildFilterChain,
    calibrateRoom,
    isCalibrating,
    calibrated,
    ambientLevel,
    analyserRef: micAnalyserRef
  } = useNoiseSuppression()

  const aiAnalyserRef = useRef(null)

  // Sync state and ref
  const setAiSpeakingState = (val) => {
    aiSpeakingRef.current = val
    if (val) {
      aiSpeechStartTimeRef.current = Date.now()
      consecutiveLoudFramesRef.current = 0
    }
    setIsAiSpeaking(val)
  }

  // --- TTS Queue System ---
  const playNextTts = useCallback(() => {
    if (isTtsPlayingRef.current || ttsQueueRef.current.length === 0) {
      if (ttsQueueRef.current.length === 0 && !window.speechSynthesis.speaking) {
        setAiSpeakingState(false)
      }
      return
    }

    isTtsPlayingRef.current = true
    setAiSpeakingState(true)

    const textToSpeak = ttsQueueRef.current.shift()
    if (!textToSpeak) {
      isTtsPlayingRef.current = false
      setAiSpeakingState(false)
      return
    }

    // Resume speech synthesis if paused by browser
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.lang = 'en-US'
    utterance.rate = 1.0

    // Prevent Chrome garbage collection bug by anchoring to ref
    activeUtteranceRef.current = utterance

    // Try finding nice English voice
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Ava')))
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    // Safety Watchdog: If Chrome freezes and never fires onend, automatically release speaking state
    const maxUtteranceMs = Math.max(3000, textToSpeak.split(/\s+/).length * 550 + 2000)
    const watchdogTimer = setTimeout(() => {
      if (isTtsPlayingRef.current) {
        console.warn('[AudioEngine] ⏰ SpeechSynthesis watchdog: auto-releasing speech lock')
        activeUtteranceRef.current = null
        isTtsPlayingRef.current = false
        setAiSpeakingState(false)
      }
    }, maxUtteranceMs)

    utterance.onend = () => {
      clearTimeout(watchdogTimer)
      activeUtteranceRef.current = null
      isTtsPlayingRef.current = false
      if (ttsQueueRef.current.length > 0) {
        setTimeout(playNextTts, 60)
      } else {
        setAiSpeakingState(false)
      }
    }

    utterance.onerror = (e) => {
      clearTimeout(watchdogTimer)
      activeUtteranceRef.current = null
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('[TTS] Utterance error:', e)
      }
      isTtsPlayingRef.current = false
      setAiSpeakingState(false)
      if (ttsQueueRef.current.length > 0) {
        playNextTts()
      }
    }

    window.speechSynthesis.speak(utterance)
  }, [])

  const enqueueTts = useCallback((text) => {
    if (!text || !text.trim()) return
    ttsQueueRef.current.push(text)
    if (!isTtsPlayingRef.current) {
      playNextTts()
    }
  }, [playNextTts])

  const clearTtsQueue = useCallback(() => {
    ttsQueueRef.current = []
    isTtsPlayingRef.current = false
    activeUtteranceRef.current = null
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel()
        // Chrome bug workaround: cancel() leaves speech engine paused
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume()
        }
      } catch (e) {}
    }
    setAiSpeakingState(false)
  }, [])

  // Start Mic & Audio Context
  const startAudio = useCallback(async () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      const audioCtx = new AudioCtx()
      audioCtxRef.current = audioCtx

      const playbackCtx = new AudioCtx()
      playbackCtxRef.current = playbackCtx

      if (audioCtx.state === 'suspended') await audioCtx.resume()
      if (playbackCtx.state === 'suspended') await playbackCtx.resume()

      // Setup AI Analyser Node for AI speaking level measurement
      const aiAnalyser = playbackCtx.createAnalyser()
      aiAnalyser.fftSize = 128
      aiAnalyserRef.current = aiAnalyser

      // Get clean noise-suppressed mic stream
      const stream = await getMicStream()
      micStreamRef.current = stream

      const source = audioCtx.createMediaStreamSource(stream)
      buildFilterChain(audioCtx, source)

      // Start Level Metering & Barge-In Detection Loop
      const micData = new Uint8Array(128)

      const tick = () => {
        if (micAnalyserRef.current) {
          micAnalyserRef.current.getByteFrequencyData(micData)
          const avgMic = micData.reduce((acc, v) => acc + v, 0) / micData.length
          setMicVolume(avgMic)

          // Measure mic level for animated dock wave bars
          // (Note: We do NOT use volume threshold for barge-in because laptop speakers
          // play AI voice directly into the laptop mic, causing self-interruption)
        }

        if (aiSpeakingRef.current) {
          setAiVolume(45 + Math.random() * 40) // Smooth active animation level
        } else {
          setAiVolume(0)
        }

        animFrameRef.current = requestAnimationFrame(tick)
      }

      tick()
      return true
    } catch (err) {
      console.error('[AudioEngine] Init error:', err)
      return false
    }
  }, [ambientLevel, buildFilterChain, clearTtsQueue, getMicStream, micAnalyserRef, onUserSpeechStart])

  const stopAudio = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop())
      micStreamRef.current = null
    }

    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {})
      audioCtxRef.current = null
    }

    if (playbackCtxRef.current) {
      playbackCtxRef.current.close().catch(() => {})
      playbackCtxRef.current = null
    }

    clearTtsQueue()
    setMicVolume(0)
    setAiVolume(0)
  }, [clearTtsQueue])

  const toggleMute = useCallback(() => {
    if (micStreamRef.current) {
      const audioTracks = micStreamRef.current.getAudioTracks()
      audioTracks.forEach(t => {
        t.enabled = isMuted
      })
      setIsMuted(!isMuted)
    }
  }, [isMuted])

  useEffect(() => {
    return () => {
      stopAudio()
    }
  }, [stopAudio])

  return {
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
    ambientLevel,
  }
}

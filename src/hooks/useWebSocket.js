import { useState, useEffect, useRef, useCallback } from 'react'

export default function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [isFallbackMode, setIsFallbackMode] = useState(false)
  const [engineName, setEngineName] = useState('Offline')
  const [connectionStatus, setConnectionStatus] = useState('offline') // offline | connecting | connected | fallback
  const [messages, setMessages] = useState([]) // { role: 'user'|'tutor', text, timestamp }
  const [feedbackCards, setFeedbackCards] = useState([]) // { type: 'grammar'|'vocab'|'pronunciation', data, id }
  const wsRef = useRef(null)
  const sessionActiveRef = useRef(false)

  const connect = useCallback((scenario = 'free', voice = 'Aoede') => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return

    setConnectionStatus('connecting')
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const wsUrl = `${protocol}://${window.location.host}/ws?scenario=${scenario}&voice=${voice}`

    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('[WS] Connected to server')
      setIsConnected(true)
      setConnectionStatus('connected')
      setEngineName('Gemini Live')
      sessionActiveRef.current = true
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        // Fallback activation
        if (data.type === 'fallback_activated') {
          setIsFallbackMode(true)
          setConnectionStatus('fallback')
          setEngineName(data.engine || 'Fallback')
          return
        }

        // Chat history restore
        if (data.type === 'chat_history') {
          if (Array.isArray(data.history)) {
            const restored = data.history.map((m, i) => ({
              role: m.role,
              text: m.text,
              timestamp: Date.now() - (data.history.length - i) * 60000,
              id: `restored-${i}`,
            }))
            setMessages(restored)
          }
          return
        }

        // Fallback response (text + tool calls)
        if (data.type === 'fallback_response') {
          if (data.text) {
            setMessages(prev => [...prev, {
              role: 'tutor',
              text: data.text,
              timestamp: Date.now(),
              id: `tutor-${Date.now()}`,
            }])
          }
          if (data.toolResults && data.toolResults.length > 0) {
            const newCards = data.toolResults.map((tr, i) => ({
              type: tr.name === 'report_grammar_correction' ? 'grammar'
                : tr.name === 'suggest_vocabulary_upgrade' ? 'vocab'
                : 'pronunciation',
              data: tr.args,
              id: `card-${Date.now()}-${i}`,
              timestamp: Date.now(),
            }))
            setFeedbackCards(prev => [...prev, ...newCards])
          }
          return
        }

        // Live API tool calls
        if (data.toolCall && data.toolCall.functionCalls) {
          const newCards = data.toolCall.functionCalls.map((fc, i) => ({
            type: fc.name === 'report_grammar_correction' ? 'grammar'
              : fc.name === 'suggest_vocabulary_upgrade' ? 'vocab'
              : 'pronunciation',
            data: fc.args,
            id: `live-card-${Date.now()}-${i}`,
            timestamp: Date.now(),
          }))
          setFeedbackCards(prev => [...prev, ...newCards])
          return
        }

        // Live API server content (transcript text)
        if (data.serverContent) {
          const parts = data.serverContent?.modelTurn?.parts
          if (parts) {
            for (const part of parts) {
              if (part.text) {
                setMessages(prev => [...prev, {
                  role: 'tutor',
                  text: part.text,
                  timestamp: Date.now(),
                  id: `live-${Date.now()}`,
                }])
              }
            }
          }
          return
        }

        // Status messages
        if (data.type === 'status') {
          console.log('[WS] Status:', data.message)
          return
        }

        // Error
        if (data.error) {
          console.error('[WS] Error:', data.error)
          return
        }
      } catch (err) {
        console.error('[WS] Parse error:', err)
      }
    }

    ws.onclose = () => {
      console.log('[WS] Disconnected')
      setIsConnected(false)
      setConnectionStatus('offline')
      setEngineName('Offline')
      sessionActiveRef.current = false
    }

    ws.onerror = (err) => {
      console.error('[WS] Error:', err)
    }
  }, [])

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    sessionActiveRef.current = false
    setIsConnected(false)
    setConnectionStatus('offline')
    setEngineName('Offline')
  }, [])

  const sendMessage = useCallback((text) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return

    // Add user message to chat
    setMessages(prev => [...prev, {
      role: 'user',
      text,
      timestamp: Date.now(),
      id: `user-${Date.now()}`,
    }])

    // Send based on mode
    const payload = { transcript: text }
    wsRef.current.send(JSON.stringify(payload))
  }, [])

  const sendAudioData = useCallback((base64Audio) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
    wsRef.current.send(JSON.stringify({
      realtimeInput: {
        mediaChunks: [{ mimeType: 'audio/pcm;rate=16000', data: base64Audio }]
      }
    }))
  }, [])

  const restoreHistory = useCallback((pastMessages) => {
    if (Array.isArray(pastMessages) && pastMessages.length > 0) {
      const formatted = pastMessages.map((m, i) => ({
        role: m.role,
        text: m.text,
        timestamp: m.timestamp || Date.now() - (pastMessages.length - i) * 60000,
        id: `restored-${i}-${Date.now()}`,
        spoken: true, // Mark as already spoken so TTS doesn't blast past messages
      }))
      setMessages(formatted)
      return formatted
    }
  }, [])

  const sendHistoryToServer = useCallback((pastMessages) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && Array.isArray(pastMessages)) {
      wsRef.current.send(JSON.stringify({
        type: 'restore_history',
        history: pastMessages.map(m => ({ role: m.role, text: m.text }))
      }))
    }
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setFeedbackCards([])
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close()
    }
  }, [])

  return {
    connect,
    disconnect,
    sendMessage,
    sendAudioData,
    restoreHistory,
    sendHistoryToServer,
    isConnected,
    isFallbackMode,
    connectionStatus,
    engineName,
    messages,
    feedbackCards,
    clearMessages,
    wsRef,
  }
}

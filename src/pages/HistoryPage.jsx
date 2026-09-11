import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, History, Sparkles, Play, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function HistoryPage() {
  const navigate = useNavigate()
  const { user, authFetch } = useAuth()
  const [sessions, setSessions] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    authFetch('/api/sessions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSessions(data)
        } else {
          setSessions([])
        }
      })
      .catch(() => setSessions([]))
      .finally(() => setIsLoading(false))
  }, [user?.id, authFetch])


  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleContinueSession = (session) => {
    navigate('/practice', {
      state: {
        resumeSession: session,
      },
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-7 pb-12 w-full">
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F4EFEA] border border-[#EAE5DE] text-xs font-semibold text-[#E06D53]">
            <History size={13} />
            <span>Speech Archives</span>
          </div>
          {user && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B0CDE6]/25 border border-[#B0CDE6]/40 text-xs font-semibold text-[#1C1A17]">
              <User size={12} className="text-[#1C1A17]" />
              <span>Learner: {user.name}</span>
            </div>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1A17] tracking-tight">
          Session History & Transcripts
        </h1>
        <p className="text-xs sm:text-sm text-[#6B645C]">
          Review past conversation dialogues, speaking pace, and transcripts — or resume any conversation directly in the Voice Studio.
        </p>
      </div>

      {sessions.length === 0 && !isLoading && (
        <div className="p-12 rounded-3xl border border-[#EAE5DE] bg-white text-center space-y-3 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4EFEA] mx-auto text-[#E06D53]">
            <History size={22} />
          </div>
          <h3 className="font-heading font-bold text-base text-[#1C1A17]">
            No speech sessions recorded yet
          </h3>
          <p className="text-xs text-[#6B645C] max-w-sm mx-auto">
            Welcome, {user?.name}! Your speech sessions and transcripts will appear here as you practice in the Voice Studio.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/practice')}
              className="btn-terracotta inline-flex items-center gap-2 text-xs font-semibold px-4 py-2"
            >
              <Play size={13} className="fill-white" />
              <span>Start Speaking in Studio</span>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3.5">

        {sessions.map((s) => {
          const isExpanded = expandedId === s.id
          return (
            <div
              key={s.id}
              className="relative overflow-hidden rounded-3xl border border-[#EAE5DE] bg-white shadow-xs transition-colors hover:border-[#E06D53]/40"
            >
              {/* Header Row */}
              <div className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-[#FBF9F5] transition-colors">
                <div
                  onClick={() => toggleExpand(s.id)}
                  className="space-y-1.5 cursor-pointer flex-1"
                >
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-semibold text-sm sm:text-base text-[#1C1A17]">{s.scenario}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E06D53]/10 text-[#E06D53] border border-[#E06D53]/20">
                      {s.cefr_level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-mono text-[#6B645C] flex-wrap">
                    <span>{s.started_at}</span>
                    <span>• {Math.floor(s.duration_seconds / 60)}m {s.duration_seconds % 60}s</span>
                    <span>• {s.words_spoken} words</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs font-semibold text-[#4A7C59] hidden sm:inline">
                    {s.accuracy_percent}% Accuracy
                  </span>

                  {/* Primary Continue Button */}
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleContinueSession(s)}
                    className="btn-terracotta flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full shadow-xs cursor-pointer"
                    title="Resume this conversation in Practice Studio"
                  >
                    <Play size={11} className="fill-current" />
                    <span>Continue</span>
                  </motion.button>

                  <button
                    onClick={() => toggleExpand(s.id)}
                    className="p-1.5 rounded-full bg-[#F4EFEA] text-[#6B645C] hover:text-[#1C1A17] cursor-pointer"
                    title={isExpanded ? 'Collapse transcript' : 'View transcript'}
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Expanded Transcript Box */}
              <AnimatePresence>
                {isExpanded && s.transcript && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-6 bg-[#FBF9F5] border-t border-[#EAE5DE] space-y-3 text-xs sm:text-sm"
                  >
                    <div className="text-[10px] font-mono font-bold text-[#6B645C] uppercase tracking-widest mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles size={11} className="text-[#E06D53]" />
                        <span>Full Dialogue Transcript</span>
                      </div>
                      <button
                        onClick={() => handleContinueSession(s)}
                        className="text-[#E06D53] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Play size={10} className="fill-current" />
                        <span>Resume conversation →</span>
                      </button>
                    </div>
                    {s.transcript.map((msg, i) => (
                      <div key={i} className="flex gap-3 leading-relaxed">
                        <span className={`font-mono text-xs font-bold shrink-0 mt-0.5 ${
                          msg.role === 'user' ? 'text-[#E06D53]' : 'text-indigo-700'
                        }`}>
                          {msg.role === 'user' ? 'YOU:' : 'AI:'}
                        </span>
                        <span className="text-[#1C1A17]">{msg.text}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

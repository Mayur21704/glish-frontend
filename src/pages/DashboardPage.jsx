import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Award, Flame, MessageCircle, CheckCircle, ArrowRight, Sparkles, Briefcase, Terminal, TrendingUp, GraduationCap, Server, Coffee } from 'lucide-react'
import TiltCard from '@/components/ui/TiltCard'

const PRACTICE_TRACKS = [
  {
    id: 'interview',
    title: 'Tech Job Interview',
    desc: 'System design questions, behavioral STAR method, and engineering leadership scenarios.',
    icon: Briefcase,
    color: 'text-[#E06D53]',
    bg: 'bg-[#E06D53]/10',
    badge: 'High Impact',
  },
  {
    id: 'devops',
    title: 'Full-Stack & DevOps',
    desc: 'Debate Docker, Kubernetes, CI/CD pipelines, Node.js, and cloud scalability tradeoffs.',
    icon: Terminal,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    badge: 'Architecture',
  },
  {
    id: 'business',
    title: 'Executive Sync & Meeting',
    desc: 'Practice presenting product roadmaps, negotiating tradeoffs, and strategic team updates.',
    icon: TrendingUp,
    color: 'text-[#D97706]',
    bg: 'bg-amber-50',
    badge: 'Leadership',
  },
  {
    id: 'ielts',
    title: 'IELTS Speaking (Band 8+)',
    desc: 'Structured examiner questions with focus on lexical variety, complex tenses, and coherence.',
    icon: GraduationCap,
    color: 'text-[#4A7C59]',
    bg: 'bg-emerald-50',
    badge: 'Exam Prep',
  },
  {
    id: 'systemdesign',
    title: 'System Design & Scalability',
    desc: 'Debate distributed caching, Redis vs Memcached, database sharding, and Kafka queues.',
    icon: Server,
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    badge: 'High Scale',
  },
  {
    id: 'free',
    title: 'Casual Daily Banter',
    desc: 'Open-ended natural conversation about hobbies, books, philosophy, and cultural trends.',
    icon: Coffee,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    badge: 'Confidence',
  },
]

import { useAuth } from '@/contexts/AuthContext'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 350, damping: 28 },
  },
}

export default function DashboardPage() {
  const { user, authFetch } = useAuth()
  const [dbStats, setDbStats] = useState(null)
  const [dbCorrections, setDbCorrections] = useState([])

  useEffect(() => {
    authFetch('/api/stats')
      .then(res => res.json())
      .then(data => setDbStats(data))
      .catch(() => {})

    authFetch('/api/vocab')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDbCorrections(data.slice(0, 3).map(item => ({
            original: item.original,
            corrected: item.corrected,
            tip: item.explanation,
            type: item.type === 'grammar' ? 'Grammar' : item.type === 'vocab' ? 'Vocab' : 'Pronunciation',
            badgeColor: item.type === 'grammar' ? 'text-indigo-700 bg-indigo-50 border-indigo-200'
              : item.type === 'vocab' ? 'text-[#E06D53] bg-[#E06D53]/10 border-[#E06D53]/20'
              : 'text-[#D97706] bg-amber-50 border-amber-200',
          })))
        } else {
          setDbCorrections([])
        }
      })
      .catch(() => {})
  }, [user?.id, authFetch])

  const stats = [
    {
      label: 'Daily Streak',
      value: `${dbStats?.streakDays || 0} Days`,
      sub: user ? 'Active speaking streak' : 'Sign in to track streak',
      icon: Flame,
      color: 'text-[#D97706]',
      bg: 'bg-amber-50'
    },
    {
      label: 'CEFR Fluency',
      value: dbStats?.totalSessions > 0 ? (dbStats.totalWords > 1000 ? 'C1 Level' : 'B2 Level') : (user ? 'Calibrating' : 'Guest'),
      sub: user?.role || 'Fluency Assessment',
      icon: Award,
      color: 'text-[#E06D53]',
      bg: 'bg-[#E06D53]/10'
    },
    {
      label: 'Words Spoken',
      value: dbStats?.totalWords ? dbStats.totalWords.toLocaleString() : '0',
      sub: `${dbStats?.totalSessions || 0} sessions completed`,
      icon: MessageCircle,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      label: 'Grammar Accuracy',
      value: `${dbStats?.avgAccuracy || 90}%`,
      sub: 'Speech benchmark',
      icon: CheckCircle,
      color: 'text-[#4A7C59]',
      bg: 'bg-emerald-50'
    },
  ]

  const recentCorrections = dbCorrections.length > 0 ? dbCorrections : [
    {
      original: 'I go to office yesterday by train',
      corrected: 'I went to the office yesterday by train',
      tip: 'Use simple past "went" and definite article "the office".',
      type: 'Grammar',
      badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    },
    {
      original: 'Our microservice architecture is very good',
      corrected: 'Our microservice architecture is highly resilient and scalable',
      tip: 'Native engineering vocabulary upgrade.',
      type: 'Vocab',
      badgeColor: 'text-[#E06D53] bg-[#E06D53]/10 border-[#E06D53]/20',
    },
    {
      original: 'comfortable',
      corrected: 'KUMF-ter-buhl (3 syllables)',
      tip: 'Stress 1st syllable, omit the middle "or" sound.',
      type: 'Pronunciation',
      badgeColor: 'text-[#D97706] bg-amber-50 border-amber-200',
    },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-16"
    >
      {/* 1. Hero Studio Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl border border-[#EAE5DE] bg-gradient-to-br from-white via-white to-[#F4EFEA] p-7 sm:p-10 shadow-[0_4px_24px_rgba(28,26,23,0.04)]"
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F4EFEA] border border-[#EAE5DE] text-xs font-semibold text-[#E06D53]">
                <Sparkles size={13} className="fill-[#E06D53]" />
                <span>Real-Time Voice Studio</span>
              </div>
              {user && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B0CDE6]/25 border border-[#B0CDE6]/40 text-xs font-semibold text-[#1C1A17]">
                  <span>Welcome back, {user.name}</span>
                </div>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1C1A17] leading-tight">
              Speak English with <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#E06D53] to-[#D95D39] bg-clip-text text-transparent">
                effortless rhythm & clarity.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#6B645C] leading-relaxed max-w-xl">
              Practice spontaneous conversations and tech interviews. Get instant grammar feedback and native vocabulary upgrades powered by Gemini Live voice intelligence.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link to="/practice" className="btn-terracotta">
                <Play size={14} className="fill-white" />
                <span>Launch Voice Studio</span>
              </Link>

              <Link to="/reader" className="btn-sand">
                <span>Try Tech Book Reader</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Right Live Equalizer Preview Badge */}
          <div className="hidden lg:flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-[#EAE5DE] w-72 shrink-0 space-y-4 shadow-sm">
            <div className="flex items-center gap-1.5 h-8">
              <div className="w-[3px] bg-[#E06D53] rounded-full wave-bar-1" />
              <div className="w-[3px] bg-[#D95D39] rounded-full wave-bar-2" />
              <div className="w-[3px] bg-[#D97706] rounded-full wave-bar-3" />
              <div className="w-[3px] bg-[#E06D53] rounded-full wave-bar-4" />
              <div className="w-[3px] bg-[#D95D39] rounded-full wave-bar-5" />
            </div>

            <div className="text-center space-y-0.5">
              <div className="text-xs font-semibold text-[#1C1A17]">Gemini Live Voice Engine</div>
              <div className="text-[11px] text-[#6B645C]">24ms ultra-low latency audio</div>
            </div>

            <Link
              to="/practice"
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-center bg-[#F4EFEA] text-[#1C1A17] border border-[#EAE5DE] hover:bg-[#E06D53] hover:text-white transition-all duration-200 no-underline shadow-xs"
            >
              Start Practice Session
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 2. Fluency KPI Stat Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-3xl border border-[#EAE5DE] bg-white p-5 shadow-xs transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B645C] font-semibold">{s.label}</span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${s.bg}`}>
                  <Icon size={16} className={s.color} />
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="font-heading text-2xl font-bold text-[#1C1A17]">
                  {s.value}
                </div>
                <div className="text-[11px] text-[#6B645C] font-medium">{s.sub}</div>
              </div>
            </div>
          )
        })}
      </motion.div>

      {/* 3. Practice Tracks Section with 3D TiltCards */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#1C1A17]">Contextual Conversation Tracks</h2>
          <p className="text-xs sm:text-sm text-[#6B645C]">Choose a scenario to practice speaking with immediate AI coaching</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRACTICE_TRACKS.map((track) => {
            const Icon = track.icon
            return (
              <Link
                key={track.id}
                to="/practice"
                className="no-underline block h-full"
              >
                <TiltCard
                  intensity={6}
                  spotlightColor="rgba(224, 109, 83, 0.08)"
                  className="h-full flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${track.bg}`}>
                        <Icon size={18} className={track.color} />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#F4EFEA] text-[#6B645C] border border-[#EAE5DE]">
                        {track.badge}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-sm font-semibold text-[#1C1A17] group-hover:text-[#E06D53] transition-colors">
                        {track.title}
                      </h3>
                      <p className="text-xs text-[#6B645C] leading-relaxed">
                        {track.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold text-[#E06D53] group-hover:translate-x-1 transition-transform">
                    <span>Enter Track</span>
                    <ArrowRight size={13} />
                  </div>
                </TiltCard>
              </Link>
            )
          })}
        </div>
      </motion.div>

      {/* 4. Recent Live Corrections */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl border border-[#EAE5DE] bg-white p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between border-b border-[#EAE5DE] pb-3.5">
          <div>
            <h2 className="text-base font-bold text-[#1C1A17]">Recent Live Corrections</h2>
            <p className="text-xs text-[#6B645C]">Targeted grammar and pronunciation diffs from previous sessions</p>
          </div>
          <Link to="/vocab" className="text-xs font-semibold text-[#E06D53] hover:underline flex items-center gap-1.5 no-underline">
            <span>Open Lexicon</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {recentCorrections.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#F4EFEA] border border-[#EAE5DE] space-y-2 hover:border-[#E06D53]/40 transition-colors"
            >
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border font-semibold ${item.badgeColor}`}>
                {item.type}
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="text-rose-600 line-through">"{item.original}"</div>
                <div className="font-semibold text-[#1C1A17]">"{item.corrected}"</div>
                <p className="text-[11px] text-[#6B645C] pt-1.5 border-t border-[#EAE5DE]/80">
                  💡 {item.tip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

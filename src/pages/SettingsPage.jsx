import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sliders, Volume2, ShieldCheck, Gauge, User, Users, LogOut, Mail, Sparkles } from 'lucide-react'
import { VOICES, SPEEDS, NOISE_FILTERS } from '@/lib/constants'
import { useAuth } from '@/contexts/AuthContext'

export default function SettingsPage() {
  const { user, openAuthModal, logout } = useAuth()
  const [voice, setVoice] = useState('Aoede')
  const [speed, setSpeed] = useState('1.0')
  const [noiseFilter, setNoiseFilter] = useState('22')

  return (
    <div className="max-w-3xl mx-auto space-y-7 pb-12 w-full">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F4EFEA] border border-[#EAE5DE] text-xs font-semibold text-[#E06D53]">
          <Sliders size={13} />
          <span>Acoustic Preferences & Identity</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1A17] tracking-tight">
          Settings & Tutor Calibration
        </h1>
        <p className="text-xs sm:text-sm text-[#6B645C]">
          Manage your active learner identity, voice models, speaking pace, and room noise suppression thresholds.
        </p>
      </div>

      {/* 1. Account & Learner Profile Card */}
      {user ? (
        <div className="relative overflow-hidden rounded-3xl border border-[#EAE5DE] bg-white p-6 sm:p-7 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1C1A17] uppercase tracking-wider">
              <User size={14} className="text-[#E06D53]" />
              <span>Active Learner Account</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E06D53]/10 text-[#E06D53] border border-[#E06D53]/20">
              Verified
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FBF9F5] border border-[#EAE5DE]">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1C1A17] to-[#36322C] text-white font-heading font-bold text-sm shadow-sm">
                {user.avatar || user.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-[#1C1A17]">{user.name}</h3>
                <p className="text-xs text-[#6B645C]">{user.role}</p>
                <p className="text-[11px] font-mono text-[#8C827A] flex items-center gap-1.5 mt-0.5">
                  <Mail size={11} />
                  <span>{user.email}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl border border-[#EAE5DE] bg-white p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-sm text-[#1C1A17]">Not Signed In</h3>
            <p className="text-xs text-[#6B645C]">
              Sign in or create an account to save your speech sessions, transcripts, and personal vocabulary vault.
            </p>
          </div>
          <button
            onClick={openAuthModal}
            className="btn-terracotta text-xs px-4 py-2 shrink-0 inline-flex items-center gap-2"
          >
            <User size={13} />
            <span>Sign In / Register</span>
          </button>
        </div>
      )}

      {/* 2. Voice Selection */}
      <div className="relative overflow-hidden rounded-3xl border border-[#EAE5DE] bg-white p-6 sm:p-7 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1C1A17] uppercase tracking-wider">
          <Volume2 size={14} className="text-[#E06D53]" />
          <span>Tutor Persona & Vocal Resonance</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {VOICES.map((v) => {
            const isSelected = voice === v.key
            return (
              <motion.button
                key={v.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setVoice(v.key)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#E06D53] bg-[#F4EFEA] text-[#1C1A17] shadow-xs'
                    : 'border-[#EAE5DE] bg-[#FBF9F5] hover:bg-[#F4EFEA] text-[#6B645C]'
                }`}
              >
                <div className="text-2xl mb-1.5">{v.icon}</div>
                <div className="text-xs font-semibold text-[#1C1A17]">{v.label}</div>
                <div className="text-[10px] text-[#6B645C] mt-0.5">{v.desc}</div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* 3. Speech Speed */}
      <div className="relative overflow-hidden rounded-3xl border border-[#EAE5DE] bg-white p-6 sm:p-7 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1C1A17] uppercase tracking-wider">
          <Gauge size={14} className="text-[#D97706]" />
          <span>Cadence & Speaking Rate</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {SPEEDS.map((s) => {
            const isSelected = speed === s.key
            return (
              <motion.button
                key={s.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSpeed(s.key)}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#E06D53] bg-[#F4EFEA] text-[#1C1A17] shadow-xs font-semibold'
                    : 'border-[#EAE5DE] bg-[#FBF9F5] hover:bg-[#F4EFEA] text-[#6B645C]'
                }`}
              >
                <div className="text-xs font-semibold text-[#1C1A17]">{s.label}</div>
                <div className="text-[10px] text-[#6B645C] mt-0.5">{s.desc}</div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* 4. Noise Filter Threshold */}
      <div className="relative overflow-hidden rounded-3xl border border-[#EAE5DE] bg-white p-6 sm:p-7 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1C1A17] uppercase tracking-wider">
          <ShieldCheck size={14} className="text-[#4A7C59]" />
          <span>Acoustic Fan & Room Gate Filter</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {NOISE_FILTERS.map((n) => {
            const isSelected = noiseFilter === n.key
            return (
              <motion.button
                key={n.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setNoiseFilter(n.key)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#E06D53] bg-[#F4EFEA] text-[#1C1A17] shadow-xs'
                    : 'border-[#EAE5DE] bg-[#FBF9F5] hover:bg-[#F4EFEA] text-[#6B645C]'
                }`}
              >
                <div className="text-2xl mb-1.5">{n.icon}</div>
                <div className="text-xs font-semibold text-[#1C1A17]">{n.label}</div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

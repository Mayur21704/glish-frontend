import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Lock, Mail, Sparkles, ArrowRight, Briefcase } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    login,
    register,
  } = useAuth()

  const [activeTab, setActiveTab] = useState('signin') // 'signin' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('Senior Software Engineer')
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isAuthModalOpen) return null

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await login(email, password)
      closeAuthModal()
      setEmail('')
      setPassword('')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await register(name, email, password, role)
      closeAuthModal()
      setName('')
      setEmail('')
      setPassword('')
    } catch (err) {
      setError(err.message || 'Failed to create account')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-[#1C1A17]/60 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#EAE5DE] bg-[#FFFFFF] p-6 sm:p-8 shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-[#EAE5DE]">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#E06D53] to-[#D95D39] text-white shadow-sm shadow-[#E06D53]/30">
                <Sparkles size={18} className="fill-white" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-[#1C1A17] tracking-tight">
                  {activeTab === 'signin' ? 'Sign In to glish' : 'Create Your Account'}
                </h2>
                <p className="text-xs text-[#6B645C]">
                  {activeTab === 'signin'
                    ? 'Access your saved speech history and vocabulary'
                    : 'Personalize your English speech tutor and speech vault'}
                </p>
              </div>
            </div>
            <button
              onClick={closeAuthModal}
              className="rounded-full p-1.5 text-[#6B645C] hover:bg-[#F4EFEA] hover:text-[#1C1A17] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 mt-5 rounded-2xl bg-[#F4EFEA] border border-[#EAE5DE]">
            <button
              onClick={() => { setActiveTab('signin'); setError(null) }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'signin'
                  ? 'bg-white text-[#1C1A17] shadow-xs'
                  : 'text-[#6B645C] hover:text-[#1C1A17]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('register'); setError(null) }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white text-[#1C1A17] shadow-xs'
                  : 'text-[#6B645C] hover:text-[#1C1A17]'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2"
            >
              <span>{error}</span>
            </motion.div>
          )}

          {/* SIGN IN FORM */}
          {activeTab === 'signin' && (
            <form onSubmit={handleLogin} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C1A17] flex items-center gap-1.5">
                  <Mail size={13} className="text-[#6B645C]" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EAE5DE] bg-[#FBF9F5] text-xs text-[#1C1A17] focus:outline-none focus:border-[#E06D53] focus:bg-white transition-all font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C1A17] flex items-center gap-1.5">
                  <Lock size={13} className="text-[#6B645C]" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EAE5DE] bg-[#FBF9F5] text-xs text-[#1C1A17] focus:outline-none focus:border-[#E06D53] focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#E06D53] to-[#D95D39] text-white font-semibold text-xs shadow-md shadow-[#E06D53]/25 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
                <ArrowRight size={14} />
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setError(null) }}
                  className="text-xs text-[#6B645C] hover:text-[#1C1A17] transition-colors cursor-pointer"
                >
                  Don't have an account yet? <span className="font-semibold text-[#E06D53] underline">Create one</span>
                </button>
              </div>
            </form>
          )}

          {/* CREATE ACCOUNT FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="mt-5 space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C1A17] flex items-center gap-1.5">
                  <User size={13} className="text-[#6B645C]" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EAE5DE] bg-[#FBF9F5] text-xs text-[#1C1A17] focus:outline-none focus:border-[#E06D53] focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C1A17] flex items-center gap-1.5">
                  <Briefcase size={13} className="text-[#6B645C]" />
                  <span>Role / Practice Goal</span>
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Lead Engineer, Product Manager, Interview Prep"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EAE5DE] bg-[#FBF9F5] text-xs text-[#1C1A17] focus:outline-none focus:border-[#E06D53] focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C1A17] flex items-center gap-1.5">
                  <Mail size={13} className="text-[#6B645C]" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EAE5DE] bg-[#FBF9F5] text-xs text-[#1C1A17] focus:outline-none focus:border-[#E06D53] focus:bg-white transition-all font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C1A17] flex items-center gap-1.5">
                  <Lock size={13} className="text-[#6B645C]" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EAE5DE] bg-[#FBF9F5] text-xs text-[#1C1A17] focus:outline-none focus:border-[#E06D53] focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#E06D53] to-[#D95D39] text-white font-semibold text-xs shadow-md shadow-[#E06D53]/25 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
                <ArrowRight size={14} />
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { setActiveTab('signin'); setError(null) }}
                  className="text-xs text-[#6B645C] hover:text-[#1C1A17] transition-colors cursor-pointer"
                >
                  Already have an account? <span className="font-semibold text-[#E06D53] underline">Sign in</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

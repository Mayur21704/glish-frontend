import { useState, useRef, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Flame, Sparkles, User, ChevronDown, LogOut, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

const NAV_ITEMS = [
  { to: '/practice', label: 'Studio', badge: 'Live' },
  { to: '/reader', label: 'Reader', badge: 'New' },
  { to: '/', label: 'Overview' },
  { to: '/history', label: 'History' },
  { to: '/vocab', label: 'Lexicon' },
  { to: '/settings', label: 'Settings' },
]

export default function TopBar({ connectionStatus = 'connected' }) {
  const location = useLocation()
  const { user, isAuthenticated, logout, openAuthModal } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const statusConfig = {
    offline: { dot: 'bg-rose-500', pingColor: 'border-rose-500/40', text: 'Offline', ping: '200ms+' },
    connecting: { dot: 'bg-amber-500', pingColor: 'border-amber-500/40', text: 'Connecting', ping: '...' },
    connected: { dot: 'bg-[#4A7C59]', pingColor: 'border-[#4A7C59]/40', text: 'Gemini Live', ping: '24ms' },
    fallback: { dot: 'bg-amber-500', pingColor: 'border-amber-500/40', text: 'Standard TTS', ping: '45ms' },
  }

  const status = statusConfig[connectionStatus] || statusConfig.connected

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EAE5DE] bg-[#FBF9F5]/90 backdrop-blur-xl transition-all duration-200">
      <div className="app-container h-16 flex items-center justify-between gap-4">
        {/* Brand Emblem */}
        <NavLink to="/" className="flex items-center gap-3 shrink-0 group no-underline">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#E06D53] to-[#D95D39] text-white shadow-sm shadow-[#E06D53]/30 transition-transform duration-200 group-hover:scale-105">
            <Sparkles size={16} className="fill-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading text-base font-bold tracking-tight text-[#1C1A17] group-hover:text-[#E06D53] transition-colors">
                glish
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F4EFEA] text-[#E06D53] border border-[#EAE5DE] font-semibold">
                v2.0
              </span>
            </div>
          </div>
        </NavLink>

        {/* Center Warm Linen Nav Dock with Framer Motion layoutId */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-[#F4EFEA] border border-[#EAE5DE]">
          {NAV_ITEMS.map(({ to, label, badge }) => {
            const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  'relative px-4 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 no-underline flex items-center gap-1.5',
                  isActive ? 'text-[#1C1A17] font-semibold' : 'text-[#6B645C] hover:text-[#1C1A17]'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 rounded-full bg-white shadow-[0_2px_8px_rgba(28,26,23,0.08)] border border-[#EAE5DE]"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
                {badge && (
                  <span
                    className={cn(
                      'relative z-10 text-[9px] font-bold px-1.5 py-0.5 rounded-full',
                      isActive
                        ? 'bg-[#E06D53] text-white'
                        : 'bg-[#E06D53]/15 text-[#E06D53] border border-[#E06D53]/20'
                    )}
                  >
                    {badge}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Right Status Badges & User Profile Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Daily Streak (when authenticated) */}
          {isAuthenticated && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4EFEA] border border-[#EAE5DE] text-xs font-medium text-[#1C1A17]">
              <Flame size={14} className="text-[#D97706] fill-[#D97706]" />
              <span className="font-mono text-[11px] font-semibold text-[#1C1A17]">Active</span>
            </div>
          )}

          {/* Engine Status Capsule */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4EFEA] border border-[#EAE5DE] text-[11px] font-mono">
            <span className={cn('h-2 w-2 rounded-full', status.dot)} />
            <span className="text-[#1C1A17] font-medium hidden sm:inline">{status.text}</span>
          </div>

          {/* Studio Quick Launch Button */}
          {location.pathname !== '/practice' && (
            <NavLink
              to="/practice"
              className="hidden sm:inline-flex items-center gap-1.5 btn-terracotta py-1.5 px-3.5 text-xs font-semibold shadow-xs"
            >
              <Mic size={13} />
              <span>Studio</span>
            </NavLink>
          )}

          {/* User Profile Or Sign In Buttons */}
          <div className="relative" ref={dropdownRef}>
            {isAuthenticated && user ? (
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full bg-[#F4EFEA] border border-[#EAE5DE] hover:border-[#E06D53]/40 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#1C1A17] to-[#36322C] text-white font-heading font-bold text-[11px]">
                  {user.avatar || user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-[#1C1A17] leading-tight">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] font-mono text-[#6B645C] leading-none truncate max-w-[90px]">
                    {user.role || 'Learner'}
                  </span>
                </div>
                <ChevronDown size={12} className="text-[#6B645C] hidden sm:inline" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={openAuthModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4EFEA] border border-[#EAE5DE] text-xs font-semibold text-[#1C1A17] hover:bg-white hover:border-[#E06D53] transition-all cursor-pointer"
                >
                  <User size={13} />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={openAuthModal}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#E06D53] to-[#D95D39] text-xs font-semibold text-white hover:brightness-105 shadow-xs transition-all cursor-pointer"
                >
                  <UserPlus size={13} />
                  <span>Create Account</span>
                </button>
              </div>
            )}

            {/* Dropdown Menu for Authenticated User */}
            <AnimatePresence>
              {isDropdownOpen && user && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute right-0 mt-2 w-64 rounded-3xl border border-[#EAE5DE] bg-white p-3 shadow-xl z-50"
                >
                  {/* User Info Capsule */}
                  <div className="p-3 rounded-2xl bg-[#FBF9F5] border border-[#EAE5DE] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-[#1C1A17]">{user.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#E06D53]/10 text-[#E06D53] border border-[#E06D53]/20">
                        Active Account
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B645C] line-clamp-1">{user.role}</p>
                    <p className="text-[10px] font-mono text-[#8C827A] truncate">{user.email}</p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 space-y-1">
                    <NavLink
                      to="/settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#1C1A17] hover:bg-[#F4EFEA] transition-colors cursor-pointer text-left no-underline"
                    >
                      <User size={14} className="text-[#E06D53]" />
                      <span>Account & Preferences</span>
                    </NavLink>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false)
                        logout()
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-3 left-4 right-4 z-40 flex items-center justify-around p-1.5 rounded-2xl bg-[#FFFFFF]/95 border border-[#EAE5DE] backdrop-blur-2xl shadow-xl">
        {NAV_ITEMS.map(({ to, label }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                'relative flex-1 py-2 text-center text-xs font-medium rounded-xl transition-colors no-underline',
                isActive ? 'text-[#1C1A17] font-semibold' : 'text-[#6B645C]'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  className="absolute inset-0 rounded-xl bg-[#F4EFEA] border border-[#EAE5DE]"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10 text-[11px]">{label}</span>
            </NavLink>
          )
        })}
      </div>
    </header>
  )
}

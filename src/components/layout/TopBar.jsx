import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mic, Flame, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

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

  const statusConfig = {
    offline: { dot: 'bg-rose-500', pingColor: 'border-rose-500/40', text: 'Offline', ping: '200ms+' },
    connecting: { dot: 'bg-amber-500', pingColor: 'border-amber-500/40', text: 'Connecting', ping: '...' },
    connected: { dot: 'bg-[#4A7C59]', pingColor: 'border-[#4A7C59]/40', text: 'Gemini Live', ping: '24ms' },
    fallback: { dot: 'bg-amber-500', pingColor: 'border-amber-500/40', text: 'Standard TTS', ping: '45ms' },
  }

  const status = statusConfig[connectionStatus] || statusConfig.connected

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#EAE5DE] bg-[#FBF9F5]/90 backdrop-blur-xl transition-all duration-200">
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

        {/* Right Status Badges & Quick Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Daily Streak */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4EFEA] border border-[#EAE5DE] text-xs font-medium text-[#1C1A17]">
            <Flame size={14} className="text-[#D97706] fill-[#D97706]" />
            <span className="font-mono text-[11px] font-semibold text-[#1C1A17]">3d streak</span>
          </div>

          {/* Engine Status Capsule */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4EFEA] border border-[#EAE5DE] text-[11px] font-mono">
            <span className={cn('h-2 w-2 rounded-full', status.dot)} />
            <span className="text-[#1C1A17] font-medium hidden sm:inline">{status.text}</span>
            <span className="text-[#6B645C] hidden lg:inline">({status.ping})</span>
          </div>

          {/* Studio Quick Launch Button */}
          {location.pathname !== '/practice' && (
            <NavLink
              to="/practice"
              className="btn-terracotta py-1.5 px-4 text-xs font-semibold shadow-sm"
            >
              <Mic size={13} />
              <span>Studio</span>
            </NavLink>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-3 left-4 right-4 z-50 flex items-center justify-around p-1.5 rounded-2xl bg-[#FFFFFF]/95 border border-[#EAE5DE] backdrop-blur-2xl shadow-xl">
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

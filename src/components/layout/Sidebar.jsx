import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Mic, Clock, BookOpen, Settings, Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/practice', icon: Mic, label: 'Practice', primary: true },
  { to: '/history', icon: Clock, label: 'History' },
  { to: '/vocab', icon: BookOpen, label: 'Vocabulary' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 flex flex-col h-screen sticky top-0 bg-[#161D27] border-r border-[#B0CDE6]/15 z-30 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-[#B0CDE6]/10">
        <div className="w-9 h-9 rounded-xl bg-[#FDF4D2] flex items-center justify-center shadow-md shadow-[#FDF4D2]/10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#11161F" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2V22M2 12H22M4.93 4.93L19.07 19.07M4.93 19.07L19.07 4.93" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-heading text-base font-bold tracking-tight text-[#FDF4D2]">
            zoro AI
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-[#B0CDE6]/70">
            Voice Tutor
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1.5 p-3.5 mt-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label, primary }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150',
                isActive
                  ? 'bg-[#FDF4D2]/15 text-[#FDF4D2] font-semibold border border-[#FDF4D2]/25 shadow-sm'
                  : 'text-[#B0CDE6]/70 hover:text-[#FDF4D2] hover:bg-[#B0CDE6]/10',
                primary && !isActive && 'text-[#B0CDE6] font-medium'
              )
            }
          >
            <Icon size={18} className="shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Streak Badge */}
      <div className="p-3.5 border-t border-[#B0CDE6]/10">
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#11161F] border border-[#B0CDE6]/15">
          <Flame size={18} className="text-[#FDF4D2] shrink-0 fill-[#FDF4D2]/20" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#FDF4D2]">3 Day Streak</span>
            <span className="text-[10px] text-[#B0CDE6]/60">Keep it going!</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

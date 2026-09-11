import { motion } from 'framer-motion'
import { MessageSquare, Terminal, Briefcase, TrendingUp, Server, Coffee } from 'lucide-react'
import { cn } from '@/lib/utils'

const PERSONAS = [
  { key: 'systemdesign', label: 'System Design', icon: Server, sub: 'Scale, Caching, Queues' },
  { key: 'devops', label: 'DevOps & Cloud', icon: Terminal, sub: 'Docker, K8s, CI/CD' },
  { key: 'interview', label: 'Job Interview', icon: Briefcase, sub: 'STAR & behavioral' },
  { key: 'business', label: 'Executive Sync', icon: TrendingUp, sub: 'Meetings & strategy' },
  { key: 'free', label: 'Free Banter', icon: MessageSquare, sub: 'Daily conversations' },
  { key: 'cafe', label: 'Social & Café', icon: Coffee, sub: 'Small talk & coffee' },
]

export default function ScenarioSelector({ selectedScenario, onSelect, disabled }) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B645C] font-medium">
          Conversation Persona
        </span>
        <span className="text-[11px] font-mono text-[#E06D53] font-medium">
          {PERSONAS.find((p) => p.key === selectedScenario)?.label || 'Selected'}
        </span>
      </div>

      {/* Warm Segmented Switcher Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
        {PERSONAS.map((p) => {
          const isSelected = selectedScenario === p.key
          const Icon = p.icon

          return (
            <motion.button
              key={p.key}
              whileHover={{ scale: disabled ? 1 : 1.015 }}
              whileTap={{ scale: disabled ? 1 : 0.985 }}
              disabled={disabled}
              onClick={() => onSelect(p.key)}
              className={cn(
                'relative flex flex-col items-start p-3 rounded-2xl text-left transition-all duration-150 cursor-pointer border',
                isSelected
                  ? 'bg-[#F4EFEA] border-[#E06D53] shadow-sm'
                  : 'bg-white border-[#EAE5DE] hover:border-[#DFD8CE] hover:bg-[#FBF9F5] shadow-xs',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#E06D53]" />
              )}
              <div
                className={cn(
                  'p-2 rounded-xl mb-1.5 transition-colors',
                  isSelected
                    ? 'bg-[#E06D53] text-white shadow-xs'
                    : 'bg-[#F4EFEA] text-[#6B645C]'
                )}
              >
                <Icon size={14} />
              </div>
              <div className="text-xs font-semibold text-[#1C1A17] leading-tight truncate w-full">
                {p.label}
              </div>
              <div className="text-[10px] text-[#6B645C] line-clamp-1 mt-0.5 leading-tight font-sans">
                {p.sub}
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

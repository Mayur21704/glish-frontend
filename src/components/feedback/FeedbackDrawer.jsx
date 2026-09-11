import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import GrammarCard from './GrammarCard'
import VocabCard from './VocabCard'
import PronunciationCard from './PronunciationCard'
import { cn } from '@/lib/utils'

export default function FeedbackDrawer({ cards = [], onListen, onSave }) {
  const [activeTab, setActiveTab] = useState('all')

  const filteredCards = cards.filter((c) => {
    if (activeTab === 'all') return true
    return c.type === activeTab
  })

  const countByType = {
    grammar: cards.filter(c => c.type === 'grammar').length,
    vocab: cards.filter(c => c.type === 'vocab').length,
    pronunciation: cards.filter(c => c.type === 'pronunciation').length,
  }

  return (
    <div className="w-full shrink-0 h-full flex flex-col bg-[#FBF9F5]">
      {/* Header with counts */}
      <div className="p-4 border-b border-[#EAE5DE]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1C1A17] tracking-wide">
              Live Coaching Points
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#F4EFEA] text-[#E06D53] border border-[#EAE5DE] font-semibold">
              {cards.length}
            </span>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 bg-[#F4EFEA] p-1 rounded-xl border border-[#EAE5DE]">
          {[
            { key: 'all', label: 'All', count: cards.length },
            { key: 'grammar', label: 'Grammar', count: countByType.grammar },
            { key: 'vocab', label: 'Vocab', count: countByType.vocab },
            { key: 'pronunciation', label: 'Pron', count: countByType.pronunciation },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex-1 py-1 rounded-lg text-[11px] font-medium transition-all duration-150 cursor-pointer flex items-center justify-center gap-1',
                activeTab === tab.key
                  ? 'bg-white text-[#1C1A17] font-semibold shadow-xs border border-[#EAE5DE]'
                  : 'text-[#6B645C] hover:text-[#1C1A17]'
              )}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={cn(
                  'text-[9px] font-mono px-1 rounded-full',
                  activeTab === tab.key ? 'bg-[#E06D53]/10 text-[#E06D53]' : 'bg-[#EAE4DC] text-[#6B645C]'
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Cards List with AnimatePresence */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {filteredCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-[#6B645C] space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#F4EFEA] border border-[#EAE5DE] flex items-center justify-center text-sm text-[#E06D53]">
              ✨
            </div>
            <p className="text-xs text-[#6B645C] max-w-[200px] leading-relaxed">
              No suggestions yet. Speak naturally and real-time corrections will appear here.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredCards.map((card) => {
              if (card.type === 'grammar') {
                return <GrammarCard key={card.id} data={card.data} onListen={onListen} onSave={onSave} />
              }
              if (card.type === 'vocab') {
                return <VocabCard key={card.id} data={card.data} onListen={onListen} onSave={onSave} />
              }
              if (card.type === 'pronunciation') {
                return <PronunciationCard key={card.id} data={card.data} onListen={onListen} onSave={onSave} />
              }
              return null
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Trash2, Search, BookOpen } from 'lucide-react'

export default function VocabNotebookPage() {
  const [items, setItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetch('/api/vocab')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data)
        } else {
          setItems([
            { id: 1, type: 'grammar', original: 'I go to office yesterday', corrected: 'I went to the office yesterday', explanation: 'Use past tense "went" and definite article "the office".', mastered: false },
            { id: 2, type: 'vocab', original: 'very good', corrected: 'exceptional / outstanding / resilient', explanation: 'Sounds more formal and high-impact in engineering discussions.', mastered: true },
            { id: 3, type: 'pronunciation', original: 'comfortable', corrected: 'KUMF-ter-buhl (3 syllables)', explanation: 'Stress the 1st syllable, omit the middle "or" sound.', mastered: false },
          ])
        }
      })
      .catch(() => {})
  }, [])

  const toggleMastered = async (id) => {
    setItems(items.map(item => item.id === id ? { ...item, mastered: !item.mastered } : item))
    try {
      await fetch(`/api/vocab/${id}/toggle`, { method: 'PATCH' })
    } catch (e) {
      console.warn('Failed to toggle mastered on server:', e)
    }
  }

  const deleteItem = async (id) => {
    setItems(items.filter(item => item.id !== id))
    try {
      await fetch(`/api/vocab/${id}`, { method: 'DELETE' })
    } catch (e) {
      console.warn('Failed to delete vocab on server:', e)
    }
  }

  const filteredItems = items.filter(item =>
    item.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.corrected.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto space-y-7 pb-12 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F4EFEA] border border-[#EAE5DE] text-xs font-semibold text-[#E06D53]">
            <BookOpen size={13} />
            <span>Personal Lexicon</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1A17] tracking-tight">
            Vocabulary & Grammar Vault
          </h1>
          <p className="text-xs sm:text-sm text-[#6B645C]">
            Saved corrections, phonetic guidance, and upgraded idioms from your voice conversations.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B645C]" />
          <input
            type="text"
            placeholder="Search saved cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-white border border-[#EAE5DE] text-xs text-[#1C1A17] placeholder-[#6B645C]/60 focus:border-[#E06D53] focus:outline-none shadow-xs font-sans"
          />
        </div>
      </div>

      {/* Grid of Saved Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative overflow-hidden rounded-3xl border border-[#EAE5DE] bg-white p-5 sm:p-6 space-y-3 shadow-xs group hover:border-[#E06D53]/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full ${
                  item.type === 'grammar' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                  item.type === 'vocab' ? 'bg-amber-50 text-[#D97706] border border-amber-200' :
                  'bg-[#E06D53]/10 text-[#E06D53] border border-[#E06D53]/20'
                }`}>
                  {item.type}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleMastered(item.id)}
                    className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                      item.mastered
                        ? 'bg-[#4A7C59]/10 text-[#4A7C59] border-[#4A7C59]/30 font-semibold'
                        : 'text-[#6B645C] border-[#EAE5DE] hover:text-[#1C1A17] hover:bg-[#F4EFEA]'
                    }`}
                  >
                    <Check size={12} />
                    <span>{item.mastered ? 'Mastered' : 'Mark Mastered'}</span>
                  </button>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#6B645C] hover:text-rose-600 transition-all p-1.5 bg-transparent border-none cursor-pointer"
                    title="Delete card"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-xs sm:text-sm">
                <div className="text-rose-600 line-through">
                  "{item.original}"
                </div>
                <div className="font-semibold text-[#1C1A17]">
                  "{item.corrected}"
                </div>
                {item.explanation && (
                  <p className="text-[11px] text-[#6B645C] leading-relaxed pt-2 border-t border-[#EAE5DE]/80">
                    💡 {item.explanation}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

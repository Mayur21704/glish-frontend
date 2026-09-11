import { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, Bookmark, Check } from 'lucide-react'

export default function VocabCard({ data, onListen, onSave }) {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onSave?.({
      type: 'vocab',
      original: data.original_phrase,
      corrected: data.upgraded_phrase,
      explanation: data.explanation,
    })
    setSaved(true)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="p-4 rounded-2xl bg-white border border-[#EAE5DE] space-y-2.5 relative shadow-xs"
    >
      <div className="flex items-center justify-between text-[10px] font-mono font-semibold uppercase tracking-wider">
        <span className="text-[#D97706] flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" />
          Vocabulary Upgrade
        </span>
        <span className="text-[#6B645C]">Native</span>
      </div>

      <div className="space-y-1.5 text-xs">
        {/* Original Phrase */}
        <div className="text-[#6B645C] bg-[#F4EFEA] px-2.5 py-1.5 rounded-lg border border-[#EAE5DE]">
          <span className="text-[10px] font-mono text-[#6B645C]/70 mr-1.5">Original:</span>
          {data.original_phrase}
        </div>

        {/* Upgraded Phrase */}
        <div className="text-[#1C1A17] font-semibold bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
          <span className="text-[10px] font-mono text-[#D97706] mr-1.5 font-bold">Native:</span>
          {data.upgraded_phrase}
        </div>

        {/* Explanation */}
        {data.explanation && (
          <p className="text-[11px] text-[#6B645C] leading-relaxed pt-1">
            {data.explanation}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAE5DE]/60">
        <button
          onClick={() => onListen?.(data.upgraded_phrase)}
          className="flex items-center gap-1 text-[11px] font-medium text-[#6B645C] hover:text-[#1C1A17] px-2.5 py-1 rounded-lg bg-[#F4EFEA] border border-[#EAE5DE] transition-colors cursor-pointer"
        >
          <Volume2 size={12} className="text-[#E06D53]" />
          <span>Listen</span>
        </button>

        <button
          onClick={handleSave}
          disabled={saved}
          className="flex items-center gap-1 text-[11px] font-medium text-[#6B645C] hover:text-[#1C1A17] px-2.5 py-1 rounded-lg bg-[#F4EFEA] border border-[#EAE5DE] transition-colors cursor-pointer disabled:opacity-60"
        >
          {saved ? <Check size={12} className="text-[#4A7C59]" /> : <Bookmark size={12} />}
          <span>{saved ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </motion.div>
  )
}

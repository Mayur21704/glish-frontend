import { CornerDownLeft, Sparkles } from 'lucide-react'

export default function LiveDraftBubble({ text, onSendNow }) {
  if (!text) return null

  return (
    <div className="flex items-end gap-2 max-w-[85%] ml-auto flex-row-reverse my-3">
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono font-bold border border-[#E06D53]/30 bg-[#E06D53]/15 text-[#E06D53] shadow-xs animate-pulse">
        LIVE
      </div>

      <div className="flex flex-col items-end gap-1.5">
        <div className="px-5 py-3 rounded-2xl rounded-tr-xs text-sm sm:text-base bg-[#F4EFEA] border border-dashed border-[#E06D53]/40 text-[#1C1A17] italic shadow-xs">
          <span>{text}</span>
          <span className="inline-block w-1.5 h-3.5 ml-1.5 bg-[#E06D53] animate-pulse align-middle" />
        </div>

        {onSendNow && (
          <button
            onClick={onSendNow}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E06D53] text-white text-[11px] font-medium shadow-xs hover:bg-[#D95D39] transition-all cursor-pointer"
            title="Send now without waiting for pause timeout"
          >
            <span>Send Now</span>
            <CornerDownLeft size={12} />
          </button>
        )}
      </div>
    </div>
  )
}

export default function LiveDraftBubble({ text }) {
  if (!text) return null

  return (
    <div className="flex gap-3 max-w-[85%] ml-auto flex-row-reverse my-3 animate-pulse">
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono font-bold border border-[#E06D53]/30 bg-[#E06D53]/15 text-[#E06D53] mt-1 shadow-xs">
        LIVE
      </div>
      <div className="px-5 py-3 rounded-2xl rounded-tr-xs text-sm sm:text-base bg-[#F4EFEA] border border-dashed border-[#E06D53]/40 text-[#1C1A17] italic shadow-xs">
        <span>{text}</span>
        <span className="inline-block w-1.5 h-3.5 ml-1.5 bg-[#E06D53] animate-pulse align-middle" />
      </div>
    </div>
  )
}

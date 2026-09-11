import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'

export default function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1A17] selection:bg-[#E06D53]/20 selection:text-[#E06D53] relative overflow-x-hidden font-sans">
      {/* Soft Warm Ambient Lighting Nodes (Speak.com / Claude style) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        {/* Warm Apricot / Peach Glow */}
        <div className="absolute -top-[12%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-b from-[#E06D53]/06 via-[#F59E0B]/04 to-transparent blur-[100px]" />
        
        {/* Warm Sand Diffuse Floor */}
        <div className="absolute bottom-[2%] -right-[5%] w-[650px] h-[450px] rounded-full bg-gradient-to-tl from-[#F4EFEA] to-transparent blur-[120px] opacity-80" />
      </div>

      {/* Top Header Warm Linen Floating Capsule */}
      <TopBar />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 w-full app-container py-6 sm:py-8 pb-24 md:pb-10 flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}

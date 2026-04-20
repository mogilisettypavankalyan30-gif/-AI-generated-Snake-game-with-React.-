import SnakeGame from "./components/SnakeGame";
import MusicPlayer from "./components/MusicPlayer";
import { motion } from "motion/react";
import { Cpu, Wifi, Battery, Zap } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden relative selection:bg-neon-cyan selection:text-black">
      {/* Dynamic Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-magenta/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#111] opacity-20 border border-white/5 rounded-full" />
      </div>

      {/* Decorative Navbar/Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neon-cyan/10 rounded-lg border border-neon-cyan/20">
            <Zap className="w-5 h-5 text-neon-cyan fill-current" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tighter glow-cyan">CYBER CORE</h1>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">System v4.0.2</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-white/30">
          <div className="hidden md:flex items-center gap-4 text-[10px] uppercase tracking-widest font-mono">
            <div className="flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              <span>86% Load</span>
            </div>
            <div className="flex items-center gap-1">
              <Wifi className="w-3 h-3" />
              <span>Link Stabilized</span>
            </div>
            <div className="flex items-center gap-1">
              <Battery className="w-3 h-3" />
              <span>Aux Power</span>
            </div>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="text-right">
            <div className="text-xs font-mono text-white/60">07:30:55</div>
            <div className="text-[10px] font-mono text-neon-lime/60 uppercase">Node Running</div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 pt-32 pb-20 relative z-10 min-h-screen flex flex-col items-center">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
          
          {/* Center Window: Snake Game */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-neon-cyan shadow-neon-cyan" />
              <h2 className="text-sm uppercase tracking-[0.4em] text-white font-bold font-mono">Module B-01: Snake Emulator</h2>
            </div>
            
            <div className="bg-[#0D0D0D] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
              {/* Scanline Effect */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
              
              <SnakeGame />
              
              {/* Decorative Window Elements */}
              <div className="absolute top-6 left-12 w-2 h-2 bg-white/10 rounded-full" />
              <div className="absolute top-6 left-16 w-2 h-2 bg-white/10 rounded-full" />
              <div className="absolute top-6 left-20 w-2 h-2 bg-white/10 rounded-full" />
            </div>

            <div className="flex gap-4 mt-4 overflow-x-auto pb-4 no-scrollbar">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-shrink-0 w-32 h-16 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                   <span className="text-[10px] font-mono">DATA_BLOCK_0{i}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Side Panel: Music Player */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-6 sticky top-32"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-neon-magenta shadow-neon-magenta" />
              <h2 className="text-sm uppercase tracking-[0.4em] text-white font-bold font-mono">Module A-04: Audio Core</h2>
            </div>
            
            <MusicPlayer />
            
            <div className="mt-8 p-6 bg-neon-cyan/5 border border-neon-cyan/10 rounded-2xl">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neon-cyan mb-3">System Log</h3>
              <div className="space-y-2 font-mono text-[10px] text-white/40">
                <p><span className="text-neon-cyan/60">[{new Date().toLocaleTimeString()}]</span> Core frequency stabilized at 4.2GHz</p>
                <p><span className="text-neon-cyan/60">[{new Date().toLocaleTimeString()}]</span> Neural sync established with player</p>
                <p className="text-neon-magenta/60 animate-pulse">! Audio tracks loaded from AI sub-routine</p>
              </div>
            </div>
          </motion.section>

        </div>
      </main>

      {/* Footer Branding */}
      <footer className="w-full py-8 border-t border-white/5 flex flex-col items-center gap-4 bg-black/60">
        <div className="flex gap-8 text-[10px] uppercase tracking-[0.5em] text-white/20 font-bold">
          <span>Integrity</span>
          <span>Precision</span>
          <span>Evolution</span>
        </div>
        <p className="text-[9px] text-white/10 uppercase tracking-widest">© 2026 Neo Slither Entertainment. All rights reserved.</p>
      </footer>
    </div>
  );
}


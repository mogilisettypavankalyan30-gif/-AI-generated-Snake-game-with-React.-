import { useState, useRef, useEffect } from "react";
import { Track } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, SkipForward, SkipBack, ListMusic, Music2, Volume2, Mic2 } from "lucide-react";

const DUMMY_TRACKS: Track[] = [
  {
    id: "1",
    title: "Neon Horizon",
    artist: "SynthAI Alpha",
    cover: "https://picsum.photos/seed/synth1/400/400",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "2",
    title: "Cyber Slither",
    artist: "GlitchBot 404",
    cover: "https://picsum.photos/seed/synth2/400/400",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "3",
    title: "Quantum Funk",
    artist: "Vector Soul",
    cover: "https://picsum.photos/seed/synth3/400/400",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showQueue, setShowQueue] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleSkip = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    }
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => handleSkip('next')}
      />

      {/* Album Art & Visualizer Area */}
      <div className="relative aspect-video w-full overflow-hidden">
        <motion.img
          key={currentTrack.id}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          src={currentTrack.cover}
          className="absolute inset-0 w-full h-full object-cover blur-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
        
        <div className="absolute inset-0 flex items-center justify-center p-8">
           <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <div className="relative group">
                <div className={`absolute -inset-2 bg-neon-cyan/20 blur-2xl rounded-full transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
                <img 
                  src={currentTrack.cover} 
                  className={`w-32 h-32 rounded-2xl shadow-2xl border-2 border-white/10 relative transition-transform duration-500 ${isPlaying ? 'scale-105' : 'scale-100'}`}
                  alt={currentTrack.title}
                />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white mt-2 glow-cyan">{currentTrack.title}</h3>
              <p className="text-sm text-white/40 uppercase tracking-widest">{currentTrack.artist}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CSS Visualizer Bars */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 h-12 opacity-30 px-4">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-neon-cyan rounded-t-full"
              animate={isPlaying ? {
                height: [4, Math.random() * 40 + 4, 4],
              } : { height: 4 }}
              transition={{
                duration: 0.5 + Math.random() * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Controls Area */}
      <div className="p-6 pt-2 flex flex-col gap-6">
        {/* Progress Bar */}
        <div className="group cursor-pointer">
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-neon-cyan shadow-[0_0_10px_#00f3ff]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-mono text-white/20 uppercase tracking-tighter">
            <span>Progressive</span>
            <span>Live Feed</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setShowQueue(!showQueue)}
            className={`p-2 rounded-lg transition-colors ${showQueue ? 'bg-neon-magenta/20 text-neon-magenta' : 'text-white/40 hover:text-white'}`}
          >
            <ListMusic className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => handleSkip('prev')}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <SkipBack className="w-6 h-6 fill-current" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </button>
            <button 
              onClick={() => handleSkip('next')}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
          </div>

          <button className="p-2 text-white/40 hover:text-white transition-colors">
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Queue List Overlay */}
        <AnimatePresence>
          {showQueue && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-white/5 rounded-2xl border border-white/5"
            >
              <div className="p-4 flex flex-col gap-2">
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold px-2">Up Next</p>
                {DUMMY_TRACKS.map((track, idx) => (
                  <button
                    key={track.id}
                    onClick={() => {
                      setCurrentTrackIndex(idx);
                      setIsPlaying(true);
                    }}
                    className={`flex items-center gap-4 p-2 rounded-xl transition-all ${idx === currentTrackIndex ? 'bg-neon-cyan/10 ring-1 ring-neon-cyan/30' : 'hover:bg-white/5'}`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 relative flex-shrink-0">
                      <img src={track.cover} className="w-full h-full object-cover opacity-60" />
                      {idx === currentTrackIndex && isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <div className="flex gap-0.5 items-end h-3">
                            <motion.div animate={{ height: [2, 10, 2] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-neon-cyan" />
                            <motion.div animate={{ height: [6, 2, 6] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-0.5 bg-neon-cyan" />
                            <motion.div animate={{ height: [4, 8, 4] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-neon-cyan" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <span className={`text-sm font-medium truncate ${idx === currentTrackIndex ? 'text-neon-cyan' : 'text-white'}`}>{track.title}</span>
                      <span className="text-xs text-white/30 truncate">{track.artist}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Bottom Bar */}
      <div className="bg-neon-cyan/5 border-t border-white/5 py-2 px-6 flex justify-between items-center bg-black">
        <div className="flex items-center gap-2 text-neon-cyan/40">
          <Mic2 className="w-3 h-3" />
          <span className="text-[10px] uppercase tracking-wider font-mono">Neural Interface Online</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-lime animate-pulse shadow-[0_0_8px_#39ff14]" />
          <span className="text-[10px] uppercase tracking-wider font-mono text-neon-lime/60">Ready</span>
        </div>
      </div>
    </div>
  );
}

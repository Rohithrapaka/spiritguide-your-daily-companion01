import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, RotateCcw, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { SoulPet } from './SoulPet';
import { cn } from '@/lib/utils';

interface ZenModeProps {
  isActive: boolean;
  onClose: () => void;
}

const LOFI_STREAMS = [
  {
    name: 'Chill Beats',
    // Using a royalty-free ambient audio placeholder
    url: 'https://stream.zeno.fm/0r0xa792kwzuv',
  },
  {
    name: 'Nature Sounds',
    url: 'https://stream.zeno.fm/yn65fsaurfhvv',
  },
];

export const ZenMode: React.FC<ZenModeProps> = ({ isActive, onClose }) => {
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(focusMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(30);
  const [currentStream, setCurrentStream] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Audio setup
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying && isActive) {
      audioRef.current.src = LOFI_STREAMS[currentStream].url;
      audioRef.current.volume = isMuted ? 0 : volume / 100;
      audioRef.current.play().catch(() => {
        // Handle autoplay restrictions
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, isActive, currentStream]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Cleanup on close
  useEffect(() => {
    if (!isActive && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimeLeft(focusMinutes * 60);
    setIsTimerRunning(false);
  };

  const adjustFocusTime = (delta: number) => {
    const newMinutes = Math.max(5, Math.min(60, focusMinutes + delta));
    setFocusMinutes(newMinutes);
    if (!isTimerRunning) {
      setTimeLeft(newMinutes * 60);
    }
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-hidden"
        >
          {/* Parallax Background */}
          <div className="absolute inset-0 zen-parallax">
            {/* Layer 1 - Far background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Stars layer */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0.2, 0.8, 0.2],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Aurora effect */}
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, 0.3) 50%, transparent 70%)',
              }}
              animate={{
                x: ['-50%', '50%', '-50%'],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Floating particles */}
            <div className="absolute inset-0">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    background: `rgba(${139 + Math.random() * 50}, ${92 + Math.random() * 50}, 246, 0.4)`,
                  }}
                  animate={{
                    y: ['100vh', '-10vh'],
                    x: [0, Math.random() * 100 - 50],
                  }}
                  transition={{
                    duration: 15 + Math.random() * 10,
                    repeat: Infinity,
                    delay: Math.random() * 10,
                    ease: "linear",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={onClose}
            className={cn(
              "absolute top-6 right-6 z-50",
              "w-12 h-12 rounded-full",
              "bg-white/10 backdrop-blur-md border border-white/20",
              "flex items-center justify-center",
              "hover:bg-white/20 transition-colors",
              "text-white/80 hover:text-white"
            )}
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Main Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center gap-8 p-8">
            {/* Soul Pet */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <SoulPet />
            </motion.div>

            {/* Focus Timer */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={cn(
                "flex flex-col items-center gap-6",
                "p-8 rounded-3xl",
                "bg-white/5 backdrop-blur-lg border border-white/10"
              )}
            >
              <h2 className="text-white/80 text-lg font-medium flex items-center gap-2">
                <Leaf className="w-5 h-5" />
                Focus Timer
              </h2>

              {/* Time Display */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => adjustFocusTime(-5)}
                  disabled={isTimerRunning}
                  className="text-white/40 hover:text-white/80 text-2xl disabled:opacity-30"
                >
                  −
                </button>
                <motion.div
                  className="text-6xl font-light text-white tracking-wider tabular-nums"
                  key={timeLeft}
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                >
                  {formatTime(timeLeft)}
                </motion.div>
                <button
                  onClick={() => adjustFocusTime(5)}
                  disabled={isTimerRunning}
                  className="text-white/40 hover:text-white/80 text-2xl disabled:opacity-30"
                >
                  +
                </button>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={cn(
                    "rounded-full w-14 h-14 p-0",
                    "bg-white/10 hover:bg-white/20 border border-white/20",
                    "text-white"
                  )}
                >
                  {isTimerRunning ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                </Button>
                <Button
                  onClick={resetTimer}
                  variant="ghost"
                  className="rounded-full w-10 h-10 p-0 text-white/60 hover:text-white hover:bg-white/10"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            {/* Lo-Fi Player */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={cn(
                "flex flex-col items-center gap-4",
                "p-6 rounded-2xl",
                "bg-white/5 backdrop-blur-lg border border-white/10",
                "w-full max-w-xs"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-white/60 text-sm">
                  {LOFI_STREAMS[currentStream].name}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentStream((prev) => (prev + 1) % LOFI_STREAMS.length)}
                    className="text-white/40 hover:text-white/80 text-xs"
                  >
                    Switch
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={cn(
                    "rounded-full w-10 h-10 p-0",
                    isPlaying 
                      ? "bg-primary/80 hover:bg-primary text-primary-foreground" 
                      : "bg-white/10 hover:bg-white/20 text-white"
                  )}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </Button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white/60 hover:text-white"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                <Slider
                  value={[volume]}
                  onValueChange={([v]) => setVolume(v)}
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>
            </motion.div>

            {/* Zen Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-white/40 text-sm text-center max-w-md"
            >
              Take this moment to breathe. Your soul pet is here with you.
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ZenMode;

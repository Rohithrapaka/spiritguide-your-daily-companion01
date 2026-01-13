import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useMood } from '@/contexts/MoodContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Check, Cookie, Hand, Sparkles } from 'lucide-react';
import { EvolutionPetSVG, EvolutionStage } from './pet/EvolutionPetSVG';
import { HeartParticles, ExcitementParticles, NuzzleEffect, EatingEffect } from './pet/PetParticles';
import { FoodSystem, FoodItem, getRandomFoodType } from './pet/FoodSystem';
import { PetNameTag, LoveMeter, LovePopup } from './pet/PetUI';
import { PetType } from '@/lib/petChallenges';

interface PetPlaygroundProps {
  selectedPetType: PetType;
  evolutionStage: EvolutionStage;
}

interface Position {
  x: number;
  y: number;
}

interface HeartParticle {
  id: number;
  x: number;
  y: number;
}

interface LovePopupData {
  id: number;
  amount: number;
  x: number;
  y: number;
}

export const PetPlayground: React.FC<PetPlaygroundProps> = ({ 
  selectedPetType,
  evolutionStage 
}) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { currentMood, moodHistory } = useMood();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Pet state - now controlled by props
  const [petName, setPetName] = useState<string>('');
  const [lovePoints, setLovePoints] = useState(0);
  
  // Position and movement
  const [position, setPosition] = useState<Position>({ x: 200, y: 150 });
  const [targetPosition, setTargetPosition] = useState<Position>({ x: 200, y: 150 });
  const [isMoving, setIsMoving] = useState(false);
  const [facingDirection, setFacingDirection] = useState<'left' | 'right'>('right');
  
  // Interaction states
  const [isPetting, setIsPetting] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isEating, setIsEating] = useState(false);
  const [isNuzzling, setIsNuzzling] = useState(false);
  const [isExcited, setIsExcited] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  // Particles and effects
  const [hearts, setHearts] = useState<HeartParticle[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [showEatingEffect, setShowEatingEffect] = useState(false);
  const [eatingPosition, setEatingPosition] = useState<Position>({ x: 0, y: 0 });
  const [lovePopups, setLovePopups] = useState<LovePopupData[]>([]);
  
  // Refs for tracking
  const cursorRef = useRef<Position>({ x: 0, y: 0 });
  const lastCursorMoveRef = useRef<number>(Date.now());
  const clickCountRef = useRef<number>(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const containerSizeRef = useRef({ width: 800, height: 500 });
  const lastPetTimeRef = useRef<number>(0);

  // Mood calculation - enhanced mood sync
  const lastMoodScore = moodHistory.length > 0 ? moodHistory[0].score : currentMood;
  const isSad = lastMoodScore < 4;
  const isVeryHappy = lastMoodScore >= 8;
  
  // Size based on evolution stage AND mood
  const getBaseSizeByStage = () => {
    switch (evolutionStage) {
      case 'baby': return 280;
      case 'teen': return 340;
      case 'guardian': return 400;
    }
  };
  
  const petSize = isSad ? getBaseSizeByStage() * 0.85 : getBaseSizeByStage();
  const moveSpeed = isSad ? 0.02 : isVeryHappy ? 0.06 : 0.045;

  // Load pet data from profile (only name and love points now)
  useEffect(() => {
    const loadPetData = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('pet_name, love_points')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (data) {
        setPetName(data.pet_name || '');
        setLovePoints(data.love_points || 0);
      }
    };
    loadPetData();
  }, [user]);

  // Save pet name
  const handleNameChange = async (newName: string) => {
    setPetName(newName);
    if (user) {
      await supabase
        .from('profiles')
        .update({ pet_name: newName })
        .eq('user_id', user.id);
    }
  };

  // Add love points and save
  const addLovePoints = async (amount: number, x: number, y: number) => {
    const newPoints = Math.min(100, lovePoints + amount);
    setLovePoints(newPoints);
    
    // Show popup
    setLovePopups(prev => [...prev, { id: Date.now(), amount, x, y }]);
    
    if (user) {
      await supabase
        .from('profiles')
        .update({ love_points: newPoints })
        .eq('user_id', user.id);
    }
  };

  // Remove love popup
  const removeLovePopup = (id: number) => {
    setLovePopups(prev => prev.filter(p => p.id !== id));
  };

  // Update container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        containerSizeRef.current = {
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        };
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Smooth movement animation loop
  useEffect(() => {
    const animate = () => {
      setPosition(prev => {
        const dx = targetPosition.x - prev.x;
        const dy = targetPosition.y - prev.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 3) {
          setIsMoving(false);
          return prev;
        }

        // Ease-out movement - slower as it approaches target
        const easeAmount = Math.min(1, distance / 150);
        const speed = moveSpeed * (0.3 + easeAmount * 0.7);

        const newX = prev.x + dx * speed;
        const newY = prev.y + dy * speed;

        // Update facing direction
        if (Math.abs(dx) > 2) {
          setFacingDirection(dx > 0 ? 'right' : 'left');
        }
        
        setIsMoving(true);
        return { x: newX, y: newY };
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetPosition, moveSpeed]);

  // Blinking animation
  useEffect(() => {
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) blink();
    }, isSad ? 4000 : 2500); // Blink slower when sad

    return () => clearInterval(interval);
  }, [isSad]);

  // Click to move handler
  const handlePlaygroundClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    if ((e.target as HTMLElement).closest('button')) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - petSize / 2;
    const y = e.clientY - rect.top - petSize / 2;

    // Bound within container
    const boundedX = Math.max(0, Math.min(rect.width - petSize, x));
    const boundedY = Math.max(0, Math.min(rect.height - petSize, y));

    setTargetPosition({ x: boundedX, y: boundedY });
    setIsHiding(false);

    // Track rapid clicks for excitement
    clickCountRef.current++;
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    if (clickCountRef.current >= 5) {
      triggerExcitement();
      clickCountRef.current = 0;
    }

    clickTimeoutRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1000);
  }, [petSize]);

  // Excitement spin animation
  const triggerExcitement = () => {
    setIsExcited(true);
    addLovePoints(5, position.x + petSize / 2, position.y);
    
    const centerX = position.x + petSize / 2;
    const centerY = position.y + petSize / 2;
    const radius = 60;
    
    let angle = 0;
    const spinInterval = setInterval(() => {
      angle += 30;
      if (angle >= 720) {
        clearInterval(spinInterval);
        setIsExcited(false);
        return;
      }
      
      const rad = (angle * Math.PI) / 180;
      setTargetPosition({
        x: centerX + Math.cos(rad) * radius - petSize / 2,
        y: centerY + Math.sin(rad) * radius - petSize / 2
      });
    }, 50);
  };

  // Track cursor for nuzzle behavior
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    cursorRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    lastCursorMoveRef.current = Date.now();
  }, []);

  // Nuzzle behavior
  useEffect(() => {
    const checkNuzzle = setInterval(() => {
      const timeSinceMove = Date.now() - lastCursorMoveRef.current;
      
      if (timeSinceMove >= 3000 && !isNuzzling && !isMoving && !isEating) {
        const petCenterX = position.x + petSize / 2;
        const petCenterY = position.y + petSize / 2;
        const dx = cursorRef.current.x - petCenterX;
        const dy = cursorRef.current.y - petCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 250 && distance > 80) {
          setTargetPosition({
            x: cursorRef.current.x - petSize / 2,
            y: cursorRef.current.y - petSize / 2
          });
          setIsNuzzling(true);

          setTimeout(() => {
            setIsNuzzling(false);
          }, 2500);
        }
      }
    }, 1000);

    return () => clearInterval(checkNuzzle);
  }, [position, petSize, isNuzzling, isMoving, isEating]);

  // Random hide & seek behavior (only when not sad)
  useEffect(() => {
    if (isSad) return;

    const scheduleHide = () => {
      const delay = 25000 + Math.random() * 45000;
      
      const timeout = setTimeout(() => {
        if (!containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const side = Math.random() > 0.5 ? 'left' : 'right';
        const hideSpot = side === 'left'
          ? { x: -petSize * 0.6, y: position.y }
          : { x: rect.width - petSize * 0.4, y: position.y };

        setTargetPosition(hideSpot);
        setIsHiding(true);

        setTimeout(() => {
          if (isHiding) {
            setTargetPosition({
              x: side === 'left' ? -petSize * 0.3 : rect.width - petSize * 0.7,
              y: hideSpot.y
            });
          }
        }, 3000);

        scheduleHide();
      }, delay);

      return () => clearTimeout(timeout);
    };

    const cleanup = scheduleHide();
    return cleanup;
  }, [isSad, petSize, position.y, isHiding]);

  // Sad behavior - move to corner and stay still
  useEffect(() => {
    if (isSad && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // Move to bottom right corner when sad
      setTargetPosition({
        x: rect.width - petSize - 30,
        y: rect.height - petSize - 30
      });
    }
  }, [isSad, petSize]);

  // Pet hover (petting) handler with love points
  const handlePetHover = () => {
    const now = Date.now();
    if (!isPetting) {
      setIsPetting(true);
      
      // Add love points (throttled to once per second)
      if (now - lastPetTimeRef.current > 1000) {
        lastPetTimeRef.current = now;
        addLovePoints(2, position.x + petSize / 2, position.y + 20);
      }
      
      // Spawn hearts
      const newHearts = Array.from({ length: 3 }, (_, i) => ({
        id: Date.now() + i,
        x: position.x + petSize / 2 + (Math.random() - 0.5) * 100,
        y: position.y + 50
      }));
      setHearts(prev => [...prev, ...newHearts]);
    }
  };

  const handlePetLeave = () => {
    setIsPetting(false);
  };

  // Clean up hearts
  useEffect(() => {
    if (hearts.length > 0) {
      const timer = setTimeout(() => {
        setHearts(prev => prev.slice(1));
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [hearts]);

  // Feed handler with love points
  const handleFeed = () => {
    if (!containerRef.current || foods.length >= 3) return;

    const rect = containerRef.current.getBoundingClientRect();
    const randomX = 100 + Math.random() * (rect.width - 200);
    
    setFoods(prev => [...prev, { 
      id: Date.now(), 
      x: randomX, 
      y: 0,
      type: getRandomFoodType(selectedPetType)
    }]);
  };

  // Food landed - pet chases it
  const handleFoodLand = (foodId: number, x: number, y: number) => {
    setTargetPosition({ 
      x: x - petSize / 2, 
      y: y - petSize / 2 - 50
    });

    setTimeout(() => {
      setIsEating(true);
      setEatingPosition({ x: x, y: y - 40 });
      setShowEatingEffect(true);
      
      // Add love points for eating
      addLovePoints(10, x, y - 60);
      
      setTimeout(() => {
        setFoods(prev => prev.filter(f => f.id !== foodId));
        setIsEating(false);
        setShowEatingEffect(false);
      }, 800);
    }, 600);
  };

  const petIcons = {
    dog: '🐕',
    cat: '🐱',
    fish: '🐠',
  };

  const stageEmojis = {
    baby: '🌱',
    teen: '⭐',
    guardian: '👑'
  };

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col">
      {/* Custom cursor styling */}
      <style>{`
        .pet-playground-cursor {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23d4a574' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v0'/%3E%3Cpath d='M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2'/%3E%3Cpath d='M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8'/%3E%3Cpath d='M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15'/%3E%3C/svg%3E") 16 16, pointer;
        }
      `}</style>

      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-900/80 dark:to-yellow-800/80 rounded-3xl shadow-2xl">
              <Sparkles className="w-16 h-16 text-amber-500 animate-pulse" />
              <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">Level Up!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Pet Name, Stats */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="font-serif text-lg font-semibold">Pet Playground</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Hand className="w-4 h-4" />
              Click anywhere to call your pet!
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Love Meter */}
          <LoveMeter lovePoints={lovePoints} />
          
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
              theme === 'warm' ? "bg-secondary" : "bg-muted"
            )}>
              <span>{petIcons[selectedPetType]}</span>
              <span>{stageEmojis[evolutionStage]}</span>
            </div>
            <button
              onClick={handleFeed}
              disabled={foods.length >= 3}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-all",
                "bg-primary/90 text-primary-foreground hover:bg-primary shadow-sm",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <Cookie className="w-4 h-4" />
              Feed (+10💕)
            </button>
          </div>
        </div>
      </div>

      {/* Playground Area */}
      <div
        ref={containerRef}
        onClick={handlePlaygroundClick}
        onMouseMove={handleMouseMove}
        className={cn(
          "relative flex-1 mx-4 mb-4 rounded-3xl overflow-hidden pet-playground-cursor",
          isSad 
            ? "bg-gradient-to-b from-slate-200/80 via-blue-100/60 to-slate-300/40 dark:from-slate-800/30 dark:via-blue-900/20 dark:to-slate-700/30"
            : isVeryHappy
              ? "bg-gradient-to-b from-amber-100/80 via-yellow-200/60 to-orange-200/40 dark:from-amber-900/30 dark:via-yellow-800/20 dark:to-orange-700/30"
              : "bg-gradient-to-b from-emerald-100/80 via-green-200/60 to-emerald-300/40 dark:from-emerald-900/30 dark:via-green-800/20 dark:to-emerald-700/30"
        )}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, hsl(var(--secondary) / 0.2) 0%, transparent 40%)
          `
        }}
      >
        {/* Ground/grass effect - changes based on mood */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t to-transparent",
          isSad ? "from-slate-400/50 dark:from-slate-600/30" : "from-emerald-400/50 dark:from-emerald-600/30"
        )} />
        
        {/* Decorative elements */}
        {!isSad && (
          <>
            <div className="absolute bottom-4 left-8 w-3 h-12 bg-emerald-500/40 rounded-full dark:bg-emerald-400/25" />
            <div className="absolute bottom-4 left-14 w-2 h-8 bg-emerald-600/40 rounded-full dark:bg-emerald-500/25" />
            <div className="absolute bottom-4 left-20 w-3 h-10 bg-emerald-500/40 rounded-full dark:bg-emerald-400/25" />
            <div className="absolute bottom-4 right-10 w-3 h-14 bg-emerald-500/40 rounded-full dark:bg-emerald-400/25" />
            <div className="absolute bottom-4 right-18 w-2 h-9 bg-emerald-600/40 rounded-full dark:bg-emerald-500/25" />
            <div className="absolute bottom-4 right-24 w-3 h-11 bg-emerald-500/40 rounded-full dark:bg-emerald-400/25" />
          </>
        )}

        {/* Sad atmosphere - rain drops */}
        {isSad && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-4 bg-blue-300/40 rounded-full"
                style={{ left: `${5 + i * 6.5}%` }}
                animate={{ y: ['0%', '100vh'], opacity: [0.4, 0] }}
                transition={{
                  duration: 1.5 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'linear'
                }}
              />
            ))}
          </div>
        )}

        {/* Very happy - sparkles */}
        {isVeryHappy && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ 
                  left: `${10 + Math.random() * 80}%`, 
                  top: `${10 + Math.random() * 60}%` 
                }}
                animate={{ 
                  scale: [0, 1, 0], 
                  rotate: [0, 180],
                  opacity: [0, 1, 0] 
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Food system */}
        <FoodSystem 
          foods={foods} 
          onFoodLand={handleFoodLand}
          containerHeight={containerSizeRef.current.height}
        />

        {/* Heart particles */}
        <HeartParticles particles={hearts} />
        
        {/* Excitement particles */}
        <ExcitementParticles 
          isActive={isExcited} 
          centerX={position.x + petSize / 2} 
          centerY={position.y + petSize / 2}
        />

        {/* Nuzzle effect */}
        <NuzzleEffect 
          isActive={isNuzzling}
          x={position.x + petSize / 2}
          y={position.y}
        />

        {/* Eating effect */}
        <EatingEffect 
          isActive={showEatingEffect}
          x={eatingPosition.x}
          y={eatingPosition.y}
        />

        {/* Love popups */}
        {lovePopups.map(popup => (
          <LovePopup
            key={popup.id}
            amount={popup.amount}
            x={popup.x}
            y={popup.y}
            onComplete={() => removeLovePopup(popup.id)}
          />
        ))}

        {/* Pet Name Tag - floating above pet */}
        <motion.div
          className="absolute z-20 pointer-events-auto"
          style={{ 
            left: position.x + petSize / 2, 
            top: position.y - 20,
            transform: 'translateX(-50%)'
          }}
        >
          <PetNameTag 
            name={petName} 
            onNameChange={handleNameChange}
            stage={evolutionStage}
          />
        </motion.div>

        {/* The Pet - Using Evolution SVG */}
        <motion.div
          className="absolute pointer-events-auto"
          style={{ 
            left: position.x, 
            top: position.y,
            width: petSize,
            height: petSize
          }}
          animate={
            isExcited 
              ? { rotate: [0, 15, -15, 15, -15, 0] }
              : isMoving 
                ? { y: [0, -8, 0] }
                : isSad
                  ? { y: [0, 2, 0] } // Subtle breathing when sad
                  : {}
          }
          transition={{
            duration: isExcited ? 0.3 : isSad ? 2 : 0.35,
            repeat: isExcited ? Infinity : isMoving || isSad ? Infinity : 0,
            ease: "easeInOut"
          }}
          onMouseEnter={handlePetHover}
          onMouseLeave={handlePetLeave}
        >
          <EvolutionPetSVG
            type={selectedPetType}
            stage={evolutionStage}
            size={petSize}
            isPetting={isPetting || isNuzzling}
            isEating={isEating}
            isBlinking={isBlinking}
            isSad={isSad}
            facingDirection={facingDirection}
            isMoving={isMoving}
          />
        </motion.div>

        {/* Zzz particles when sad and not moving */}
        {isSad && !isMoving && (
          <div className="absolute pointer-events-none" style={{ left: position.x + petSize - 20, top: position.y }}>
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="absolute text-blue-400/70 font-bold"
                style={{ fontSize: 12 + i * 4 }}
                animate={{ 
                  y: [-10 - i * 15, -30 - i * 15],
                  x: [0, 10 + i * 5],
                  opacity: [0.7, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              >
                z
              </motion.span>
            ))}
          </div>
        )}

        {/* Mood indicator */}
        <div className="absolute top-4 left-4">
          <div className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm",
            isSad 
              ? "bg-blue-100/80 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
              : isVeryHappy
                ? "bg-amber-100/80 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                : "bg-green-100/80 text-green-700 dark:bg-green-900/50 dark:text-green-300"
          )}>
            {isSad ? '😢 Feeling low...' : isVeryHappy ? '🌟 Ecstatic!' : '😊 Happy!'}
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
          <p className="text-xs text-muted-foreground/80 bg-background/60 px-4 py-2 rounded-full backdrop-blur-sm">
            Hover to pet (+2💕) • Click to call • Rapid clicks for excitement! (+5💕)
          </p>
        </div>
      </div>
    </div>
  );
};

export default PetPlayground;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useMood } from '@/contexts/MoodContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Check, Cookie, Hand } from 'lucide-react';
import { PetSVG } from './pet/PetSVG';
import { HeartParticles, ExcitementParticles, NuzzleEffect, EatingEffect } from './pet/PetParticles';
import { FoodSystem, FoodItem, getRandomFoodType } from './pet/FoodSystem';

type PetType = 'dog' | 'cat' | 'fish';

interface Position {
  x: number;
  y: number;
}

interface HeartParticle {
  id: number;
  x: number;
  y: number;
}

export const PetPlayground: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { currentMood, moodHistory } = useMood();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Pet state
  const [selectedPet, setSelectedPet] = useState<PetType>('dog');
  const [showSelection, setShowSelection] = useState(false);
  
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
  
  // Particles and effects
  const [hearts, setHearts] = useState<HeartParticle[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [showEatingEffect, setShowEatingEffect] = useState(false);
  const [eatingPosition, setEatingPosition] = useState<Position>({ x: 0, y: 0 });
  
  // Refs for tracking
  const cursorRef = useRef<Position>({ x: 0, y: 0 });
  const lastCursorMoveRef = useRef<number>(Date.now());
  const clickCountRef = useRef<number>(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const containerSizeRef = useRef({ width: 800, height: 500 });

  // Mood calculation
  const lastMoodScore = moodHistory.length > 0 ? moodHistory[0].score : currentMood;
  const isSad = lastMoodScore < 4;
  const petSize = isSad ? 300 : 350; // Slightly smaller when sad
  const moveSpeed = isSad ? 0.025 : 0.045;

  // Load pet type from profile
  useEffect(() => {
    const loadPetType = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('pet_type')
        .eq('user_id', user.id)
        .single();
      
      if (data?.pet_type && ['dog', 'cat', 'fish'].includes(data.pet_type)) {
        setSelectedPet(data.pet_type as PetType);
      }
    };
    loadPetType();
  }, [user]);

  // Save pet selection
  const handlePetSelect = async (pet: PetType) => {
    setSelectedPet(pet);
    setShowSelection(false);
    
    if (user) {
      await supabase
        .from('profiles')
        .update({ pet_type: pet })
        .eq('user_id', user.id);
    }
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
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Click to move handler
  const handlePlaygroundClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    if ((e.target as HTMLElement).closest('button')) return; // Ignore button clicks

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
    
    // Circular spin path
    const centerX = position.x + petSize / 2;
    const centerY = position.y + petSize / 2;
    const radius = 60;
    
    let angle = 0;
    const spinInterval = setInterval(() => {
      angle += 30;
      if (angle >= 720) { // Two full rotations
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
          // Move toward cursor for nuzzle
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

  // Random hide & seek behavior
  useEffect(() => {
    if (isSad) return; // Don't hide when sad

    const scheduleHide = () => {
      const delay = 20000 + Math.random() * 40000; // 20-60 seconds
      
      const timeout = setTimeout(() => {
        if (!containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        
        // Move partially off-screen
        const side = Math.random() > 0.5 ? 'left' : 'right';
        const hideSpot = side === 'left'
          ? { x: -petSize * 0.6, y: position.y }
          : { x: rect.width - petSize * 0.4, y: position.y };

        setTargetPosition(hideSpot);
        setIsHiding(true);

        // Peek out after a bit
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

  // Pet hover (petting) handler
  const handlePetHover = () => {
    if (!isPetting) {
      setIsPetting(true);
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

  // Feed handler
  const handleFeed = () => {
    if (!containerRef.current || foods.length >= 3) return;

    const rect = containerRef.current.getBoundingClientRect();
    const randomX = 100 + Math.random() * (rect.width - 200);
    
    setFoods(prev => [...prev, { 
      id: Date.now(), 
      x: randomX, 
      y: 0,
      type: getRandomFoodType(selectedPet)
    }]);
  };

  // Food landed - pet chases it
  const handleFoodLand = (foodId: number, x: number, y: number) => {
    // Pet rushes to food
    setTargetPosition({ 
      x: x - petSize / 2, 
      y: y - petSize / 2 - 50
    });

    // Start eating animation after reaching food
    setTimeout(() => {
      setIsEating(true);
      setEatingPosition({ x: x, y: y - 40 });
      setShowEatingEffect(true);
      
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

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col">
      {/* Custom cursor styling */}
      <style>{`
        .pet-playground-cursor {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23d4a574' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v0'/%3E%3Cpath d='M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2'/%3E%3Cpath d='M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8'/%3E%3Cpath d='M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15'/%3E%3C/svg%3E") 16 16, pointer;
        }
      `}</style>

      {/* Selection Modal */}
      <AnimatePresence>
        {showSelection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-3xl"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className={cn(
                "p-8 rounded-3xl max-w-md w-full mx-4",
                theme === 'warm' ? "warm-card" : "glass-card"
              )}
            >
              <h3 className="font-serif text-xl font-semibold text-center mb-6">
                Choose Your Companion
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {(['dog', 'cat', 'fish'] as PetType[]).map((pet) => (
                  <button
                    key={pet}
                    onClick={() => handlePetSelect(pet)}
                    className={cn(
                      "relative p-6 rounded-2xl transition-all duration-300 flex flex-col items-center gap-2",
                      selectedPet === pet
                        ? "bg-primary/15 ring-2 ring-primary shadow-md"
                        : "bg-muted/50 hover:bg-muted"
                    )}
                  >
                    <span className="text-4xl">{petIcons[pet]}</span>
                    <span className="text-sm font-medium capitalize">{pet}</span>
                    {selectedPet === pet && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="font-serif text-lg font-semibold">Pet Playground</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Hand className="w-4 h-4" />
            Click anywhere to call your pet!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSelection(true)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
              theme === 'warm' ? "bg-secondary hover:bg-secondary/80" : "bg-muted hover:bg-muted/80"
            )}
          >
            <span>{petIcons[selectedPet]}</span>
            Change Pet
          </button>
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
            Feed
          </button>
        </div>
      </div>

      {/* Playground Area */}
      <div
        ref={containerRef}
        onClick={handlePlaygroundClick}
        onMouseMove={handleMouseMove}
        className={cn(
          "relative flex-1 mx-4 mb-4 rounded-3xl overflow-hidden pet-playground-cursor",
          "bg-gradient-to-b from-emerald-100/80 via-green-200/60 to-emerald-300/40",
          "dark:from-emerald-900/30 dark:via-green-800/20 dark:to-emerald-700/30"
        )}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, hsl(var(--secondary) / 0.2) 0%, transparent 40%)
          `
        }}
      >
        {/* Ground/grass effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-400/50 to-transparent dark:from-emerald-600/30" />
        
        {/* Decorative grass blades */}
        <div className="absolute bottom-4 left-8 w-3 h-12 bg-emerald-500/40 rounded-full dark:bg-emerald-400/25" />
        <div className="absolute bottom-4 left-14 w-2 h-8 bg-emerald-600/40 rounded-full dark:bg-emerald-500/25" />
        <div className="absolute bottom-4 left-20 w-3 h-10 bg-emerald-500/40 rounded-full dark:bg-emerald-400/25" />
        <div className="absolute bottom-4 right-10 w-3 h-14 bg-emerald-500/40 rounded-full dark:bg-emerald-400/25" />
        <div className="absolute bottom-4 right-18 w-2 h-9 bg-emerald-600/40 rounded-full dark:bg-emerald-500/25" />
        <div className="absolute bottom-4 right-24 w-3 h-11 bg-emerald-500/40 rounded-full dark:bg-emerald-400/25" />

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

        {/* The Pet */}
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
                : {}
          }
          transition={{
            duration: isExcited ? 0.3 : 0.35,
            repeat: isExcited ? Infinity : isMoving ? Infinity : 0,
            ease: "easeInOut"
          }}
          onMouseEnter={handlePetHover}
          onMouseLeave={handlePetLeave}
        >
          <PetSVG
            type={selectedPet}
            size={petSize}
            isPetting={isPetting || isNuzzling}
            isEating={isEating}
            isBlinking={isBlinking}
            isSad={isSad}
            facingDirection={facingDirection}
            isMoving={isMoving}
          />
        </motion.div>

        {/* Mood indicator */}
        <div className="absolute top-4 left-4">
          <div className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm",
            isSad 
              ? "bg-blue-100/80 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
              : "bg-green-100/80 text-green-700 dark:bg-green-900/50 dark:text-green-300"
          )}>
            {isSad ? '😢 Feeling low...' : '😊 Happy!'}
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
          <p className="text-xs text-muted-foreground/80 bg-background/60 px-4 py-2 rounded-full backdrop-blur-sm">
            Hover to pet • Click to call • Rapid clicks for excitement! 💕
          </p>
        </div>
      </div>
    </div>
  );
};

export default PetPlayground;

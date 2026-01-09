import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Heart, Cookie, Check, Sparkles } from 'lucide-react';

type PetType = 'dog' | 'cat' | 'fish';

interface FoodItem {
  id: number;
  x: number;
  y: number;
}

// SVG Pet Components
const DogPet: React.FC<{ isPetting: boolean; isEating: boolean }> = ({ isPetting, isEating }) => (
  <svg width="80" height="80" viewBox="0 0 100 100" className="drop-shadow-lg">
    <defs>
      <radialGradient id="dogFur" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#d4a574" />
        <stop offset="100%" stopColor="#a67c52" />
      </radialGradient>
      <radialGradient id="dogBelly" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#f5e6d3" />
        <stop offset="100%" stopColor="#e8d5c4" />
      </radialGradient>
    </defs>
    {/* Body */}
    <motion.ellipse
      cx="50" cy="60" rx="30" ry="25"
      fill="url(#dogFur)"
      animate={isPetting ? { scaleY: [1, 0.9, 1.05, 1], scaleX: [1, 1.05, 0.95, 1] } : {}}
      transition={{ duration: 0.5 }}
    />
    {/* Belly */}
    <ellipse cx="50" cy="65" rx="18" ry="15" fill="url(#dogBelly)" />
    {/* Head */}
    <motion.circle
      cx="50" cy="35" r="22"
      fill="url(#dogFur)"
      animate={isPetting ? { scale: [1, 1.05, 1] } : isEating ? { y: [0, 5, 0] } : {}}
      transition={{ duration: 0.3 }}
    />
    {/* Ears */}
    <motion.ellipse
      cx="30" cy="25" rx="10" ry="15"
      fill="#8b6914"
      animate={isPetting ? { rotate: [-5, 5, -5] } : {}}
      transition={{ duration: 0.3 }}
      style={{ transformOrigin: '30px 35px' }}
    />
    <motion.ellipse
      cx="70" cy="25" rx="10" ry="15"
      fill="#8b6914"
      animate={isPetting ? { rotate: [5, -5, 5] } : {}}
      transition={{ duration: 0.3 }}
      style={{ transformOrigin: '70px 35px' }}
    />
    {/* Eyes */}
    <motion.ellipse
      cx="42" cy="32" rx="5" ry={isPetting ? 2 : 6}
      fill="#3d2914"
      animate={isEating ? { scaleY: [1, 0.5, 1] } : {}}
    />
    <motion.ellipse
      cx="58" cy="32" rx="5" ry={isPetting ? 2 : 6}
      fill="#3d2914"
      animate={isEating ? { scaleY: [1, 0.5, 1] } : {}}
    />
    {/* Eye highlights */}
    {!isPetting && (
      <>
        <circle cx="44" cy="30" r="2" fill="white" opacity="0.8" />
        <circle cx="60" cy="30" r="2" fill="white" opacity="0.8" />
      </>
    )}
    {/* Nose */}
    <ellipse cx="50" cy="42" rx="5" ry="4" fill="#3d2914" />
    {/* Mouth */}
    {isPetting ? (
      <path d="M44 48 Q50 55 56 48" fill="none" stroke="#3d2914" strokeWidth="2" strokeLinecap="round" />
    ) : isEating ? (
      <ellipse cx="50" cy="50" rx="4" ry="3" fill="#3d2914" />
    ) : (
      <path d="M46 48 Q50 52 54 48" fill="none" stroke="#3d2914" strokeWidth="2" strokeLinecap="round" />
    )}
    {/* Tail */}
    <motion.path
      d="M78 55 Q90 45 85 60 Q80 70 75 65"
      fill="url(#dogFur)"
      animate={isPetting ? { rotate: [-20, 20, -20, 20, 0] } : { rotate: [0, 10, 0] }}
      transition={{ duration: isPetting ? 0.6 : 1, repeat: isPetting ? 0 : Infinity }}
      style={{ transformOrigin: '78px 60px' }}
    />
    {/* Legs */}
    <ellipse cx="35" cy="82" rx="6" ry="8" fill="#a67c52" />
    <ellipse cx="65" cy="82" rx="6" ry="8" fill="#a67c52" />
    {/* Tongue when happy */}
    {isPetting && (
      <motion.ellipse
        cx="50" cy="54" rx="4" ry="6"
        fill="#ff6b8a"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        style={{ transformOrigin: '50px 48px' }}
      />
    )}
  </svg>
);

const CatPet: React.FC<{ isPetting: boolean; isEating: boolean }> = ({ isPetting, isEating }) => (
  <svg width="80" height="80" viewBox="0 0 100 100" className="drop-shadow-lg">
    <defs>
      <radialGradient id="catFur" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#6b7280" />
        <stop offset="100%" stopColor="#4b5563" />
      </radialGradient>
      <radialGradient id="catBelly" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#e5e7eb" />
        <stop offset="100%" stopColor="#d1d5db" />
      </radialGradient>
    </defs>
    {/* Body */}
    <motion.ellipse
      cx="50" cy="60" rx="28" ry="22"
      fill="url(#catFur)"
      animate={isPetting ? { scaleY: [1, 0.85, 1.08, 1], scaleX: [1, 1.08, 0.92, 1] } : {}}
      transition={{ duration: 0.5 }}
    />
    {/* Belly */}
    <ellipse cx="50" cy="65" rx="16" ry="12" fill="url(#catBelly)" />
    {/* Head */}
    <motion.circle
      cx="50" cy="35" r="20"
      fill="url(#catFur)"
      animate={isPetting ? { scale: [1, 1.05, 1] } : isEating ? { y: [0, 3, 0] } : {}}
      transition={{ duration: 0.3 }}
    />
    {/* Ears */}
    <motion.path
      d="M30 30 L25 10 L40 25 Z"
      fill="url(#catFur)"
      animate={isPetting ? { rotate: [-5, 5, -5] } : {}}
      transition={{ duration: 0.3 }}
    />
    <path d="M32 28 L28 15 L38 26 Z" fill="#ffc0cb" />
    <motion.path
      d="M70 30 L75 10 L60 25 Z"
      fill="url(#catFur)"
      animate={isPetting ? { rotate: [5, -5, 5] } : {}}
      transition={{ duration: 0.3 }}
    />
    <path d="M68 28 L72 15 L62 26 Z" fill="#ffc0cb" />
    {/* Eyes */}
    <motion.ellipse
      cx="42" cy="33" rx="5" ry={isPetting ? 1 : 6}
      fill="#10b981"
      animate={isEating ? { scaleY: [1, 0.5, 1] } : {}}
    />
    <motion.ellipse
      cx="58" cy="33" rx="5" ry={isPetting ? 1 : 6}
      fill="#10b981"
      animate={isEating ? { scaleY: [1, 0.5, 1] } : {}}
    />
    {/* Pupils */}
    {!isPetting && (
      <>
        <ellipse cx="42" cy="33" rx="2" ry="5" fill="#1f2937" />
        <ellipse cx="58" cy="33" rx="2" ry="5" fill="#1f2937" />
        <circle cx="43" cy="31" r="1.5" fill="white" opacity="0.8" />
        <circle cx="59" cy="31" r="1.5" fill="white" opacity="0.8" />
      </>
    )}
    {/* Nose */}
    <path d="M47 42 L50 45 L53 42 Z" fill="#ffc0cb" />
    {/* Mouth */}
    {isPetting ? (
      <path d="M44 48 Q50 54 56 48" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" />
    ) : (
      <>
        <path d="M50 46 L50 49" stroke="#4b5563" strokeWidth="1.5" />
        <path d="M47 49 Q50 52 53 49" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" />
      </>
    )}
    {/* Whiskers */}
    <g stroke="#9ca3af" strokeWidth="1">
      <line x1="20" y1="40" x2="35" y2="42" />
      <line x1="20" y1="45" x2="35" y2="45" />
      <line x1="65" y1="42" x2="80" y2="40" />
      <line x1="65" y1="45" x2="80" y2="45" />
    </g>
    {/* Tail */}
    <motion.path
      d="M75 60 Q95 40 90 70 Q85 85 78 75"
      fill="url(#catFur)"
      stroke="none"
      animate={isPetting ? { d: ["M75 60 Q95 40 90 70 Q85 85 78 75", "M75 60 Q100 35 95 65 Q90 80 80 72", "M75 60 Q95 40 90 70 Q85 85 78 75"] } : {}}
      transition={{ duration: 0.8 }}
    />
    {/* Legs */}
    <ellipse cx="35" cy="80" rx="5" ry="7" fill="#4b5563" />
    <ellipse cx="65" cy="80" rx="5" ry="7" fill="#4b5563" />
  </svg>
);

const FishPet: React.FC<{ isPetting: boolean; isEating: boolean }> = ({ isPetting, isEating }) => (
  <svg width="80" height="80" viewBox="0 0 100 100" className="drop-shadow-lg">
    <defs>
      <radialGradient id="fishBody" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="50%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#2563eb" />
      </radialGradient>
      <radialGradient id="fishBelly" cx="50%" cy="70%" r="50%">
        <stop offset="0%" stopColor="#e0f2fe" />
        <stop offset="100%" stopColor="#bae6fd" />
      </radialGradient>
    </defs>
    {/* Body */}
    <motion.ellipse
      cx="45" cy="50" rx="30" ry="20"
      fill="url(#fishBody)"
      animate={isPetting ? { scaleY: [1, 0.9, 1.1, 1], scaleX: [1, 1.05, 0.95, 1] } : {}}
      transition={{ duration: 0.5 }}
    />
    {/* Belly */}
    <ellipse cx="40" cy="55" rx="18" ry="10" fill="url(#fishBelly)" />
    {/* Tail */}
    <motion.path
      d="M75 50 L95 35 L90 50 L95 65 Z"
      fill="url(#fishBody)"
      animate={{ rotate: [-5, 5, -5] }}
      transition={{ duration: 0.5, repeat: Infinity }}
      style={{ transformOrigin: '75px 50px' }}
    />
    {/* Dorsal fin */}
    <motion.path
      d="M35 30 Q45 15 55 30"
      fill="#2563eb"
      animate={{ scaleY: [1, 1.1, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
    {/* Pectoral fin */}
    <motion.ellipse
      cx="35" cy="58" rx="8" ry="4"
      fill="#3b82f6"
      animate={{ rotate: [-10, 10, -10] }}
      transition={{ duration: 0.8, repeat: Infinity }}
      style={{ transformOrigin: '40px 58px' }}
    />
    {/* Eye */}
    <circle cx="28" cy="45" r="8" fill="white" />
    <motion.circle
      cx="28" cy="45" r="5"
      fill="#1e3a8a"
      animate={isEating ? { scale: [1, 0.8, 1] } : {}}
    />
    <circle cx="26" cy="43" r="2" fill="white" opacity="0.9" />
    {/* Mouth */}
    {isPetting ? (
      <ellipse cx="12" cy="50" rx="4" ry="3" fill="#f472b6" />
    ) : isEating ? (
      <motion.ellipse
        cx="12" cy="50" rx="5" ry="5"
        fill="#1e3a8a"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 0.3 }}
      />
    ) : (
      <ellipse cx="12" cy="50" rx="3" ry="2" fill="#1e3a8a" />
    )}
    {/* Scales pattern */}
    <g fill="none" stroke="hsl(var(--primary) / 0.2)" strokeWidth="1">
      <path d="M30 45 Q35 42 40 45" />
      <path d="M35 50 Q40 47 45 50" />
      <path d="M40 55 Q45 52 50 55" />
      <path d="M45 45 Q50 42 55 45" />
      <path d="M50 50 Q55 47 60 50" />
    </g>
    {/* Bubbles when happy */}
    {isPetting && (
      <>
        <motion.circle
          cx="8" cy="40" r="3"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="1"
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: -20, opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.circle
          cx="5" cy="45" r="2"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="1"
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: -15, opacity: 0 }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
        />
      </>
    )}
  </svg>
);

// Heart particle component
const HeartParticle: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: x - 10, top: y - 10 }}
    initial={{ opacity: 1, scale: 0, y: 0 }}
    animate={{ opacity: 0, scale: 1.5, y: -50 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.8 }}
  >
    <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
  </motion.div>
);

// Food component
const FallingFood: React.FC<{ x: number; onLand: (y: number) => void }> = ({ x, onLand }) => {
  return (
    <motion.div
      className="absolute"
      style={{ left: x - 15 }}
      initial={{ top: -30, rotate: 0 }}
      animate={{ top: '70%', rotate: 360 }}
      transition={{ duration: 1.5, ease: 'easeIn' }}
      onAnimationComplete={() => onLand(70)}
    >
      <Cookie className="w-8 h-8 text-amber-500" />
    </motion.div>
  );
};

export const PetPlayground: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [selectedPet, setSelectedPet] = useState<PetType>('dog');
  const [isPetting, setIsPetting] = useState(false);
  const [isEating, setIsEating] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [showSelection, setShowSelection] = useState(false);
  
  // Cursor following with spring physics
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 100, damping: 20 });
  const springY = useSpring(cursorY, { stiffness: 100, damping: 20 });

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

  // Handle cursor movement
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    cursorX.set(e.clientX - rect.left - 40);
    cursorY.set(e.clientY - rect.top - 40);
  };

  // Handle petting
  const handlePetHover = (e: React.MouseEvent) => {
    if (!isPetting) {
      setIsPetting(true);
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left + Math.random() * 20 - 10;
      const y = e.clientY - rect.top;
      setHearts(prev => [...prev, { id: Date.now(), x, y }]);
    }
  };

  const handlePetLeave = () => {
    setIsPetting(false);
  };

  // Handle feeding
  const handleFeed = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const randomX = Math.random() * (rect.width - 60) + 30;
      setFoods(prev => [...prev, { id: Date.now(), x: randomX, y: 0 }]);
    }
  };

  const handleFoodLand = (foodId: number) => {
    setIsEating(true);
    setTimeout(() => {
      setFoods(prev => prev.filter(f => f.id !== foodId));
      setIsEating(false);
    }, 500);
  };

  // Clean up hearts
  useEffect(() => {
    if (hearts.length > 0) {
      const timer = setTimeout(() => {
        setHearts(prev => prev.slice(1));
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [hearts]);

  const renderPet = () => {
    const props = { isPetting, isEating };
    switch (selectedPet) {
      case 'dog': return <DogPet {...props} />;
      case 'cat': return <CatPet {...props} />;
      case 'fish': return <FishPet {...props} />;
    }
  };

  const petIcons = {
    dog: '🐕',
    cat: '🐱',
    fish: '🐠',
  };

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col">
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
          <p className="text-sm text-muted-foreground">Move your cursor to play!</p>
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
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-all",
              "bg-primary/90 text-primary-foreground hover:bg-primary shadow-sm"
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
        onMouseMove={handleMouseMove}
        className={cn(
          "relative flex-1 mx-4 mb-4 rounded-3xl overflow-hidden cursor-none",
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
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-emerald-400/40 to-transparent dark:from-emerald-600/20" />
        
        {/* Decorative elements */}
        <div className="absolute bottom-4 left-8 w-3 h-8 bg-emerald-500/30 rounded-full dark:bg-emerald-400/20" />
        <div className="absolute bottom-4 left-12 w-2 h-6 bg-emerald-600/30 rounded-full dark:bg-emerald-500/20" />
        <div className="absolute bottom-4 right-10 w-3 h-10 bg-emerald-500/30 rounded-full dark:bg-emerald-400/20" />
        <div className="absolute bottom-4 right-16 w-2 h-7 bg-emerald-600/30 rounded-full dark:bg-emerald-500/20" />

        {/* Falling food */}
        <AnimatePresence>
          {foods.map((food) => (
            <FallingFood
              key={food.id}
              x={food.x}
              onLand={() => handleFoodLand(food.id)}
            />
          ))}
        </AnimatePresence>

        {/* The Pet */}
        <motion.div
          className="absolute cursor-pointer"
          style={{ x: springX, y: springY }}
          onMouseEnter={handlePetHover}
          onMouseLeave={handlePetLeave}
        >
          {renderPet()}
          
          {/* Heart particles */}
          <AnimatePresence>
            {hearts.map((heart) => (
              <HeartParticle key={heart.id} x={heart.x} y={heart.y} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Sparkles when petting */}
        {isPetting && (
          <motion.div
            className="absolute pointer-events-none"
            style={{ x: springX, y: springY }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="absolute -top-4 -right-4"
              animate={{ scale: [0, 1, 0], rotate: [0, 180, 360] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </motion.div>
          </motion.div>
        )}

        {/* Instructions */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
          <p className="text-xs text-muted-foreground/70 bg-background/50 px-4 py-2 rounded-full backdrop-blur-sm">
            Hover over your pet to show love 💕
          </p>
        </div>
      </div>
    </div>
  );
};

export default PetPlayground;

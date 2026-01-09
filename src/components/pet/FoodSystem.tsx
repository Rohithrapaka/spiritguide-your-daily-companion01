import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Apple, Fish, Bone } from 'lucide-react';

export interface FoodItem {
  id: number;
  x: number;
  y: number;
  type: 'cookie' | 'apple' | 'fish' | 'bone';
}

interface FallingFoodProps {
  food: FoodItem;
  onLand: (id: number, x: number, y: number) => void;
  containerHeight: number;
}

const FoodIcon: React.FC<{ type: FoodItem['type'] }> = ({ type }) => {
  const iconClass = "w-12 h-12 drop-shadow-lg";
  
  switch (type) {
    case 'cookie':
      return <Cookie className={`${iconClass} text-amber-500`} />;
    case 'apple':
      return <Apple className={`${iconClass} text-red-500`} />;
    case 'fish':
      return <Fish className={`${iconClass} text-blue-400`} />;
    case 'bone':
      return <Bone className={`${iconClass} text-stone-400`} />;
  }
};

export const FallingFood: React.FC<FallingFoodProps> = ({ 
  food, 
  onLand, 
  containerHeight 
}) => {
  const landingY = containerHeight - 100;

  return (
    <motion.div
      className="absolute z-40 pointer-events-none"
      style={{ left: food.x - 24 }}
      initial={{ top: -60, rotate: 0, scale: 0.5 }}
      animate={{ 
        top: landingY, 
        rotate: 360,
        scale: 1
      }}
      transition={{ 
        duration: 1.8, 
        ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for bounce
      }}
      onAnimationComplete={() => onLand(food.id, food.x, landingY)}
    >
      <motion.div
        animate={{ 
          y: [0, -8, 0, -4, 0],
          scale: [1, 1.1, 1, 1.05, 1]
        }}
        transition={{ 
          duration: 0.5,
          delay: 1.8
        }}
      >
        <FoodIcon type={food.type} />
      </motion.div>
    </motion.div>
  );
};

interface FoodSystemProps {
  foods: FoodItem[];
  onFoodLand: (id: number, x: number, y: number) => void;
  containerHeight: number;
}

export const FoodSystem: React.FC<FoodSystemProps> = ({ 
  foods, 
  onFoodLand, 
  containerHeight 
}) => {
  return (
    <AnimatePresence>
      {foods.map(food => (
        <FallingFood
          key={food.id}
          food={food}
          onLand={onFoodLand}
          containerHeight={containerHeight}
        />
      ))}
    </AnimatePresence>
  );
};

export const getRandomFoodType = (petType: 'dog' | 'cat' | 'fish'): FoodItem['type'] => {
  const foodOptions: Record<string, FoodItem['type'][]> = {
    dog: ['bone', 'cookie', 'apple'],
    cat: ['fish', 'cookie'],
    fish: ['cookie', 'apple']
  };
  
  const options = foodOptions[petType] || ['cookie'];
  return options[Math.floor(Math.random() * options.length)];
};

export default FoodSystem;

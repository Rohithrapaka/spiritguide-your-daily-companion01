import { useState, useEffect, useCallback, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface PetBehaviorOptions {
  containerRef: React.RefObject<HTMLDivElement>;
  moodScore: number;
  onNuzzle?: () => void;
  onExcitement?: () => void;
}

interface PetBehaviorState {
  position: Position;
  targetPosition: Position;
  rotation: number;
  isMoving: boolean;
  isHiding: boolean;
  isNuzzling: boolean;
  isExcited: boolean;
  facingDirection: 'left' | 'right';
}

export const usePetBehavior = ({
  containerRef,
  moodScore,
  onNuzzle,
  onExcitement
}: PetBehaviorOptions) => {
  const [state, setState] = useState<PetBehaviorState>({
    position: { x: 200, y: 200 },
    targetPosition: { x: 200, y: 200 },
    rotation: 0,
    isMoving: false,
    isHiding: false,
    isNuzzling: false,
    isExcited: false,
    facingDirection: 'right'
  });

  const cursorRef = useRef<Position>({ x: 0, y: 0 });
  const lastCursorMoveRef = useRef<number>(Date.now());
  const clickCountRef = useRef<number>(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const isSad = moodScore < 4;
  const moveSpeed = isSad ? 0.02 : 0.04;

  // Calculate angle between two points
  const getAngle = (from: Position, to: Position): number => {
    return Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);
  };

  // Smooth movement animation
  useEffect(() => {
    const animate = () => {
      setState(prev => {
        const dx = prev.targetPosition.x - prev.position.x;
        const dy = prev.targetPosition.y - prev.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 5) {
          return { ...prev, isMoving: false };
        }

        // Ease-out movement
        const easeAmount = Math.min(1, distance / 100);
        const speed = moveSpeed * (0.5 + easeAmount * 0.5);

        const newX = prev.position.x + dx * speed;
        const newY = prev.position.y + dy * speed;

        // Update facing direction
        const facingDirection = dx > 0 ? 'right' : 'left';

        return {
          ...prev,
          position: { x: newX, y: newY },
          isMoving: true,
          facingDirection,
          rotation: getAngle(prev.position, prev.targetPosition)
        };
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [moveSpeed]);

  // Click to move handler
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 175; // Center the pet
    const y = e.clientY - rect.top - 175;

    // Bound within container
    const boundedX = Math.max(0, Math.min(rect.width - 350, x));
    const boundedY = Math.max(0, Math.min(rect.height - 350, y));

    setState(prev => ({
      ...prev,
      targetPosition: { x: boundedX, y: boundedY },
      isHiding: false
    }));

    // Track rapid clicks for excitement
    clickCountRef.current++;
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    if (clickCountRef.current >= 5) {
      // Trigger excitement spin
      setState(prev => ({ ...prev, isExcited: true }));
      onExcitement?.();
      
      setTimeout(() => {
        setState(prev => ({ ...prev, isExcited: false }));
      }, 2000);
      
      clickCountRef.current = 0;
    }

    clickTimeoutRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1000);
  }, [containerRef, onExcitement]);

  // Track cursor for nuzzle behavior
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    cursorRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    lastCursorMoveRef.current = Date.now();
  }, [containerRef]);

  // Nuzzle behavior: if cursor stays still for 3 seconds near pet
  useEffect(() => {
    const checkNuzzle = setInterval(() => {
      const timeSinceMove = Date.now() - lastCursorMoveRef.current;
      
      if (timeSinceMove >= 3000) {
        const dx = cursorRef.current.x - state.position.x - 175;
        const dy = cursorRef.current.y - state.position.y - 175;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200 && distance > 50 && !state.isNuzzling) {
          // Move toward cursor for nuzzle
          setState(prev => ({
            ...prev,
            targetPosition: {
              x: cursorRef.current.x - 175,
              y: cursorRef.current.y - 175
            },
            isNuzzling: true
          }));
          onNuzzle?.();

          setTimeout(() => {
            setState(prev => ({ ...prev, isNuzzling: false }));
          }, 2000);
        }
      }
    }, 1000);

    return () => clearInterval(checkNuzzle);
  }, [state.position, state.isNuzzling, onNuzzle]);

  // Random hide & seek behavior
  useEffect(() => {
    const scheduleHide = () => {
      const delay = 15000 + Math.random() * 30000; // 15-45 seconds
      
      hideTimeoutRef.current = setTimeout(() => {
        if (!containerRef.current || isSad) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        
        // Move to edge (hiding)
        const hideSpot = Math.random() > 0.5 
          ? { x: -150, y: Math.random() * rect.height - 175 }
          : { x: rect.width - 200, y: Math.random() * rect.height - 175 };

        setState(prev => ({
          ...prev,
          targetPosition: hideSpot,
          isHiding: true
        }));

        // Peek out after a bit
        setTimeout(() => {
          if (state.isHiding) {
            setState(prev => ({
              ...prev,
              targetPosition: {
                x: Math.max(0, Math.min(rect.width - 350, hideSpot.x + 100)),
                y: hideSpot.y
              }
            }));
          }
        }, 3000);

        scheduleHide();
      }, delay);
    };

    scheduleHide();

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [containerRef, isSad]);

  return {
    ...state,
    handleClick,
    handleMouseMove,
    isSad
  };
};

export default usePetBehavior;

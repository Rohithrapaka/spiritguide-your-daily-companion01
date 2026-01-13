-- Create pet_progress table for independent pet tracking
CREATE TABLE public.pet_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  pet_type TEXT NOT NULL CHECK (pet_type IN ('dog', 'cat', 'fish')),
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  evolution_stage TEXT NOT NULL DEFAULT 'baby' CHECK (evolution_stage IN ('baby', 'teen', 'guardian')),
  challenges_completed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, pet_type)
);

-- Create pet_challenges table to track individual challenge completions
CREATE TABLE public.pet_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  pet_type TEXT NOT NULL CHECK (pet_type IN ('dog', 'cat', 'fish')),
  challenge_id TEXT NOT NULL,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('daily', 'weekly')),
  progress INTEGER NOT NULL DEFAULT 0,
  target INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  reset_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, pet_type, challenge_id, reset_at)
);

-- Enable RLS
ALTER TABLE public.pet_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_challenges ENABLE ROW LEVEL SECURITY;

-- RLS policies for pet_progress
CREATE POLICY "Users can view their own pet progress" ON public.pet_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own pet progress" ON public.pet_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pet progress" ON public.pet_progress FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for pet_challenges
CREATE POLICY "Users can view their own pet challenges" ON public.pet_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own pet challenges" ON public.pet_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pet challenges" ON public.pet_challenges FOR UPDATE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_pet_progress_updated_at
BEFORE UPDATE ON public.pet_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
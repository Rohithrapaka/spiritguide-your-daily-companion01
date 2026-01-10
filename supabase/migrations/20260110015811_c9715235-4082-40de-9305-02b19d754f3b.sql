-- Add pet personalization columns to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS pet_name TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS love_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_challenges_completed INTEGER DEFAULT 0;
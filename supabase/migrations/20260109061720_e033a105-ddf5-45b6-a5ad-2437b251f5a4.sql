-- Add pet and typing analytics columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS pet_level integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS pet_type text DEFAULT 'spirit_fox',
ADD COLUMN IF NOT EXISTS pet_energy integer DEFAULT 50,
ADD COLUMN IF NOT EXISTS typing_average_wpm numeric DEFAULT 0;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
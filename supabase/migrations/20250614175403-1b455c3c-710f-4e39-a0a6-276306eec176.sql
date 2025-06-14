
-- Create an enum type for booking status
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'failed');

-- Create a table for bookings
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  court_number INT NOT NULL,
  match_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  partners TEXT[] NOT NULL,
  status public.booking_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reservation_opens_at TIMESTAMPTZ
);

-- Add Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own bookings
CREATE POLICY "Users can view their own bookings"
  ON public.bookings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own bookings
CREATE POLICY "Users can insert their own bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

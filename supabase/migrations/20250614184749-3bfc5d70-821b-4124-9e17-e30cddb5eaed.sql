
-- Policy: Users can delete their own pending bookings
CREATE POLICY "Users can delete their own pending bookings"
  ON public.bookings
  FOR DELETE
  USING (auth.uid() = user_id AND status = 'pending');

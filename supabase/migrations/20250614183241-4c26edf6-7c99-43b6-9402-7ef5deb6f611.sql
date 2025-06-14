
CREATE OR REPLACE FUNCTION public.check_booking_conflict(
    p_court_number integer,
    p_match_date date,
    p_start_time time,
    p_end_time time
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.bookings
    WHERE
      court_number = p_court_number AND
      match_date = p_match_date AND
      (start_time, end_time) OVERLAPS (p_start_time, p_end_time) AND
      status IN ('pending', 'confirmed')
  );
END;
$$;

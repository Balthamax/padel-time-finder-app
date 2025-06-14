
ALTER TABLE public.bookings DROP COLUMN partners;
ALTER TABLE public.bookings ADD COLUMN partner_1 TEXT;
ALTER TABLE public.bookings ADD COLUMN partner_2 TEXT;
ALTER TABLE public.bookings ADD COLUMN partner_3 TEXT;

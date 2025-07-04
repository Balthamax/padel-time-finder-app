
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import type { Tables } from '@/integrations/supabase/types';

export const useAdminBookings = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Tables<'bookings'>[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('match_date', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
      } else {
        setBookings(data || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId)
      .eq('status', 'pending');

    if (error) {
      console.error('Error canceling booking:', error);
      toast({
        title: "Erreur lors de l'annulation",
        description: "La demande n'a pas pu être annulée. Veuillez réessayer.",
        variant: "destructive",
      });
    } else {
      setBookings(bookings.filter(b => b.id !== bookingId));
      toast({
        title: "Demande annulée",
        description: "La demande de réservation a été annulée avec succès.",
      });
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    cancelBooking,
    fetchBookings
  };
};

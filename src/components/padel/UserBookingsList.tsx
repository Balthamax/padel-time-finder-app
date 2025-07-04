
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Calendar, Clock, Users } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

interface UserBookingsListProps {
  bookings: Tables<'bookings'>[];
  isLoading: boolean;
  onCancelBooking: (bookingId: string) => void;
}

const statusVariant = {
  pending: 'secondary',
  confirmed: 'default',
  failed: 'destructive',
} as const;

const statusLabel = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  failed: 'Échec',
} as const;

const UserBookingsList = ({ bookings, isLoading, onCancelBooking }: UserBookingsListProps) => {
  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardContent className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Chargement de vos demandes...</p>
        </CardContent>
      </Card>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Vos demandes de réservation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Vous n'avez pas encore fait de demande de réservation.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Vos demandes de réservation ({bookings.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {bookings.map((booking) => {
          const partners = [booking.partner_1, booking.partner_2, booking.partner_3]
            .filter(Boolean)
            .join(', ');
          
          return (
            <div
              key={booking.id}
              className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(booking.match_date), 'dd/MM/yyyy', { locale: fr })}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {booking.start_time.slice(0, 5)}
                  </div>
                  <Badge variant="outline">
                    Padel {booking.court_number}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant[booking.status as keyof typeof statusVariant] || 'secondary'}>
                    {statusLabel[booking.status as keyof typeof statusLabel] || booking.status}
                  </Badge>
                  {booking.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCancelBooking(booking.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              {partners && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>Partenaires : {partners}</span>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                Demande créée le {format(new Date(booking.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default UserBookingsList;

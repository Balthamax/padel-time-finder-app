
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Clock } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

interface AdminBookingsListProps {
  bookings: Tables<'bookings'>[];
  loading: boolean;
}

const statusVariant = {
  pending: 'secondary',
  confirmed: 'default',
  failed: 'destructive',
} as const;

const statusLabel = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  failed: 'Échec',
} as const;

const AdminBookingsList = ({ bookings, loading }: AdminBookingsListProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Chargement des réservations...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Toutes les Réservations ({bookings.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Aucune réservation trouvée.</p>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Terrain</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Partenaires</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créée le</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => {
                  const partners = [booking.partner_1, booking.partner_2, booking.partner_3]
                    .filter(Boolean)
                    .join(', ') || 'Aucun partenaire';
                  
                  return (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        Padel {booking.court_number}
                      </TableCell>
                      <TableCell>
                        {format(new Date(booking.match_date), 'dd/MM/yyyy', { locale: fr })}
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}
                      </TableCell>
                      <TableCell className="text-sm max-w-48 truncate" title={partners}>
                        {partners}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[booking.status as keyof typeof statusVariant] || 'secondary'}>
                          {statusLabel[booking.status as keyof typeof statusLabel] || booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(booking.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminBookingsList;

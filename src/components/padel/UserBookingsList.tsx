
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Info, CalendarDays } from 'lucide-react';
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

const UserBookingsList = ({ bookings, isLoading, onCancelBooking }: UserBookingsListProps) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center mt-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Chargement de vos réservations...</p>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
             <Card className="mt-8 bg-muted/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Info className="w-5 h-5"/> Pas de pré-réservation</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Vous n'avez pas encore de pré-réservation en cours. Utilisez le formulaire ci-dessus pour en créer une !</p>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card className="mt-12">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><CalendarDays className="w-5 h-5" />Mes pré-réservations</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Terrain</TableHead>
                                <TableHead  className="hidden md:table-cell">Date</TableHead>
                                <TableHead>Créneau</TableHead>
                                <TableHead className="hidden lg:table-cell">Partenaires</TableHead>
                                <TableHead className="hidden sm:table-cell">Statut</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell>Padel {booking.court_number}</TableCell>
                                    <TableCell className="hidden md:table-cell">{format(new Date(booking.match_date), 'yyyy-MM-dd')}</TableCell>
                                    <TableCell>{booking.start_time} - {booking.end_time}</TableCell>
                                    <TableCell className="hidden lg:table-cell text-xs">
                                        {booking.partner_1}, {booking.partner_2}, {booking.partner_3}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Badge variant={statusVariant[booking.status as keyof typeof statusVariant] || 'secondary'}>
                                            {booking.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {booking.status === 'pending' && (
                                            <Button variant="ghost" size="icon" onClick={() => onCancelBooking(booking.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                <span className="sr-only">Annuler</span>
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default UserBookingsList;

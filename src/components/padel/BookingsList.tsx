
import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ListChecks, XCircle } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import { Button } from '../ui/button';

const statusTranslation: { [key in Tables<'bookings'>['status']]: string } = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    failed: 'Échec',
};

const statusColor: { [key in Tables<'bookings'>['status']]: string } = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
};

interface BookingsListProps {
    bookings: Tables<'bookings'>[];
    isLoading: boolean;
    onCancelBooking: (bookingId: string) => Promise<void>;
}

const BookingsList = ({ bookings, isLoading, onCancelBooking }: BookingsListProps) => {
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    const handleCancel = async (id: string) => {
        setCancellingId(id);
        await onCancelBooking(id);
        setCancellingId(null);
    };

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ListChecks className="w-5 h-5" /> Mes pré-réservations</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-24">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : bookings.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Vous n'avez aucune pré-réservation pour le moment.</p>
                ) : (
                    <ul className="space-y-4">
                        {bookings.map((booking) => (
                            <li key={booking.id} className="border p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-colors hover:bg-muted/50">
                                <div className="flex-grow">
                                    <p className="font-semibold">
                                        Padel {booking.court_number} - {format(new Date(booking.match_date + 'T00:00:00'), 'eeee dd MMMM yyyy', { locale: fr })}
                                    </p>
                                    <p className="text-sm">
                                        De {booking.start_time.slice(0, 5)} à {booking.end_time.slice(0, 5)}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Avec : {booking.partners.join(', ')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <div className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColor[booking.status]}`}>
                                        {statusTranslation[booking.status]}
                                    </div>
                                    {booking.status === 'pending' && (
                                        <Button variant="ghost" size="icon" onClick={() => handleCancel(booking.id)} disabled={cancellingId === booking.id} title="Annuler la pré-réservation">
                                            {cancellingId === booking.id ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-destructive" />
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
};

export default BookingsList;

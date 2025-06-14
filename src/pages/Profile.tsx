
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Database } from '@/integrations/supabase/types';
import { Badge } from '@/components/ui/badge';

type ProfileData = {
  first_name: string | null;
  last_name: string | null;
  racing_id: string | null;
};

type Booking = Database['public']['Tables']['bookings']['Row'];

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setLoading(true);

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('first_name, last_name, racing_id')
                .eq('id', user.id)
                .single();
            
            if (profileError) {
                console.error('Error fetching profile', profileError);
            } else {
                setProfile(profileData);
            }

            const { data: bookingsData, error: bookingsError } = await supabase
                .from('bookings')
                .select('*')
                .eq('user_id', user.id)
                .order('match_date', { ascending: false })
                .order('start_time', { ascending: false });

            if (bookingsError) {
                console.error('Error fetching bookings', bookingsError);
            } else {
                setBookings(bookingsData || []);
            }

            setLoading(false);
        };

        fetchData();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <main className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto p-4 max-w-5xl">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-primary">Mon Profil</h1>
                    <Button asChild variant="outline">
                        <Link to="/booking">Retour à la réservation</Link>
                    </Button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mes informations</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p><strong>Prénom:</strong> {profile?.first_name || 'Non renseigné'}</p>
                                <p><strong>Nom:</strong> {profile?.last_name || 'Non renseigné'}</p>
                                <p><strong>ID Racing:</strong> {profile?.racing_id || 'Non renseigné'}</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Historique des pré-réservations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {bookings.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead className="hidden sm:table-cell">Créneau</TableHead>
                                                <TableHead>Terrain</TableHead>
                                                <TableHead>Statut</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {bookings.map((booking) => (
                                                <TableRow key={booking.id}>
                                                    <TableCell>{format(new Date(booking.match_date), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                                                    <TableCell className="hidden sm:table-cell">{booking.start_time.slice(0,5)} - {booking.end_time.slice(0,5)}</TableCell>
                                                    <TableCell>Padel {booking.court_number}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={booking.status === 'pending' ? 'secondary' : booking.status === 'confirmed' ? 'default' : 'destructive'}>
                                                            {booking.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-muted-foreground">Aucune demande de réservation pour le moment.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Profile;

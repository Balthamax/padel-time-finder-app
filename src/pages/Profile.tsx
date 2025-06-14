
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Loader2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Database } from '@/integrations/supabase/types';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type ProfileData = {
  first_name: string | null;
  last_name: string | null;
  racing_id: string | null;
};

type Booking = Database['public']['Tables']['bookings']['Row'];

const profileFormSchema = z.object({
  first_name: z.string().min(1, { message: "Le prénom est requis." }),
  last_name: z.string().min(1, { message: "Le nom est requis." }),
  racing_id: z.string().nullable().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            racing_id: '',
        },
    });

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
                toast.error("Erreur lors de la récupération du profil.");
            } else if (profileData) {
                setProfile(profileData);
                form.reset({
                    first_name: profileData.first_name || '',
                    last_name: profileData.last_name || '',
                    racing_id: profileData.racing_id || '',
                });
            }

            const { data: bookingsData, error: bookingsError } = await supabase
                .from('bookings')
                .select('*')
                .eq('user_id', user.id)
                .order('match_date', { ascending: false })
                .order('start_time', { ascending: false });

            if (bookingsError) {
                console.error('Error fetching bookings', bookingsError);
                toast.error("Erreur lors de la récupération des réservations.");
            } else {
                setBookings(bookingsData || []);
            }

            setLoading(false);
        };

        fetchData();
    }, [user, form]);

    async function onSubmit(data: ProfileFormValues) {
        if (!user) return;
        
        const { error } = await supabase
            .from('profiles')
            .update({
                first_name: data.first_name,
                last_name: data.last_name,
                racing_id: data.racing_id || null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);

        if (error) {
            console.error('Error updating profile', error);
            toast.error("Une erreur est survenue lors de la mise à jour.");
        } else {
            setProfile({
                first_name: data.first_name,
                last_name: data.last_name,
                racing_id: data.racing_id || null,
            });
            setIsEditing(false);
            toast.success("Profil mis à jour avec succès !");
        }
    }

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
                            {!isEditing ? (
                                <>
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle>Mes informations</CardTitle>
                                            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <p><strong>Prénom:</strong> {profile?.first_name || 'Non renseigné'}</p>
                                        <p><strong>Nom:</strong> {profile?.last_name || 'Non renseigné'}</p>
                                        <p><strong>ID Racing:</strong> {profile?.racing_id || 'Non renseigné'}</p>
                                    </CardContent>
                                </>
                            ) : (
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)}>
                                        <CardHeader>
                                            <CardTitle>Modifier mes informations</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="first_name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Prénom</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="last_name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Nom</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="racing_id"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>ID Racing</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} value={field.value ?? ''} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                        <CardFooter className="flex justify-end gap-2">
                                            <Button variant="ghost" type="button" onClick={() => { setIsEditing(false); form.reset(); }}>Annuler</Button>
                                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Sauvegarder
                                            </Button>
                                        </CardFooter>
                                    </form>
                                </Form>
                            )}
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

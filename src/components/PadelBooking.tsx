import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { calculateReservationOpenDate } from '@/utils/dateUtils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

import PageHeader from './padel/PageHeader';
import DateCard from './padel/DateCard';
import CourtCard from './padel/CourtCard';
import TimeCard from './padel/TimeCard';
import BookingSummary from './padel/BookingSummary';
import PartnerModal from './padel/PartnerModal';
import BookingsList from './padel/BookingsList';

export type Partner = {
    first_name: string;
    last_name: string;
};

const PadelBooking = () => {
    const { user, signOut } = useAuth();
    const [profile, setProfile] = useState<{first_name: string, last_name: string} | null>(null);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedCourt, setSelectedCourt] = useState<string>("1");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [partners, setPartners] = useState<[Partner, Partner, Partner]>([
        { first_name: '', last_name: '' },
        { first_name: '', last_name: '' },
        { first_name: '', last_name: '' },
    ]);
    const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
    const [bookings, setBookings] = useState<Tables<'bookings'>[]>([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                const { data, error } = await supabase.from('profiles').select('first_name, last_name').eq('id', user.id).single();
                if (error) {
                    console.error("Error fetching profile", error);
                } else if (data) {
                    setProfile(data);
                }
            };
            fetchProfile();

            const fetchBookings = async () => {
                setIsLoadingBookings(true);
                const { data, error } = await supabase
                    .from('bookings')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('match_date', { ascending: false })
                    .order('start_time', { ascending: false });

                if (error) {
                    console.error("Error fetching bookings", error);
                    toast({
                        title: "Erreur",
                        description: "Impossible de charger vos réservations.",
                        variant: "destructive"
                    });
                } else if (data) {
                    setBookings(data);
                }
                setIsLoadingBookings(false);
            };
            fetchBookings();
        } else {
            setProfile(null);
            setBookings([]);
            setIsLoadingBookings(false);
        }
    }, [user, toast]);

    useEffect(() => {
        setStartTime('');
        setEndTime('');
    }, [date, selectedCourt]);
    
    const handleDateChange = (newDate: Date | undefined) => {
        setDate(newDate);
    }

    const handlePartnerChange = (index: number, field: 'first_name' | 'last_name', value: string) => {
        const newPartners = [...partners] as [Partner, Partner, Partner];
        newPartners[index] = { ...newPartners[index], [field]: value };
        setPartners(newPartners);
    };

    const handleCancelBooking = async (bookingId: string) => {
        const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', bookingId)
            .eq('status', 'pending');

        if (error) {
            console.error('Error canceling booking:', error);
            toast({
                title: "Erreur lors de l'annulation",
                description: "Votre demande n'a pas pu être traitée. Veuillez réessayer.",
                variant: "destructive",
            });
        } else {
            setBookings(bookings.filter(b => b.id !== bookingId));
            toast({
                title: "Pré-réservation annulée",
                description: "Votre demande a bien été annulée.",
            });
        }
    };

    const reservationOpenDate = date ? calculateReservationOpenDate(date) : null;
    const isBookingAlreadyOpen = reservationOpenDate ? reservationOpenDate < new Date() : false;
    
    const submitBooking = async () => {
        if (!date || !startTime || !endTime || !user) {
            toast({
                title: "Sélection incomplète",
                description: "Veuillez choisir une date et des heures de début et de fin.",
                variant: "destructive",
            });
            return;
        }

        if (partners.some(p => p.first_name.trim() === '' || p.last_name.trim() === '')) {
            toast({
                title: "Noms des partenaires manquants",
                description: "Veuillez renseigner le prénom et le nom des 3 partenaires.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        
        try {
            const { data: isConflict, error: conflictError } = await supabase.rpc('check_booking_conflict', {
                p_court_number: parseInt(selectedCourt, 10),
                p_match_date: format(date, 'yyyy-MM-dd'),
                p_start_time: startTime,
                p_end_time: endTime,
            });

            if (conflictError) {
                console.error('Error checking booking conflict:', conflictError);
                toast({
                    title: "Erreur lors de la vérification",
                    description: "Impossible de vérifier la disponibilité du créneau. Veuillez réessayer.",
                    variant: "destructive",
                });
                 setIsSubmitting(false);
                return;
            }

            if (isConflict) {
                toast({
                    title: "Créneau non disponible",
                    description: "Ce créneau a déjà été demandé par un autre utilisateur de l'application.",
                    variant: "destructive",
                });
                 setIsSubmitting(false);
                return;
            }

            const partnerDataToUpsert = partners.map(p => ({
                user_id: user.id,
                first_name: p.first_name.trim(),
                last_name: p.last_name.trim()
            }));

            const { error: partnerError } = await supabase.from('partenaires').upsert(partnerDataToUpsert, {
                onConflict: 'user_id, first_name, last_name'
            });

            if (partnerError) {
                console.error('Error upserting partners:', partnerError);
                toast({
                    title: "Erreur lors de l'enregistrement des partenaires",
                    description: "Une erreur est survenue, vos partenaires n'ont pas pu être enregistrés. Veuillez réessayer.",
                    variant: "destructive",
                });
                setIsSubmitting(false);
                return;
            }
            
            const formattedPartners = partners.map(p => `${p.first_name.trim()} ${p.last_name.trim()}`);

            const { data: newBooking, error } = await supabase
                .from('bookings')
                .insert({
                    court_number: parseInt(selectedCourt, 10),
                    match_date: format(date, 'yyyy-MM-dd'),
                    start_time: startTime,
                    end_time: endTime,
                    partners: formattedPartners,
                    user_id: user.id,
                    reservation_opens_at: reservationOpenDate?.toISOString() || null,
                })
                .select()
                .single();

            if (error) {
                console.error('Error inserting booking:', error);
                toast({
                    title: "Erreur lors de la réservation",
                    description: "Une erreur est survenue, votre demande n'a pas pu être enregistrée. Veuillez réessayer.",
                    variant: "destructive",
                });
                setIsSubmitting(false);
                return;
            }
            
            if (newBooking) {
                setBookings(prevBookings => [newBooking, ...prevBookings].sort((a, b) => {
                    const dateA = new Date(a.match_date + 'T00:00:00').getTime();
                    const dateB = new Date(b.match_date + 'T00:00:00').getTime();
                    if (dateB !== dateA) return dateB - dateA;
                    return b.start_time.localeCompare(a.start_time);
                }));
            }

            toast({
                title: "Pré-réservation validée !",
                description: "Votre demande avec vos partenaires a bien été enregistrée.",
            });
            setStartTime('');
            setEndTime('');
            setPartners([
                { first_name: '', last_name: '' },
                { first_name: '', last_name: '' },
            ]);
            setIsPartnerModalOpen(false);
        } catch (e) {
            console.error("An unexpected error occurred:", e);
            toast({
                title: "Erreur inattendue",
                description: "Une erreur inattendue est survenue. Veuillez réessayer.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <PageHeader user={user} profile={profile} onSignOut={signOut} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <DateCard date={date} onDateChange={handleDateChange} />
                </div>
                
                <div className="space-y-6">
                    <CourtCard selectedCourt={selectedCourt} onCourtChange={setSelectedCourt} />
                    <TimeCard 
                        date={date}
                        startTime={startTime}
                        onStartTimeChange={setStartTime}
                        endTime={endTime}
                        onEndTimeChange={setEndTime}
                    />

                    {startTime && endTime && date && (
                        <BookingSummary
                            date={date}
                            startTime={startTime}
                            endTime={endTime}
                            selectedCourt={selectedCourt}
                            isBookingAlreadyOpen={isBookingAlreadyOpen}
                            reservationOpenDate={reservationOpenDate}
                            onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
                        />
                    )}
                </div>
            </div>

            <PartnerModal 
                isOpen={isPartnerModalOpen}
                onOpenChange={setIsPartnerModalOpen}
                partners={partners}
                onPartnerChange={handlePartnerChange}
                onSubmit={submitBooking}
                isSubmitting={isSubmitting}
            />

            <BookingsList bookings={bookings} isLoading={isLoadingBookings} onCancelBooking={handleCancelBooking} />

             <footer className="text-center mt-12 text-sm text-muted-foreground">
                <p>Cette plateforme a été développée pour permettre aux copains d'Arkavia d'accéder facilement aux réservations et de découvrir un cas d'usage, parmi tant d'autres, des agents autonomes propulsés par l'intelligence artificielle.</p>
            </footer>
        </div>
    );
}

export default PadelBooking;

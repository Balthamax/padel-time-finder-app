import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { calculateReservationOpenDate } from '@/utils/dateUtils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type AvailableSlot = {
    court_id: string;
    start_time: string;
    end_time: string;
    status: string;
};

export type Partner = {
    first_name: string;
    last_name: string;
};

export const usePadelBooking = () => {
    const { user, signOut } = useAuth();
    const { toast } = useToast();
    
    const [profile, setProfile] = useState<{
        first_name: string | null;
        last_name: string | null;
        racing_id?: string | null;
        racing_password?: string | null;
    } | null>(null);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [startTime, setStartTime] = useState('');
    const [selectedCourt, setSelectedCourt] = useState<string>("1");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [partners, setPartners] = useState<[Partner, Partner, Partner]>([
        { first_name: '', last_name: '' },
        { first_name: '', last_name: '' },
        { first_name: '', last_name: '' },
    ]);
    const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
    const [isRacingModalOpen, setIsRacingModalOpen] = useState(false);
    const [racingIdInput, setRacingIdInput] = useState('');
    const [racingPasswordInput, setRacingPasswordInput] = useState('');
    const [bookings, setBookings] = useState<Tables<'bookings'>[]>([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(true);
    const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // Mapping des court_ids aux numéros de terrains
    const courtIdToNumber: { [key: string]: string } = {
        '1290': '1',
        '1291': '2', 
        '1669': '3'
    };

    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                const { data, error } = await supabase.from('profiles').select('first_name, last_name, racing_id, racing_password').eq('id', user.id).single();
                if (error) {
                    console.error("Error fetching profile", error);
                } else if (data) {
                    setProfile(data);
                    setRacingIdInput(data.racing_id || '');
                }
            };
            fetchProfile();

            // Check if user is admin
            const checkUserRole = async () => {
                try {
                    const { data, error } = await supabase
                        .from('user_roles')
                        .select('role')
                        .eq('user_id', user.id)
                        .eq('role', 'admin')
                        .single();

                    if (error && error.code !== 'PGRST116') {
                        console.error('Error checking user role:', error);
                    }

                    setIsAdmin(!!data);
                } catch (error) {
                    console.error('Error checking user role:', error);
                    setIsAdmin(false);
                }
            };
            checkUserRole();

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
            setIsAdmin(false);
        }
    }, [user, toast]);

    useEffect(() => {
        setStartTime('');
    }, [date, selectedCourt]);

    // Fonction pour récupérer les disponibilités depuis l'API
    const fetchAvailableSlots = async (selectedDate: Date) => {
        setIsLoadingSlots(true);
        try {
            const response = await fetch('https://workflows.arkavia.fr/webhook/1a51fedd-o982-562j-98f9-f9ffdf997b49', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: format(selectedDate, 'yyyy-MM-dd')
                })
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const slots: AvailableSlot[] = await response.json();
            console.log('Available slots received:', slots);
            setAvailableSlots(Array.isArray(slots) ? slots : []);
        } catch (error) {
            console.error('Error fetching available slots:', error);
            setAvailableSlots([]);
            // Ne pas afficher de toast d'erreur pour éviter de polluer l'interface
        } finally {
            setIsLoadingSlots(false);
        }
    };

    // Récupérer les disponibilités quand la date change
    useEffect(() => {
        if (date) {
            fetchAvailableSlots(date);
        } else {
            setAvailableSlots([]);
        }
    }, [date]);

    // Filtrer les créneaux selon le terrain sélectionné
    const getFilteredTimeSlots = () => {
        if (!availableSlots.length) return [];
        
        // Trouver le court_id correspondant au terrain sélectionné
        const targetCourtId = Object.keys(courtIdToNumber).find(
            courtId => courtIdToNumber[courtId] === selectedCourt
        );
        
        if (!targetCourtId) return [];
        
        return availableSlots
            .filter(slot => slot.court_id === targetCourtId && slot.status === 'upcoming')
            .map(slot => slot.start_time)
            .sort();
    };
    
    const handleDateChange = (newDate: Date | undefined) => {
        setDate(newDate);
    }

    const handlePartnerChange = (index: number, field: 'first_name' | 'last_name', value: string) => {
        const newPartners = [...partners] as [Partner, Partner, Partner];
        let processedValue = value;
        if (field === 'last_name') {
            processedValue = value.toUpperCase();
        } else if (field === 'first_name' && value) {
            processedValue = value.charAt(0).toUpperCase() + value.slice(1);
        }
        newPartners[index] = { ...newPartners[index], [field]: processedValue };
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
                title: "Demande annulée",
                description: "Votre demande de réservation a bien été annulée.",
            });
        }
    };

    const handleInitiateBooking = () => {
        // Vérifier si l'utilisateur non-admin a déjà une demande en attente
        if (!isAdmin) {
            const hasPendingBooking = bookings.some(booking => booking.status === 'pending');
            if (hasPendingBooking) {
                toast({
                    title: "Demande déjà en cours",
                    description: "Vous avez déjà une demande de réservation en attente. Veuillez l'annuler avant d'en créer une nouvelle.",
                    variant: "destructive",
                });
                return;
            }
        }

        if (!profile?.racing_id || !profile?.racing_password) {
            setIsRacingModalOpen(true);
        } else {
            setIsPartnerModalOpen(true);
        }
    };
    
    const handleRacingCredentialsSubmit = async () => {
        if (!user || !racingIdInput || !racingPasswordInput) {
            toast({
                title: "Champs manquants",
                description: "Veuillez renseigner votre identifiant et mot de passe Racing.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        const { error } = await supabase
            .from('profiles')
            .update({ racing_id: racingIdInput, racing_password: racingPasswordInput })
            .eq('id', user.id);
        
        setIsSubmitting(false);

        if (error) {
            console.error('Error updating profile with racing credentials:', error);
            toast({
                title: "Erreur",
                description: "Impossible de sauvegarder vos identifiants Racing.",
                variant: "destructive"
            });
        } else {
            setProfile(prev => prev ? { ...prev, racing_id: racingIdInput, racing_password: racingPasswordInput } : null);
            toast({
                title: "Identifiants enregistrés",
                description: "Vous pouvez maintenant continuer votre demande.",
            });
            setIsRacingModalOpen(false);
            submitBooking();
        }
    };

    const reservationOpenDate = date ? calculateReservationOpenDate(date) : null;
    const isBookingAlreadyOpen = reservationOpenDate ? reservationOpenDate < new Date() : false;
    
    const submitBooking = async () => {
        if (!date || !startTime || !user) {
            toast({
                title: "Sélection incomplète",
                description: "Veuillez choisir une date et une heure de début.",
                variant: "destructive",
            });
            return;
        }

        // Double vérification avant soumission pour les non-admins
        if (!isAdmin) {
            const hasPendingBooking = bookings.some(booking => booking.status === 'pending');
            if (hasPendingBooking) {
                toast({
                    title: "Demande déjà en cours",
                    description: "Vous avez déjà une demande de réservation en attente.",
                    variant: "destructive",
                });
                return;
            }
        }

        if (partners.some(p => p.first_name.trim() === '' || p.last_name.trim() === '')) {
            toast({
                title: "Noms des partenaires manquants",
                description: "Veuillez renseigner le prénom et le nom des 3 partenaires.",
                variant: "destructive",
            });
            return;
        }

        if (!profile || !profile.first_name || !profile.last_name) {
            toast({
                title: "Profil incomplet",
                description: "Veuillez renseigner votre prénom et votre nom dans la page profil pour continuer.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        
        try {
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
            
            // Générer un nom unique pour la demande
            const { count, error: countError } = await supabase
                .from('bookings')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', user.id);
            
            if (countError) {
                console.error('Error counting user bookings', countError);
                toast({
                    title: "Erreur",
                    description: "Impossible de générer un nom pour la demande.",
                    variant: "destructive"
                });
                setIsSubmitting(false);
                return;
            }
            
            const bookingNumber = (count || 0) + 1;
            const bookingName = `${profile.first_name.charAt(0).toLowerCase()}${profile.last_name.toLowerCase().replace(/\s/g, '')}${bookingNumber}`;
            
            // Créer la demande de réservation - en utilisant seulement les champs existants
            const bookingData = {
                court_number: parseInt(selectedCourt, 10),
                match_date: format(date, 'yyyy-MM-dd'),
                start_time: startTime,
                end_time: '23:59:59', // Valeur par défaut car le champ est encore requis
                partner_1: `${partners[0].first_name.trim()} ${partners[0].last_name.trim()}`,
                partner_2: `${partners[1].first_name.trim()} ${partners[1].last_name.trim()}`,
                partner_3: `${partners[2].first_name.trim()} ${partners[2].last_name.trim()}`,
                user_id: user.id,
                reservation_opens_at: reservationOpenDate?.toISOString() || null,
            };

            const { data: newBooking, error } = await supabase
                .from('bookings')
                .insert(bookingData)
                .select()
                .single();

            if (error) {
                console.error('Error inserting booking:', error);
                toast({
                    title: "Erreur lors de la demande",
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
                    if (a.start_time && b.start_time) {
                       return b.start_time.localeCompare(a.start_time);
                    }
                    return 0;
                }));
                
                // Réinitialiser le formulaire
                setStartTime('');
                setPartners([
                    { first_name: '', last_name: '' },
                    { first_name: '', last_name: '' },
                    { first_name: '', last_name: '' },
                ]);
                setIsPartnerModalOpen(false);
            }

            toast({
                title: "Demande enregistrée !",
                description: `Votre demande de réservation "${bookingName}" a bien été enregistrée.`,
            });
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
    
    const handleWizardSubmit = () => {
        // Vérifier si l'utilisateur non-admin a déjà une demande en attente
        if (!isAdmin) {
            const hasPendingBooking = bookings.some(booking => booking.status === 'pending');
            if (hasPendingBooking) {
                toast({
                    title: "Demande déjà en cours",
                    description: "Vous avez déjà une demande de réservation en attente. Veuillez l'annuler avant d'en créer une nouvelle.",
                    variant: "destructive",
                });
                return;
            }
        }

        if (!profile?.racing_id || !profile?.racing_password) {
            setIsRacingModalOpen(true);
        } else {
            submitBooking();
        }
    };
    
    return {
        user,
        signOut,
        profile,
        date,
        handleDateChange,
        startTime,
        setStartTime,
        selectedCourt,
        setSelectedCourt,
        isSubmitting,
        partners,
        handlePartnerChange,
        isPartnerModalOpen,
        setIsPartnerModalOpen,
        isRacingModalOpen,
        setIsRacingModalOpen,
        racingIdInput,
        setRacingIdInput,
        racingPasswordInput,
        setRacingPasswordInput,
        bookings,
        isLoadingBookings,
        handleCancelBooking,
        handleInitiateBooking,
        handleRacingCredentialsSubmit,
        submitBooking,
        reservationOpenDate,
        isBookingAlreadyOpen,
        getFilteredTimeSlots,
        isLoadingSlots,
        handleWizardSubmit,
    };
}

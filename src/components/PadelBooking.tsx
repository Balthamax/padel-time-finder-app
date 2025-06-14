import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { calculateReservationOpenDate } from '@/utils/dateUtils';
import { Loader2, Calendar as CalendarIcon, Clock, Send, Layers, User as UserIcon, LogOut, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const timeSlots = Array.from({ length: (22 - 7) * 2 + 1 }, (_, i) => {
    const hours = 7 + Math.floor(i / 2);
    const minutes = (i % 2) * 30;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
});

const PadelBooking = () => {
    const { user, signOut } = useAuth();
    const [profile, setProfile] = useState<{first_name: string, last_name: string} | null>(null);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedCourt, setSelectedCourt] = useState<string>("1");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [partners, setPartners] = useState<[string, string, string]>(['', '', '']);
    const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
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
        } else {
            setProfile(null);
        }
    }, [user]);

    useEffect(() => {
        setStartTime('');
        setEndTime('');
    }, [date, selectedCourt]);
    
    const handleDateChange = (newDate: Date | undefined) => {
        setDate(newDate);
    }

    const handlePartnerChange = (index: number, value: string) => {
        const newPartners = [...partners] as [string, string, string];
        newPartners[index] = value;
        setPartners(newPartners);
    };

    const reservationOpenDate = date ? calculateReservationOpenDate(date) : null;
    const isBookingAlreadyOpen = reservationOpenDate ? reservationOpenDate < new Date() : false;
    
    const submitBooking = async () => {
        if (!date || !startTime || !endTime) {
            toast({
                title: "Sélection incomplète",
                description: "Veuillez choisir une date et des heures de début et de fin.",
                variant: "destructive",
            });
            return;
        }

        if (partners.some(p => p.trim() === '')) {
            toast({
                title: "Noms des partenaires manquants",
                description: "Veuillez renseigner les noms des 3 partenaires.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Booking submitted for:', {
            court: selectedCourt,
            match_date: format(date, 'yyyy-MM-dd'),
            match_time_start: startTime,
            match_time_end: endTime,
            reservation_opens: reservationOpenDate?.toISOString(),
            user_id: user?.id,
            partners,
        });

        toast({
            title: "Pré-réservation validée !",
            description: "Votre demande avec vos partenaires a bien été enregistrée. Ceci est une simulation.",
        });
        setStartTime('');
        setEndTime('');
        setPartners(['', '', '']);
        setIsPartnerModalOpen(false);
        setIsSubmitting(false);
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            
            <header className="text-center mb-8 relative">
                <h1 className="text-4xl font-bold text-primary">PadelBooking</h1>
                <p className="text-muted-foreground">Réservez votre terrain de padel en un clic.</p>
                <div className="absolute top-0 right-0">
                    {user && profile ? (
                        <div className="flex items-center gap-2">
                           <span className="text-sm hidden sm:inline">Bonjour, {profile.first_name}</span>
                           <Button variant="ghost" size="icon" onClick={signOut}>
                               <LogOut className="h-5 w-5" />
                           </Button>
                        </div>
                    ) : null}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><CalendarIcon className="w-5 h-5" /> 1. Choisissez une date</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={handleDateChange}
                                disabled={(d) => d < new Date(new Date().setDate(new Date().getDate() - 1))}
                                className="rounded-md border"
                                locale={fr}
                            />
                        </CardContent>
                    </Card>
                </div>
                
                <div className="space-y-6">
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Layers className="w-5 h-5" /> 2. Terrain souhaité</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup defaultValue={selectedCourt} onValueChange={setSelectedCourt} className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="1" id="padel1" />
                                    <Label htmlFor="padel1">Padel 1</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="2" id="padel2" />
                                    <Label htmlFor="padel2">Padel 2</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="3" id="padel3" />
                                    <Label htmlFor="padel3">Padel 3</Label>
                                </div>
                            </RadioGroup>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                             <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> 3. Choisissez un créneau</CardTitle>
                             <CardDescription>{date ? format(date, 'eeee dd MMMM yyyy', { locale: fr }) : 'Sélectionnez une date.'}</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="start-time">Heure de début</Label>
                                        <Select onValueChange={setStartTime} value={startTime}>
                                            <SelectTrigger id="start-time">
                                                <SelectValue placeholder="HH:MM" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {timeSlots.map(slot => (
                                                    <SelectItem key={`start-${slot}`} value={slot}>{slot}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="end-time">Heure de fin</Label>
                                        <Select onValueChange={setEndTime} value={endTime}>
                                            <SelectTrigger id="end-time">
                                                <SelectValue placeholder="HH:MM" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {timeSlots.map(slot => (
                                                    <SelectItem key={`end-${slot}`} value={slot}>{slot}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {startTime && endTime && date && (
                        <Card className="bg-primary/10 border-primary/30 animate-in fade-in-50 duration-500">
                            <CardHeader><CardTitle>Résumé de la réservation</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                <p><strong>Terrain :</strong> Padel {selectedCourt}</p>
                                <p><strong>Date :</strong> {format(date, 'dd/MM/yyyy')}</p>
                                <p><strong>Heure :</strong> de {startTime} à {endTime}</p>
                                
                                {isBookingAlreadyOpen ? (
                                    <Alert>
                                        <Info className="h-4 w-4" />
                                        <AlertTitle>Information</AlertTitle>
                                        <AlertDescription>
                                            PadelBooking permet d'être les premiers sur les réservations pour les créneaux pas encore disponibles. Pour cette date, les réservations sont déjà ouvertes.
                                            <br />
                                            <a href="https://lagardereparisracing.kirola.fr/users/sign_in" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">
                                                Réservez directement sur le site du Racing.
                                            </a>
                                        </AlertDescription>
                                    </Alert>
                                ) : reservationOpenDate && (
                                    <p className="text-sm text-primary font-semibold">
                                        Ouverture de la réservation le {format(reservationOpenDate, "dd/MM/yyyy 'à' HH:mm", { locale: fr })}
                                    </p>
                                )}

                                <Dialog open={isPartnerModalOpen} onOpenChange={setIsPartnerModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full mt-4" disabled={isBookingAlreadyOpen}>
                                            <UserIcon className="mr-2 h-4 w-4" />
                                            Renseigner le nom de vos partenaires
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Renseigner les partenaires</DialogTitle>
                                            <DialogDescription>
                                                Veuillez renseigner le nom complet de vos 3 partenaires (ex: Jean-Phillipe BERNE). Le nom doit être exact pour que la réservation fonctionne.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            {[0, 1, 2].map((i) => (
                                                <div key={i} className="space-y-2">
                                                    <Label htmlFor={`partner${i + 1}`}>Partenaire {i + 1}</Label>
                                                    <Input
                                                        id={`partner${i + 1}`}
                                                        value={partners[i]}
                                                        onChange={(e) => handlePartnerChange(i, e.target.value)}
                                                        placeholder="Prénom NOM"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={submitBooking} disabled={isSubmitting}>
                                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                                Confirmer la pré-réservation
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
             <footer className="text-center mt-12 text-sm text-muted-foreground">
                <p>⚠️ Les données de disponibilité sont simulées. Connectez ce front-end à votre propre API pour des données réelles.</p>
            </footer>
        </div>
    );
}

export default PadelBooking;

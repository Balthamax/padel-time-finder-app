
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { fetchAvailability, TimeSlot } from '@/services/availabilityService';
import { calculateReservationOpenDate } from '@/utils/dateUtils';
import { Loader2, Calendar as CalendarIcon, Clock, Send, Layers } from 'lucide-react';

const PadelBooking = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | undefined>(undefined);
    const [selectedCourt, setSelectedCourt] = useState<string>("1");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (date) {
            setIsLoading(true);
            setSlots([]);
            setSelectedSlot(undefined);
            fetchAvailability(date, selectedCourt)
                .then(setSlots)
                .finally(() => setIsLoading(false));
        }
    }, [date, selectedCourt]);
    
    const handleDateChange = (newDate: Date | undefined) => {
        setDate(newDate);
    }

    const reservationOpenDate = date && selectedSlot ? calculateReservationOpenDate(date) : null;

    const isWeekend = (d: Date) => {
        const day = d.getDay();
        return day === 6 || day === 0; // Samedi ou Dimanche
    };

    const handleBooking = async () => {
        if (!date || !selectedSlot) {
            toast({
                title: "Sélection incomplète",
                description: "Veuillez choisir une date et un créneau.",
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
            match_time: selectedSlot.time,
            reservation_opens: reservationOpenDate?.toISOString(),
        });

        toast({
            title: "Réservation validée !",
            description: "Ceci est une simulation. Aucune vraie réservation n'a été faite.",
        });
        setSelectedSlot(undefined);
        setIsSubmitting(false);
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-primary">PadelBooking</h1>
                <p className="text-muted-foreground">Réservez votre terrain de padel en un clic.</p>
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
                            {isLoading ? (
                                <div className="flex justify-center items-center h-40"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                            ) : date && isWeekend(date) ? (
                                <div className="text-center text-muted-foreground p-4 bg-muted rounded-md">Les réservations pour le week-end se font sur place.</div>
                            ) : slots.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {slots.map(slot => (
                                        <Button
                                            key={slot.time}
                                            variant={selectedSlot?.time === slot.time ? 'default' : (slot.available ? 'outline' : 'secondary')}
                                            disabled={!slot.available}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`transition-all duration-200 ${!slot.available ? 'cursor-not-allowed text-muted-foreground' : ''} ${selectedSlot?.time === slot.time ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
                                        >
                                            {slot.time}
                                        </Button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground p-4">Aucun créneau disponible.</div>
                            )}
                        </CardContent>
                    </Card>

                    {selectedSlot && date && (
                        <Card className="bg-primary/10 border-primary/30 animate-in fade-in-50 duration-500">
                            <CardHeader><CardTitle>Résumé de la réservation</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                <p><strong>Terrain :</strong> Padel {selectedCourt}</p>
                                <p><strong>Date :</strong> {format(date, 'dd/MM/yyyy')}</p>
                                <p><strong>Heure :</strong> {selectedSlot.time}</p>
                                {reservationOpenDate && (
                                    <p className="text-sm text-primary font-semibold">
                                        Ouverture de la réservation le {format(reservationOpenDate, "dd/MM/yyyy 'à' HH:mm", { locale: fr })}
                                    </p>
                                )}
                                <Button className="w-full mt-4" onClick={handleBooking} disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                    Valider cette réservation
                                </Button>
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

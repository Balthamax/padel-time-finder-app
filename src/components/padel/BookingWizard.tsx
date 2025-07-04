
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Layers, Clock, Rocket, Loader2, RotateCcw } from 'lucide-react';

interface BookingWizardProps {
    date: Date | undefined;
    onDateChange: (date: Date | undefined) => void;
    selectedCourt: string;
    onCourtChange: (court: string) => void;
    startTime: string;
    onStartTimeChange: (time: string) => void;
    availableSlots: string[];
    isLoadingSlots: boolean;
    onSubmit: () => void;
    isBookingAlreadyOpen: boolean;
    reservationOpenDate: Date | null;
}

const BookingWizard = ({
    date,
    onDateChange,
    selectedCourt,
    onCourtChange,
    startTime,
    onStartTimeChange,
    availableSlots,
    isLoadingSlots,
    onSubmit,
    isBookingAlreadyOpen,
    reservationOpenDate
}: BookingWizardProps) => {
    const [currentStep, setCurrentStep] = useState(1);

    // Auto-advance logic
    useEffect(() => {
        if (date && currentStep === 1) {
            setCurrentStep(2);
        }
    }, [date, currentStep]);

    useEffect(() => {
        if (selectedCourt && currentStep === 2) {
            setCurrentStep(3);
        }
    }, [selectedCourt, currentStep]);

    const handleDateSelect = (newDate: Date | undefined) => {
        onDateChange(newDate);
    };

    const handleCourtSelect = (court: string) => {
        onCourtChange(court);
    };

    const handleReset = () => {
        onDateChange(undefined);
        onCourtChange('');
        onStartTimeChange('');
        setCurrentStep(1);
    };

    const handleEditStep = (step: number) => {
        setCurrentStep(step);
    };

    const canShowFinalButton = date && selectedCourt && startTime;

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between gap-4">
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold flex-1 min-w-0">
                        <Rocket className="w-5 h-5 flex-shrink-0" />
                        <span className="truncate">Programmer une réservation</span>
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleReset}
                        className="h-8 w-8 flex-shrink-0"
                        title="Réinitialiser"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Étape 1: Date */}
                <div className={currentStep === 1 ? '' : 'opacity-75'}>
                    <div className="flex items-center gap-2 mb-3">
                        <CalendarIcon className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold">
                            {currentStep === 1 ? '1. Choisissez une date' : (
                                <button 
                                    onClick={() => handleEditStep(1)}
                                    className="text-left hover:underline"
                                >
                                    Date: {date ? format(date, 'dd/MM/yyyy', { locale: fr }) : ''}
                                </button>
                            )}
                        </h3>
                    </div>
                    {currentStep === 1 && (
                        <div className="flex justify-center">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={handleDateSelect}
                                disabled={(d) => d < new Date(new Date().setDate(new Date().getDate() - 1))}
                                className="rounded-md border"
                                locale={fr}
                            />
                        </div>
                    )}
                </div>

                {/* Étape 2: Terrain */}
                {currentStep >= 2 && (
                    <div className={currentStep === 2 ? '' : 'opacity-75'}>
                        <div className="flex items-center gap-2 mb-3">
                            <Layers className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold">
                                {currentStep === 2 ? '2. Terrain souhaité' : (
                                    <button 
                                        onClick={() => handleEditStep(2)}
                                        className="text-left hover:underline"
                                    >
                                        Terrain: Padel {selectedCourt}
                                    </button>
                                )}
                            </h3>
                        </div>
                        {currentStep === 2 && (
                            <RadioGroup 
                                value={selectedCourt} 
                                onValueChange={handleCourtSelect} 
                                className="flex flex-col sm:flex-row sm:justify-center gap-4"
                            >
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
                        )}
                    </div>
                )}

                {/* Étape 3: Créneau */}
                {currentStep >= 3 && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold">
                                3. Choisissez un créneau
                                {isLoadingSlots && <Loader2 className="w-4 h-4 animate-spin inline ml-2" />}
                            </h3>
                        </div>
                        {date && (
                            <p className="text-sm text-muted-foreground mb-3">
                                {format(date, 'eeee dd MMMM yyyy', { locale: fr })}
                            </p>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="time-select">Heure de début</Label>
                            <Select onValueChange={onStartTimeChange} value={startTime} disabled={isLoadingSlots}>
                                <SelectTrigger id="time-select">
                                    <SelectValue placeholder={isLoadingSlots ? "Chargement..." : "HH:MM"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableSlots.length > 0 ? (
                                        availableSlots.map(slot => (
                                            <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                        ))
                                    ) : (
                                        !isLoadingSlots && (
                                            <SelectItem value="no-slots" disabled>
                                                Aucun créneau disponible
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {/* Bouton final */}
                {canShowFinalButton && (
                    <div className="pt-4 border-t">
                        {isBookingAlreadyOpen ? (
                            <div className="space-y-3">
                                <p className="text-sm text-orange-600 text-center">
                                    Les réservations sont déjà ouvertes pour cette date.
                                </p>
                                <Button asChild className="w-full" variant="outline">
                                    <a 
                                        href="https://racing-connect.com/booking" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2"
                                    >
                                        Réserver sur le site du Racing
                                    </a>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {reservationOpenDate && (
                                    <p className="text-sm text-primary font-semibold text-center">
                                        Ouverture le {format(reservationOpenDate, "dd/MM/yyyy 'à' HH:mm", { locale: fr })}
                                    </p>
                                )}
                                <Button onClick={onSubmit} className="w-full" size="lg">
                                    <Rocket className="mr-2 h-5 w-5" />
                                    Programmer la réservation
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default BookingWizard;

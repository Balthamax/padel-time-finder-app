
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info, User as UserIcon } from 'lucide-react';

interface BookingSummaryProps {
    date: Date;
    startTime: string;
    endTime: string;
    selectedCourt: string;
    isBookingAlreadyOpen: boolean;
    reservationOpenDate: Date | null;
    onOpenPartnerModal: () => void;
}

const BookingSummary = ({
    date,
    startTime,
    endTime,
    selectedCourt,
    isBookingAlreadyOpen,
    reservationOpenDate,
    onOpenPartnerModal,
}: BookingSummaryProps) => {
    return (
        <Card className="bg-primary/10 border-primary/30 animate-in fade-in-50 duration-500">
            <CardHeader><CardTitle>Résumé de la réservation</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                <p><strong>Terrain :</strong> Padel {selectedCourt}</p>
                <p><strong>Date :</strong> {format(date, 'yyyy-MM-dd')}</p>
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

                <Button className="w-full mt-4" disabled={isBookingAlreadyOpen} onClick={onOpenPartnerModal}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    Renseigner le nom de vos partenaires
                </Button>
            </CardContent>
        </Card>
    );
};

export default BookingSummary;

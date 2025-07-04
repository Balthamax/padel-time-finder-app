
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Clock, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeCardProps {
    date: Date | undefined;
    startTime: string;
    onStartTimeChange: (time: string) => void;
    availableSlots: string[];
    isLoadingSlots: boolean;
}

const TimeCard = ({ date, startTime, onStartTimeChange, availableSlots, isLoadingSlots }: TimeCardProps) => (
    <Card>
        <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" /> 
                3. Choisissez un créneau
                {isLoadingSlots && <Loader2 className="w-4 h-4 animate-spin" />}
             </CardTitle>
             <CardDescription>{date ? format(date, 'eeee dd MMMM yyyy', { locale: fr }) : 'Sélectionnez une date.'}</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="space-y-4">
                <div>
                    <Label htmlFor="start-time">Heure de début</Label>
                    <Select onValueChange={onStartTimeChange} value={startTime} disabled={isLoadingSlots || !date}>
                        <SelectTrigger id="start-time">
                            <SelectValue placeholder={isLoadingSlots ? "Chargement..." : "HH:MM"} />
                        </SelectTrigger>
                        <SelectContent>
                            {availableSlots.length > 0 ? (
                                availableSlots.map(slot => (
                                    <SelectItem key={`start-${slot}`} value={slot}>{slot}</SelectItem>
                                ))
                            ) : (
                                !isLoadingSlots && date && (
                                    <SelectItem value="" disabled>
                                        Aucun créneau disponible
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </CardContent>
    </Card>
);

export default TimeCard;

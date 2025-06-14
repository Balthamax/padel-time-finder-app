
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const timeSlots = Array.from({ length: (22 - 7) * 2 + 1 }, (_, i) => {
    const hours = 7 + Math.floor(i / 2);
    const minutes = (i % 2) * 30;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
});

interface TimeCardProps {
    date: Date | undefined;
    startTime: string;
    onStartTimeChange: (time: string) => void;
    endTime: string;
    onEndTimeChange: (time: string) => void;
}

const TimeCard = ({ date, startTime, onStartTimeChange, endTime, onEndTimeChange }: TimeCardProps) => (
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
                        <Select onValueChange={onStartTimeChange} value={startTime}>
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
                        <Select onValueChange={onEndTimeChange} value={endTime}>
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
);

export default TimeCard;


import { fr } from 'date-fns/locale';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon } from 'lucide-react';

interface DateCardProps {
    date: Date | undefined;
    onDateChange: (date: Date | undefined) => void;
}

const DateCard = ({ date, onDateChange }: DateCardProps) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarIcon className="w-5 h-5" /> 1. Choisissez une date</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
            <Calendar
                mode="single"
                selected={date}
                onSelect={onDateChange}
                disabled={(d) => d < new Date(new Date().setDate(new Date().getDate() - 1))}
                className="rounded-md border"
                locale={fr}
            />
        </CardContent>
    </Card>
);

export default DateCard;

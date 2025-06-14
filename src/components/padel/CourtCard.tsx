
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Layers } from 'lucide-react';

interface CourtCardProps {
    selectedCourt: string;
    onCourtChange: (court: string) => void;
}

const CourtCard = ({ selectedCourt, onCourtChange }: CourtCardProps) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Layers className="w-5 h-5" /> 2. Terrain souhaité</CardTitle>
        </CardHeader>
        <CardContent>
            <RadioGroup value={selectedCourt} onValueChange={onCourtChange} className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
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
);

export default CourtCard;

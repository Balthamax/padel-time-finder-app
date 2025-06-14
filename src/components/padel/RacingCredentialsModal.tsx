
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface RacingCredentialsModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    racingId: string;
    setRacingId: (value: string) => void;
    racingPassword: string;
    setRacingPassword: (value: string) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

const RacingCredentialsModal = ({
    isOpen,
    onOpenChange,
    racingId,
    setRacingId,
    racingPassword,
    setRacingPassword,
    onSubmit,
    isSubmitting,
}: RacingCredentialsModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Informations de connexion Racing</DialogTitle>
                    <DialogDescription>
                        Ces informations sont nécessaires car la réservation du créneau se fait automatiquement via une connexion à votre portail de réservation. Elles seront enregistrées pour vos prochaines réservations.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="racing-id">Identifiant Lagardère Paris Racing</Label>
                        <Input
                            id="racing-id"
                            value={racingId}
                            onChange={(e) => setRacingId(e.target.value)}
                            placeholder="Votre identifiant"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="racing-password">Mot de passe Lagardère Paris Racing</Label>
                        <Input
                            id="racing-password"
                            type="password"
                            value={racingPassword}
                            onChange={(e) => setRacingPassword(e.target.value)}
                            placeholder="Votre mot de passe"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={onSubmit} disabled={isSubmitting || !racingId || !racingPassword}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Enregistrer et continuer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RacingCredentialsModal;

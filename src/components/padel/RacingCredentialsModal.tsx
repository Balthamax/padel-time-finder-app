
import { useState } from "react";
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
import { Loader2, Eye, EyeOff } from "lucide-react";

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
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Informations de connexion Racing</DialogTitle>
                    <DialogDescription>
                        Ce sont vos identifiants pour vous connecter à votre espace membre du Racing. Ils seront utilisés pour se connecter au <a href="https://lagardereparisracing.kirola.fr/users/sign_in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">site de réservation du club</a> et y effectuer la réservation automatiquement. Vos identifiants seront enregistrés de manière sécurisée pour vos prochaines utilisations.
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
                        <div className="relative">
                            <Input
                                id="racing-password"
                                type={showPassword ? "text" : "password"}
                                value={racingPassword}
                                onChange={(e) => setRacingPassword(e.target.value)}
                                placeholder="Votre mot de passe"
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute inset-y-0 right-0 text-muted-foreground"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
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

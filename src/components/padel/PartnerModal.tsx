
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from 'lucide-react';

interface PartnerModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    partners: [string, string, string];
    onPartnerChange: (index: number, value: string) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

const PartnerModal = ({
    isOpen,
    onOpenChange,
    partners,
    onPartnerChange,
    onSubmit,
    isSubmitting
}: PartnerModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                                onChange={(e) => onPartnerChange(i, e.target.value)}
                                placeholder="Prénom NOM"
                            />
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button onClick={onSubmit} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Confirmer la pré-réservation
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PartnerModal;

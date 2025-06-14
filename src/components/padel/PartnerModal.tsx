
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from 'lucide-react';
import type { Partner } from "@/hooks/usePadelBooking";

interface PartnerModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    partners: [Partner, Partner, Partner];
    onPartnerChange: (index: number, field: 'first_name' | 'last_name', value: string) => void;
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
            <DialogContent className="sm:max-w-[425px] md:sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Renseigner les partenaires</DialogTitle>
                    <DialogDescription>
                        Ces informations serviront à faire les réservations sur la plateforme de réservation du club.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="space-y-3 p-4 border rounded-md bg-muted/20">
                             <h4 className="font-medium text-sm">Partenaire {i + 1}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`partner${i + 1}-first`}>Prénom</Label>
                                    <Input
                                        id={`partner${i + 1}-first`}
                                        value={partners[i].first_name}
                                        onChange={(e) => onPartnerChange(i, 'first_name', e.target.value)}
                                        placeholder="Jean-Philippe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`partner${i + 1}-last`}>Nom</Label>
                                    <Input
                                        id={`partner${i + 1}-last`}
                                        value={partners[i].last_name}
                                        onChange={(e) => onPartnerChange(i, 'last_name', e.target.value)}
                                        placeholder="BERNE"
                                    />
                                </div>
                            </div>
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

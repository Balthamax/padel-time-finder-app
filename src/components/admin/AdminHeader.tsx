
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import Navigation from "@/components/Navigation";
import MainNavigation from "@/components/MainNavigation";
import type { User } from '@supabase/supabase-js';

interface AdminHeaderProps {
    user: User | null;
    onSignOut: () => void;
}

const AdminHeader = ({ user, onSignOut }: AdminHeaderProps) => {
    return (
        <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <Navigation />
                    <MainNavigation />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm">Admin: {user?.email}</span>
                    <Button variant="ghost" size="icon" onClick={onSignOut} title="Déconnexion">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>
            <div className="text-center">
                <h1 className="text-4xl font-bold text-primary">Administration PadelBooking</h1>
                <p className="text-muted-foreground">Interface de gestion des utilisateurs et réservations</p>
            </div>
        </header>
    );
};

export default AdminHeader;

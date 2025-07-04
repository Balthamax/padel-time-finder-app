
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User as UserIcon, LogOut } from 'lucide-react';
import Navigation from "@/components/Navigation";
import MainNavigation from "@/components/MainNavigation";
import type { User } from '@supabase/supabase-js';

interface PageHeaderProps {
    user: User | null;
    profile: { first_name: string; } | null;
    onSignOut: () => void;
}

const PageHeader = ({ user, profile, onSignOut }: PageHeaderProps) => {
    return (
        <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <Navigation />
                    <MainNavigation />
                </div>
                {user && profile ? (
                    <div className="flex items-center gap-2">
                       <span className="text-sm hidden sm:inline">Bonjour, {profile.first_name}</span>
                        <Button asChild variant="ghost" size="icon" title="Mon profil">
                            <Link to="/profile">
                                <UserIcon className="h-5 w-5" />
                            </Link>
                        </Button>
                       <Button variant="ghost" size="icon" onClick={onSignOut} title="Déconnexion">
                           <LogOut className="h-5 w-5" />
                       </Button>
                    </div>
                ) : null}
            </div>
            <div className="text-center">
                <h1 className="text-4xl font-bold text-primary">PadelBooking</h1>
                <p className="text-muted-foreground">Réservez votre terrain de padel en un clic.</p>
            </div>
        </header>
    );
};

export default PageHeader;


import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User as UserIcon, LogOut, Settings } from 'lucide-react';
import Navigation from "@/components/Navigation";
import { useUserRole } from "@/hooks/useUserRole";
import type { User } from '@supabase/supabase-js';

interface PageHeaderProps {
    user: User | null;
    profile: { first_name: string; } | null;
    onSignOut: () => void;
}

const PageHeader = ({ user, profile, onSignOut }: PageHeaderProps) => {
    const { isAdmin } = useUserRole();

    return (
        <header className="text-center mb-8 relative">
            <div className="absolute left-0 top-0">
                <Navigation />
            </div>
            <h1 className="text-4xl font-bold text-primary">PadelBooking</h1>
            <p className="text-muted-foreground">Réservez votre terrain de padel en un clic.</p>
            <div className="absolute top-0 right-0">
                {user && profile ? (
                    <div className="flex items-center gap-2">
                       <span className="text-sm hidden sm:inline">Bonjour, {profile.first_name}</span>
                        {isAdmin && (
                            <Button asChild variant="ghost" size="icon" title="Console d'administration">
                                <Link to="/admin">
                                    <Settings className="h-5 w-5" />
                                </Link>
                            </Button>
                        )}
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
        </header>
    );
};

export default PageHeader;

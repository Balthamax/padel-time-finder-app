
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Settings, User, Home } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/contexts/AuthContext';

const MainNavigation = () => {
  const { isAdmin } = useUserRole();
  const { user } = useAuth();
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Accueil',
      href: '/',
      icon: Home,
      showWhen: 'always' as const,
    },
    {
      label: 'Réservations',
      href: '/booking',
      icon: Calendar,
      showWhen: 'authenticated' as const,
    },
    {
      label: 'Administration',
      href: '/admin',
      icon: Settings,
      showWhen: 'admin' as const,
    },
    {
      label: 'Profil',
      href: '/profile',
      icon: User,
      showWhen: 'authenticated' as const,
    }
  ];

  const isActive = (href: string) => location.pathname === href;

  const shouldShowItem = (showWhen: string) => {
    switch (showWhen) {
      case 'always':
        return true;
      case 'authenticated':
        return !!user;
      case 'admin':
        return isAdmin;
      default:
        return false;
    }
  };

  return (
    <nav className="hidden md:flex items-center space-x-2">
      {navigationItems
        .filter(item => shouldShowItem(item.showWhen))
        .map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.href}
              asChild
              variant={isActive(item.href) ? "default" : "ghost"}
              size="sm"
            >
              <Link to={item.href} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          );
        })}
    </nav>
  );
};

export default MainNavigation;

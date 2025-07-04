
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Calendar, Settings, User } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin } = useUserRole();
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Réservations',
      href: '/booking',
      icon: Calendar,
    },
    ...(isAdmin ? [
      {
        label: 'Administration',
        href: '/admin',
        icon: Settings,
      }
    ] : []),
    {
      label: 'Profil',
      href: '/profile',
      icon: User,
    }
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Ouvrir le menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default Navigation;

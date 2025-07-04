
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthPopup } from "@/components/AuthPopup";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);

  const handleStart = () => {
    if (user) {
      navigate("/booking");
    } else {
      setIsAuthPopupOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    navigate("/booking");
  };

  return (
    <main className="container mx-auto flex flex-col items-center justify-center min-h-screen text-center p-4">
      <div className="max-w-2xl">
        <div className="mb-8">
          <img 
            src="/lovable-uploads/9bbb7e4d-9f5c-42af-8d5d-bd373ba411f9.png" 
            alt="Logo Arkavia" 
            className="mx-auto mb-4 h-16 w-auto"
          />
        </div>
        <h1 className="text-5xl font-bold text-primary mb-4">PadelBooking</h1>
        <p className="text-xl text-muted-foreground mb-8">
          La plateforme qui aide les amis du Racing à réserver leurs terrains de padel simplement et rapidement.
        </p>
        <Button onClick={handleStart} size="lg">
          Commencer
        </Button>
        <footer className="mt-16 text-sm text-muted-foreground">
          <p>Développé par les équipes d'Arkavia - cabinet de conseil en transformation digitale.</p>
        </footer>
      </div>
      <AuthPopup
        open={isAuthPopupOpen}
        onOpenChange={setIsAuthPopupOpen}
        onSuccess={handleAuthSuccess}
      />
    </main>
  );
};

export default Index;


import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <main className="container mx-auto flex flex-col items-center justify-center min-h-screen text-center p-4">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-bold text-primary mb-4">PadelBooking</h1>
        <p className="text-xl text-muted-foreground mb-8">
          La plateforme qui aide les amis du Racing à réserver leurs terrains de padel simplement et rapidement.
        </p>
        <Button asChild size="lg">
          <Link to="/booking">Commencer</Link>
        </Button>
        <footer className="mt-16 text-sm text-muted-foreground">
          <p>Développé par les équipes d'Arkavia - cabinet de conseil en IA.</p>
        </footer>
      </div>
    </main>
  );
};

export default Index;

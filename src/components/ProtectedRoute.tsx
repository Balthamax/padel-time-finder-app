
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

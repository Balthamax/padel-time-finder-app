
-- Créer un type enum pour les rôles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Créer une table pour gérer les rôles des utilisateurs
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Activer Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Fonction pour vérifier si un utilisateur a un rôle spécifique
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Politique pour que les utilisateurs puissent voir leur propre rôle
CREATE POLICY "Users can view their own role"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Politique pour que les admins puissent voir tous les rôles
CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Insérer le rôle admin pour votre compte
-- Note: Cette commande devra être exécutée après que vous vous soyez connecté au moins une fois
-- pour que votre user_id soit disponible dans auth.users
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'maxime.gaultier@icloud.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Modifier les politiques des profils pour que les admins puissent tout voir
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Modifier les politiques des réservations pour que les admins puissent tout voir
CREATE POLICY "Admins can view all bookings"
  ON public.bookings
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

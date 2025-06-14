
-- Création de la table pour stocker les partenaires
CREATE TABLE public.partenaires (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajout d'une contrainte pour éviter les doublons de partenaires pour un même utilisateur
ALTER TABLE public.partenaires ADD CONSTRAINT user_partner_unique UNIQUE (user_id, first_name, last_name);

-- Activation de la sécurité au niveau des lignes (RLS)
ALTER TABLE public.partenaires ENABLE ROW LEVEL SECURITY;

-- Politique de sécurité pour que les utilisateurs ne voient que leurs propres partenaires
CREATE POLICY "Users can view their own partners"
ON public.partenaires FOR SELECT
USING (auth.uid() = user_id);

-- Politique de sécurité pour que les utilisateurs ne puissent ajouter que leurs propres partenaires
CREATE POLICY "Users can insert their own partners"
ON public.partenaires FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Politique de sécurité pour que les utilisateurs ne puissent mettre à jour que leurs propres partenaires
CREATE POLICY "Users can update their own partners"
ON public.partenaires FOR UPDATE
USING (auth.uid() = user_id);

-- Politique de sécurité pour que les utilisateurs ne puissent supprimer que leurs propres partenaires
CREATE POLICY "Users can delete their own partners"
ON public.partenaires FOR DELETE
USING (auth.uid() = user_id);

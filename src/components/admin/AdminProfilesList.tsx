
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, User } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

interface AdminProfilesListProps {
  profiles: Tables<'profiles'>[];
  loading: boolean;
}

const AdminProfilesList = ({ profiles, loading }: AdminProfilesListProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Chargement des profils...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Profils Utilisateurs ({profiles.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {profiles.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Aucun profil trouvé.</p>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Racing ID</TableHead>
                  <TableHead>Dernière mise à jour</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">
                      {profile.first_name || 'Non renseigné'}
                    </TableCell>
                    <TableCell>
                      {profile.last_name || 'Non renseigné'}
                    </TableCell>
                    <TableCell>
                      {profile.racing_id || 'Non renseigné'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {profile.updated_at 
                        ? new Date(profile.updated_at).toLocaleDateString('fr-FR')
                        : 'Jamais'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminProfilesList;

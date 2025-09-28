'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, User, Mail, MapPin, Calendar, Shield, XCircle, Edit, MoreVertical,
} from 'lucide-react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';

const UserDetailPage = () => {
  const { userId } = useParams();
  const router = useRouter();

  // Simulated user data - replace with fetch logic by userId if needed
  const [userData, setUserData] = useState({
    user_name: 'steve.fotso@efspa.edu',
    email: 'stevenho@yopmail.com',
    first_name: 'STEVE',
    gender: 'MALE',
    last_name: 'FOTSO',
    other_email: null,
    other_phone: null,
    phone_number: '698523673',
    country: null,
    city: null,
    street: null,
    address_details: null,
    status_code: 'ACTIVE',
    avatar_url: null,
    place_of_birth: null,
    date_of_birth: null,
    ethnicity_code: null,
    marital_status_code: null,
    cni_number: null,
    cni_issue_date: null,
    cni_issue_location: null,
    is_verified: 0,
    created_at: 1755877579,
    updated_at: 1755877579,
    last_login_at: null,
    user_code: 'USER123', // added this as you use it in JSX
  });

  // You can fetch user data by userId here with useEffect
  useEffect(() => {
    console.log('Load user data for userId:', userId);
    // fetch(`/api/users/${userId}`).then(...) to setUserData
  }, [userId]);

  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleBack = () => {
    router.push('/admin/users');
  };

  const formatTimestamp = (timestamp: number) => {
    if (!timestamp) return 'Non renseigné';
    return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'SUSPENDED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (statusCode: string) => {
    switch (statusCode) {
      case 'ACTIVE':
        return 'Actif';
      case 'INACTIVE':
        return 'Inactif';
      case 'SUSPENDED':
        return 'Suspendu';
      default:
        return statusCode;
    }
  };

  const handleEdit = () => {
    console.log('Modifier utilisateur');
  };

  const handleDeactivate = async () => {
    setProcessing(true);
    try {
      console.log("Désactivation de l'utilisateur");
      setDeactivateDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la désactivation', error);
    } finally {
      setProcessing(false);
    }
  };

  const canEdit = () => userData.status_code === 'ACTIVE';
  const canDeactivate = () => userData.status_code === 'ACTIVE';

  return (
    <div className="min-h-screen">
      <div className="mx-auto space-y-6">
        {/* Header section */}
        <div className="bg-white border-b border-gray-200 -mx-6 -mt-6 px-6 py-4">
  <div className="flex items-center justify-between flex-wrap gap-3">
    {/* Partie gauche */}
    <div className="flex items-center flex-wrap gap-3 min-w-0 flex-1">
      <Button variant="ghost" size="sm" onClick={handleBack} className="hover:bg-gray-100 shrink-0">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Utilisateurs
      </Button>
      
      <Separator orientation="vertical" className="h-6 shrink-0" />
      
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold text-gray-900 truncate">
          {userData.first_name} {userData.last_name}
        </h1>
      </div>
      
      <Separator orientation="vertical" className="h-6 shrink-0" />
      
      <div className="flex items-center space-x-3 shrink-0">
        <Badge className={getStatusColor(userData.status_code)}>
          {getStatusLabel(userData.status_code)}
        </Badge>
      </div>
    </div>

    {/* Partie droite */}
    <div className="flex items-center space-x-3 shrink-0">
      {canEdit() && (
        <Button onClick={handleEdit} variant="outline" className="shrink-0">
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      )}

      {canDeactivate() && (
        <Dialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0">
              <XCircle className="h-4 w-4 mr-2" />
              Désactiver
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Désactiver l'utilisateur</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir désactiver cet utilisateur ? Cette action peut être annulée ultérieurement.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeactivateDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleDeactivate}
                disabled={processing}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirmer la désactivation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Button variant="ghost" size="sm" className="shrink-0">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </div>
  </div>
</div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Informations personnelles */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-600" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Prénom</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-medium">{userData.first_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Nom de famille</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-medium">{userData.last_name}</dd>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Genre</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userData.gender === 'MALE' ? 'Masculin' : 'Féminin'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date de naissance</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userData.date_of_birth || 'Non renseigné'}</dd>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Lieu de naissance</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userData.place_of_birth || 'Non renseigné'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">État civil</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userData.marital_status_code || 'Non renseigné'}</dd>
                </div>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Ethnie</dt>
                <dd className="mt-1 text-sm text-gray-900">{userData.ethnicity_code || 'Non renseigné'}</dd>
              </div>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gray-600" />
                Coordonnées
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email principal</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">{userData.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email secondaire</dt>
                <dd className="mt-1 text-sm text-gray-900">{userData.other_email || 'Non renseigné'}</dd>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Téléphone principal</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userData.phone_number || 'Non renseigné'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Téléphone secondaire</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userData.other_phone || 'Non renseigné'}</dd>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adresse */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-gray-600" />
                Adresse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Pays</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userData.country || 'Non renseigné'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Ville</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userData.city || 'Non renseigné'}</dd>
                </div>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Rue</dt>
                <dd className="mt-1 text-sm text-gray-900">{userData.street || 'Non renseigné'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Détails de l'adresse</dt>
                <dd className="mt-1 text-sm text-gray-900">{userData.address_details || 'Non renseigné'}</dd>
              </div>
            </CardContent>
          </Card>

          {/* Pièce d'identité */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-gray-600" />
                Pièce d'identité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Numéro CNI</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{userData.cni_number || 'Non renseigné'}</dd>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date d'émission</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userData.cni_issue_date || 'Non renseigné'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Lieu d'émission</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userData.cni_issue_location || 'Non renseigné'}</dd>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informations système */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-600" />
              Informations système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Nom d'utilisateur</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{userData.user_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Code utilisateur</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono text-xs">{userData.user_code || 'Non renseigné'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Statut</dt>
                <dd className="mt-1">
                  <Badge className={getStatusColor(userData.status_code)}>
                    {getStatusLabel(userData.status_code)}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Date de création</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatTimestamp(userData.created_at)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Dernière mise à jour</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatTimestamp(userData.updated_at)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Dernière connexion</dt>
                <dd className="mt-1 text-sm text-gray-900">{userData.last_login_at && formatTimestamp(userData.last_login_at)}</dd>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDetailPage;

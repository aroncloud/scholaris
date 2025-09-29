/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, User, Mail, MapPin, Calendar, Shield, XCircle, Edit, MoreVertical, Trash2
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserData } from '@/hooks/feature/users/useUserData';
import { getStatusColor } from '@/lib/utils';
import { DialogUpdateUser } from '@/components/features/users/Modal/DialogUpdateUser';
import { IUpdateUserForm } from '@/types/staffType';

const UserDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  
  const { 
    fetchUserDetail, 
    userDetail, 
    loading,
    handleDesactivateUser,
    handleDeleteUser,
    handleUpdateUser
  } = useUserData();

  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserDetail(userId);
    }
  }, [userId]);

  const handleBack = () => {
    router.push('/admin/users');
  };

  const handleEdit = () => {
    setUpdateDialogOpen(true);
  };

  const handleDeactivate = async () => {
    if (!userDetail) return;
    
    setProcessing(true);
    try {
      const result = await handleDesactivateUser(userDetail.user_code);
      if (result.success) {
        setDeactivateDialogOpen(false);
        // Refresh user data
        await fetchUserDetail(userId);
      }
    } catch (error) {
      console.error('Error deactivating user:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!userDetail) return;
    
    setProcessing(true);
    try {
      const result = await handleDeleteUser(userDetail.user_code);
      if (result.success) {
        setDeleteDialogOpen(false);
        router.push('/admin/users');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setProcessing(false);
    }
  };


  const canEdit = () => {
    return userDetail && userDetail.status_code === 'ACTIVE';
  };

  const canDeactivate = () => {
    return userDetail && userDetail.status_code === 'ACTIVE';
  };

  const canDelete = () => {
    return userDetail && userDetail.status_code === 'INACTIVE';
  };

  const formatTimestamp = (timestamp: number | null) => {
    if (!timestamp) return 'Non disponible';
    return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const updateUser = async (data: IUpdateUserForm) => {
    console.log('Update data received:', data);

    return false
    if(userDetail){
      const result = await handleUpdateUser(data, userDetail.user_code);
      console.log('Update result:', result);
      if(result.success) {
        
      }
      return false
    } else {
      return true
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header Skeleton */}
          <div className="bg-white border-b border-gray-200 -mx-6 -mt-6 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-24" />
                <Separator orientation="vertical" className="h-6" />
                <Skeleton className="h-8 w-48" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
          
          {/* Content Skeleton */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!userDetail && loading == false) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Utilisateur introuvable</h2>
          <p className="text-gray-600 mt-2">L&apos;utilisateur demandé n&apos;existe pas ou a été supprimé.</p>
          <Button onClick={handleBack} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      {userDetail &&
        <div className="mx-auto max-w-7xl space-y-6">
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
                    {userDetail.first_name} {userDetail.last_name}
                  </h1>
                </div>
                
                <Separator orientation="vertical" className="h-6 shrink-0" />
                
                <div className="flex items-center space-x-3 shrink-0">
                  <Badge className={getStatusColor(userDetail.status_code)}>
                    {userDetail.status_code}
                  </Badge>
                  {userDetail.is_verified === 1 && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Vérifié
                    </Badge>
                  )}
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
                        <DialogTitle>Désactiver l&apos;utilisateur</DialogTitle>
                        <DialogDescription>
                          Êtes-vous sûr de vouloir désactiver cet utilisateur ? Cette action peut être annulée ultérieurement.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDeactivateDialogOpen(false)} disabled={processing}>
                          Annuler
                        </Button>
                        <Button
                          onClick={handleDeactivate}
                          disabled={processing}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          {processing ? 'Traitement...' : 'Confirmer la désactivation'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEdit} disabled={!canEdit()}>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {canDelete() && (
                      <DropdownMenuItem 
                        onClick={() => setDeleteDialogOpen(true)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer définitivement
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
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
                    <dd className="mt-1 text-sm text-gray-900 font-medium">{userDetail.first_name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nom de famille</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-medium">{userDetail.last_name}</dd>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Genre</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {userDetail.gender === 'MALE' ? 'Masculin' : userDetail.gender === 'FEMALE' ? 'Féminin' : userDetail.gender || 'Non renseigné'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date de naissance</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {userDetail.date_of_birth ? formatTimestamp(userDetail.date_of_birth) : 'Non renseigné'}
                    </dd>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Lieu de naissance</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userDetail.place_of_birth || 'Non renseigné'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">État civil</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userDetail.marital_status_code || 'Non renseigné'}</dd>
                  </div>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Ethnie</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userDetail.ethnicity_code || 'Non renseigné'}</dd>
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
                  <dd className="mt-1 text-sm text-gray-900 font-medium">{userDetail.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email secondaire</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userDetail.other_email || 'Non renseigné'}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Téléphone principal</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userDetail.phone_number || 'Non renseigné'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Téléphone secondaire</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userDetail.other_phone || 'Non renseigné'}</dd>
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
                    <dd className="mt-1 text-sm text-gray-900">{userDetail.country || 'Non renseigné'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Ville</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userDetail.city || 'Non renseigné'}</dd>
                  </div>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Rue</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userDetail.street || 'Non renseigné'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Détails de l&apos;adresse</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userDetail.address_details || 'Non renseigné'}</dd>
                </div>
              </CardContent>
            </Card>

            {/* Pièce d'identité */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-gray-600" />
                  Pièce d&apos;identité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Numéro CNI</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{userDetail.cni_number || 'Non renseigné'}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date d&apos;émission</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {userDetail.cni_issue_date ? formatTimestamp(userDetail.cni_issue_date) : 'Non renseigné'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Lieu d&apos;émission</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userDetail.cni_issue_location || 'Non renseigné'}</dd>
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
                  <dt className="text-sm font-medium text-gray-500">Nom d&apos;utilisateur</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{userDetail.user_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Code utilisateur</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{userDetail.user_code || 'Non renseigné'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Statut</dt>
                  <dd className="mt-1">
                    <Badge className={getStatusColor(userDetail.status_code)}>
                      {userDetail.status_code}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date de création</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatTimestamp(userDetail.created_at)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Dernière mise à jour</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatTimestamp(userDetail.updated_at)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Dernière connexion</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {userDetail.last_login_at ? formatTimestamp(userDetail.last_login_at) : 'Jamais connecté'}
                  </dd>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dialog de suppression */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Supprimer définitivement l&apos;utilisateur</DialogTitle>
                <DialogDescription>
                  Cette action est irréversible. Tous les données associées à cet utilisateur seront définitivement supprimées.
                  Êtes-vous absolument sûr ?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={processing}>
                  Annuler
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={processing}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {processing ? 'Suppression...' : 'Supprimer définitivement'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      }

      <DialogUpdateUser 
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        userData={userDetail}
        loading={processing}
        onSave={updateUser}
      />
    </div>
  );
};

export default UserDetailPage;
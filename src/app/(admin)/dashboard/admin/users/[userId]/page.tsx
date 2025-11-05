'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, User, Mail, MapPin, Shield, XCircle, Edit, Trash2
} from 'lucide-react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserData } from '@/hooks/feature/users/useUserData';
import { formatTimestamp, getStatusColor } from '@/lib/utils';
import { DialogUpdateUser } from '@/components/features/users/Modal/DialogUpdateUser';
import { IUpdateUserForm } from '@/types/staffType';
import { showToast } from '@/components/ui/showToast';
import { ConfirmActionDialog } from '@/components/ConfirmActionDialog';
import PageHeader from '@/layout/PageHeader';
import BoxedSkeleton from '@/components/Skeletons/BoxedSkeleton';

const UserDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  
  const { 
    fetchUserDetail, 
    userDetail, 
    loadingUserData,
    processing,
    handleDeleteUser,
    handleUpdateUser,
    handleDeactivateUser
  } = useUserData();

  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserDetail(userId);
    }
  }, [fetchUserDetail, userId]);

  const handleBack = () => {
    router.push('/dashboard/admin/users');
  };

  const handleEdit = () => {
    setUpdateDialogOpen(true);
  };

  const handleDeactivate = async (user_code: string) => {
    const result = await handleDeactivateUser(user_code);
    if (result.success) {
      setDeactivateDialogOpen(false);
      await fetchUserDetail(userId);
      showToast({
        variant: "success-solid",
        message: 'Utilisateur désactivé',
        description: 'L\'utilisateur a été désactivé avec succès.',
        position: 'top-center',
      });
    } else {
      showToast({
        variant: "error-solid",
        message: 'Erreur',
        description: result.error,
        position: 'top-center',
      });
    }
  };

  const handleDelete = async (user_code: string) => {
    const result = await handleDeleteUser(user_code);
    if (result.success) {
      setDeleteDialogOpen(false);
      showToast({
        variant: "success-solid",
        message: 'Utilisateur supprimé',
        description: 'L\'utilisateur a été supprimé définitivement.',
        position: 'top-center',
      });
      router.push('/dashboard/admin/users');
    } else {
      showToast({
        variant: "error-solid",
        message: 'Erreur',
        description: result.error,
        position: 'top-center',
      });
    }
  };



  const updateUser = async (data: IUpdateUserForm) => {
    console.log('Update data received:', data);

    if(userDetail){
      const result = await handleUpdateUser(data, userDetail.user_code);
      console.log('Update result:', result);
      if(result.success) {
        showToast({
          variant: "success-solid",
          message: 'Mise à jour effectuée avec succès',
          description: `Les données sur l'utilisateur ${data.last_name} ont été mise à jour avec succès.`,
          position: 'top-center',
        });
        return true
      } else {
        showToast({
          variant: "error-solid",
          message: "Impossible de mettre à jour l'utilisateur",
          description: result.error ?? "Une erreur est survenue, essayez encore ou veuillez contacter l'administrateur",
          position: 'top-center',
        });
        return false
      }
    } else {
      setUpdateDialogOpen(false);
      return true
    }
  }

  
  if (loadingUserData) {
    return (
      <BoxedSkeleton />
    );
  } else if (!userDetail) {
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
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto space-y-6">
        {/* Header section */}
        <PageHeader
          title={`${userDetail.first_name} ${userDetail.last_name}`}
          backLabel='Utilisateurs'
          backUrl='/dashboard/admin/users'
          status={<Badge className={getStatusColor(userDetail.status_code)}>{userDetail.status_code}</Badge>}
          description="Detail de l'utilisateur"
        >

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <Button onClick={handleEdit} variant="info" className="flex-1 w-full" disabled={processing}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>

            <Button 
              variant={userDetail.status_code === 'ACTIVE' ? 'danger' : 'success'}
              onClick={() => setDeactivateDialogOpen(true)}
              disabled={processing}
              className=' flex-1 w-full'
            >
              <XCircle className="h-4 w-4 mr-2" />
              {userDetail.status_code === 'ACTIVE' ? 'Désactiver' : 'Activer'}
            </Button>
            
            <Button 
              onClick={() => setDeleteDialogOpen(true)} 
              variant="danger" 
              className="flex-1 w-full"
              disabled={processing}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </PageHeader>
        <div className='p-6'>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Ethnie</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userDetail.ethnicity_code || 'Non renseigné'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Statut</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userDetail.status_code || 'Non renseigné'}</dd>
                  </div>
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
        </div>
      </div>

      {/* Dialogs génériques */}
      <ConfirmActionDialog
        open={deactivateDialogOpen}
        onOpenChange={setDeactivateDialogOpen}
        onConfirm={() => {handleDeactivate(userDetail.user_code)}}
        title={userDetail.status_code === 'ACTIVE' ? "Désactiver l'utilisateur" : "Activer l'utilisateur"}
        description={`"Êtes-vous sûr de vouloir ${userDetail.status_code === 'ACTIVE' ? 'désactiver' : 'activer'}  cet utilisateur ? Cette action peut être annulée ultérieurement."`}
        confirmLabel="Désactiver"
        cancelLabel="Annuler"
        variant={userDetail.status_code === 'ACTIVE' ? 'danger' : 'success'}
        loading={processing}
        loadingText="Désactivation..."
      />

      <ConfirmActionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {handleDelete(userDetail.user_code)}}
        title="Supprimer définitivement l'utilisateur"
        description="Cette action est irréversible. Toutes les données associées à cet utilisateur seront définitivement supprimées. Êtes-vous absolument sûr ?"
        confirmLabel="Supprimer définitivement"
        cancelLabel="Annuler"
        variant="danger"
        loading={processing}
        loadingText="Suppression..."
      />

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
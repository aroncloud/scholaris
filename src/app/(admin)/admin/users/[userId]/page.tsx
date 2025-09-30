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
import { getStatusColor } from '@/lib/utils';
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
  }, [fetchUserDetail, userId]);

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
        await fetchUserDetail(userId);
        showToast({
          variant: "success-solid",
          message: 'Utilisateur désactivé',
          description: 'L\'utilisateur a été désactivé avec succès.',
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Error deactivating user:', error);
      showToast({
        variant: "error-solid",
        message: 'Erreur',
        description: 'Impossible de désactiver l\'utilisateur.',
        position: 'top-center',
      });
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
        showToast({
          variant: "success-solid",
          message: 'Utilisateur supprimé',
          description: 'L\'utilisateur a été supprimé définitivement.',
          position: 'top-center',
        });
        router.push('/admin/users');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast({
        variant: "error-solid",
        message: 'Erreur',
        description: 'Impossible de supprimer l\'utilisateur.',
        position: 'top-center',
      });
    } finally {
      setProcessing(false);
    }
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
        await fetchUserDetail(userId);
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

  // Afficher le skeleton pendant le chargement
  if (loading) {
    return (
      <BoxedSkeleton />
    );
  }

  // Afficher le message d'erreur uniquement si le chargement est terminé et qu'il n'y a pas de données
  if (!userDetail) {
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
          backUrl='/admin/users'
          status={<Badge className={getStatusColor(userDetail.status_code)}>{userDetail.status_code}</Badge>}
        >

          <div className="flex items-center space-x-3 shrink-0">
            <Button onClick={handleEdit} variant="outline-info" className="shrink-0">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>

            <Button 
              variant={userDetail.status_code === 'ACTIVE' ? 'outline-danger' : 'outline-success'}
              onClick={() => setDeactivateDialogOpen(true)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              {userDetail.status_code === 'ACTIVE' ? 'Désactiver' : 'Activer'}
            </Button>
            
            <Button 
              onClick={() => setDeleteDialogOpen(true)} 
              variant="danger" 
              className="shrink-0"
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
        </div>
      </div>

      {/* Dialogs génériques */}
      <ConfirmActionDialog
        open={deactivateDialogOpen}
        onOpenChange={setDeactivateDialogOpen}
        onConfirm={handleDeactivate}
        title="Désactiver l'utilisateur"
        description="Êtes-vous sûr de vouloir désactiver cet utilisateur ? Cette action peut être annulée ultérieurement."
        confirmLabel="Désactiver"
        cancelLabel="Annuler"
        variant="warning"
        loading={processing}
        loadingText="Désactivation..."
      />

      <ConfirmActionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
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
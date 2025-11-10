'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  X,
  Camera,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import PageHeader from '@/layout/PageHeader';
import Badge from '@/components/custom-ui/Badge';
import { useUserStore } from '@/store/useAuthStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ContentLayout from '@/layout/ContentLayout';
import { forgotPassword, resetPassword, selfUpdate } from '@/actions/userAction';
import { showToast } from '@/components/ui/showToast';
import { DatePicker } from '@/components/DatePicker';

const StudentProfilePage: React.FC = () => {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // États pour les informations personnelles
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    placeOfBirth: '',
    country: '',
    city: '',
    addressDetails: '',
  });

  // États pour le changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Charger les données utilisateur au montage
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      // Simuler un petit délai pour montrer le loader (tu peux l'enlever si tu fetch depuis l'API)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPersonalInfo({
        firstName: user?.user.first_name || '',
        lastName: user?.user.last_name || '',
        email: user?.user.email || '',
        phone: user?.userDetailled?.phone_number || '',
        dateOfBirth: user?.userDetailled?.date_of_birth || '',
        placeOfBirth: user?.userDetailled?.place_of_birth || '',
        country: user?.userDetailled?.country || '',
        city: user?.userDetailled?.city || '',
        addressDetails: user?.userDetailled?.address_details || '',
      });
      
      setIsLoading(false);
    };

    loadUserData();
  }, [user]);

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePersonalInfo = async () => {
    setIsSaving(true);

    try {
      const payload = {
        last_name: personalInfo.lastName,
        first_name: personalInfo.firstName,
        email: personalInfo.email,
        phone_number: personalInfo.phone,
        country: personalInfo.country,
        city: personalInfo.city,
        address_details: personalInfo.addressDetails,
        place_of_birth: personalInfo.placeOfBirth,
        date_of_birth: personalInfo.dateOfBirth,
      };

      console.log('--->payload', payload)

      const result = await selfUpdate(payload);

      if (result.code === 'success') {
        showToast({
          variant: 'success-solid',
          message: 'Profil mis à jour',
          description: 'Vos modifications ont été enregistrées avec succès',
          position: 'top-center',
        });
        setIsEditing(false);
      } else {
        showToast({
          variant: 'error-solid',
          message: 'Erreur',
          description: result.error || 'Une erreur est survenue lors de la mise à jour',
          position: 'top-center',
        });
      }
    } catch {
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Une erreur inattendue est survenue',
        position: 'top-center',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRequestOTP = async () => {
    if (!user?.user?.email) {
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Email utilisateur non trouvé',
        position: 'top-center',
      });
      return;
    }

    setIsSaving(true);

    try {
      const result = await forgotPassword(user.user.email);

      if (result.code === 'success') {
        setOtpSent(true);
        showToast({
          variant: 'success-solid',
          message: 'Code OTP envoyé',
          description: 'Un code de vérification a été envoyé à votre adresse email',
          position: 'top-center',
        });
      } else {
        showToast({
          variant: 'error-solid',
          message: 'Erreur',
          description: result.error || "Impossible d'envoyer le code OTP",
          position: 'top-center',
        });
      }
    } catch {
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Une erreur inattendue est survenue',
        position: 'top-center',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (!user?.user?.email) {
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Email utilisateur non trouvé',
        position: 'top-center',
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Les mots de passe ne correspondent pas',
        position: 'top-center',
      });
      return;
    }

    if (!passwordData.otp) {
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Veuillez entrer le code OTP',
        position: 'top-center',
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Le mot de passe doit contenir au moins 8 caractères',
        position: 'top-center',
      });
      return;
    }

    setIsSaving(true);

    try {
      const result = await resetPassword({
        email: user.user.email,
        otp: passwordData.otp,
        newPassword: passwordData.newPassword,
      });

      if (result.code === 'success') {
        setPasswordData({ otp: '', newPassword: '', confirmPassword: '' });
        setOtpSent(false);
        showToast({
          variant: 'success-solid',
          message: 'Mot de passe modifié',
          description: 'Votre mot de passe a été mis à jour avec succès',
          position: 'top-center',
        });
      } else {
        showToast({
          variant: 'error-solid',
          message: 'Erreur',
          description: result.error || 'Impossible de modifier le mot de passe',
          position: 'top-center',
        });
      }
    } catch {
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Une erreur inattendue est survenue',
        position: 'top-center',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Réinitialiser les valeurs
    setPersonalInfo({
      firstName: user?.user.first_name || '',
      lastName: user?.user.last_name || '',
      email: user?.user.email || '',
      phone: user?.userDetailled?.phone_number || '',
      dateOfBirth: user?.userDetailled?.date_of_birth || '',
      placeOfBirth: user?.userDetailled?.place_of_birth || '',
      country: user?.userDetailled?.country || '',
      city: user?.userDetailled?.city || '',
      addressDetails: user?.userDetailled?.address_details || '',
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Uploading photo:', file);
      // Logique d'upload de photo
    }
  };

  // Composant de skeleton loader
  const SkeletonLoader = () => (
    <div className="space-y-8 animate-pulse">
      {/* Photo de profil skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-gray-200">
        <div className="w-24 h-24 rounded-full bg-gray-200"></div>
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
      </div>

      {/* Champs skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Textarea skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <PageHeader
        Icon={User}
        title="Mon Profil"
        description="Gérez vos informations personnelles et vos préférences"
        status={<Badge size='sm' value="ACTIVE" label="Actif" />}
      >
      </PageHeader>

      <div className="px-4 pb-4 md:px-6 md:pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white rounded-xl border border-slate-200 p-1.5 inline-flex space-x-1 shadow-sm h-auto w-full mt-6 mb-2">
            <TabsTrigger value="personal" className="px-6 py-1.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30">
              Informations Personnelles
            </TabsTrigger>
            <TabsTrigger value="security" className="px-6 py-1.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30">
              Sécurité
            </TabsTrigger>
          </TabsList>

          {/* Onglet Informations Personnelles */}
          <TabsContent value="personal">
            <ContentLayout 
              title='Informations Personnelles' 
              description='Gérez vos informations personnelles et vos préférences'
              actions={
                !isLoading && !isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant={"info"}>
                    <User className="w-4 h-4 mr-2" />
                    Modifier le profil
                  </Button>
                ) : null
              }
            >
              {isLoading ? (
                <SkeletonLoader />
              ) : (
                <div className="space-y-8">
                  {/* Photo de profil */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-gray-200">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                        {personalInfo.firstName.charAt(0)}{personalInfo.lastName.charAt(0)}
                      </div>
                      {isEditing && (
                        <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 border border-gray-200">
                          <Camera className="w-4 h-4 text-gray-600" />
                          <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoUpload}
                          />
                        </label>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{personalInfo.firstName} {personalInfo.lastName}</h3>
                      <p className="text-sm text-gray-600">{personalInfo.email}</p>
                      {isEditing && (
                        <p className="text-xs text-gray-500 mt-2">
                          Cliquez sur l&apos;icône pour changer votre photo de profil
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Informations de base */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        value={personalInfo.firstName}
                        onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-gray-50' : ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input
                        id="lastName"
                        value={personalInfo.lastName}
                        onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-gray-50' : ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={personalInfo.email}
                          onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                          disabled={!isEditing}
                          className={`pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          value={personalInfo.phone}
                          onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                          disabled={!isEditing}
                          className={`pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date de naissance</Label>
                      <div className="relative">
                        <DatePicker
                          label=""
                          minDate={new Date(1900, 0, 1)}
                          onChange={(e) => {
                            if(e){
                              handlePersonalInfoChange("dateOfBirth", e?.toJSON().split('T')[0])
                              }
                          }}
                          selected={personalInfo.dateOfBirth ? new Date(personalInfo.dateOfBirth) : undefined}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="placeOfBirth">Lieu de naissance</Label>
                      <Input
                        id="placeOfBirth"
                        value={personalInfo.placeOfBirth}
                        onChange={(e) => handlePersonalInfoChange('placeOfBirth', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-gray-50' : ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Pays</Label>
                      <Input
                        id="country"
                        value={personalInfo.country}
                        onChange={(e) => handlePersonalInfoChange('country', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-gray-50' : ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Ville de résidence</Label>
                      <Input
                        id="city"
                        value={personalInfo.city}
                        onChange={(e) => handlePersonalInfoChange('city', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-gray-50' : ''}
                      />
                    </div>
                  </div>

                  {/* Adresse complète */}
                  <div className="space-y-2">
                    <Label htmlFor="addressDetails">Adresse complète</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Textarea
                        id="addressDetails"
                        value={personalInfo.addressDetails}
                        onChange={(e) => handlePersonalInfoChange('addressDetails', e.target.value)}
                        disabled={!isEditing}
                        className={`pl-10 min-h-[80px] ${!isEditing ? 'bg-gray-50' : ''}`}
                        placeholder="Quartier, rue, numéro..."
                      />
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  {isEditing && (
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                      <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                      <Button onClick={handleSavePersonalInfo} disabled={isSaving} variant={"info"}>
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Enregistrer
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </ContentLayout>
          </TabsContent>

          {/* Onglet Sécurité */}
          <TabsContent value="security">
            <ContentLayout
              title='Changer le mot de passe'
              description='Modifiez votre mot de passe pour sécuriser votre compte'
            >
              <div className="space-y-4">
                {/* Étape 1 : Demander l'OTP */}
                {!otpSent ? (
                  <div className="space-y-4">
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        Pour des raisons de sécurité, un code de vérification sera envoyé à votre adresse email <strong>{user?.user?.email}</strong>
                      </AlertDescription>
                    </Alert>

                    <div className="flex justify-center pt-4">
                      <Button onClick={handleRequestOTP} disabled={isSaving} variant="info">
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4 mr-2" />
                            Envoyer le code de vérification
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Étape 2 : Entrer l'OTP et le nouveau mot de passe */}
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Un code de vérification a été envoyé à votre email. Vérifiez votre boîte de réception.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <Label htmlFor="otp">Code de vérification (OTP) *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="otp"
                          type="text"
                          placeholder="Entrez le code reçu par email"
                          value={passwordData.otp}
                          onChange={(e) => handlePasswordChange('otp', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nouveau mot de passe *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="newPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Minimum 8 caractères avec lettres, chiffres et symboles
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {passwordData.newPassword && passwordData.confirmPassword &&
                      passwordData.newPassword !== passwordData.confirmPassword && (
                      <Alert className="bg-red-50 border-red-200">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          Les mots de passe ne correspondent pas
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setOtpSent(false);
                          setPasswordData({ otp: '', newPassword: '', confirmPassword: '' });
                        }}
                        disabled={isSaving}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                      <Button onClick={handleSavePassword} disabled={isSaving} variant="info">
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Modification...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Changer le mot de passe
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </ContentLayout>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default StudentProfilePage;
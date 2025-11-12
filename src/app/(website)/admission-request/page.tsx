/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, CheckCircle, FileText, User, MapPin, Phone, GraduationCap, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

import { useAdmissionForm } from "@/hooks/useAdmissionForm";
import {
  FormSection,
  PersonalInfoForm,
  OriginInfoForm,
  AdditionalInfoForm,
  AcademicInfoForm,
  ConfirmationSummary,
  DocumentsForm
} from "@/components/website/admissions/FormSections";
import { searchStudentByMatricule } from "@/actions/requestSubmissionActions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ISeachMatricule } from "@/types/requestSubmissionTypes";
import { getConfig, getCurriculumListSite } from "@/actions/utilitiesActions";
import { IConfig } from "@/types/utilitiesTypes";
import { IFactorizedProgram } from "@/types/programTypes";


const STEPS = [
  {
    id: 1,
    title: "Informations Personnelles",
    description: "Vos données personnelles de base",
    icon: User,
    component: PersonalInfoForm,
  },
  {
    id: 2,
    title: "Origine",
    description: "Votre lieu d'origine",
    icon: MapPin,
    component: OriginInfoForm,
  },
  {
    id: 3,
    title: "Informations Complémentaires",
    description: "Détails additionnels",
    icon: Phone,
    component: AdditionalInfoForm,
  },
  {
    id: 4,
    title: "Informations Académiques",
    description: "Votre parcours académique",
    icon: GraduationCap,
    component: AcademicInfoForm,
  },
  {
    id: 5,
    title: "Documents",
    description: "Documents requis",
    icon: FileText,
    component: DocumentsForm,
  },
  {
    id: 6,
    title: "Confirmation",
    description: "Vérification et envoi",
    icon: FileText,
    component: ConfirmationSummary,
  },
];

const AdmissionRequest: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [matriculeInput, setMatriculeInput] = useState<string>('');
  const [matricule, setMatricule] = useState<ISeachMatricule | null>(null);
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState<IConfig | null>(null);
  const [program, setProgram] = useState<IFactorizedProgram[]>([]);
  const [hasAutoSearched, setHasAutoSearched] = useState(false);



  const init = React.useCallback(async () => {
    const result = await getConfig();
    if(result.code === 'success' && result.data) {
      setConfigs(result.data);
    }
    const curriculumResult = await getCurriculumListSite();
      if(curriculumResult.code == 'success'){
        setProgram(factorizeByProgram(curriculumResult.data.body))
      }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    validateCurrentStep,
    handleSubmit,
  } = useAdmissionForm();

  // Fonction pour effectuer la recherche par matricule
  const searchMatricule = React.useCallback(async (code: string) => {
    try {
      setLoading(true);
      const result = await searchStudentByMatricule(code);
      console.log('result', result);
      if (result.code === 'success' && result.data) {
        setMatricule(result.data.body);
        handleInputChange('nom', result.data.body.last_name || '');
        handleInputChange('prenom', result.data.body.first_name || '');
        handleInputChange('dateNaissance', result.data.body.date_of_birth ? new Date(result.data.body.date_of_birth).toISOString().split('T')[0] : '');
        handleInputChange('lieuNaissance', result.data.body.place_of_birth || '');
        handleInputChange('email', result.data.body.email || '');
      }
    } finally {
      setLoading(false);
    }
  }, [handleInputChange]);

  // Lire le paramètre 'code' de l'URL et lancer la recherche automatiquement
  useEffect(() => {
    const codeParam = searchParams.get('code');
    if (codeParam && !hasAutoSearched) {
      setMatriculeInput(codeParam);
      setHasAutoSearched(true);
      searchMatricule(codeParam);
    }
  }, [searchParams, hasAutoSearched, searchMatricule]);

  // Nettoyer l'URL quand on retourne à l'écran de recherche
  useEffect(() => {
    if (matricule === null && searchParams.get('code')) {
      router.push('/admission-request', { scroll: false });
    }
  }, [matricule, searchParams, router]);

  const handleSeachMatricule = async () => {
    // Mettre à jour l'URL avec le paramètre 'code'
    const params = new URLSearchParams(searchParams.toString());
    params.set('code', matriculeInput);
    router.push(`?${params.toString()}`, { scroll: false });

    // Effectuer la recherche
    await searchMatricule(matriculeInput);
  };

  
  const nextStep = () => {
    if (validateCurrentStep(currentStep) && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };


  const prevStep = () => {
    if(currentStep === 1) {
      // Retour à l'écran de recherche (étape 0)
      console.log('Search matricule reset');
      setMatricule(null); // Le useEffect nettoiera l'URL automatiquement
      setMatriculeInput('');
      setHasAutoSearched(false);
      setCurrentStep(1);
    } else if (currentStep > 1) {
      // Navigation entre les étapes du formulaire - garder le paramètre 'code'
      setCurrentStep(currentStep - 1);
    }
  };

  function factorizeByProgram(data: any[]): IFactorizedProgram[] {
    const grouped: { [key: string]: IFactorizedProgram } = {};

    data.forEach(item => {
      const { program, training_sequences, ...curriculumInfo } = item;
      if (!grouped[item.program_code]) {
        grouped[item.program_code] = {
          program: program,
          curriculums: []
        };
      }

      grouped[item.program_code].curriculums.push({
        ...curriculumInfo,
        training_sequences
      });
    });

    return Object.values(grouped);
  }

  const currentStepData = STEPS.find((step) => step.id === currentStep);
  const progress = (currentStep / STEPS.length) * 100;
  const CurrentStepComponent = currentStepData?.component;

  return (
    <div className="landing-page">
      <main >
        <div className="container mx-auto px-4 max-w-4xl">
          {/* En-tête du formulaire */}
          <div className="text-center mb-8">
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200 mb-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-500">LOGO</span>
                </div>
                <div className="text-center">
                  <h2 className=" font-bold text-[#3b2c6a] mb-1">
                    ÉCOLE PRIVÉE DE FORMATION DES PROFESSIONNELS DE LA SANTÉ
                  </h2>
                  <p className="text-xs text-gray-600">MEIGANGA - CAMEROUN</p>
                  <p className="text-xs text-gray-500">
                    Tél: +237 XXX XXX XXX | Email: contact@epfps.cm
                  </p>
                </div>
              </div>
              <h1 className="heading-font text-3xl font-bold text-[#3b2c6a] mb-4">
                FICHE DE RENSEIGNEMENTS
              </h1>
            </div>
          </div>
            {
              matricule === null
              ?
              <>
                <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200 mb-52 mt-20">
                  <div className="mb-4 space-y-4">
                    <Label htmlFor="nom" className="text-base">
                      Entrez votre numéro de matricule pour rechercher votre dossier:  
                    </Label>
                    <Input id="matricule" value={matriculeInput}
                      onChange={(e) => setMatriculeInput(e.target.value)}
                      placeholder="Numéro de matricule"
                    />
                  </div>
                  <Button
                    onClick={handleSeachMatricule}
                    disabled={matriculeInput.trim() === '' || loading}
                    className="bg-[#ff9900] hover:bg-[#e68a00] text-white flex items-center gap-2"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loading ? "Recherche en cours..." : "Rechercher"}
                  </Button>

                </div>
              </>
              :
              <>
                {/* Indicateur de progression des étapes */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-[#3b2c6a]">
                      Étape {currentStep} sur {STEPS.length}
                    </h2>
                    <span className=" text-gray-500">
                      {Math.round(progress)}% complété
                    </span>
                  </div>
                  <Progress value={progress} className="mb-6" />
                  <div className="flex justify-between items-center mb-6">
                    {STEPS.map((step) => {
                      const Icon = step.icon;
                      const isActive = step.id === currentStep;
                      const isCompleted = step.id < currentStep;

                      return (
                        <div
                          key={step.id}
                          className={`flex flex-col items-center text-center ${
                            isActive
                              ? "text-[#ff9900]"
                              : isCompleted
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                              isActive
                                ? "bg-[#ff9900] text-white"
                                : isCompleted
                                ? "bg-green-600 text-white"
                                : "bg-gray-200"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <Icon className="h-5 w-5" />
                            )}
                          </div>
                          <span className="text-xs font-medium hidden md:block max-w-20">
                            {step.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Rendu du composant de l'étape actuelle */}
                {CurrentStepComponent && (
                  <FormSection
                    title={currentStepData.title}
                    description={currentStepData.description}
                    icon={currentStepData.icon}
                  >
                    <CurrentStepComponent
                      formData={formData}
                      errors={errors}
                      handleInputChange={handleInputChange}
                      handleFileChange={handleFileChange}
                      configs={configs}
                      programList={program}
                      applicationCode={matriculeInput}
                    />
                  </FormSection>
                )}

                {/* Boutons de navigation */}
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {currentStep === 1 ? "Retour" : "Précédent"}
                  </Button>
                  {currentStep < STEPS.length ? (
                    <Button
                      onClick={nextStep}
                      className="bg-[#ff9900] hover:bg-[#e68a00] text-white flex items-center gap-2"
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={async () => {
                        const success = await handleSubmit(matriculeInput);
                        if (success) {
                          alert("Votre demande a été soumise avec succès !");
                          setMatricule(null); 
                          setCurrentStep(1); 
                        }
                      }}
                      disabled={isSubmitting}
                      className="bg-[#ff9900] hover:bg-[#e68a00] text-white"
                    >
                      {isSubmitting ? "Envoi en cours..." : "Soumettre ma demande"}
                  </Button>
                  )}
                </div>
              </>
            }
        </div>
      </main>
    </div>
  );
};

export default AdmissionRequest;

'use client'
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, CheckCircle, FileText, User, MapPin, Phone, GraduationCap, Camera } from "lucide-react";

import { useAdmissionForm } from "@/hooks/useAdmissionForm";
import {
  FormSection,
  PersonalInfoForm,
  OriginInfoForm,
  AdditionalInfoForm,
  AcademicInfoForm,
  DocumentsForm,
  ConfirmationSummary
} from "@/components/website/admissions/FormSections";
import { useRouter } from "next/navigation";
import LandingHeader from "@/components/website/LandingHeader";
import LandingFooter from "@/components/website/LandingFooter";


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
    description: "Documents à joindre",
    icon: Camera,
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
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [matricule, setMatricule] = useState<string>('');

  useEffect(() => {
    console.log('AdmissionRequest component mounted');
  }, []);

  const {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    validateCurrentStep,
    handleSubmit,
  } = useAdmissionForm();

  
  const nextStep = () => {
    if (validateCurrentStep(currentStep) && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = STEPS.find((step) => step.id === currentStep);
  const progress = (currentStep / STEPS.length) * 100;
  const CurrentStepComponent = currentStepData?.component;

  return (
    <div className="landing-page">
      <LandingHeader />
      <main className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* En-tête du formulaire */}
          <div className="text-center mb-8">
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200 mb-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-500">LOGO</span>
                </div>
                <div className="text-center">
                  <h2 className="text-sm font-bold text-[#3b2c6a] mb-1">
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

            {/* Indicateur de progression des étapes */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#3b2c6a]">
                  Étape {currentStep} sur {STEPS.length}
                </h2>
                <span className="text-sm text-gray-500">
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
                />
              </FormSection>
            )}

            {/* Boutons de navigation */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={currentStep === 1 ? () => router.push("/") : prevStep}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                {currentStep === 1 ? "Retour à l'accueil" : "Précédent"}
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
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-[#ff9900] hover:bg-[#e68a00] text-white"
                >
                  {isSubmitting ? "Envoi en cours..." : "Soumettre ma demande"}
                </Button>
              )}
            </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
};

export default AdmissionRequest;

'use client';
import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Plus, MoreHorizontal, Eye, Search, Check, X } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { DialogSubmitJustification } from "@/components/features/student-my-absences/modal/DialogSubmitJustification";
import { DialogViewDetail } from "@/components/features/student-my-absences/modal/DialogViewDetail";
import { Absence as AbsenceType, UIAbsence, JustificationFile } from "@/types/studentmyabsencesTypes";
import { showToast } from "@/components/ui/showToast";
import { useStudentAbsenceData } from "@/hooks/feature/student-my-absences/useStudentAbsenceData";
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import dynamic from 'next/dynamic';
import { verifyClientSession } from '@/lib/client-session';

type Absence = AbsenceType;

type SubmitJustificationFn = (data: {
  absence_codes: string[];
  reason: string;
  type: string;
  files: Array<{
    file?: File;
    content_url?: string;
    name: string;
  }>;
}) => Promise<void>;

// Import the AbsenceHistorySection component with skeleton loading
const AbsenceHistorySection = dynamic<React.ComponentProps<typeof import('@/components/features/student-my-absences/AbsenceHistorySection').AbsenceHistorySection>>(
  () => import("@/components/features/student-my-absences/AbsenceHistorySection").then(mod => mod.AbsenceHistorySection),
  {
    ssr: false,
    loading: () => <SkeletonMyAbsenceTab />
  }
);

// Import the skeleton component
import { SkeletonMyAbsenceTab } from "@/components/features/student-my-absences/skeleton/SkeletonMyAbsenceTab";

// Error boundary component
function ErrorFallback() {
  return <div className="p-4 text-red-600">Erreur lors du chargement du composant</div>;
}



// Helper function to map API status to UI status
const mapStatusToUI = (status: string) => {
  if (!status) return 'non_justifiee';
  
  const normalizedStatus = status.trim().toUpperCase();
  
  switch (normalizedStatus) {
    case 'JUSTIFIED':
    case 'APPROVED':
      return 'justifiee';
    case 'UNJUSTIFIED':
      return 'non_justifiee';
    case 'PENDING':
    case 'PENDING_REVIEW':
      return 'en_attente';
    case 'REJECTED':
      return 'non_justifiee';
    default:
      console.warn('Unknown status:', status);
      return 'non_justifiee';
  }
};

// Helper function to map API type to UI type
const mapTypeToUI = (type: string = 'COURSE'): 'cours' | 'tp' | 'td' | 'examen' => {
  const typeUpper = type.toUpperCase();
  switch (typeUpper) {
    case 'COURSE':
      return 'cours';
    case 'TP':
      return 'tp';
    case 'TD':
      return 'td';
    case 'EXAM':
      return 'examen';
    default:
      return 'cours';
  }
};

// Helper function to map absence data to UI format
const mapAbsenceToUI = (absence: Absence): UIAbsence => {
  // Map status from API format to UI format
  const mapApiStatusToUI = (status?: string) => {
    if (!status) return 'non_justifiee';
    
    const normalizedStatus = status.trim().toLowerCase();
    if (['justified', 'justifiee', 'justifiée'].includes(normalizedStatus)) return 'justifiee';
    if (['pending', 'en_attente', 'en attente', 'pending_review'].includes(normalizedStatus)) return 'en_attente';
    return 'non_justifiee'; // Default to non_justifiee for any other status
  };

  // Extract date and time from startTime
  const startDate = absence.startTime ? new Date(absence.startTime) : new Date();
  const endDate = absence.endTime ? new Date(absence.endTime) : new Date(startDate.getTime() + 60 * 60 * 1000); // Default to 1 hour later
  
  // Calculate duration in hours
  const durationHours = absence.duration || 
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

  // Create the base UI absence object
  const uiAbsence: UIAbsence = {
    id: parseInt(absence.id) || 0,
    dateAbsence: startDate.toISOString().split('T')[0],
    heureDebut: startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    heureFin: endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    dureeHeures: Math.round(durationHours * 10) / 10, // Round to 1 decimal place
    ue: absence.course_unit_name || 'UE Inconnue',
    cours: absence.course_unit_name || 'Cours inconnu',
    enseignant: absence.teacherName || 'Enseignant inconnu',
    type: mapTypeToUI(absence.type).toLowerCase() as 'cours' | 'tp' | 'td' | 'examen',
    statut: mapApiStatusToUI(absence.status || absence.status_code),
    absence_code: absence.absence_code,
    status_code: absence.status_code as 'JUSTIFIED' | 'UNJUSTIFIED' | 'PENDING' | 'PENDING_REVIEW' | undefined
  };

  // Add optional fields if they exist
  if (absence.justification) {
    uiAbsence.justificatifId = parseInt(absence.justification.id) || 0;
  }

  return uiAbsence;
};

// Helper function to map API status to UI status
const mapApiStatusToUI = (status: string) => {
  if (!status) return 'non_justifiee';
  
  const normalizedStatus = status.trim().toUpperCase();
  
  switch (normalizedStatus) {
    case 'JUSTIFIED':
    case 'APPROVED':
      return 'justifiee';
    case 'UNJUSTIFIED':
      return 'non_justifiee';
    case 'PENDING':
    case 'PENDING_REVIEW':
      return 'en_attente';
    case 'REJECTED':
    default:
      return 'non_justifiee';
  }
};

// Import the shared utility for generating absence keys
import { getAbsenceKey } from "@/utils/absenceKeys";

// Define the component props type
interface MyAbsencesPageProps {}

export default function MyAbsencesPage({}: MyAbsencesPageProps) {
  // State hooks
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAbsence, setSelectedAbsence] = useState<UIAbsence | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isSubmitJustificatifOpen, setIsSubmitJustificatifOpen] = useState(false);
  const [selectedAbsenceKeys, setSelectedAbsenceKeys] = useState<Set<string>>(new Set());
  // Add this with your other state hooks
  const [isSubmittingJustification, setIsSubmittingJustification] = useState(false);

  // Data fetching
  const {
    absences: apiAbsences = [],
    isLoading,
    isError,
    error,
    refetchAbsences,
    submitJustification,
  } = useStudentAbsenceData({
    searchTerm,
    filters: {},
    enabled: true
  });
  
  // State to force show skeleton when refreshing
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Handle refresh with loading state
  const handleRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      if (refetchAbsences) {
        await refetchAbsences();
      }
    } catch (error) {
      console.error('Error refreshing absences:', error);
    } finally {
      // Small delay to ensure smooth transition
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [refetchAbsences]);

  // Process absences data
  const absencesData = useMemo(() => {
    if (!Array.isArray(apiAbsences)) {
      console.warn('apiAbsences is not an array:', apiAbsences);
      return [];
    }
    
    return apiAbsences.map(absence => {
      try {
        return mapAbsenceToUI(absence);
      } catch (err) {
        console.error('Error mapping absence:', { absence, error: err });
        return null;
      }
    }).filter(Boolean) as UIAbsence[];
  }, [apiAbsences]);

  // Filter absences based on search term
  const filteredAbsences = useMemo(() => {
    return absencesData.filter((absence: UIAbsence) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        (absence.ue?.toLowerCase() || '').includes(searchLower) ||
        (absence.cours?.toLowerCase() || '').includes(searchLower) ||
        (absence.dateAbsence?.toLowerCase() || '').includes(searchLower)
      );
    });
  }, [absencesData, searchTerm]);

  // Helper functions
  const getTypeColor = useCallback((type: string): string => {
    switch (type) {
      case 'cours': return 'bg-blue-100 text-blue-800';
      case 'tp': return 'bg-green-100 text-green-800';
      case 'td': return 'bg-orange-100 text-orange-800';
      case 'examen': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const getStatutColor = useCallback((statut: string): string => {
    switch (statut) {
      case 'justifiee': return 'bg-green-100 text-green-800';
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'non_justifiee': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const getStatutLabel = useCallback((statut: string): string => {
    switch (statut) {
      case 'justifiee': return 'Justifiée';
      case 'en_attente': return 'En attente';
      case 'non_justifiee': return 'Non justifiée';
      default: return statut;
    }
  }, []);

  // Handle view details
 const handleViewDetails = useCallback((absence: Absence | UIAbsence) => {
  try {
    // Convert to UIAbsence if it's an Absence
    const uiAbsence = 'statut' in absence ? absence : mapAbsenceToUI(absence);
    setSelectedAbsence(uiAbsence);
    setIsDetailsDialogOpen(true);
  } catch (error) {
    console.error('Error viewing absence details:', error);
  }
}, [setSelectedAbsence, setIsDetailsDialogOpen]);

  // Handle select absence
  const handleSelectAbsence = useCallback((absence: Absence | UIAbsence, isSelected: boolean) => {
    try {
      const uiAbsence = 'statut' in absence ? absence : mapAbsenceToUI(absence);
      
      // Use absence_code as the primary key if available, otherwise fall back to composite key
      const absenceKey = uiAbsence.absence_code || getAbsenceKey(uiAbsence);
      
      if (!absenceKey) {
        console.error('Could not generate a valid key for absence:', uiAbsence);
        return;
      }
      
      setSelectedAbsenceKeys(prev => {
        const newSet = new Set(prev);
        if (isSelected) {
          newSet.add(absenceKey);
        } else {
          newSet.delete(absenceKey);
        }
        console.log('Updated selected absences:', Array.from(newSet));
        return newSet;
      });
    } catch (error) {
      console.error('Error selecting absence:', { error, absence });
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Impossible de sélectionner cette absence. Veuillez réessayer.'
      });
    }
  }, [setSelectedAbsenceKeys, mapAbsenceToUI]);

  // Get the access token
  const getAccessToken = useCallback(async () => {
    const session = await verifyClientSession();
    return session?.accessToken;
  }, []);

  // Handle submit justification
  const handleSubmitJustification = useCallback(async (formData: {
    type: string;
    reason?: string;
    description?: string;
    file?: File | null;
    selectedAbsences: string[];
    absence_codes?: string[];
    files?: Array<{
      file: File;
      name: string;
      title: string;
      type_code: string;
      content_url?: string;
    }>;
  }) => {
    try {
      setIsSubmittingJustification(true);
      
      // Get the access token
      const token = await getAccessToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Ensure we have absence codes to submit
      let absenceCodes: string[] = [];
      
      // First, check if we have absence_codes in formData
      if (formData.absence_codes?.length) {
        absenceCodes = [...formData.absence_codes];
      } 
      // Then check selectedAbsences
      else if (formData.selectedAbsences?.length) {
        absenceCodes = [...formData.selectedAbsences];
      } 
      // Finally, check selectedAbsenceKeys as fallback
      else if (selectedAbsenceKeys.size > 0) {
        // Map selectedAbsenceKeys to absence codes
        const selectedAbsences = Array.from(selectedAbsenceKeys).map(key => {
          const keyStr = String(key);
          const abs = absencesData.find(a => {
            const codeMatch = a.absence_code && a.absence_code.toString() === keyStr;
            const idMatch = a.id && a.id.toString() === keyStr;
            return codeMatch || idMatch;
          });
          return abs?.absence_code || keyStr;
        }).filter((code): code is string => Boolean(code));
        
        if (selectedAbsences.length > 0) {
          absenceCodes = [...new Set(selectedAbsences)];
        }
      }
      
      // If we still don't have any absence codes, throw an error
      if (absenceCodes.length === 0) {
        throw new Error('Aucune absence sélectionnée pour la justification');
      }

      // Prepare files array for submission
      const filesToSubmit = [];
      
      // Add main file if exists
      if (formData.file) {
        filesToSubmit.push({
          file: formData.file,
          name: formData.file.name,
          title: formData.file.name,
          type_code: formData.type.toUpperCase()
        });
      }
      
      // Add any additional files
      if (formData.files?.length) {
        filesToSubmit.push(...formData.files.map(file => ({
          ...file,
          type_code: file.type_code || formData.type.toUpperCase()
        })));
      }

      if (filesToSubmit.length === 0) {
        throw new Error('Aucun fichier fourni pour la justification');
      }
      
      // Prepare the submission data
      const submissionData = {
        type: formData.type,
        reason: formData.reason || formData.description || 'Justification soumise',
        selectedAbsences: Array.from(new Set([...formData.selectedAbsences || [], ...absenceCodes])),
        absence_codes: absenceCodes,
        files: filesToSubmit
      };
      
      console.log('Submitting justification with data:', {
        ...submissionData,
        files: submissionData.files.map(f => ({
          ...f,
          file: f.file ? '[File]' : undefined
        }))
      });
      
      // Call the API to submit the justification
      await submitJustification({
        ...submissionData,
        token: token
      });

      // Show success message
      showToast({
        variant: 'success-solid',
        message: 'Justification soumise',
        description: 'Votre justificatif a été enregistré avec succès.'
      });

      // Close the dialog and reset state
      setIsSubmitJustificatifOpen(false);
      setSelectedAbsenceKeys(new Set());
      
      // Refresh the absences list
      await refetchAbsences();
      
    } catch (error) {
      console.error('Error submitting justification:', error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: `Échec de la soumission du justificatif: ${errorMessage}`
      });
      throw error;
    } finally {
      setIsSubmittingJustification(false);
    }
  }, [setIsSubmittingJustification, setIsSubmitJustificatifOpen, setSelectedAbsenceKeys]);

  // Get selected absences based on keys
  const selectedAbsences = useMemo(() => {
    if (!absencesData || !selectedAbsenceKeys) return [];
    
    return absencesData.filter(absence => {
      // First try to match by absence_code, then by composite key
      return (absence.absence_code && selectedAbsenceKeys.has(absence.absence_code)) ||
             selectedAbsenceKeys.has(getAbsenceKey(absence));
    });
  }, [absencesData, selectedAbsenceKeys]);

  // Handle opening the submit justification dialog
  const handleOpenSubmitJustification = useCallback((absenceId?: number) => {
    console.log('handleOpenSubmitJustification called with absenceId:', absenceId);
    console.log('Current selectedAbsenceKeys:', Array.from(selectedAbsenceKeys));
    
    // If an absenceId is provided (including 0), update the selectedAbsenceKeys with it
    if (absenceId !== undefined) {
      console.log('Looking for absence with ID:', absenceId);
      const absence = absencesData.find(a => a.id === absenceId);
      console.log('Found absence:', absence);
      
      if (absence) {
        const absenceKey = absence.absence_code || getAbsenceKey(absence);
        console.log('Setting selectedAbsenceKeys to:', [absenceKey]);
        
        // Update the state and open the modal in the same batch
        setSelectedAbsenceKeys(new Set([absenceKey]));
        // Use setTimeout to ensure the state is updated before opening the modal
        setTimeout(() => {
          console.log('Opening submit justificatif modal');
          setIsSubmitJustificatifOpen(true);
        }, 0);
        return;
      } else {
        console.error('Absence not found with ID:', absenceId);
        showToast({
          variant: 'error-solid',
          message: 'Erreur',
          description: 'Absence introuvable. Veuillez réessayer.'
        });
        return;
      }
    }
    
    // If no absences are selected, show an error
    if (selectedAbsenceKeys.size === 0) {
      console.warn('No absences selected');
      showToast({
        variant: 'error-solid',
        message: 'Sélection requise',
        description: 'Veuillez sélectionner au moins une absence à justifier'
      });
      return;
    }
    
    // Get all selected absences by matching both absence_code and composite key
    const selectedAbsences = absencesData.filter(absence => {
      const absenceKey = absence.absence_code || getAbsenceKey(absence);
      return selectedAbsenceKeys.has(absenceKey);
    });
    
    console.log('Selected absences for submission:', selectedAbsences.map(a => ({
      id: a.id,
      absence_code: a.absence_code,
      status: a.status_code,
      key: getAbsenceKey(a)
    })));
    
    // Check if we have any selectable absences
    if (selectedAbsences.length === 0) {
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Aucune absence valide sélectionnée. Veuillez réessayer.'
      });
      return;
    }
    
    // Check if any of the selected absences can be justified
    const hasNonJustifiedAbsences = selectedAbsences.some(
      absence => !absence.status_code || absence.status_code === 'UNJUSTIFIED'
    );
    
    if (!hasNonJustifiedAbsences) {
      showToast({
        variant: 'warning',
        message: 'Absences déjà justifiées',
        description: 'Toutes les absences sélectionnées sont déjà justifiées ou en attente de validation.'
      });
      return;
    }
    
    setIsSubmitJustificatifOpen(true);
  }, [selectedAbsenceKeys, absencesData]);

  // Helper function to normalize absence keys for comparison
  const normalizeKey = useCallback((key: string) => {
    return key ? key.trim().toLowerCase() : '';
  }, []);

  // Handle select all/deselect all
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const allAbsenceKeys = new Set(absencesData.map(absence => getAbsenceKey(absence)));
      setSelectedAbsenceKeys(allAbsenceKeys);
    } else {
      setSelectedAbsenceKeys(new Set());
    }
  }, [absencesData, getAbsenceKey]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between bg-white px-6 py-6 shadow-sm">
        {/* Left side - Title & Subtitle */}
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-900">Mes Absences</h2>
          <p className="text-sm text-gray-500">Historique de vos absences</p>
        </div>

      {/* Right side - Buttons */}
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
          className="flex items-center"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading || isRefreshing ? 'animate-spin' : ''}`}
          />
          {isLoading || isRefreshing ? 'Actualisation...' : 'Actualiser'}
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setSelectedAbsenceKeys(new Set());
            setIsSubmitJustificatifOpen(true);
          }}
          disabled={isLoading || absencesData.length === 0}
          className="flex items-center bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Soumettre un justificatif
        </Button>
      </div>
    </div>



      {isLoading || isRefreshing ? (
        <SkeletonMyAbsenceTab />
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          Une erreur est survenue lors du chargement des absences.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <AbsenceHistorySection
          absences={absencesData}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onViewDetails={handleViewDetails}
          getTypeColor={getTypeColor}
          getStatutColor={getStatutColor}
          getStatutLabel={getStatutLabel}
          onRefresh={refetchAbsences}
          onSubmitJustificatif={handleOpenSubmitJustification}
        />
        </div>
      )}
      
      <DialogSubmitJustification
        isOpen={isSubmitJustificatifOpen}
        onOpenChange={setIsSubmitJustificatifOpen}
        absences={absencesData}
        selectedAbsences={Array.from(selectedAbsenceKeys)}
        singleAbsenceMode={selectedAbsenceKeys.size === 1}
        onAbsenceSelection={(absenceId: string, isSelected: boolean) => {
          const newSelection = new Set(selectedAbsenceKeys);
          if (isSelected) {
            newSelection.add(absenceId);
          } else {
            newSelection.delete(absenceId);
          }
          setSelectedAbsenceKeys(newSelection);
        }}
        onSubmit={async (data) => {
          try {
            await handleSubmitJustification({
              type: data.type,
              reason: data.reason,
              file: data.file,
              files: data.files,
              selectedAbsences: Array.from(selectedAbsenceKeys),
              absence_codes: Array.from(selectedAbsenceKeys) // Use the same as selectedAbsences if not provided
            });
          } catch (error) {
            console.error('Error in onSubmit:', error);
            throw error; // Make sure to re-throw to show error in UI
          }
        }}
        isLoading={isSubmittingJustification}
      />
<DialogViewDetail
        isOpen={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        absence={selectedAbsence ? ('statut' in selectedAbsence ? selectedAbsence : mapAbsenceToUI(selectedAbsence)) : null}
        getTypeColor={getTypeColor}
        getStatutColor={getStatutColor}
        getStatutLabel={getStatutLabel}
      />
    </div>
  );
}

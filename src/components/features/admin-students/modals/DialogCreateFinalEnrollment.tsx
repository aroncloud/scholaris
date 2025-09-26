/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAcademicYearStore } from '@/store/useAcademicYearStore';
import { useStudentStore } from '@/store/studentStore';
import { createEnrollment, getCurriculumList } from '@/actions/programsAction';
import { showToast } from '@/components/ui/showToast';
import { IGetAcademicYears } from '@/types/planificationType';
import { ICreateCurriculum } from '@/types/programTypes';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
interface DialogCreateFinalEnrollmentProps {
  isOpen: boolean;
  onClose: () => void;
  studentCode: string;
  studentId?: string;
  curriculumCode: string;
  programName?: string;
  onSuccess?: (enrollment: any) => void;
  onEnrollmentSuccess?: (studentId: string, status: string, academicYear?: string, notes?: string) => void;
  onCurriculumChange?: (curriculumCode: string) => void;
  onAcademicYearChange?: (academicYear: string) => void;
}

type EnrollmentFormData = {
  academic_year_code: string;
  curriculum_code: string;
  notes: string;
};

interface CurriculumOption {
  value: string;
  label: string;
}

export function DialogCreateFinalEnrollment({
  isOpen,
  onClose,
  studentCode,
  curriculumCode,
  onSuccess,
  onEnrollmentSuccess,
  onCurriculumChange,
  onAcademicYearChange,
}: DialogCreateFinalEnrollmentProps) {
  const { academicYears, fetchAcademicYears } = useAcademicYearStore();
  const updateStudentStatus = useStudentStore(state => state.updateStudentStatus);
  const [submitting, setSubmitting] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [curriculums, setCurriculums] = useState<CurriculumOption[]>([]);
  const [loadingCurriculums, setLoadingCurriculums] = useState(false);

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<EnrollmentFormData>({
    defaultValues: { 
      academic_year_code: 'ay-2024-2025',
      curriculum_code: curriculumCode || '', 
      notes: '' 
    },
  });


  const handleCurriculumChange = (value: string) => {
    setValue('curriculum_code', value, { shouldValidate: true });
    if (onCurriculumChange) {
      onCurriculumChange(value);
    }
  };

  const handleAcademicYearChange = (value: string) => {
    setValue('academic_year_code', value, { shouldValidate: true });
    if (onAcademicYearChange) {
      onAcademicYearChange(value);
    }
  };

  useEffect(() => {
    const fetchCurriculums = async () => {
      try {
        setLoadingCurriculums(true);
        const result = await getCurriculumList();
        console.log('Curriculum list response:', result); // Debug log
        
        if (result.code === 'success' && result.data) {
          // Check if result.data has a body property, if not use result.data directly
          const curriculumData = result.data.body || result.data;
          
          // Ensure curriculumData is an array before mapping
          if (Array.isArray(curriculumData)) {
            const curriculumOptions = curriculumData.map((curriculum: ICreateCurriculum) => ({
              value: curriculum.curriculum_code,
              label: curriculum.curriculum_name || curriculum.curriculum_code
            }));
            setCurriculums(curriculumOptions);
          } else if (typeof curriculumData === 'object' && curriculumData !== null) {
            // Handle case where data is a single object instead of an array
            const curriculumOptions = [{
              value: curriculumData.curriculum_code,
              label: curriculumData.curriculum_name || curriculumData.curriculum_code
            }];
            setCurriculums(curriculumOptions);
          } else {
            console.error('Unexpected curriculum data format:', curriculumData);
            showToast({ variant: 'error-solid', message: 'Format de données de curriculum inattendu' });
          }
        }
      } catch (error) {
        console.error('Error fetching curriculums:', error);
        showToast({ variant: 'error-solid', message: 'Erreur lors du chargement des curriculums' });
      } finally {
        setLoadingCurriculums(false);
      }
    };

    if (isOpen) {
      fetchCurriculums();
      if (curriculumCode) {
        reset({ 
          // academic_year_code: '', 
          academic_year_code: 'ay-2024-2025', 
          curriculum_code: curriculumCode, 
          notes: '' 
        });
        setValue('curriculum_code', curriculumCode, { shouldValidate: true });
      }
      setEnrolled(false);
    }
  }, [isOpen, curriculumCode, reset, setValue]);

  useEffect(() => {
    if (isOpen) {
      fetchAcademicYears();
    }
  }, [isOpen, fetchAcademicYears]);

  const onSubmit = async (data: EnrollmentFormData) => {
    try {
      setSubmitting(true);

      // Ensure notes are properly trimmed and handled
      const notes = (data.notes || '').trim();
      
      const payload = {
        academic_year_code: data.academic_year_code,
        curriculum_code: data.curriculum_code || curriculumCode,
        notes: notes, // Use the trimmed notes
        status_code: 'ENROLLED',
      };

      console.log('Submitting enrollment with payload:', payload); // Debug log

      const result = await createEnrollment(studentCode, payload);
      
      if (result?.code === 'success') {
        updateStudentStatus(studentCode, 'ENROLLED');
        setEnrolled(true);
        
        // Call onSuccess first to ensure the parent updates its state
        if (onSuccess) {
          onSuccess({ ...result.data, notes });
        }

        // Then call onEnrollmentSuccess to update the parent's UI state
        if (onEnrollmentSuccess) {
          await onEnrollmentSuccess(
            studentCode, 
            'ENROLLED', 
            result.data.academic_year_code, 
            notes // Pass the trimmed notes
          );
        }
        
        // Close the modal after all state updates are complete
        onClose();
      } else {
        throw new Error(result?.error || "Échec de la création de l'inscription");
      }
    } catch (error: any) {
      showToast({ variant: 'error-solid', message: error?.message || 'Erreur lors de l’inscription' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      // Reset form when closing
      reset({ 
        academic_year_code: 'ay-2024-2025', 
        curriculum_code: curriculumCode, 
        notes: '' 
      });
      setEnrolled(false);
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Finaliser l&apos;inscription</DialogTitle>
          <DialogDescription>
            Sélectionnez l&apos;année académique et le programme pour finaliser l&apos;inscription de l&apos;étudiant.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label>Année Académique</Label>
            <Controller
              name="academic_year_code"
              control={control}
              rules={{ required: "L'année académique est requise" }}
              render={({ field }) => (
                <div>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleAcademicYearChange(value);
                    }} 
                    value={field.value} 
                    defaultValue="ay-2024-2025"
                    disabled={submitting || enrolled}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une année académique" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map((year: IGetAcademicYears) => (
                        <SelectItem key={year.academic_year_code} value={year.academic_year_code}>
                          {year.academic_year_code.replace(/^ay-/, "")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.value && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Sélectionné: {field.value.replace(/^ay-/, "")}
                    </p>
                  )}
                </div>
              )}
            />
            {errors.academic_year_code && (
              <p className="text-red-600 text-sm">{errors.academic_year_code.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Curriculum</Label>
            <Controller
              name="curriculum_code"
              control={control}
              rules={{ required: 'Le curriculum est requis' }}
              render={({ field }) => (
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleCurriculumChange(value);
                  }} 
                  value={field.value}
                  disabled={submitting || enrolled || loadingCurriculums}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={loadingCurriculums ? "Chargement des curriculums..." : "Sélectionner un curriculum"} />
                  </SelectTrigger>
                  <SelectContent>
                    {curriculums.map((curriculum) => (
                      <SelectItem key={curriculum.value} value={curriculum.value}>
                        {curriculum.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.curriculum_code && (
              <p className="text-red-600 text-sm">{errors.curriculum_code.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Notes (Optionnel)</Label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Textarea {...field} placeholder="Ajoutez des notes" className="w-full min-h-[120px]" disabled={submitting || enrolled} />
              )}
            />
          </div>

          <DialogFooter className="mt-5 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={submitting || enrolled}>
              {enrolled ? 'Inscription finalisée' : (submitting ? 'Enregistrement...' : 'Enregistrer')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

    </Dialog>
  );
}

export default DialogCreateFinalEnrollment;

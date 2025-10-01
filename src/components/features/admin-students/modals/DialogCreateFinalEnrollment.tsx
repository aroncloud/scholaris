/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAcademicYearStore } from '@/store/useAcademicYearStore';
import { useStudentStore } from '@/store/studentStore';
import { createEnrollment } from '@/actions/programsAction';
import { showToast } from '@/components/ui/showToast';
import { IGetAcademicYears } from '@/types/planificationType';
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
import { Combobox } from '@/components/ui/Combobox';
import { useFactorizedProgramStore } from '@/store/programStore';
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


export function DialogCreateFinalEnrollment({
  isOpen,
  onClose,
  studentCode,
  curriculumCode,
  onSuccess,
  onEnrollmentSuccess,
  onAcademicYearChange,
}: DialogCreateFinalEnrollmentProps) {
  const { academicYears, fetchAcademicYears } = useAcademicYearStore();
  const updateStudentStatus = useStudentStore(state => state.updateStudentStatus);
  const [submitting, setSubmitting] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const { factorizedPrograms } = useFactorizedProgramStore();
  const curriculumList = factorizedPrograms.flatMap((fp) => fp.curriculums);

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<EnrollmentFormData>({
    defaultValues: { 
      academic_year_code: 'ay-2024-2025',
      curriculum_code: curriculumCode || '', 
      notes: '' 
    },
  });




  const handleAcademicYearChange = (value: string) => {
    setValue('academic_year_code', value, { shouldValidate: true });
    if (onAcademicYearChange) {
      onAcademicYearChange(value);
    }
  };


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
              render={({ field }) => (
              <Combobox
                  options={curriculumList.map(item => {
                    return {
                      value: item.curriculum_code,
                      label: `${item.curriculum_name}`
                    }
                  })}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Sélectionner le statut"
                  className='py-5'
              />
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

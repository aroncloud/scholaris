'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAcademicYearStore } from '@/store/useAcademicYearStore';
import { useStudentStore } from '@/store/studentStore';
import { createEnrollment } from '@/actions/programsAction';
import { showToast } from '@/components/ui/showToast';
import { IGetAcademicYears } from '@/types/planificationType';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  // onEnrollmentSuccess?: (studentId: string, status: string) => void;
 onEnrollmentSuccess?: (studentId: string, status: string, academicYear?: string) => void;



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
  programName = '',
  onSuccess,
  onEnrollmentSuccess,
}: DialogCreateFinalEnrollmentProps) {
  const { academicYears, fetchAcademicYears } = useAcademicYearStore();
  const updateStudentStatus = useStudentStore(state => state.updateStudentStatus);
  const [submitting, setSubmitting] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<EnrollmentFormData>({
    defaultValues: { academic_year_code: '', curriculum_code: '', notes: '' },
  });

  useEffect(() => {
    if (isOpen && curriculumCode) {
      reset({ academic_year_code: '', curriculum_code: curriculumCode, notes: '' });
      setValue('curriculum_code', curriculumCode, { shouldValidate: true });
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

      const payload = {
        academic_year_code: data.academic_year_code,
        curriculum_code: data.curriculum_code || curriculumCode,
        notes: data.notes || 'Enrollment created',
        status_code: 'ENROLLED',
      };

      const result = await createEnrollment(studentCode, payload);
      

     if (result?.code === 'success') {
      updateStudentStatus(studentCode, 'ENROLLED'); 
      setEnrolled(true); 
      if (onEnrollmentSuccess) onEnrollmentSuccess(studentCode, 'ENROLLED', result.data.academic_year_code);
      if (onSuccess) onSuccess(result.data);
    }
    else {
        throw new Error(result?.error || "Échec de la création de l'inscription");
      }
    } catch (error: any) {
      showToast({ variant: 'error', message: error?.message || 'Erreur lors de l’inscription' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      // Reset form when closing
      reset({ academic_year_code: '', curriculum_code: curriculumCode, notes: '' });
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
                <Select onValueChange={field.onChange} value={field.value} disabled={submitting || enrolled}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une année académique" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((year: IGetAcademicYears) => (
                      <SelectItem key={year.academic_year_code} value={year.academic_year_code}>
                        {/* {year.academic_year_code} */}
                        {year.academic_year_code.replace(/^ay-/, "")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              rules={{ required: 'Le code du programme est requis' }}
              render={({ field }) => (
                <Input {...field} placeholder="Code du programme" disabled readOnly className="w-full bg-gray-100" />
              )}
            />
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

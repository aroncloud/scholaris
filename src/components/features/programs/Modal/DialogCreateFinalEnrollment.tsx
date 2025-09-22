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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentCode: string;
  studentId?: string;
  curriculumCode: string;
  programName?: string;
  onSuccess?: (enrollment: any) => void;
  onEnrollmentSuccess?: (studentId: string, status: string) => void;
}

type EnrollmentFormData = {
  academic_year_code: string;
  curriculum_code: string;
  notes: string;
};

export function DialogCreateFinalEnrollment({
  open,
  onOpenChange,
  studentCode,
  curriculumCode,
  programName = '',
  onSuccess,
  onEnrollmentSuccess,
}: DialogCreateFinalEnrollmentProps) {
  const { academicYears, fetchAcademicYears } = useAcademicYearStore();
  const updateStudentStatus = useStudentStore(state => state.updateStudentStatus);

  const [submitting, setSubmitting] = useState(false);
  const [enrolled, setEnrolled] = useState(false); // ✅ Track success

  const { control, handleSubmit, reset, setValue, formState: { errors }, watch } = useForm<EnrollmentFormData>({
    defaultValues: { academic_year_code: '', curriculum_code: '', notes: '' },
  });

  useEffect(() => {
    if (open && curriculumCode) {
      reset({ academic_year_code: '', curriculum_code: curriculumCode, notes: '' });
      setValue('curriculum_code', curriculumCode, { shouldValidate: true });
      setEnrolled(false); // Reset on modal open
    }
  }, [open, curriculumCode, reset, setValue]);

  useEffect(() => {
    if (open) fetchAcademicYears();
  }, [open, fetchAcademicYears]);

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
        updateStudentStatus(studentCode, 'ENROLLED'); // ✅ Update store
        setEnrolled(true); // ✅ Disable button
        if (onEnrollmentSuccess) onEnrollmentSuccess(studentCode, 'ENROLLED');
        if (onSuccess) onSuccess(result.data);

        showToast({ variant: 'success', message: 'Inscription créée avec succès' });
      } else {
        throw new Error(result?.error || "Échec de la création de l'inscription");
      }
    } catch (error: any) {
      showToast({ variant: 'error', message: error?.message || 'Erreur lors de l’inscription' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une année académique" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((year: IGetAcademicYears) => (
                      <SelectItem key={year.academic_year_code} value={year.academic_year_code}>
                        {year.academic_year_code}
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
            <Label>Programme</Label>
            <Controller
              name="curriculum_code"
              control={control}
              rules={{ required: 'Le code du programme est requis' }}
              render={({ field }) => (
                <Input {...field} placeholder="Code du programme" disabled readOnly className="bg-gray-100" />
              )}
            />
          </div>

          <div className="space-y-1">
            <Label>Notes (Optionnel)</Label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Textarea {...field} placeholder="Ajoutez des notes" className="min-h-[100px]" disabled={submitting || enrolled} />
              )}
            />
          </div>

          <DialogFooter className="mt-5 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
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

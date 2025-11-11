/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { showToast } from '@/components/ui/showToast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Combobox } from '@/components/ui/Combobox';
import { useFactorizedProgramStore } from '@/store/programStore';
import { CheckCircle } from 'lucide-react';

interface DialogFinalizeEnrollmentProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  currentCurriculumCode: string;
  currentCurriculumName: string;
  currentProgramCode: string;
  onConfirm: (curriculumCode: string) => Promise<void>;
  loading?: boolean;
}

type FinalizeFormData = {
  curriculum_code: string;
};

export function DialogFinalizeEnrollment({
  isOpen,
  onClose,
  studentName,
  currentCurriculumCode,
  currentCurriculumName,
  currentProgramCode,
  onConfirm,
  loading = false,
}: DialogFinalizeEnrollmentProps) {
  const { factorizedPrograms } = useFactorizedProgramStore();
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FinalizeFormData>({
    defaultValues: {
      curriculum_code: currentCurriculumCode,
    },
  });

  // Filtrer les curriculums du même programme
  const availableCurriculums = useMemo(() => {
    const currentProgram = factorizedPrograms.find(
      (fp) => fp.program.program_code === currentProgramCode
    );

    if (!currentProgram) return [];

    return currentProgram.curriculums.map((curriculum) => ({
      value: curriculum.curriculum_code,
      label: curriculum.curriculum_name,
    }));
  }, [factorizedPrograms, currentProgramCode]);

  // Réinitialiser le formulaire quand le dialog s'ouvre
  useEffect(() => {
    if (isOpen) {
      reset({
        curriculum_code: currentCurriculumCode,
      });
    }
  }, [isOpen, currentCurriculumCode, reset]);

  const onSubmit = async (data: FinalizeFormData) => {
    try {
      setSubmitting(true);
      await onConfirm(data.curriculum_code);
    } catch (error: any) {
      showToast({
        variant: 'error-solid',
        message: error?.message || "Erreur lors de la finalisation de l'inscription",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !submitting && !loading) {
      onClose();
      reset({
        curriculum_code: currentCurriculumCode,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="md:min-w-3xl max-h-[95vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-slate-200 sticky top-0 bg-slate-50 z-10">
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Finaliser l&apos;inscription
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 mt-1">
            Vous êtes sur le point de finaliser l&apos;inscription de{' '}
            <span className="font-semibold text-gray-900">{studentName}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 max-h-[calc(95vh-180px)] overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-1">
              <Label className="font-medium text-gray-700">
                Sélectionner le curriculum <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="curriculum_code"
                control={control}
                rules={{ required: 'Le curriculum est requis' }}
                render={({ field }) => (
                  <div>
                    <Combobox
                      options={availableCurriculums}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Sélectionner un curriculum"
                      disabled={submitting || loading}
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      Curriculum par défaut : {currentCurriculumName}
                    </p>
                  </div>
                )}
              />
              {errors.curriculum_code && (
                <p className="text-red-500 text-sm">{errors.curriculum_code.message}</p>
              )}
            </div>

            {/* <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900">
                 Cette action est irréversible. L&apos;étudiant sera inscrit pour l&apos;année
                académique en cours.
              </p>
            </div> */}
          </form>
        </div>

        <DialogFooter className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting || loading}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={submitting || loading}
              onClick={handleSubmit(onSubmit)}
              variant={"info"}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {submitting || loading ? 'Finalisation en cours...' : 'Oui, finaliser'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DialogFinalizeEnrollment;
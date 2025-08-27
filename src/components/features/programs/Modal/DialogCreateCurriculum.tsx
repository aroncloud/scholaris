"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ICreateCurriculum } from "@/types/programTypes";

export interface DialogCurriculumProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ICreateCurriculum) => Promise<void>;
  initialData?: ICreateCurriculum; // Utilisé uniquement pour la mise à jour
}


export function DialogCreateCurriculum({ open, onOpenChange, onSave, initialData }: DialogCurriculumProps) {
  const { register, handleSubmit, reset } = useForm<ICreateCurriculum>({
    defaultValues: initialData || {
      curriculum_code: "",
      program_code: "",
      study_level: "",
      curriculum_name: "",
      status_code: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: ICreateCurriculum) => {
    await onSave(data);
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Mettre à jour le curriculum" : "Créer un nouveau curriculum"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Code du curriculum</Label>
            <Input {...register("curriculum_code", { required: true })} />
          </div>
          <div>
            <Label>Code du programme</Label>
            <Input {...register("program_code", { required: true })} />
          </div>
          <div>
            <Label>Niveau d&apos;étude</Label>
            <Input {...register("study_level", { required: true })} />
          </div>
          <div>
            <Label>Nom du curriculum</Label>
            <Input {...register("curriculum_name", { required: true })} />
          </div>
          <div>
            <Label>Code du statut</Label>
            <Input {...register("status_code", { required: true })} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {initialData ? "Mettre à jour" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

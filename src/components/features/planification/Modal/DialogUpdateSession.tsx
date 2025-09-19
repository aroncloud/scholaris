"use client";

import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IFullCalendarEvent } from "@/components/features/planification/Calendar/CalendarPlanification";
import { useClassroomStore } from "@/store/useClassroomStore";
import { useEffect } from "react";

interface DialogUpdateSessionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { resource_code: string; session_title: string }) => Promise<boolean>;
  onCancelSession: () => Promise<boolean>;
  eventData: IFullCalendarEvent | null;
}

export function DialogUpdateSession({
  open,
  onOpenChange,
  onSave,
  onCancelSession,
  eventData,
}: DialogUpdateSessionProps) {
  const { classrooms } = useClassroomStore();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<{ resource_code: string; session_title: string }>({
    defaultValues: {
      resource_code: eventData?.classroom ?? "",
      session_title: eventData?.title ?? "",
    },
  });


  useEffect(() => {
    if (open) {
        const ressource = classrooms.find((c) => c.resource_name === eventData?.classroom);

        setValue("resource_code", ressource?.resource_code ?? "");
        setValue("session_title", eventData?.title ?? "");
    }
  }, [open, eventData, setValue, classrooms]);

  const handleCancel = () => {
    if (isSubmitting) return;
    reset();
    onOpenChange(false);
  };

  const handleSubmitForm = async (data: { resource_code: string; session_title: string }) => {
    const result = await onSave(data);
    if (result) {
      reset();
      onOpenChange(false);
    }
  };

  const handleCancelSessionClick = async () => {
    await onCancelSession();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mettre à jour la session</DialogTitle>
          <DialogDescription>Modifiez le titre ou la salle de la session</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleSubmitForm)} className="grid gap-4">
          {/* Titre */}
          <div className="space-y-1">
            <Label>Titre de la session</Label>
            <Input
              {...register("session_title", { required: "Titre requis" })}
              disabled={isSubmitting}
              className={errors.session_title ? "border-red-500" : ""}
            />
            {errors.session_title && <p className="text-red-600 text-sm">{errors.session_title.message}</p>}
          </div>

          {/* Salle */}
          <div className="space-y-1">
            <Label>Salle</Label>
            <Controller
              name="resource_code"
              control={control}
              rules={{ required: "Salle requise" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                  <SelectTrigger className={errors.resource_code ? "border-red-500 w-full" : "w-full"}>
                    <SelectValue placeholder="Sélectionner une salle" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {classrooms.map((c) => (
                      <SelectItem key={c.resource_code} value={c.resource_code}>
                        {c.resource_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.resource_code && <p className="text-red-600 text-sm">{errors.resource_code.message}</p>}
          </div>

          <DialogFooter className="flex justify-between">
            <div className="space-x-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enregistrement..." : "Mettre à jour"}
              </Button>
            </div>
            <Button variant="destructive" type="button" onClick={handleCancelSessionClick} disabled={isSubmitting}>
              Annuler la session
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

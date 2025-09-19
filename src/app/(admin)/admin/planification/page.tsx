"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogCreateClassroom } from "@/components/features/classroom/modal/DialogCreateClassroom";
import { ICreateClassroom } from "@/types/classroomType";
import { createClassroom } from "@/actions/classroomAction";
import { showToast } from "@/components/ui/showToast";
import { useClassroomData } from "@/hooks/feature/classroom/useClassroomData";
import SequenceTab from "@/components/features/planification/SequenceTab";

export default function ClassroomPage() {
  const [isCreateClassroom, setIsCreateClassroomDialogOpen] = useState(false);
const { refresh } =  useClassroomData();

  const handleCreateClassroom = async (classroom: ICreateClassroom) => {
    console.log('classroom', classroom)
    const result = await createClassroom (classroom);
    console.log("Create classroom result:", result);

    if (result.code === 'success') {
      setIsCreateClassroomDialogOpen(false);
      showToast({
        variant: "success-solid",
        message: 'Salle de classe créé avec succès',
        description: `${classroom.resource_name} a été ajouté.`,
        position: 'top-center',
      });
      console.log('before refresh')
      await refresh();
      console.log('after refresh')
      return true
    } else {
      showToast({
        variant: "error-solid",
        message: "Impossible de créer la salle de classe",
        description:result.error ?? "Une erreur est survenue, essayez encore ou veuillez contacter l'administrateur",
        position: 'top-center',
      });
    }
    return false
  };
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col mb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Calendriers de séquences
            </h1>
            <p className="text-gray-600">
              Dates de début et fin de chaque séquence par filière et niveau
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsCreateClassroomDialogOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          + Nouvelle ressource
        </Button>
      </div>

      {/* Tabs */}
      <SequenceTab />

      {/* Modal */}
      <DialogCreateClassroom
        onOpenChange={setIsCreateClassroomDialogOpen}
        onSave={handleCreateClassroom}
        open={isCreateClassroom}
      />
    </div>
  );
}

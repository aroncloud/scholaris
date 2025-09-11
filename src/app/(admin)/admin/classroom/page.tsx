"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ResourcesTab from "@/components/features/classroom/ResourcesTab";
import PlanningTab from "@/components/features/classroom/PlanningTab";
import { DialogCreateClassroom } from "@/components/features/classroom/modal/DialogCreateClassroom";
import { ICreateClassroom } from "@/types/classroomType";
import { createClassroom } from "@/actions/classroomAction";
import { showToast } from "@/components/ui/showToast";
import { useClassroomData } from "@/hooks/feature/classroom/useClassroomData";

export default function ClassroomPage() {
  const [isCreateClassroom, setIsCreateClassroomDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
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
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Gestion des Ressources Matérielles
          </h1>
          <p className="text-gray-600">
            Gérez les Ressources, Planning du système
          </p>
        </div>

        <Button
          onClick={() => setIsCreateClassroomDialogOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          + Nouvelle ressource
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="resources">
        <TabsList className="bg-gray-100 rounded-md p-1 mb-4">
          <TabsTrigger
            value="resources"
            className="px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-md"
          >
            Ressources
          </TabsTrigger>
          <TabsTrigger
            value="planning"
            className="px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-md"
          >
            Planning
          </TabsTrigger>
        </TabsList>

        {/* Resources Tab */}
        <TabsContent value="resources">
          <div>
            <ResourcesTab
              search={search}
              filterType={filterType}
              setSearch={setSearch}
              setFilterType={setFilterType}
            />
          </div>
        </TabsContent>

        {/* Planning Tab */}
        <TabsContent value="planning">
          <div className="bg-white rounded-md shadow p-4">
            <PlanningTab />
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal */}
      <DialogCreateClassroom
        onOpenChange={setIsCreateClassroomDialogOpen}
        onSave={handleCreateClassroom}
        open={isCreateClassroom}
      />
    </div>
  );
}

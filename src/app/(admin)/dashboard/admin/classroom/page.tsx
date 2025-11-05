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
import PageHeader from "@/layout/PageHeader";
import { Calendar } from "lucide-react";

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
    <div>
      <PageHeader
        title="Gestion des Ressources Matérielles"
        description="Gérez les Ressources, Planning du système"
        Icon={Calendar}
      >
        <Button
          onClick={() => setIsCreateClassroomDialogOpen(true)}
          variant={"info"}
        >
          + Nouvelle ressource
        </Button>
      </PageHeader>
      <div className="px-2 pb-2 mt-4 md:px-6 md:pb-6 md:pt-0 mx-auto">
        {/* Tabs */}
        <Tabs defaultValue="resources">
          <TabsList className="bg-white rounded-xl border border-slate-200 p-1.5 inline-flex space-x-1 shadow-sm h-auto w-full mb-2">
            <TabsTrigger
              value="resources"
              className="px-6 py-1.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30"
            >
              Ressources
            </TabsTrigger>
            <TabsTrigger
              value="planning"
              className="px-6 py-1.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30"
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
      </div>

      {/* Modal */}
      <DialogCreateClassroom
        onOpenChange={setIsCreateClassroomDialogOpen}
        onSave={handleCreateClassroom}
        open={isCreateClassroom}
      />
    </div>
  );
}

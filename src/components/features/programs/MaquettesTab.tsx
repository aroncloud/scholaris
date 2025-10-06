'use client'

import { Button } from "@/components/ui/button";
import {
  Plus,
} from "lucide-react";
import MaquetteCard from "@/components/cards/MaquetteCard";
import { v4 as uuidv4 } from 'uuid';
import { ICreateCurriculum, ICurriculumDetail } from "@/types/programTypes";
import { useState } from "react";
import { createCurriculum } from "@/actions/programsAction";
import { showToast } from "@/components/ui/showToast";
import { DialogCreateCurriculum } from "./Modal/DialogCreateCurriculum";
import ContentLayout from "@/layout/ContentLayout";
import MaquetteCardSkeleton from "./MaquetteCardSkeleton";

type MyComponentProps = {
  curriculumList: ICurriculumDetail[];
  refresh: () => void;
  isLoading: boolean;

};

const MaquettesTab = ({curriculumList, refresh, isLoading}: MyComponentProps) => {
  // ---- Curriculum ----
  const [isCreateCurriculumDialogOpen, setIsCreateCurriculumDialogOpen] = useState(false);



  

  const handleCreateCurriculum = async (curriculum: ICreateCurriculum) => {
    const result = await createCurriculum(curriculum);
    console.log("Create curriculum result:", result);

    if (result.code === 'success') {
      setIsCreateCurriculumDialogOpen(false);
      showToast({
          variant: "success-solid",
          message: 'Curriculum créé avec succès',
          description: `${curriculum.curriculum_name} a été ajouté.`,
          position: 'top-center',
      })
      refresh()
    } else {
      showToast({
          variant: "error-solid",
          message: "Impossible de créer le curriculum",
          description: result.code,
          position: 'top-center',
      })
    }
  }




  return (
    <div>
      <ContentLayout
        title={`Maquettes de formation`}
        description="Liste détaillée des maquettes de formation jusqu'aux UE"
        actions = {
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {setIsCreateCurriculumDialogOpen(true)}}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une maquette
          </Button>
        }
      >
        <div className="space-y-3">
          {
            isLoading ? <>
              <MaquetteCardSkeleton />
              <MaquetteCardSkeleton />
              <MaquetteCardSkeleton />
              <MaquetteCardSkeleton />
              <MaquetteCardSkeleton />
            </>
            :
            curriculumList.map(curric => {
              return <MaquetteCard
                key={uuidv4()}
                curriculum={curric}
                refresh={refresh}
                programName={curric.program.program_name}
                isLoading={isLoading}
              />
            })
          }
        </div>
      </ContentLayout>

      <DialogCreateCurriculum
        onOpenChange={setIsCreateCurriculumDialogOpen}
        onSave={handleCreateCurriculum}
        open={isCreateCurriculumDialogOpen}

      />
    </div>
  )
}

export default MaquettesTab
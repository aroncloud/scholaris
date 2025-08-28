'use client'
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import {
  Plus,
} from "lucide-react";
import MaquetteCard from "@/components/cards/MaquetteCard";
import { v4 as uuidv4 } from 'uuid';
import { ICreateCurriculum, ICreateDomain, ICreateModule, ICreateSemester, ICreateUE, ICurriculumDetail } from "@/types/programTypes";
import { useState } from "react";
import { createCurriculum, createDomain, createModule, createSemester, createUE, updateCurriculum, updateDomain, updateModule, updateSemester, updateUE } from "@/actions/programsAction";
import { showToast } from "@/components/ui/showToast";
import { DialogCreateCurriculum } from "./Modal/DialogCreateCurriculum";

type MyComponentProps = {
  curriculumList: ICurriculumDetail[];
  refresh: () => void;

};

const MaquettesTab = ({curriculumList, refresh}: MyComponentProps) => {
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
    <TabsContent value="maquettes" className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Maquettes de formation</h3>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {setIsCreateCurriculumDialogOpen(true)}}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une maquette
        </Button>
      </div>

      <div className="space-y-4">
        {/* Licence 3 Informatique */}
        {
          curriculumList.map(curric => {
            return <MaquetteCard
              key={uuidv4()}
              curriculum={curric}
              refresh={refresh}
              programName={curric.program.program_name}
            />
          })
        }
      </div>

      <DialogCreateCurriculum
        onOpenChange={setIsCreateCurriculumDialogOpen}
        onSave={handleCreateCurriculum}
        open={isCreateCurriculumDialogOpen}

      />
    </TabsContent>
  )
}

export default MaquettesTab
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

type MyComponentProps = {
  curriculumList: ICurriculumDetail[];
  refresh: () => void;

};

const MaquettesTab = ({curriculumList, refresh}: MyComponentProps) => {
  // ---- Curriculum ----
  const [selectedCurriculum, setSelectedCurriculum] = useState<ICreateCurriculum | null>(null);
  const [isCreateCurriculumDialogOpen, setIsCreateCurriculumDialogOpen] = useState(false);
  const [isUpdateCurriculumDialogOpen, setIsUpdateCurriculumDialogOpen] = useState(false);

  // ---- Domaine ----
  const [selectedDomain, setSelectedDomain] = useState<ICreateDomain | null>(null);
  const [isCreateDomainDialogOpen, setIsCreateDomainDialogOpen] = useState(false);
  const [isUpdateDomainDialogOpen, setIsUpdateDomainDialogOpen] = useState(false);

  // ---- Module ----
  const [selectedModule, setSelectedModule] = useState<ICreateModule | null>(null);
  const [isCreateModuleDialogOpen, setIsCreateModuleDialogOpen] = useState(false);
  const [isUpdateModuleDialogOpen, setIsUpdateModuleDialogOpen] = useState(false);

  // ---- Séquence ----
  const [selectedSequence, setSelectedSequence] = useState<ICreateSemester | null>(null);
  const [isCreateSequenceDialogOpen, setIsCreateSequenceDialogOpen] = useState(false);
  const [isUpdateSequenceDialogOpen, setIsUpdateSequenceDialogOpen] = useState(false);

  // ---- UE ----
  const [selectedUE, setSelectedUE] = useState<ICreateUE | null>(null);
  const [isCreateUEDialogOpen, setIsCreateUEDialogOpen] = useState(false);
  const [isUpdateUEDialogOpen, setIsUpdateUEDialogOpen] = useState(false);



  

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

  const handleUpdateCurriculum = async (curriculum: ICreateCurriculum) => {
    const result = await updateCurriculum(curriculum);
    console.log("Update curriculum result:", result);

    if (result.code === 'success') {
      setIsUpdateCurriculumDialogOpen(false);
      showToast({
          variant: "success-solid",
          message: 'Curriculum mis à jour avec succès',
          description: `${curriculum.curriculum_name} a été ajouté.`,
          position: 'top-center',
      })
      refresh()
    } else {
      showToast({
          variant: "error-solid",
          message: "Impossible de mettre a jour le curriculum",
          description: result.code,
          position: 'top-center',
      })
    }
  }

  // --- Domain ---
  const handleCreateDomain = async (domain: ICreateDomain) => {
    const result = await createDomain(domain);
    console.log("Create domain result:", result);

    if (result.code === 'success') {
      setIsCreateDomainDialogOpen(false);
      showToast({
        variant: "success-solid",
        message: 'Domaine créé avec succès',
        description: `${domain.domain_name} a été ajouté.`,
        position: 'top-center',
      });
      refresh();
    } else {
      showToast({
        variant: "error-solid",
        message: "Impossible de créer le domaine",
        description: result.code,
        position: 'top-center',
      });
    }
  };

  const handleUpdateDomain = async (domain: ICreateDomain) => {
    const result = await updateDomain(domain);
    console.log("Update domain result:", result);

    if (result.code === 'success') {
      setIsUpdateDomainDialogOpen(false);
      showToast({
        variant: "success-solid",
        message: 'Domaine mis à jour avec succès',
        description: `${domain.domain_name} a été modifié.`,
        position: 'top-center',
      });
      refresh();
    } else {
      showToast({
        variant: "error-solid",
        message: "Impossible de mettre à jour le domaine",
        description: result.code,
        position: 'top-center',
      });
    }
  };

  // --- Sequence ---
  const handleCreateSequence = async (sequence: ICreateSemester) => {
    const result = await createSemester(sequence);
    console.log("Create sequence result:", result);

    if (result.code === 'success') {
      setIsCreateSequenceDialogOpen(false);
      showToast({
        variant: "success-solid",
        message: 'Séquence créée avec succès',
        description: `${sequence.sequence_name} a été ajoutée.`,
        position: 'top-center',
      });
      refresh();
    } else {
      showToast({
        variant: "error-solid",
        message: "Impossible de créer la séquence",
        description: result.code,
        position: 'top-center',
      });
    }
  };

  const handleUpdateSequence = async (sequence: ICreateSemester) => {
    const result = await updateSemester(sequence);
    console.log("Update sequence result:", result);

    if (result.code === 'success') {
      setIsUpdateSequenceDialogOpen(false);
      showToast({
        variant: "success-solid",
        message: 'Séquence mise à jour avec succès',
        description: `${sequence.sequence_name} a été modifiée.`,
        position: 'top-center',
      });
      refresh();
    } else {
      showToast({
        variant: "error-solid",
        message: "Impossible de mettre à jour la séquence",
        description: result.code,
        position: 'top-center',
      });
    }
  };

  // --- UE ---
  const handleCreateUE = async (ue: ICreateUE) => {
    const result = await createUE(ue);
    console.log("Create UE result:", result);

    if (result.code === 'success') {
      setIsCreateUEDialogOpen(false);
      showToast({
        variant: "success-solid",
        message: 'UE créée avec succès',
        description: `${ue.course_unit_name} a été ajoutée.`,
        position: 'top-center',
      });
      refresh();
    } else {
      showToast({
        variant: "error-solid",
        message: "Impossible de créer l'UE",
        description: result.code,
        position: 'top-center',
      });
    }
  };

  const handleUpdateUE = async (ue: ICreateUE) => {
    const result = await updateUE(ue);
    console.log("Update UE result:", result);

    if (result.code === 'success') {
      setIsUpdateUEDialogOpen(false);
      showToast({
        variant: "success-solid",
        message: 'UE mise à jour avec succès',
        description: `${ue.course_unit_name} a été modifiée.`,
        position: 'top-center',
      });
      refresh();
    } else {
      showToast({
        variant: "error-solid",
        message: "Impossible de mettre à jour l'UE",
        description: result.code,
        position: 'top-center',
      });
    }
  };

  // --- Module ---
  const handleCreateModule = async (module: ICreateModule) => {
    const result = await createModule(module);
    console.log("Create module result:", result);

    if (result.code === 'success') {
      setIsCreateModuleDialogOpen(false);
      showToast({
        variant: "success-solid",
        message: 'Module créé avec succès',
        description: `${module.module_name} a été ajouté.`,
        position: 'top-center',
      });
      refresh();
    } else {
      showToast({
        variant: "error-solid",
        message: "Impossible de créer le module",
        description: result.code,
        position: 'top-center',
      });
    }
  };

  const handleUpdateModule = async (module: ICreateModule) => {
    const result = await updateModule(module);
    console.log("Update module result:", result);

    if (result.code === 'success') {
      setIsUpdateModuleDialogOpen(false);
      showToast({
        variant: "success-solid",
        message: 'Module mis à jour avec succès',
        description: `${module.module_name} a été modifié.`,
        position: 'top-center',
      });
      refresh();
    } else {
      showToast({
        variant: "error-solid",
        message: "Impossible de mettre à jour le module",
        description: result.code,
        position: 'top-center',
      });
    }
  };



  return (
    <TabsContent value="maquettes" className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Maquettes de formation</h3>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {}}
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
              programName={curric.program.program_name}
            />
          })
        }
      </div>
    </TabsContent>
  )
}

export default MaquettesTab
'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
} from "lucide-react";
import MaquetteCard from "@/components/cards/MaquetteCard";
import { v4 as uuidv4 } from 'uuid';
import { ICreateCurriculum, ICurriculumDetail } from "@/types/programTypes";
import { useState, useMemo } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");



  

  const handleCreateCurriculum = async (curriculum: ICreateCurriculum) => {
    const result = await createCurriculum(curriculum);
    console.log("Create curriculum result:", result);

    if (result.code === 'success') {
      showToast({
          variant: "success-solid",
          message: 'Curriculum créé avec succès',
          description: `${curriculum.curriculum_name} a été ajouté.`,
          position: 'top-center',
      })
      refresh()
      return true;
    } else {
      showToast({
          variant: "error-solid",
          message: "Impossible de créer le curriculum",
          description: result.code,
          position: 'top-center',
      })
      return false;
    }
  }

  // Filtrer les curriculums par nom de programme
  const filteredCurriculums = useMemo(() => {
    if (!searchTerm.trim()) return curriculumList;

    return curriculumList.filter((curric) => {
      const programName = curric.program.program_name.toLowerCase();
      const curriculumName = curric.curriculum_name.toLowerCase();
      const search = searchTerm.toLowerCase();

      return programName.includes(search) || curriculumName.includes(search);
    });
  }, [curriculumList, searchTerm]);

  return (
    <div>
      <ContentLayout
        title={`Maquettes de formation`}
        description="Liste détaillée des maquettes de formation jusqu'aux UE"
        actions = {
          <Button
            variant={"info"}
            onClick={() => {setIsCreateCurriculumDialogOpen(true)}}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une maquette
          </Button>
        }
      >
        {/* Barre de recherche */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher par nom de programme ou maquette..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
          {searchTerm && (
            <p className="text-sm text-gray-500 mt-2">
              {filteredCurriculums.length} résultat{filteredCurriculums.length > 1 ? 's' : ''} trouvé{filteredCurriculums.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {
            isLoading ? <>
              <MaquetteCardSkeleton />
              <MaquetteCardSkeleton />
              <MaquetteCardSkeleton />
              <MaquetteCardSkeleton />
              <MaquetteCardSkeleton />
            </>
            : filteredCurriculums.length > 0 ? (
              filteredCurriculums.map(curric => {
                return <MaquetteCard
                  key={uuidv4()}
                  curriculum={curric}
                  refresh={refresh}
                  programName={curric.program.program_name}
                  isLoading={isLoading}
                />
              })
            ) : (
              <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun résultat trouvé
                </h3>
                <p className="text-gray-500">
                  Aucune maquette ne correspond à votre recherche &quot;{searchTerm}&quot;
                </p>
              </div>
            )
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
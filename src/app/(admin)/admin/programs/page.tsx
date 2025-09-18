'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { v4 as uuiv4 } from "uuid";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Upload,
  Plus,
} from "lucide-react";
import FilieresTab from "../../../../components/features/programs/FilieresTab";
import MaquettesTab from "../../../../components/features/programs/MaquettesTab";
import CalendrierTab from "../../../../components/features/programs/CalendrierTab";
import SkeletonFilieresTab from "@/components/features/skeleton/SkeletonFilieresTab";
import { useProgramData } from "@/hooks/feature/programs/useProgramData";
import StatCard from "@/components/cards/StatCard";

const stats = [
  {
    title: 'Filières actives',
    value: '2',
    description: 'Programmes proposés'
  },
  {
    title: 'Maquettes validées',
    value: '1',
    description: 'Structures pédagogiques'
  },
  {
    title: 'Modules enseignés',
    value: '4',
    description: "Unités d'enseignement"
  },
  {
    title: "Capacité d'accueil",
    value: 200,
    description: 'Étudiants maximum'
  },
]


export default function ProgramsPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateProgramOpen, setIsCreateProgramOpen] = useState(false);

  const { curriculumList, programs, loading, refresh, } =  useProgramData();


  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 w-full">
        {/* Texte et boutons en responsive */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3">
          <div className="w-full sm:w-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Gestion des Programmes Académiques
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Configuration des filières, maquettes et modules d&apos;enseignement
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" className="text-sm w-full sm:w-fit">
              <Download className="h-4 w-4 mr-2" />
              Exporter structure
            </Button>
            <Button variant="outline" className="text-sm w-full sm:w-fit">
              <Upload className="h-4 w-4 mr-2" />
              Importer maquette
            </Button>
            <Button
              onClick={() => setIsCreateProgramOpen(true)}
              className="text-sm w-full sm:w-fit"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle filière
            </Button>
          </div>
        </div>

        {/* Stats Cards en responsive */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4 w-full">
        {
          stats.map(stat => (
            <StatCard 
              description={stat.description}
              title={stat.title}
              value={stat.value}
              key={uuiv4()}
            />
          ))
        }
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="program" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="program">
            Filières ({programs.length})
          </TabsTrigger>
          <TabsTrigger value="maquettes">Maquettes pédagogiques</TabsTrigger>
          <TabsTrigger value="calendrier">Calendrier académique</TabsTrigger>
        </TabsList>

        {/* Filieres Tab */}
        {loading ? (
          <SkeletonFilieresTab />
        ) : (
          <FilieresTab
            programList={programs}
            setIsCreateProgramOpen={setIsCreateProgramOpen}
            isCreateProgramOpen={isCreateProgramOpen}
            isExportModalOpen={isExportModalOpen}
            setIExportModalOpen={setIsExportModalOpen}
            isImportModalOpen={isImportModalOpen}
            setIsImportModalOpen={setIsImportModalOpen}
            isDataLoading={loading}
            refresh={refresh}
          />
        )}

        {/* Maquettes Tab */}
        {!loading && <MaquettesTab curriculumList={curriculumList} refresh={refresh} />}

        {/* Modules Tab */}
        

        {/* Calendrier Tab */}
        {!loading && <CalendrierTab />}
      </Tabs>
    </div>
  );
}



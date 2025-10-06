'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { v4 as uuiv4 } from "uuid";
import { Tabs, TabsList, TabsTrigger, TabsContent, TabsContents } from '@/components/animate-ui/components/animate/tabs';
import {
  Download,
  Upload,
  Plus,
} from "lucide-react";
import { useProgramData } from "@/hooks/feature/programs/useProgramData";
// import StatCard from "@/components/cards/StatCard";
import PageHeader from "@/layout/PageHeader";
import FilieresTab from "@/components/features/programs/FilieresTab";
import MaquettesTab from "@/components/features/programs/MaquettesTab";
import CalendrierTab from "@/components/features/programs/CalendrierTab";

// const stats = [
//   {
//     title: 'Filières actives',
//     value: '2',
//     description: 'Programmes proposés'
//   },
//   {
//     title: 'Maquettes validées',
//     value: '1',
//     description: 'Structures pédagogiques'
//   },
//   {
//     title: 'Modules enseignés',
//     value: '4',
//     description: "Unités d'enseignement"
//   },
//   {
//     title: "Capacité d'accueil",
//     value: 200,
//     description: 'Étudiants maximum'
//   },
// ]


export default function ProgramsPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateProgramOpen, setIsCreateProgramOpen] = useState(false);

  const { curriculumList, programs, loading, refresh, } =  useProgramData();


  

  return (
    <>
      <PageHeader
        title='Gestion des Programmes Académiques'
        description="Configuration des filières, maquettes et modules d&apos;enseignement"
      >
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
            variant={"info"}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle filière
          </Button>
        </div>
      </PageHeader>
      
      <div className="space-y-6 max-w-7xl p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 w-full">
          {/* Stats Cards en responsive */}
          {/* <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4 w-full">
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
          </div> */}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="maquettes" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="maquettes">Maquettes pédagogiques</TabsTrigger>
            <TabsTrigger value="program">
              Filières ({programs.length})
            </TabsTrigger>
            <TabsTrigger value="academic_year">Années académiques</TabsTrigger>
          </TabsList>
            <TabsContents className="">
              {/* Maquettes Tab */}
              <TabsContent value="maquettes" className="space-y-4">
                <MaquettesTab curriculumList={curriculumList} refresh={refresh} isLoading />
              </TabsContent>


              {/* Filieres Tab */}
              <TabsContent value="program" className="space-y-4">
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
              </TabsContent>

              {/* Calendrier Tab */}
              <TabsContent value="academic_year" className="space-y-4">
                <CalendrierTab />
              </TabsContent>


            </TabsContents>
        </Tabs>
      </div>
    </>
  );
}



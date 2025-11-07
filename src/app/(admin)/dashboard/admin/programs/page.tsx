'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { v4 as uuiv4 } from "uuid";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAcademicYears } from "@/hooks/feature/planifincation/useAcademicYears"
import {
  Download,
  Upload,
  Plus,
  BookOpen,
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
  const { academicYearList, loadingAccademicyears, fetchAcademicYear } = useAcademicYears();


  

  return (
    <>
      <PageHeader
        title='Gestion des Programmes Académiques'
        description="Configuration des filières, maquettes et modules d&apos;enseignement"
        Icon={BookOpen}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
          <Button variant="outline" className="text-sm w-full">
            <Download className="h-4 w-4 mr-2" />
            Exporter structure
          </Button>
          <Button variant="outline" className="text-sm w-full">
            <Upload className="h-4 w-4 mr-2" />
            Importer maquette
          </Button>
          <Button
            onClick={() => setIsCreateProgramOpen(true)}
            className="text-sm w-full"
            variant="info"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle filière
          </Button>
        </div>

      </PageHeader>
      
      <div className="px-2 pb-2 mt-4 md:px-6 md:pb-6 md:pt-0 mx-auto">
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
        <div className="w-full">
          <Tabs defaultValue="maquettes" className="space-y-4">
            <TabsList className="bg-white rounded-xl border border-slate-200 p-1.5 inline-flex space-x-1 shadow-sm h-auto w-full mb-2 overflow-x-auto">
              <TabsTrigger 
                value="maquettes"
                className="px-3 sm:px-6 py-1.5 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30"
              >
                Maquettes pédagogiques
              </TabsTrigger>
              <TabsTrigger 
                value="program"
                className="px-3 sm:px-6 py-1.5 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30"
              >
                Filières ({programs.length})
              </TabsTrigger>
              <TabsTrigger 
                value="academic_year"
                className="px-3 sm:px-6 py-1.5 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30"
              >
                Années académiques
              </TabsTrigger>
            </TabsList>
                {/* Maquettes Tab */}
                <TabsContent value="maquettes" className="space-y-4">
                  <MaquettesTab curriculumList={curriculumList} refresh={refresh} isLoading = {loading} />
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
                  <CalendrierTab 
                    academicYears = {academicYearList}
                    isLoading = {loadingAccademicyears}
                    fetchAcademicYear = {fetchAcademicYear}
                  />
                </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}



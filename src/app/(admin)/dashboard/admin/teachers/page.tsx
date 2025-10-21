/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from '@/components/animate-ui/components/animate/tabs'
import {
  Download,
  Upload,
  Plus,
} from "lucide-react";

import TeacherTab from "@/components/features/teachers/TeacherTab";
import ApplicantTab from "@/components/features/teachers/ApplicationsTab";
import { useTeacherData } from "@/hooks/feature/teachers/useTeacherData";
import PageHeader from "@/layout/PageHeader";

const statsData= [
  {
    title: "Enseignants actifs",
    value: 42,
    description: "Personnel en activité",
  },
  {
    title: "Candidatures",
    value: 15,
    description: "En attente de traitement",
  },
  {
    title: "Heures d'enseignement",
    value: 1250,
    description: "Total annuel",
  },
];

export default function TeachersPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateTeacherOpen, setIsCreateTeacherOpen] = useState(false);
  

  const { loading, refresh, teachers, applications} = useTeacherData();


  
  return (
    <>
      <PageHeader
        title="Gestion des Enseignants"
        description="Gestion du personnel enseignant et des candidatures"
      >
        <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0 w-full md:w-auto">
          <Button className="w-full md:w-auto" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button className="w-full md:w-auto" variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button className="w-full md:w-auto" onClick={() => setIsCreateTeacherOpen(true)} variant={"info"}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel enseignant
          </Button>
        </div>
      </PageHeader>
      <div className="space-y-6 p-6">
        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {statsData.map((stat) => (
            <StatCard
              key={uuidv4()}
              title={stat.title}
              value={stat.value}
              description={stat.description}
            />
          ))}
        </div> */}


        {/* Main Content */}
        <Tabs defaultValue="enseignants" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="enseignants">
              Enseignants ({teachers.length})
            </TabsTrigger>
            <TabsTrigger value="candidatures">
              Candidatures ({applications.length})
            </TabsTrigger>
          </TabsList>
          <TabsContents>
            {/* Teachers Tab */}
            <TabsContent value="enseignants" className="space-y-4">
              <TeacherTab 
                teachers={teachers}
                setIsCreateTeacherOpen={setIsCreateTeacherOpen}
                isCreateTeacherOpen={isCreateTeacherOpen}
                isExportModalOpen={isExportModalOpen}
                setIExportModalOpen={setIsExportModalOpen}
                isImportModalOpen={isImportModalOpen}
                setIsImportModalOpen={setIsImportModalOpen}
                isDataLoading={loading}
                refresh={refresh}
              />
            </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="candidatures" className="space-y-4">
              <ApplicantTab
                applicants={applications}
                isDataLoading={loading}
              />
            </TabsContent>
          </TabsContents>
        </Tabs>
      </div>
    </>  
  );
}

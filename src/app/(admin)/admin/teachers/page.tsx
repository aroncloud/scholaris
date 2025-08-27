'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Upload,
  Plus,
} from "lucide-react";

import TeacherTab from "@/components/features/teachers/TeacherTab";
import ApplicantTab from "@/components/features/teachers/ApplicationsTab";
import StatCard from "@/components/cards/StatCard";
import { v4 as uuidv4 } from "uuid";
import { useTeacherData } from "@/hooks/feature/teachers/useTeacherData";

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
      <div className="space-y-6">
        {/* Header */}<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h2 className="text-3xl font-bold tracking-tight">
            Gestion des Enseignants
          </h2>
          <p className="text-muted-foreground">
            Gestion du personnel enseignant et des candidatures
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0 w-full md:w-auto">
          <Button className="w-full md:w-auto" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button className="w-full md:w-auto" variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button className="w-full md:w-auto" onClick={() => setIsCreateTeacherOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel enseignant
          </Button>
        </div>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {statsData.map((stat) => (
            <StatCard
              key={uuidv4()}
              title={stat.title}
              value={stat.value}
              description={stat.description}
            />
          ))}
        </div>


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

          {/* Teachers Tab */}
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

          {/* Applications Tab */}
          <ApplicantTab
            applicants={applications}
            isDataLoading={loading}
          />
        </Tabs>
      </div>
  );
}

'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Upload,
  Search,
  Plus,
  Star,
  Eye,
} from "lucide-react";

import { TeacherStatsCards } from "../../../../components/features/teachers/TeacherStatsCards";
import { TeacherTable } from "../../../../components/features/teachers/TeacherTable";
import { ApplicationTable } from "../../../../components/features/teachers/ApplicationTable";
import { TeacherDialog } from "../../../../components/features/teachers/TeacherDialog";
import { CreateTeacherDialog } from "../../../../components/features/teachers/CreateTeacherDialog";
import { UpdateTeacherDialog } from "../../../../components/features/teachers/UpdateTeacherDialog";
import { ApplicationDialog, DeleteConfirmationDialog } from "../../../../components/features/teachers/ApplicationDialog";
import { Teacher, Application, CreateTeacherRequest, UpdateTeacherRequest, TeacherAPIResponse, statutLabels, statutApplicationLabels, typeContratLabels, transformAPIResponseToTeacher } from "./types";
import { createTeacher, updateTeacher, getTeachers } from "@/actions/teacherActions";
import { useTeacherData } from "../../../../hooks/feature/teachers/useTeacherData";
import TeacherTab from "@/components/features/teachers/TeacherTab";

const mockTeachers: Teacher[] = [
  {
    id: "1",
    matricule: "ENS001",
    nom: "Martin",
    prenom: "Jean",
    email: "jean.martin@univ.fr",
    telephone: "+33123456789",
    specialite: "Anatomie",
    departement: "Sciences Médicales",
    statut: "actif",
    typeContrat: "CDI",
    salaire: 4500,
    qualification: "Docteur",
    experience: 8,
    evaluation: 4.5,
    matieres: ["Anatomie Générale", "Anatomie Pathologique"],
    heuresEnseignement: 240,
    adresse: "123 Rue Université, 75005 Paris",
  },
  {
    id: "2",
    matricule: "ENS002",
    nom: "Dubois",
    prenom: "Sophie",
    email: "sophie.dubois@univ.fr",
    telephone: "+33123456790",
    specialite: "Physiologie",
    departement: "Sciences Biologiques",
    statut: "actif",
    typeContrat: "CDI",
    salaire: 5200,
    qualification: "Professeur",
    experience: 12,
    evaluation: 4.8,
    matieres: ["Physiologie Humaine", "Biophysique"],
    heuresEnseignement: 320,
    adresse: "456 Avenue Sciences, 75013 Paris",
  },
  {
    id: "3",
    matricule: "ENS003",
    nom: "Bernard",
    prenom: "Paul",
    email: "paul.bernard@univ.fr",
    telephone: "+33123456791",
    specialite: "Chimie Organique",
    departement: "Sciences Chimiques",
    statut: "conge",
    typeContrat: "CDD",
    dateFinContrat: "2024-12-31",
    salaire: 3800,
    qualification: "Maître de Conférences",
    experience: 5,
    evaluation: 4.2,
    matieres: ["Chimie Organique", "Biochimie"],
    heuresEnseignement: 180,
  },
];

const mockApplications: Application[] = [
  {
    id: "1",
    nom: "Leroy",
    prenom: "Marie",
    email: "marie.leroy@email.com",
    telephone: "+33123456792",
    specialite: "Pharmacologie",
    qualification: "Docteur",
    experience: 6,
    datePostulation: "2024-01-15",
    statut: "en_attente",
    posteVise: "Enseignant Pharmacologie",
    salaireSouhaite: 4200,
    cv: "cv_marie_leroy.pdf",
    lettreMotivation: "lettre_marie_leroy.pdf",
  },
  {
    id: "2",
    nom: "Petit",
    prenom: "Thomas",
    email: "thomas.petit@email.com",
    telephone: "+33123456793",
    specialite: "Dermatologie",
    qualification: "Professeur",
    experience: 15,
    datePostulation: "2024-01-12",
    statut: "en_entretien",
    posteVise: "Professeur Dermatologie",
    salaireSouhaite: 6000,
    cv: "cv_thomas_petit.pdf",
    lettreMotivation: "lettre_thomas_petit.pdf",
  },
  {
    id: "3",
    nom: "Garcia",
    prenom: "Ana",
    email: "ana.garcia@email.com",
    telephone: "+33123456794",
    specialite: "Microbiologie",
    qualification: "Maître de Conférences",
    experience: 4,
    datePostulation: "2024-01-10",
    statut: "refuse",
    posteVise: "Enseignant Microbiologie",
    salaireSouhaite: 3500,
    commentaire: "Profil intéressant mais pas d'expérience en enseignement",
  },
];


export default function TeachersPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateTeacherOpen, setIsCreateTeacherOpen] = useState(false);
const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isTeacherDialogOpen, setIsTeacherDialogOpen] = useState(false);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [isUpdateTeacherOpen, setIsUpdateTeacherOpen] = useState(false);
  const [isViewTeacherOpen, setIsViewTeacherOpen] = useState(false);
  const [applicationComment, setApplicationComment] = useState("");
  const [formData, setFormData] = useState<Partial<Teacher>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<string | null>(null);
  

  const {error, loading, refetch, teachers} = useTeacherData();



  const handleApproveApplication = (applicationId: string) => {
    
  };

  const handleRejectApplication = (applicationId: string, comment: string) => {
    
  };



  const handleDeleteTeacher = (teacherId: string) => {
    
  };

  const handleCreateTeacher = async (teacherData: CreateTeacherRequest) => {
    const result = await createTeacher(teacherData);
      
    if (result.code === 'success') {
      refetch();
    } else {
      alert(`Erreur lors de la création: ${result.error}`);
    }
  };

  const handleUpdateTeacher = async (teacherData: UpdateTeacherRequest) => {
    const result = await updateTeacher(teacherData);
      
      if (result.code === 'success') {
        refetch();
      } else {
        alert(`Erreur lors de la mise à jour: ${result.error || "Une erreur est survenue"}`);
      }
  };

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Gestion des Enseignants
            </h2>
            <p className="text-muted-foreground">
              Gestion du personnel enseignant et des candidatures
            </p>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Importer
            </Button>
            <Button onClick={() => setIsCreateTeacherOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel enseignant
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <TeacherStatsCards teachers={teachers} applications={applications} />

        {/* Main Content */}
        <Tabs defaultValue="enseignants" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
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
          />

          {/* Applications Tab */}
          <TabsContent value="candidatures" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Candidatures d'enseignement</CardTitle>
                <CardDescription>
                  Gestion des candidatures et recrutements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApplicationTable
                  applications={applications}
                  onApprove={handleApproveApplication}
                  onReject={(application) => {
                    setSelectedApplication(application);
                    setIsApplicationDialogOpen(true);
                  }}
                  onConvertToTeacher={(application) => {
                    const newTeacher: Teacher = {
                      id: Date.now().toString(),
                      matricule: `ENS${String(Date.now()).slice(-3)}`,
                      nom: application.nom,
                      prenom: application.prenom,
                      email: application.email,
                      telephone: application.telephone,
                      specialite: application.specialite,
                      departement: "À définir",
                      statut: "candidat",
                      typeContrat: "CDD",
                      qualification: application.qualification,
                      experience: application.experience,
                      matieres: [],
                    };
                    // setTeachers([...teachers, newTeacher]);
                  }}
                  onChangeToInterview={(applicationId) => {
                    setApplications((apps) =>
                      apps.map((app) =>
                        app.id === applicationId
                          ? { ...app, statut: "en_entretien" as const }
                          : app,
                      ),
                    );
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Application Dialog */}
        <ApplicationDialog
          open={isApplicationDialogOpen}
          onOpenChange={setIsApplicationDialogOpen}
          application={selectedApplication}
          onReject={handleRejectApplication}
        />


        {/* View Teacher Details Dialog */}
        <TeacherDialog
          open={isViewTeacherOpen}
          onOpenChange={setIsViewTeacherOpen}
          teacher={selectedTeacher}
          isEditing={false}
          onSave={() => {}}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Êtes-vous sûr ?"
          description="Cette action supprimera définitivement l'enseignant. Cette action ne peut pas être annulée."
          onConfirm={() => {
            if (teacherToDelete) {
              handleDeleteTeacher(teacherToDelete);
              setTeacherToDelete(null);
            }
          }}
        />
      </div>
  );
}

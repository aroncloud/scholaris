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

import { TeacherStatsCards } from "./components/TeacherStatsCards";
import { TeacherTable } from "./components/TeacherTable";
import { ApplicationTable } from "./components/ApplicationTable";
import { TeacherDialog } from "./components/TeacherDialog";
import { CreateTeacherDialog } from "./components/CreateTeacherDialog";
import { UpdateTeacherDialog } from "./components/UpdateTeacherDialog";
import { ApplicationDialog, DeleteConfirmationDialog } from "./components/ApplicationDialog";
import { Teacher, Application, CreateTeacherRequest, UpdateTeacherRequest, TeacherAPIResponse, statutLabels, statutApplicationLabels, typeContratLabels, transformAPIResponseToTeacher } from "./types";
import { createTeacher, updateTeacher, getTeachers } from "@/actions/teacherActions";

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
    dateEmbauche: "2020-09-01",
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
    dateEmbauche: "2019-03-15",
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
    dateEmbauche: "2022-01-10",
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartement, setFilterDepartement] = useState("all");
  const [filterStatut, setFilterStatut] = useState("all");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [applications, setApplications] =
    useState<Application[]>(mockApplications);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isTeacherDialogOpen, setIsTeacherDialogOpen] = useState(false);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [isCreateTeacherOpen, setIsCreateTeacherOpen] = useState(false);
  const [isUpdateTeacherOpen, setIsUpdateTeacherOpen] = useState(false);
  const [isViewTeacherOpen, setIsViewTeacherOpen] = useState(false);
  const [applicationComment, setApplicationComment] = useState("");
  const [formData, setFormData] = useState<Partial<Teacher>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const result = await getTeachers();
      
      console.log('API Response:', result);
      
      if (result.code === 'success' && result.data && result.data.body && Array.isArray(result.data.body)) {
        const transformedTeachers = result.data.body.map((apiTeacher: TeacherAPIResponse) => 
          transformAPIResponseToTeacher(apiTeacher)
        );
        console.log('Transformed teachers:', transformedTeachers);
        setTeachers(transformedTeachers);
      } else {
        console.error('Error loading teachers:', result);
        setTeachers(mockTeachers);
      }
    } catch (error) {
      console.error('Error loading teachers:', error);
      setTeachers(mockTeachers);
    } finally {
      setLoading(false);
    }
  };


  const handleApproveApplication = (applicationId: string) => {
    setApplications((apps) =>
      apps.map((app) =>
        app.id === applicationId ? { ...app, statut: "accepte" as const } : app,
      ),
    );
    // toast({
    //   title: "Candidature acceptée",
    //   description: "La candidature a été acceptée avec succès.",
    // });
  };

  const handleRejectApplication = (applicationId: string, comment: string) => {
    setApplications((apps) =>
      apps.map((app) =>
        app.id === applicationId
          ? { ...app, statut: "refuse" as const, commentaire: comment }
          : app,
      ),
    );
    // toast({
    //   title: "Candidature refusée",
    //   description: "La candidature a été refusée.",
    //   variant: "destructive",
    // });
    setIsApplicationDialogOpen(false);
    setApplicationComment("");
  };

  const handleChangeTeacherStatus = (teacherId: string, newStatus: string) => {
    setTeachers((teachers) =>
      teachers.map((teacher) =>
        teacher.id === teacherId
          ? { ...teacher, statut: newStatus as any }
          : teacher,
      ),
    );
    // toast({
    //   title: "Statut modifié",
    //   description: `Le statut de l'enseignant a été changé en "${statutLabels[newStatus as keyof typeof statutLabels].label}".`,
    // });
  };

  const handleDeleteTeacher = (teacherId: string) => {
    setTeachers((teachers) => teachers.filter((t) => t.id !== teacherId));
    // toast({
    //   title: "Enseignant supprimé",
    //   description: "L'enseignant a été supprimé définitivement.",
    //   variant: "destructive",
    // });
  };

  const handleCreateTeacher = async (teacherData: CreateTeacherRequest) => {
    try {
      const result = await createTeacher(teacherData);
      
      if (result.code === 'success') {
        await loadTeachers();
        
        setIsCreateTeacherOpen(false);
        
        // toast({
        //   title: "Enseignant créé",
        //   description: "Le nouvel enseignant a été créé avec succès.",
        // });
        console.log('Teacher created successfully');
      } else {
        // toast({
        //   title: "Erreur",
        //   description: result.error || "Une erreur est survenue lors de la création.",
        //   variant: "destructive",
        // });
        console.error('Error creating teacher:', result.error);
        alert(`Erreur lors de la création: ${result.error || "Une erreur est survenue"}`);
      }
    } catch (error) {
      console.error('Error creating teacher:', error);
      alert("Une erreur est survenue lors de la création.");
      // toast({
      //   title: "Erreur",
      //   description: "Une erreur est survenue lors de la création.",
      //   variant: "destructive",
      // });
    }
  };

  const handleUpdateTeacher = async (teacherData: UpdateTeacherRequest) => {
    try {
      const result = await updateTeacher(teacherData);
      
      if (result.code === 'success') {
        await loadTeachers();
        
        setIsUpdateTeacherOpen(false);
        setSelectedTeacher(null);
        
        // toast({
        //   title: "Enseignant modifié",
        //   description: "Les informations ont été mises à jour avec succès.",
        // });
        console.log('Teacher updated successfully');
      } else {
        // toast({
        //   title: "Erreur",
        //   description: result.error || "Une erreur est survenue lors de la mise à jour.",
        //   variant: "destructive",
        // });
        console.error('Error updating teacher:', result.error);
        alert(`Erreur lors de la mise à jour: ${result.error || "Une erreur est survenue"}`);
      }
    } catch (error) {
      console.error('Error updating teacher:', error);
      alert("Une erreur est survenue lors de la mise à jour.");
      // toast({
      //   title: "Erreur",
      //   description: "Une erreur est survenue lors de la mise à jour.",
      //   variant: "destructive",
      // });
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.specialite.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartement =
      filterDepartement === "all" || teacher.departement === filterDepartement;
    const matchesStatut =
      filterStatut === "all" || teacher.statut === filterStatut;

    return matchesSearch && matchesDepartement && matchesStatut;
  });

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
            <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
          </TabsList>

          {/* Teachers Tab */}
          <TabsContent value="enseignants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personnel enseignant</CardTitle>
                <CardDescription>Gestion du corps professoral</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Select
                      value={filterDepartement}
                      onValueChange={setFilterDepartement}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrer par département" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          Tous les départements
                        </SelectItem>
                        <SelectItem value="Sciences Médicales">
                          Sciences Médicales
                        </SelectItem>
                        <SelectItem value="Sciences Biologiques">
                          Sciences Biologiques
                        </SelectItem>
                        <SelectItem value="Sciences Chimiques">
                          Sciences Chimiques
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={filterStatut}
                      onValueChange={setFilterStatut}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrer par statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="actif">Actif</SelectItem>
                        <SelectItem value="suspendu">Suspendu</SelectItem>
                        <SelectItem value="conge">En congé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <TeacherTable
                  teachers={filteredTeachers}
                  onViewTeacher={(teacher) => {
                    setSelectedTeacher(teacher);
                    setIsViewTeacherOpen(true);
                  }}
                  onEditTeacher={(teacher) => {
                    setSelectedTeacher(teacher);
                    setIsUpdateTeacherOpen(true);
                  }}
                  onDeleteTeacher={(teacherId) => {
                    setTeacherToDelete(teacherId);
                    setDeleteDialogOpen(true);
                  }}
                  onChangeStatus={handleChangeTeacherStatus}
                />
              </CardContent>
            </Card>
          </TabsContent>

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
                      dateEmbauche: new Date().toISOString().split("T")[0],
                      qualification: application.qualification,
                      experience: application.experience,
                      matieres: [],
                    };
                    setTeachers([...teachers, newTeacher]);
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

          {/* Evaluations Tab */}
          <TabsContent value="evaluations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Évaluations des enseignants</CardTitle>
                <CardDescription>
                  Suivi des performances et évaluations étudiants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teachers
                    .filter((t) => t.evaluation)
                    .map((teacher) => (
                      <div
                        key={teacher.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="font-medium">
                              {teacher.prenom} {teacher.nom}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {teacher.specialite}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              {teacher.matieres.map((matiere, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {matiere}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="font-bold text-lg">
                                {teacher.evaluation}/5
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Note étudiants
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-lg">
                              {teacher.heuresEnseignement}h
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Heures/an
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Détails
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
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

        {/* Create Teacher Dialog */}
        <CreateTeacherDialog
          open={isCreateTeacherOpen}
          onOpenChange={setIsCreateTeacherOpen}
          onSave={handleCreateTeacher}
        />

        {/* Update Teacher Dialog */}
        <UpdateTeacherDialog
          open={isUpdateTeacherOpen}
          onOpenChange={setIsUpdateTeacherOpen}
          teacher={selectedTeacher}
          onSave={handleUpdateTeacher}
        />

        {/* Edit Teacher Dialog */}
        <TeacherDialog
          open={isTeacherDialogOpen}
          onOpenChange={setIsTeacherDialogOpen}
          teacher={selectedTeacher}
          isEditing={true}
          onSave={(updatedData) => {
            if (selectedTeacher) {
              setTeachers((teachers) =>
                teachers.map((t) =>
                  t.id === selectedTeacher.id ? { ...t, ...updatedData } : t,
                ),
              );
              setIsTeacherDialogOpen(false);
              setSelectedTeacher(null);
              setFormData({});
            }
          }}
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

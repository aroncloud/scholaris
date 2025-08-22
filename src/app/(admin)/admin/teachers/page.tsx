'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */

import { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  GraduationCap,
  Users,
  Briefcase,
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Eye,
  UserPlus,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  DollarSign,
  Bell,
  MessageSquare,
  BookOpen,
  Star,
  Building,
} from "lucide-react";

interface Teacher {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  specialite: string;
  departement: string;
  statut: "actif" | "suspendu" | "conge" | "archive" | "candidat";
  typeContrat: "CDI" | "CDD" | "Vacataire" | "Stage";
  dateEmbauche: string;
  dateFinContrat?: string;
  salaire?: number;
  qualification: string;
  experience: number;
  evaluation?: number;
  matieres: string[];
  heuresEnseignement?: number;
  adresse?: string;
}

interface Application {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  specialite: string;
  qualification: string;
  experience: number;
  datePostulation: string;
  statut: "en_attente" | "en_entretien" | "accepte" | "refuse";
  posteVise: string;
  salaireSouhaite?: number;
  cv?: string;
  lettreMotivation?: string;
  commentaire?: string;
}

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

const statutLabels = {
  actif: { label: "Actif", color: "bg-green-100 text-green-800" },
  suspendu: { label: "Suspendu", color: "bg-red-100 text-red-800" },
  conge: { label: "En congé", color: "bg-yellow-100 text-yellow-800" },
  archive: { label: "Archivé", color: "bg-gray-100 text-gray-800" },
  candidat: { label: "Candidat", color: "bg-blue-100 text-blue-800" },
};

const statutApplicationLabels = {
  en_attente: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  en_entretien: { label: "En entretien", color: "bg-blue-100 text-blue-800" },
  accepte: { label: "Accepté", color: "bg-green-100 text-green-800" },
  refuse: { label: "Refusé", color: "bg-red-100 text-red-800" },
};

const typeContratLabels = {
  CDI: { label: "CDI", color: "bg-green-100 text-green-800" },
  CDD: { label: "CDD", color: "bg-yellow-100 text-yellow-800" },
  Vacataire: { label: "Vacataire", color: "bg-blue-100 text-blue-800" },
  Stage: { label: "Stage", color: "bg-purple-100 text-purple-800" },
};

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartement, setFilterDepartement] = useState("all");
  const [filterStatut, setFilterStatut] = useState("all");
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [applications, setApplications] =
    useState<Application[]>(mockApplications);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isTeacherDialogOpen, setIsTeacherDialogOpen] = useState(false);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [isCreateTeacherOpen, setIsCreateTeacherOpen] = useState(false);
  const [isViewTeacherOpen, setIsViewTeacherOpen] = useState(false);
  const [applicationComment, setApplicationComment] = useState("");
  const [formData, setFormData] = useState<Partial<Teacher>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<string | null>(null);


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

  const handleCreateTeacher = () => {
    const newTeacher: Teacher = {
      id: Date.now().toString(),
      matricule: `ENS${String(Date.now()).slice(-3)}`,
      dateEmbauche: new Date().toISOString().split("T")[0],
      statut: "actif",
      matieres: [],
      ...formData,
    } as Teacher;

    setTeachers([...teachers, newTeacher]);
    // toast({
    //   title: "Enseignant créé",
    //   description: "Le nouvel enseignant a été créé avec succès.",
    // });
    setIsCreateTeacherOpen(false);
    setFormData({});
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
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Enseignants actifs
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teachers.filter((t) => t.statut === "actif").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Personnel en activité
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Candidatures
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {applications.filter((a) => a.statut === "en_attente").length}
              </div>
              <p className="text-xs text-muted-foreground">
                En attente de traitement
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Heures d'enseignement
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teachers.reduce(
                  (sum, t) => sum + (t.heuresEnseignement || 0),
                  0,
                )}
              </div>
              <p className="text-xs text-muted-foreground">Total annuel</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Note moyenne
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.5</div>
              <p className="text-xs text-muted-foreground">
                Évaluations étudiants
              </p>
            </CardContent>
          </Card>
        </div>

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

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Enseignant</TableHead>
                      <TableHead>Spécialité</TableHead>
                      <TableHead>Contrat</TableHead>
                      <TableHead>Évaluation</TableHead>
                      <TableHead>Heures</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {teacher.prenom} {teacher.nom}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {teacher.matricule}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {teacher.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {teacher.specialite}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {teacher.departement}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {teacher.qualification}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge
                              className={
                                typeContratLabels[teacher.typeContrat].color
                              }
                            >
                              {typeContratLabels[teacher.typeContrat].label}
                            </Badge>
                            <div className="text-sm text-muted-foreground">
                              Depuis{" "}
                              {new Date(teacher.dateEmbauche).getFullYear()}
                            </div>
                            {teacher.salaire && (
                              <div className="text-sm text-green-600">
                                {teacher.salaire}€/mois
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {teacher.evaluation && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="font-medium">
                                {teacher.evaluation}/5
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {teacher.heuresEnseignement || 0}h/an
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statutLabels[teacher.statut].color}>
                            {statutLabels[teacher.statut].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTeacher(teacher);
                                  setIsViewTeacherOpen(true);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Voir le dossier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTeacher(teacher);
                                  setFormData(teacher);
                                  setIsTeacherDialogOpen(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                Contrat
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="mr-2 h-4 w-4" />
                                Planning
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Envoyer notification
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Contacter
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {teacher.statut === "actif" ? (
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() =>
                                    handleChangeTeacherStatus(
                                      teacher.id,
                                      "suspendu",
                                    )
                                  }
                                >
                                  <Lock className="mr-2 h-4 w-4" />
                                  Suspendre
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="text-green-600"
                                  onClick={() =>
                                    handleChangeTeacherStatus(
                                      teacher.id,
                                      "actif",
                                    )
                                  }
                                >
                                  <Unlock className="mr-2 h-4 w-4" />
                                  Réactiver
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() =>
                                  handleChangeTeacherStatus(
                                    teacher.id,
                                    "archive",
                                  )
                                }
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                Archiver
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setTeacherToDelete(teacher.id);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidat</TableHead>
                      <TableHead>Poste visé</TableHead>
                      <TableHead>Qualification</TableHead>
                      <TableHead>Expérience</TableHead>
                      <TableHead>Salaire souhaité</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {application.prenom} {application.nom}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {application.email}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {application.telephone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {application.posteVise}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {application.specialite}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{application.qualification}</TableCell>
                        <TableCell>{application.experience} ans</TableCell>
                        <TableCell>
                          {application.salaireSouhaite && (
                            <span className="text-green-600">
                              {application.salaireSouhaite}€/mois
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              statutApplicationLabels[application.statut].color
                            }
                          >
                            {statutApplicationLabels[application.statut].label}
                          </Badge>
                          {application.commentaire && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {application.commentaire}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir la candidature
                              </DropdownMenuItem>
                              {application.cv && (
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  Télécharger CV
                                </DropdownMenuItem>
                              )}
                              {application.lettreMotivation && (
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  Lettre de motivation
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              {application.statut === "en_attente" && (
                                <>
                                  <DropdownMenuItem
                                    className="text-green-600"
                                    onClick={() =>
                                      handleApproveApplication(application.id)
                                    }
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Accepter
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-blue-600"
                                    onClick={() => {
                                      setApplications((apps) =>
                                        apps.map((app) =>
                                          app.id === application.id
                                            ? {
                                                ...app,
                                                statut: "en_entretien" as const,
                                              }
                                            : app,
                                        ),
                                      );
                                      // toast({
                                      //   title: "Candidature mise à jour",
                                      //   description:
                                      //     "Le statut a été changé en 'En entretien'.",
                                      // });
                                    }}
                                  >
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Convoquer entretien
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => {
                                      setSelectedApplication(application);
                                      setIsApplicationDialogOpen(true);
                                    }}
                                  >
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    Refuser
                                  </DropdownMenuItem>
                                </>
                              )}
                              {application.statut === "accepte" && (
                                <DropdownMenuItem
                                  className="text-green-600"
                                  onClick={() => {
                                    // Convertir en enseignant
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
                                      dateEmbauche: new Date()
                                        .toISOString()
                                        .split("T")[0],
                                      qualification: application.qualification,
                                      experience: application.experience,
                                      matieres: [],
                                    };
                                    setTeachers([...teachers, newTeacher]);
                                    // toast({
                                    //   title: "Enseignant ajouté",
                                    //   description:
                                    //     "Le candidat a été converti en enseignant.",
                                    // });
                                  }}
                                >
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  Convertir en enseignant
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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

        {/* Reject Application Dialog */}
        <Dialog
          open={isApplicationDialogOpen}
          onOpenChange={setIsApplicationDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Refuser la candidature</DialogTitle>
              <DialogDescription>
                Veuillez indiquer la raison du refus de la candidature.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="comment">Commentaire</Label>
                <Textarea
                  id="comment"
                  placeholder="Raison du refus..."
                  value={applicationComment}
                  onChange={(e) => setApplicationComment(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsApplicationDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  selectedApplication &&
                  handleRejectApplication(
                    selectedApplication.id,
                    applicationComment,
                  )
                }
              >
                Refuser
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Teacher Dialog */}
        <Dialog
          open={isCreateTeacherOpen}
          onOpenChange={setIsCreateTeacherOpen}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un nouvel enseignant</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  value={formData.prenom || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, prenom: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  value={formData.nom || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  value={formData.telephone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, telephone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialite">Spécialité</Label>
                <Input
                  id="specialite"
                  value={formData.specialite || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, specialite: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departement">Département</Label>
                <Select
                  value={formData.departement}
                  onValueChange={(value) =>
                    setFormData({ ...formData, departement: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                  <SelectContent>
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Select
                  value={formData.qualification}
                  onValueChange={(value) =>
                    setFormData({ ...formData, qualification: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professeur">Professeur</SelectItem>
                    <SelectItem value="Maître de Conférences">
                      Maître de Conférences
                    </SelectItem>
                    <SelectItem value="Docteur">Docteur</SelectItem>
                    <SelectItem value="Assistant">Assistant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="typeContrat">Type de contrat</Label>
                <Select
                  value={formData.typeContrat}
                  onValueChange={(value) =>
                    setFormData({ ...formData, typeContrat: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDI">CDI</SelectItem>
                    <SelectItem value="CDD">CDD</SelectItem>
                    <SelectItem value="Vacataire">Vacataire</SelectItem>
                    <SelectItem value="Stage">Stage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateTeacherOpen(false);
                  setFormData({});
                }}
              >
                Annuler
              </Button>
              <Button onClick={handleCreateTeacher}>Créer l'enseignant</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Teacher Dialog */}
        <Dialog
          open={isTeacherDialogOpen}
          onOpenChange={setIsTeacherDialogOpen}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier l'enseignant</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-prenom">Prénom</Label>
                <Input
                  id="edit-prenom"
                  value={formData.prenom || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, prenom: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-nom">Nom</Label>
                <Input
                  id="edit-nom"
                  value={formData.nom || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-telephone">Téléphone</Label>
                <Input
                  id="edit-telephone"
                  value={formData.telephone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, telephone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-salaire">Salaire</Label>
                <Input
                  id="edit-salaire"
                  type="number"
                  value={formData.salaire || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salaire: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-heures">Heures d'enseignement</Label>
                <Input
                  id="edit-heures"
                  type="number"
                  value={formData.heuresEnseignement || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      heuresEnseignement: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsTeacherDialogOpen(false);
                  setSelectedTeacher(null);
                  setFormData({});
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  if (selectedTeacher) {
                    setTeachers((teachers) =>
                      teachers.map((t) =>
                        t.id === selectedTeacher.id ? { ...t, ...formData } : t,
                      ),
                    );
                    // toast({
                    //   title: "Enseignant modifié",
                    //   description:
                    //     "Les informations ont été mises à jour avec succès.",
                    // });
                    setIsTeacherDialogOpen(false);
                    setSelectedTeacher(null);
                    setFormData({});
                  }
                }}
              >
                Modifier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Teacher Details Dialog */}
        <Dialog open={isViewTeacherOpen} onOpenChange={setIsViewTeacherOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Dossier de l'enseignant</DialogTitle>
            </DialogHeader>
            {selectedTeacher && (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Nom complet
                    </Label>
                    <p className="text-sm">
                      {selectedTeacher.prenom} {selectedTeacher.nom}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Matricule
                    </Label>
                    <p className="text-sm">{selectedTeacher.matricule}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Email
                    </Label>
                    <p className="text-sm">{selectedTeacher.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Téléphone
                    </Label>
                    <p className="text-sm">
                      {selectedTeacher.telephone || "Non renseigné"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Spécialité
                    </Label>
                    <p className="text-sm">{selectedTeacher.specialite}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Département
                    </Label>
                    <p className="text-sm">{selectedTeacher.departement}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Qualification
                    </Label>
                    <p className="text-sm">{selectedTeacher.qualification}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Type de contrat
                    </Label>
                    <Badge
                      className={
                        typeContratLabels[selectedTeacher.typeContrat].color
                      }
                    >
                      {typeContratLabels[selectedTeacher.typeContrat].label}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Date d'embauche
                    </Label>
                    <p className="text-sm">
                      {new Date(
                        selectedTeacher.dateEmbauche,
                      ).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Expérience
                    </Label>
                    <p className="text-sm">{selectedTeacher.experience} ans</p>
                  </div>
                  {selectedTeacher.salaire && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Salaire
                      </Label>
                      <p className="text-sm text-green-600">
                        {selectedTeacher.salaire}€/mois
                      </p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Statut
                    </Label>
                    <Badge
                      className={statutLabels[selectedTeacher.statut].color}
                    >
                      {statutLabels[selectedTeacher.statut].label}
                    </Badge>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Matières enseignées
                  </Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedTeacher.matieres.map((matiere, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {matiere}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action supprimera définitivement l'enseignant. Cette
                action ne peut pas être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setTeacherToDelete(null);
                }}
              >
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (teacherToDelete) {
                    handleDeleteTeacher(teacherToDelete);
                  }
                  setDeleteDialogOpen(false);
                  setTeacherToDelete(null);
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
  );
}

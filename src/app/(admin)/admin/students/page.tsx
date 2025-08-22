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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
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
import { Switch } from "@/components/ui/switch";
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
  BookOpen,
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
} from "lucide-react";
import { useRouter } from "next/navigation";



interface Student {
  id: string;
  numeroEtudiant: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  filiere: string;
  niveau: string;
  statut: "actif" | "suspendu" | "diplome" | "abandonne" | "transfere";
  moyenne?: number;
  absences?: number;
  retards?: number;
  promotion?: string;
  dateInscription: string;
  dateObtention?: string;
  mention?: string;
  moyenneFinale?: number;
  statutFinancier?: "a_jour" | "en_retard" | "bourseuse" | "exoneree";
  montantDu?: number;
}

interface EnrollmentRequest {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  filiere: string;
  niveau: string;
  datedemande: string;
  statut: "en_attente" | "approuve" | "rejete";
  documents: string[];
  commentaire?: string;
}

const mockEnrollmentRequests: EnrollmentRequest[] = [
  {
    id: "1",
    nom: "Martin",
    prenom: "Sophie",
    email: "sophie.martin@email.com",
    telephone: "+33123456789",
    filiere: "Médecine",
    niveau: "Année 1",
    datedemande: "2024-01-15",
    statut: "en_attente",
    documents: ["Baccalauréat", "Certificat médical", "Photo d'identité"],
  },
  {
    id: "2",
    nom: "Durand",
    prenom: "Pierre",
    email: "pierre.durand@email.com",
    telephone: "+33123456790",
    filiere: "Pharmacie",
    niveau: "Année 1",
    datedemande: "2024-01-12",
    statut: "approuve",
    documents: ["Baccalauréat", "Certificat médical"],
  },
  {
    id: "3",
    nom: "Bernard",
    prenom: "Claire",
    email: "claire.bernard@email.com",
    telephone: "+33123456791",
    filiere: "Dentaire",
    niveau: "Année 1",
    datedemande: "2024-01-10",
    statut: "rejete",
    documents: ["Baccalauréat"],
    commentaire: "Documents manquants",
  },
];

const mockCurrentStudents: Student[] = [
  {
    id: "1",
    numeroEtudiant: "ETU2024001",
    nom: "Dupont",
    prenom: "Marie",
    email: "marie.dupont@etud.univ.fr",
    telephone: "+33123456780",
    filiere: "Pharmacie",
    niveau: "Année 1",
    statut: "actif",
    moyenne: 15.2,
    absences: 2,
    retards: 1,
    dateInscription: "2023-09-01",
    statutFinancier: "a_jour",
    montantDu: 0,
  },
  {
    id: "2",
    numeroEtudiant: "ETU2024002",
    nom: "Martin",
    prenom: "Jean",
    email: "jean.martin@etud.univ.fr",
    telephone: "+33123456781",
    filiere: "Médecine",
    niveau: "Année 2",
    statut: "actif",
    moyenne: 12.8,
    absences: 5,
    retards: 3,
    dateInscription: "2022-09-01",
    statutFinancier: "en_retard",
    montantDu: 500,
  },
  {
    id: "3",
    numeroEtudiant: "ETU2024003",
    nom: "Bernard",
    prenom: "Sophie",
    email: "sophie.bernard@etud.univ.fr",
    telephone: "+33123456782",
    filiere: "Dentaire",
    niveau: "Année 3",
    statut: "suspendu",
    moyenne: 8.5,
    absences: 12,
    retards: 8,
    dateInscription: "2021-09-01",
    statutFinancier: "en_retard",
    montantDu: 1200,
  },
];

const mockGraduatedStudents: Student[] = [
  {
    id: "4",
    numeroEtudiant: "ETU2023015",
    nom: "Leroy",
    prenom: "Anne",
    email: "anne.leroy@alumni.univ.fr",
    filiere: "Pharmacie",
    niveau: "Diplômée",
    promotion: "2023",
    dateInscription: "2019-09-01",
    dateObtention: "2023-07-15",
    mention: "Assez bien",
    moyenneFinale: 13.8,
    statut: "diplome",
  },
  {
    id: "5",
    numeroEtudiant: "ETU2023020",
    nom: "Petit",
    prenom: "Paul",
    email: "paul.petit@alumni.univ.fr",
    filiere: "Médecine",
    niveau: "Diplômé",
    promotion: "2023",
    dateInscription: "2017-09-01",
    dateObtention: "2023-07-10",
    mention: "Bien",
    moyenneFinale: 15.2,
    statut: "diplome",
  },
];

const statutLabels = {
  actif: { label: "Actif", color: "bg-green-100 text-green-800" },
  suspendu: { label: "Suspendu", color: "bg-red-100 text-red-800" },
  diplome: { label: "Diplômé", color: "bg-blue-100 text-blue-800" },
  abandonne: { label: "Abandon", color: "bg-gray-100 text-gray-800" },
  transfere: { label: "Transféré", color: "bg-yellow-100 text-yellow-800" },
};

const statutFinancierLabels = {
  a_jour: { label: "À jour", color: "bg-green-100 text-green-800" },
  en_retard: { label: "En retard", color: "bg-red-100 text-red-800" },
  bourseuse: { label: "Boursière", color: "bg-blue-100 text-blue-800" },
  exoneree: { label: "Exonérée", color: "bg-purple-100 text-purple-800" },
};

export default function StudentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFiliere, setFilterFiliere] = useState("all");
  const [filterStatut, setFilterStatut] = useState("all");
  const [enrollmentRequests, setEnrollmentRequests] = useState<
    EnrollmentRequest[]
  >(mockEnrollmentRequests);
  const [currentStudents, setCurrentStudents] =
    useState<Student[]>(mockCurrentStudents);
  const [graduatedStudents] = useState<Student[]>(mockGraduatedStudents);
  const [selectedRequest, setSelectedRequest] =
    useState<EnrollmentRequest | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [isCreateStudentOpen, setIsCreateStudentOpen] = useState(false);
  const [requestComment, setRequestComment] = useState("");
  const [formData, setFormData] = useState<Partial<Student>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);


  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return "bg-yellow-100 text-yellow-800";
      case "approuve":
      case "actif":
        return "bg-green-100 text-green-800";
      case "rejete":
      case "suspendu":
        return "bg-red-100 text-red-800";
      case "diplome":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMentionColor = (mention: string) => {
    switch (mention) {
      case "Très bien":
        return "bg-green-100 text-green-800";
      case "Bien":
        return "bg-blue-100 text-blue-800";
      case "Assez bien":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleApproveRequest = (requestId: string) => {
    setEnrollmentRequests((requests) =>
      requests.map((req) =>
        req.id === requestId ? { ...req, statut: "approuve" as const } : req,
      ),
    );
    // toast({
    //   title: "Demande approuvée",
    //   description: "La demande d'inscription a été approuvée avec succès.",
    // });
  };

  const handleRejectRequest = (requestId: string, comment: string) => {
    setEnrollmentRequests((requests) =>
      requests.map((req) =>
        req.id === requestId
          ? { ...req, statut: "rejete" as const, commentaire: comment }
          : req,
      ),
    );
    // toast({
    //   title: "Demande rejetée",
    //   description: "La demande d'inscription a été rejetée.",
    //   variant: "destructive",
    // });
    setIsRequestDialogOpen(false);
    setRequestComment("");
  };

  const handleViewStudentDetails = (studentId: string) => {
    router.push(`/student-details/${studentId}`);
  };

  const handleChangeStudentStatus = (studentId: string, newStatus: string) => {
    setCurrentStudents((students) =>
      students.map((student) =>
        student.id === studentId
          ? { ...student, statut: newStatus as any }
          : student,
      ),
    );
    // toast({
    //   title: "Statut modifié",
    //   description: `Le statut de l'étudiant a été changé en "${statutLabels[newStatus as keyof typeof statutLabels].label}".`,
    // });
  };

  const handleDeleteStudent = (studentId: string) => {
    setCurrentStudents((students) =>
      students.filter((s) => s.id !== studentId),
    );
    // toast({
    //   title: "Étudiant supprimé",
    //   description: "L'étudiant a été supprimé définitivement.",
    //   variant: "destructive",
    // });
  };

  const handleDownloadBulletin = (student: Student) => {
    
  };

  const handleCreateStudent = () => {
    const newStudent: Student = {
      id: Date.now().toString(),
      numeroEtudiant: `ETU${new Date().getFullYear()}${String(Date.now()).slice(-3)}`,
      dateInscription: new Date().toISOString().split("T")[0],
      statut: "actif",
      ...formData,
    } as Student;

    setCurrentStudents([...currentStudents, newStudent]);
    // toast({
    //   title: "Étudiant créé",
    //   description: "Le nouvel étudiant a été créé avec succès.",
    // });
    setIsCreateStudentOpen(false);
    setFormData({});
  };

  const filteredCurrentStudents = currentStudents.filter((student) => {
    const matchesSearch =
      student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.numeroEtudiant.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFiliere =
      filterFiliere === "all" ||
      student.filiere.toLowerCase() === filterFiliere;
    const matchesStatut =
      filterStatut === "all" || student.statut === filterStatut;

    return matchesSearch && matchesFiliere && matchesStatut;
  });

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-medium tracking-tight">
              Gestion des Étudiants
            </h2>
            <p className="text-muted-foreground font-normal">
              Gestion des inscriptions, étudiants actuels et diplômés
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
            <Button onClick={() => setIsCreateStudentOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel étudiant
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Demandes en attente
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  enrollmentRequests.filter((r) => r.statut === "en_attente")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Inscriptions à traiter
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Étudiants actifs
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentStudents.filter((s) => s.statut === "actif").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Actuellement inscrits
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Diplômés</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {graduatedStudents.length}
              </div>
              <p className="text-xs text-muted-foreground">Cette année</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Moyenne générale
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">13.8</div>
              <p className="text-xs text-muted-foreground">
                Tous étudiants confondus
              </p>
            </CardContent>
          </Card>
        </div>


        {/* Main Content */}
        <Tabs defaultValue="inscriptions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inscriptions">
              Demandes d'inscription ({enrollmentRequests.length})
            </TabsTrigger>
            <TabsTrigger value="etudiants">
              Étudiants actuels ({currentStudents.length})
            </TabsTrigger>
            <TabsTrigger value="diplomes">
              Diplômés ({graduatedStudents.length})
            </TabsTrigger>
          </TabsList>

          {/* Enrollment Requests Tab */}
          <TabsContent value="inscriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Demandes d'inscription</CardTitle>
                <CardDescription>
                  Traitement des nouvelles demandes d'inscription
                </CardDescription>
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
                      value={filterStatut}
                      onValueChange={setFilterStatut}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrer par statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="en_attente">En attente</SelectItem>
                        <SelectItem value="approuve">Approuvé</SelectItem>
                        <SelectItem value="rejete">Rejeté</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidat</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Formation</TableHead>
                      <TableHead>Date demande</TableHead>
                      <TableHead>Documents</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollmentRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {request.prenom} {request.nom}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-1" />
                              {request.email}
                            </div>
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-1" />
                              {request.telephone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.filiere}</div>
                            <div className="text-sm text-muted-foreground">
                              {request.niveau}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(request.datedemande).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {request.documents.map((doc, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatutColor(request.statut)}>
                            {request.statut === "en_attente"
                              ? "En attente"
                              : request.statut === "approuve"
                                ? "Approuvé"
                                : "Rejeté"}
                          </Badge>
                          {request.commentaire && (
                            <div className="text-xs text-red-600 mt-1">
                              {request.commentaire}
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
                                Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                Documents
                              </DropdownMenuItem>
                              {request.statut === "en_attente" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-green-600"
                                    onClick={() =>
                                      handleApproveRequest(request.id)
                                    }
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approuver
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => {
                                      setSelectedRequest(request);
                                      setIsRequestDialogOpen(true);
                                    }}
                                  >
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    Rejeter
                                  </DropdownMenuItem>
                                </>
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

          {/* Current Students Tab */}
          <TabsContent value="etudiants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Étudiants actuels</CardTitle>
                <CardDescription>
                  Liste des étudiants actuellement inscrits
                </CardDescription>
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
                      value={filterFiliere}
                      onValueChange={setFilterFiliere}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrer par filière" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les filières</SelectItem>
                        <SelectItem value="médecine">Médecine</SelectItem>
                        <SelectItem value="pharmacie">Pharmacie</SelectItem>
                        <SelectItem value="dentaire">Dentaire</SelectItem>
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
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Étudiant</TableHead>
                      <TableHead>Formation</TableHead>
                      <TableHead>Moyenne</TableHead>
                      <TableHead>Absences</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Financier</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCurrentStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {student.prenom} {student.nom}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {student.numeroEtudiant}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {student.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{student.filiere}</div>
                            <div className="text-sm text-muted-foreground">
                              {student.niveau}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {student.moyenne && (
                            <Badge
                              variant={
                                student.moyenne >= 10
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {student.moyenne}/20
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {student.absences || 0} absences
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {student.retards || 0} retards
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statutLabels[student.statut].color}>
                            {statutLabels[student.statut].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {student.statutFinancier && (
                            <div className="space-y-1">
                              <Badge
                                className={
                                  statutFinancierLabels[student.statutFinancier]
                                    .color
                                }
                              >
                                {
                                  statutFinancierLabels[student.statutFinancier]
                                    .label
                                }
                              </Badge>
                              {student.montantDu && student.montantDu > 0 && (
                                <div className="text-xs text-red-600">
                                  Dû: {student.montantDu}€
                                </div>
                              )}
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
                              <DropdownMenuItem
                                onClick={() =>
                                  handleViewStudentDetails(student.id)
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Voir dossier complet
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setFormData(student);
                                  setIsStudentDialogOpen(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDownloadBulletin(student)}
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Télécharger bulletin
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
                              {student.statut === "actif" ? (
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() =>
                                    handleChangeStudentStatus(
                                      student.id,
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
                                    handleChangeStudentStatus(
                                      student.id,
                                      "actif",
                                    )
                                  }
                                >
                                  <Unlock className="mr-2 h-4 w-4" />
                                  Réactiver
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => {
                                  setStudentToDelete(student.id);
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

          {/* Graduated Students Tab */}
          <TabsContent value="diplomes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Étudiants diplômés</CardTitle>
                <CardDescription>
                  Archive des anciens étudiants diplômés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Diplômé</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Formation</TableHead>
                      <TableHead>Date obtention</TableHead>
                      <TableHead>Moyenne finale</TableHead>
                      <TableHead>Mention</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {graduatedStudents.map((graduate) => (
                      <TableRow key={graduate.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {graduate.prenom} {graduate.nom}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {graduate.numeroEtudiant}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{graduate.email}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {graduate.filiere}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Promotion {graduate.promotion}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {graduate.dateObtention &&
                            new Date(
                              graduate.dateObtention,
                            ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">
                            {graduate.moyenneFinale}/20
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getMentionColor(graduate.mention || "")}
                          >
                            {graduate.mention}
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
                                onClick={() =>
                                  handleViewStudentDetails(graduate.id)
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Voir dossier
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Télécharger diplôme
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDownloadBulletin(graduate)}
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Relevé de notes
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Contacter
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
        </Tabs>

        

        {/* Create Student Dialog */}
        <Dialog
          open={isCreateStudentOpen}
          onOpenChange={setIsCreateStudentOpen}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un nouvel étudiant</DialogTitle>
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
                <Label htmlFor="filiere">Filière</Label>
                <Select
                  value={formData.filiere}
                  onValueChange={(value) =>
                    setFormData({ ...formData, filiere: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une filière" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Médecine">Médecine</SelectItem>
                    <SelectItem value="Pharmacie">Pharmacie</SelectItem>
                    <SelectItem value="Dentaire">Dentaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="niveau">Niveau</Label>
                <Select
                  value={formData.niveau}
                  onValueChange={(value) =>
                    setFormData({ ...formData, niveau: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Année 1">Année 1</SelectItem>
                    <SelectItem value="Année 2">Année 2</SelectItem>
                    <SelectItem value="Année 3">Année 3</SelectItem>
                    <SelectItem value="Année 4">Année 4</SelectItem>
                    <SelectItem value="Année 5">Année 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateStudentOpen(false);
                  setFormData({});
                }}
              >
                Annuler
              </Button>
              <Button onClick={handleCreateStudent}>Créer l'étudiant</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Student Dialog */}
        <Dialog
          open={isStudentDialogOpen}
          onOpenChange={setIsStudentDialogOpen}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier l'étudiant</DialogTitle>
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
                <Label htmlFor="edit-filiere">Filière</Label>
                <Select
                  value={formData.filiere}
                  onValueChange={(value) =>
                    setFormData({ ...formData, filiere: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une filière" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Médecine">Médecine</SelectItem>
                    <SelectItem value="Pharmacie">Pharmacie</SelectItem>
                    <SelectItem value="Dentaire">Dentaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-niveau">Niveau</Label>
                <Select
                  value={formData.niveau}
                  onValueChange={(value) =>
                    setFormData({ ...formData, niveau: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Année 1">Année 1</SelectItem>
                    <SelectItem value="Année 2">Année 2</SelectItem>
                    <SelectItem value="Année 3">Année 3</SelectItem>
                    <SelectItem value="Année 4">Année 4</SelectItem>
                    <SelectItem value="Année 5">Année 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsStudentDialogOpen(false);
                  setSelectedStudent(null);
                  setFormData({});
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  if (selectedStudent) {
                    setCurrentStudents((students) =>
                      students.map((s) =>
                        s.id === selectedStudent.id ? { ...s, ...formData } : s,
                      ),
                    );
                    // toast({
                    //   title: "Étudiant modifié",
                    //   description:
                    //     "Les informations ont été mises à jour avec succès.",
                    // });
                    setIsStudentDialogOpen(false);
                    setSelectedStudent(null);
                    setFormData({});
                  }
                }}
              >
                Modifier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action supprimera définitivement l'étudiant. Cette action
                ne peut pas être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setStudentToDelete(null);
                }}
              >
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (studentToDelete) {
                    handleDeleteStudent(studentToDelete);
                  }
                  setDeleteDialogOpen(false);
                  setStudentToDelete(null);
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

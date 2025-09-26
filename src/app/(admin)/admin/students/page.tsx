'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useCallback, useEffect, useState } from "react";
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
import { IEnrollmentRequest, IStudent, ICreateStudent, IListStudent } from "@/types/staffType";
import Header from "../../../../components/features/admin-students/HeaderSection";
import EnrollmentRequests from "../../../../components/features/admin-students/EnrollmentRequestsTab";
import CurrentStudents from "../../../../components/features/admin-students/CurrentStudentsTab";
import GenericModal from "@/components/modal/GenericModal";
import { createUser, getUserList, updateUser } from "@/actions/programsAction";
import { getStudentApplication, getStudentApplicationList } from "@/actions/studentAction";
import { student_statuses } from "@/constant";
import { showToast } from "@/components/ui/showToast";
import ModalStudent from "@/components/modal/ModalStudent";
import CreateEnrollmentDialog from "@/components/features/admin-students/modals/DialogCreateEnrollmentRequest";
import { useRouter } from "@bprogress/next/app";






const mockEnrollmentRequests: IEnrollmentRequest[] = [
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

const mockCurrentStudents: IStudent[] = [
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

const mockGraduatedStudents: IStudent[] = [
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





export default function StudentsPage() {
  const router = useRouter();
  const [enrollmentRequests, setEnrollmentRequests] = useState<
    IEnrollmentRequest[]
  >([]);
  const [studentList, setStudentList] = useState<IListStudent[]>([])
  const [selectedStudent, setSelectedStudent] = useState<IListStudent | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<IEnrollmentRequest | null>(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [sturentFormData, setStudentFormData] = useState<Partial<ICreateStudent>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [action, setAction] = useState<'CREATE' | 'UPDATE'>('CREATE')
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("all");
  const [isCreateEnrollmentOpen, setIsCreateEnrollmentOpen] = useState(false);


  

  const loadEnrollmentRequests = useCallback(async () => {
    try {
      const result = await getStudentApplicationList();
      console.log('-->result', result)
      if(result.code === 'success') {
        const transformedData = transformApplicationData(result.data.body || []);
        console.log('transformedData-->', transformedData)
        setEnrollmentRequests(transformedData);
      } else {
        console.error('Error loading enrollment requests:', result.error);
        showToast({
          variant: 'error-solid',
          message: 'Erreur',
          description: "Impossible de charger les demandes d'inscription.",
        });
      }
    } catch (error) {
      console.error('Error loading enrollment requests:', error);
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: "Une erreur s'est produite lors du chargement des demandes.",
      });
    }
  }, []);
  
  useEffect(() => {
    init();
    loadEnrollmentRequests();
  }, [loadEnrollmentRequests])



  const graduatedStudents = studentList.filter((student) => {
    return student_statuses[student.status_code as keyof typeof student_statuses] === student_statuses.GRADUATED;
  });

  const currentStudents = studentList.filter((student) => {
    return student_statuses[student.status_code as keyof typeof student_statuses] != student_statuses.GRADUATED;
  });
  

  const handleSaveStudentInfo = async () => {
    try {
      if (action === "CREATE") {
        const payload = {
          ...sturentFormData,
        } as ICreateStudent;

        const result = await createUser(payload);
        console.log('result-->', result);
        
        if (result.code === 'success') {
          showToast({
            variant: 'success-solid',
            message: 'Succès',
            description: 'Étudiant créé avec succès',
          });
          await init();
          setIsStudentModalOpen(false);
          setStudentFormData({});
        } else {
          showToast({
            variant: 'error-solid',
            message: 'Erreur',
            description: result.error || "Erreur lors de la création de l'étudiant",
          });
        }
      } else {
        const payload = {
          ...sturentFormData,
        } as ICreateStudent;

        const result = await updateUser(payload);
        console.log('result-->', result);
        
        if (result.code === 'success') {
          showToast({
            variant: 'success-solid',
            message: 'Succès',
            description: 'Étudiant mis à jour avec succès',
          });
          await init();
          setIsStudentModalOpen(false);
          setAction('CREATE');
          setStudentFormData({});
        } else {
          showToast({
            variant: 'error-solid',
            message: 'Erreur',
            description: result.error || "Erreur lors de la mise à jour de l'étudiant",
          });
        }
      }
    } catch (error) {
      console.error('Error in handleSaveStudentInfo:', error);
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Une erreur inattendue est survenue',
      });
    }

    // setCurrentStudents([...currentStudents, newStudent]);
    // toast({
    //   title: "Étudiant créé",
    //   description: "Le nouvel étudiant a été créé avec succès.",
    // });
    // setIsStudentModalOpen(false);
    // setStudentFormData({});
  };

  const init = async () => {
    const result = await getUserList();
    if(result.code == 'success') {
        setStudentList(result.data.body);
    } 
    console.log('getUserList.result', result)
  }

  const transformApplicationData = (apiData: any[]): IEnrollmentRequest[] => {
    return apiData.map((app: any) => ({
      id: app.application_code,
      nom: app.last_name,
      prenom: app.first_name,
      email: app.email,
      telephone: app.phone_number,
      filiere: app.cirriculum?.curriculum_name || 'N/A',
      niveau: app.cirriculum?.study_level || 'N/A',
      datedemande: app.submitted_at || new Date().toISOString().split('T')[0],
      statut: app.application_status_code,
      documents: ['Documents non disponibles'], 
      commentaire: app.rejection_reason || undefined
    }));
  };

  const handleViewApplicationDetails = async (applicationCode: string) => {
    try {
      const result = await getStudentApplication(applicationCode);
      if (result.code === 'success') {
        console.log('Application details:', result.data);
        // Ici vous pouvez ouvrir un modal avec les détails ou naviguer vers une page dédiée
        showToast({
          variant: 'success-solid',
          message: 'Détails chargés',
          description: "Les détails de la demande ont été récupérés avec succès.",
        });
      } else {
        showToast({
          variant: 'error-solid',
          message: 'Erreur',
          description: "Impossible de récupérer les détails de la demande.",
        });
      }
    } catch (error) {
      console.error('Error loading application details:', error);
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: "Une erreur s'est produite lors du chargement des détails.",
      });
    }
  }

  const handleApproveRequest = (requestId: string) => {
    setEnrollmentRequests((requests) =>
      requests.map((req) =>
        req.id === requestId ? { ...req, statut: "approuve" as const } : req,
      ),
    );
    showToast({
      variant: 'success-solid',
      message: 'Demande approuvée',
      description: "La demande d'inscription a été approuvée avec succès.",
    });
  };

  const handleCreateEnrollment = () => {
    setIsCreateEnrollmentOpen(true);
  };

  const handleEnrollmentSuccess = () => {
    // Refresh enrollment requests or student list if needed
    init();
    loadEnrollmentRequests();
  };


  return (
      <div className="space-y-6">
        {/* Header */}
        <Header
          enrollmentRequests={enrollmentRequests}
          setIsCreateStudentOpen={setIsStudentModalOpen}
        />

        {/* Main Content */}
        <Tabs defaultValue="etudiants" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="etudiants">
              Étudiants actuels ({studentList.length})
            </TabsTrigger>
            <TabsTrigger value="inscriptions">
              Demandes d'inscription ({enrollmentRequests.length})
            </TabsTrigger>
          </TabsList>

          {/* Current Students Tab */}
          <CurrentStudents
            setAction={setAction}
            setDeleteDialogOpen={setDeleteDialogOpen}
            setIsStudentDialogOpen={setIsStudentModalOpen}
            setSelectedStudent={setSelectedStudent}
            setFormData={setStudentFormData}
            setStudentToDelete={setStudentToDelete}
            setIsRequestDialogOpen={setIsRequestDialogOpen}
            studentList={currentStudents}
          />

          {/* Enrollment Requests Tab */}
          <EnrollmentRequests
            enrollmentRequests={enrollmentRequests}
            filterStatut={filterStatut}
            handleApproveRequest={handleApproveRequest}
            searchTerm={searchTerm}
            setFilterStatut={setFilterStatut}
            setIsRequestDialogOpen={setIsRequestDialogOpen}
            setSearchTerm={setSearchTerm}
            setSelectedRequest={setSelectedRequest}
            onCreateEnrollment={handleCreateEnrollment}
          />

          {/* Graduated Students Tab */}
          
        </Tabs>

        

        {/* Create IStudent Dialog */}
        <ModalStudent
          open={isStudentModalOpen}
          onOpenChange={setIsStudentModalOpen}
          formData={sturentFormData}
          setFormData={setStudentFormData}
          onConfirm={handleSaveStudentInfo}
          action={action}
        />


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
                    // handleDeleteStudent(studentToDelete);
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

        {/* Create Enrollment Dialog */}
        <CreateEnrollmentDialog
          open={isCreateEnrollmentOpen}
          onOpenChange={setIsCreateEnrollmentOpen}
          onSuccess={handleEnrollmentSuccess}
        />

      </div>
  );
}

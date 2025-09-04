'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
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
import { ICreateStudent, IEnrollmentRequest, IListStudent, IStudent } from "@/types/staffType";
import Header from "./Header";
import { getUserList } from "@/actions/programsAction";


type MyComponentProps = {
    setSelectedStudent: Dispatch<SetStateAction<IListStudent | null>>;
    setIsStudentDialogOpen: Dispatch<SetStateAction<boolean>>;
    setStudentToDelete: Dispatch<SetStateAction<string | null>>;
    setDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
    setIsRequestDialogOpen: Dispatch<SetStateAction<boolean>>;
    studentList: IListStudent[];
    setAction: Dispatch<SetStateAction<'CREATE' | 'UPDATE'>>;
    setFormData: Dispatch<React.SetStateAction<Partial<ICreateStudent>>>;

};


const CurrentStudents = ({
    setSelectedStudent,
    setFormData,
    setIsStudentDialogOpen,
    setStudentToDelete,
    setDeleteDialogOpen,
    setIsRequestDialogOpen,
    studentList,
    setAction
}: MyComponentProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterFiliere, setFilterFiliere] = useState("all");
    const [filterStatut, setFilterStatut] = useState("all");
    const [enrollmentRequests, setEnrollmentRequests] = useState<IEnrollmentRequest[]>([]);
    const [currentStudents, setCurrentStudents] = useState<IStudent[]>([]);
    const router = useRouter()



    const filteredCurrentStudents = studentList.filter((student) => {
        const matchesSearch =
        student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.user_code.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFiliere =
        filterFiliere === "all" ||
        student.cirriculum.program_name.toLowerCase() === filterFiliere;
        const matchesStatut =
        filterStatut === "all" || student.status_code === filterStatut;

        return matchesSearch && matchesFiliere && matchesStatut;
    });

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

    const handleDownloadBulletin = (student: IListStudent) => {
    
    };

    return (
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
                            <TableHead>Statut</TableHead>
                            <TableHead>Financier</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCurrentStudents.map((student) => (
                            <TableRow key={uuidv4()}>
                                <TableCell>
                                    <div>
                                    <div className="font-medium">
                                        {student.first_name} {student.last_name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {student.student_number}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {student.email}
                                    </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div>
                                    <div className="font-medium">{student.cirriculum.program_name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {student.cirriculum.study_level}
                                    </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {/* <Badge className={statutLabels[student.statut].color}>
                                    {statutLabels[student.statut].label}
                                    </Badge> */}
                                    -
                                </TableCell>
                                <TableCell>
                                    {/* {student.statutFinancier && (
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
                                    )} */}
                                    -
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
                                                handleViewStudentDetails(student.user_code)
                                            }
                                            >
                                            <Eye className="mr-2 h-4 w-4" />
                                            Voir dossier complet
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setSelectedStudent(student);
                                                setAction('UPDATE')
                                                setFormData(
                                                    {
                                                        "password_plaintext": '',
                                                        "email": student.email,
                                                        "first_name": student.first_name,
                                                        "last_name": student.last_name,
                                                        "gender": 'MALE',
                                                        "phone_number": student.phone_number,
                                                        "curriculum_code": student.cirriculum.curriculum_code,
                                                        "student_number": student.student_number,
                                                        "education_level_code": 'LICENCE',
                                                    }
                                                );
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
                                        {student.status_code === "actif" ? (
                                        <DropdownMenuItem
                                            className="text-red-600"
                                            onClick={() =>
                                            handleChangeStudentStatus(
                                                student.user_code,
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
                                                student.user_code,
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
                                            setStudentToDelete(student.user_code);
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
    )
}

export default CurrentStudents
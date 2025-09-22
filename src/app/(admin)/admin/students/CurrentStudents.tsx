'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
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
import { TabsContent } from "@/components/ui/tabs";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Lock,
  Unlock,
  Mail,
  MessageSquare,
  FileText,
  Search,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ICreateStudent, IListStudent, IEnrollmentRequest, IStudent } from "@/types/staffType";
import { useStudentStore } from "@/store/studentStore";
import { useFactorizedProgramStore } from "@/store/programStore";

// ---------------- BADGES ----------------
const getStatusBadge = (status: string) => {
  if (!status) return null;

  const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; className?: string }> = {
    PROMOTED: { variant: "default", label: "PROMOTED", className: "bg-blue-100/50 hover:bg-blue-200/50 text-blue-800" },
    REPEATER: { variant: "destructive", label: "REPEATER", className: "bg-red-100/50 hover:bg-red-200/50 text-red-800" },
    GRADUATED: { variant: "default", label: "GRADUATED", className: "bg-blue-100/50 hover:bg-blue-200/50 text-blue-800" },
    DROPPED_OUT: { variant: "destructive", label: "DROPPED OUT", className: "bg-red-100/50 hover:bg-red-200/50 text-red-800" },
    TRANSFERRED: { variant: "outline", label: "TRANSFERRED", className: "bg-purple-100/50 hover:bg-purple-200/50 text-purple-800" },
    ENROLLED: { variant: "default", label: "ENROLLED", className: "bg-green-100/50 hover:bg-green-200/50 text-green-800" },
    ACTIVE: { variant: "default", label: "ACTIVE", className: "bg-green-100/50 hover:bg-green-200/50 text-green-800" },
    INACTIVE: { variant: "destructive", label: "INACTIVE", className: "bg-gray-200/50 hover:bg-gray-300/50 text-gray-600" },
    PENDING: { variant: "secondary", label: "PENDING", className: "bg-yellow-100/50 hover:bg-yellow-200/50 text-yellow-800" },
    APPROVED: { variant: "default", label: "APPROVED", className: "bg-green-100/50 hover:bg-green-200/50 text-green-800" },
    REJECTED: { variant: "destructive", label: "REJECTED", className: "bg-red-100/50 hover:bg-red-200/50 text-red-800" },
    WITHDRAWN: { variant: "destructive", label: "WITHDRAWN", className: "bg-red-100/50 hover:bg-red-200/50 text-red-800" },
    SUSPENDED: { variant: "destructive", label: "SUSPENDED", className: "bg-orange-100/50 hover:bg-orange-200/50 text-orange-800" },
  };

  const statusInfo = statusMap[status] || { variant: "secondary" as const, label: status, className: "bg-gray-100 hover:bg-gray-200 text-gray-800" };

  return <Badge variant={statusInfo.variant} className={`capitalize ${statusInfo.className || ""}`}>{statusInfo.label}</Badge>;
};

const getFinancialStatusBadge = (status: string) => {
  const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; className?: string }> = {
    PAID: { variant: "default", label: "PAID", className: "bg-green-500 hover:bg-green-600 text-white" },
    PENDING: { variant: "secondary", label: "PENDING", className: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800" },
    PARTIALLY_PAID: { variant: "outline", label: "PARTIALLY PAID", className: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
    OVERDUE: { variant: "destructive", label: "OVERDUE", className: "bg-red-500 hover:bg-red-600 text-white" },
    EXEMPTED: { variant: "default", label: "EXEMPTED", className: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
    UNPAID: { variant: "destructive", label: "UNPAID", className: "bg-red-100 hover:bg-red-200 text-red-800" },
    REFUNDED: { variant: "secondary", label: "REFUNDED", className: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
  };

  const statusInfo = statusMap[status] || { variant: "secondary" as const, label: status, className: "bg-gray-100 hover:bg-gray-200 text-gray-800" };

  return <Badge variant={statusInfo.variant} className={`capitalize ${statusInfo.className || ""}`}>{statusInfo.label}</Badge>;
};

// ---------------- COMPONENT ----------------
type MyComponentProps = {
  setSelectedStudent: Dispatch<SetStateAction<IListStudent | null>>;
  setIsStudentDialogOpen: Dispatch<SetStateAction<boolean>>;
  setStudentToDelete: Dispatch<SetStateAction<string | null>>;
  setDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
  setIsRequestDialogOpen: Dispatch<SetStateAction<boolean>>;
  studentList: IListStudent[];
  setAction: Dispatch<SetStateAction<"CREATE" | "UPDATE">>;
  setFormData: Dispatch<React.SetStateAction<Partial<ICreateStudent>>>;
};

const CurrentStudents = ({
  setSelectedStudent,
  setFormData,
  setIsStudentDialogOpen,
  setStudentToDelete,
  setDeleteDialogOpen,
  setIsRequestDialogOpen,
  studentList: initialStudentList,
  setAction,
}: MyComponentProps) => {
  const [students, setStudents] = useState<IListStudent[]>(initialStudentList);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProgram, setFilterProgram] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Get programs from store
  const { factorizedPrograms, fetchPrograms } = useFactorizedProgramStore();
  const [enrollmentRequests, setEnrollmentRequests] = useState<IEnrollmentRequest[]>([]);
  const [currentStudents, setCurrentStudents] = useState<IStudent[]>([]);
  const router = useRouter();

  const { getStudentStatus, updateStudentStatuses, studentStatuses } = useStudentStore();

  // Init statuses
  useEffect(() => {
    const statusMap = initialStudentList.reduce<Record<string, string>>((acc, student) => {
      if (student.status_code) acc[student.user_code] = student.status_code;
      return acc;
    }, {});
    if (Object.keys(statusMap).length > 0) updateStudentStatuses(statusMap);

    setStudents(initialStudentList.map((student) => ({
      ...student,
      status_code: getStudentStatus(student.user_code) || student.status_code || "PENDING",
    })));
  }, [initialStudentList, updateStudentStatuses, getStudentStatus]);

  // Subscribe to Zustand store
  useEffect(() => {
    const unsubscribe = useStudentStore.subscribe((state) => {
      setStudents((prevStudents) =>
        prevStudents.map((student) => ({
          ...student,
          status_code: state.studentStatuses[student.user_code] || student.status_code,
        }))
      );
    });
    return () => unsubscribe();
  }, []);

  // Fetch programs on mount
  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  // Get unique programs
  const programs = Array.from(new Set(factorizedPrograms.map(p => p.program.program_name)));
  
  // Get levels based on selected program
  const getFilteredLevels = () => {
    if (filterProgram === 'all') return [];
    const program = factorizedPrograms.find(p => p.program.program_name === filterProgram);
    if (!program) return [];
    return Array.from(new Set(
      program.curriculums?.map(c => c.study_level) || []
    )).filter(Boolean);
  };
  
  const filteredLevels = getFilteredLevels();

  // Filtering
  const filteredCurrentStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      searchTerm === '' ||
      (student.student_number && student.student_number.toLowerCase().includes(searchLower)) ||
      (student.last_name && student.last_name.toLowerCase().includes(searchLower)) ||
      (student.first_name && student.first_name.toLowerCase().includes(searchLower)) ||
      (student.email && student.email.toLowerCase().includes(searchLower)) ||
      (student.user_code && student.user_code.toLowerCase().includes(searchLower));
      
    const matchesProgram = filterProgram === "all" || 
      (student.cirriculum?.program_name && student.cirriculum.program_name === filterProgram);
      
    const matchesLevel = filterLevel === "all" || 
      (student.cirriculum?.study_level && student.cirriculum.study_level === filterLevel);
      
    const matchesStatus = filterStatus === "all" || 
      student.status_code === filterStatus;
      
    return matchesSearch && matchesProgram && matchesLevel && matchesStatus;
  });
  
  // Check if there are students matching the selected program
  const hasMatchingStudents = students.some(student => 
    filterProgram === 'all' || student.cirriculum?.program_name === filterProgram
  );
  
  // Reset level filter when program changes
  useEffect(() => {
    setFilterLevel('all');
  }, [filterProgram]);

  // Actions
  const handleViewStudentDetails = (studentId: string) => router.push(`/admin/students/annual-enrollment/${studentId}`);
  const handleChangeStudentStatus = (studentId: string, newStatus: string) => setCurrentStudents((students) => students.map((s) => (s.id === studentId ? { ...s, statut: newStatus as any } : s)));
  const handleDeleteStudent = (studentId: string) => setCurrentStudents((students) => students.filter((s) => s.id !== studentId));
  const handleDownloadBulletin = (student: IListStudent) => {};

  return (
    <TabsContent value="etudiants" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Étudiants actuels</CardTitle>
          <CardDescription>Liste des étudiants actuellement inscrits</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search + Filters */}
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher par nom, prénom, email, matricule..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-8 w-80"
              />
            </div>
            <div className="flex space-x-2">
              {/* Program Filter */}
              <Select value={filterProgram} onValueChange={setFilterProgram}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Programme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les programmes</SelectItem>
                  {programs.map((program) => (
                    <SelectItem key={program} value={program}>
                      {program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Level Filter */}
              <Select 
                value={filterLevel} 
                onValueChange={setFilterLevel}
                disabled={!filterProgram || filterProgram === 'all'}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={
                    !filterProgram || filterProgram === 'all' 
                      ? 'Sélectionnez un programme' 
                      : 'Niveau'
                  } />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  {filteredLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="ENROLLED">Inscrit</SelectItem>
                  <SelectItem value="ACTIVE">Actif</SelectItem>
                  <SelectItem value="PENDING">En attente</SelectItem>
                  <SelectItem value="SUSPENDED">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* No Students Message */}
          {!hasMatchingStudents && filterProgram !== 'all' && (
            <div className="p-4 text-center text-muted-foreground">
              Aucun étudiant trouvé pour le programme sélectionné.
            </div>
          )}
          
          {/* Students Table */}
          <Table className={!hasMatchingStudents && filterProgram !== 'all' ? 'hidden' : ''}>
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
                      <div className="font-medium">{student.first_name} {student.last_name}</div>
                      <div className="text-sm text-muted-foreground">{student.student_number}</div>
                      <div className="text-sm text-muted-foreground">{student.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.cirriculum.program_name}</div>
                      <div className="text-sm text-muted-foreground">{student.cirriculum.study_level}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(student.status_code || "")}</TableCell>
                  <TableCell>{getFinancialStatusBadge(student.financial_status || "PENDING")}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewStudentDetails(student.user_code)}><Eye className="mr-2 h-4 w-4" /> Voir dossier complet</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedStudent(student);
                          setAction("UPDATE");
                          setFormData({
                            password_plaintext: "",
                            email: student.email,
                            first_name: student.first_name,
                            last_name: student.last_name,
                            gender: "MALE",
                            phone_number: student.phone_number,
                            curriculum_code: student.cirriculum.curriculum_code,
                            student_number: student.student_number,
                            education_level_code: "LICENCE",
                          });
                          setIsStudentDialogOpen(true);
                        }}><Edit className="mr-2 h-4 w-4" /> Modifier</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadBulletin(student)}><FileText className="mr-2 h-4 w-4" /> Télécharger bulletin</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><Mail className="mr-2 h-4 w-4" /> Envoyer notification</DropdownMenuItem>
                        <DropdownMenuItem><MessageSquare className="mr-2 h-4 w-4" /> Contacter</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {student.status_code === "actif" ? (
                          <DropdownMenuItem className="text-red-600" onClick={() => handleChangeStudentStatus(student.user_code, "suspendu")}>
                            <Lock className="mr-2 h-4 w-4" /> Suspendre
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600" onClick={() => handleChangeStudentStatus(student.user_code, "actif")}>
                            <Unlock className="mr-2 h-4 w-4" /> Réactiver
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => { setStudentToDelete(student.user_code); setDeleteDialogOpen(true); }}>
                          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
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
  );
};

export default CurrentStudents;

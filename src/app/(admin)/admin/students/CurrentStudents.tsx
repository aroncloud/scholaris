'use client';

import React, { Dispatch, SetStateAction, useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye, Lock, Unlock, Mail, MessageSquare, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { ICreateStudent, IListStudent } from "@/types/staffType";
import { useStudentStore } from "@/store/studentStore";
import { useFactorizedProgramStore } from "@/store/programStore";
import { ResponsiveTable, TableColumn } from "@/components/tables/ResponsiveTable";
import { IFactorizedProgram } from "@/types/programTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ---------------- FILTERS ----------------
const StudentFilters = React.memo(({
  filterProgram,
  setFilterProgram,
  filterLevel,
  setFilterLevel,
  filterStatus,
  setFilterStatus,
  factorizedPrograms,
}: {
  filterProgram: string;
  setFilterProgram: (value: string) => void;
  filterLevel: string;
  setFilterLevel: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  factorizedPrograms: IFactorizedProgram[];
}) => {

  const programOptions = useMemo(() => {
    const uniquePrograms = Array.from(new Set(factorizedPrograms.map(p => p.program.program_name)));
    return uniquePrograms.map(p => ({ value: p, label: p }));
  }, [factorizedPrograms]);

  const filteredLevels = useMemo(() => {
    if (filterProgram === "all") return [];
    const program = factorizedPrograms.find(p => p.program.program_name === filterProgram);
    return program?.curriculums || [];
  }, [filterProgram, factorizedPrograms]);

  return (
    <div className="flex flex-wrap gap-4 mb-4 items-center">
      <div className="flex-1 min-w-0">
        <Select value={filterProgram} onValueChange={setFilterProgram}>
          <SelectTrigger className="w-full min-w-0">
            <SelectValue placeholder="Programme" />
          </SelectTrigger>
          <SelectContent className="w-full min-w-0">
            <SelectItem value="all">Tous les programmes</SelectItem>
            {programOptions.map(p => (
              <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-0">
        <Select 
          value={filterLevel} 
          onValueChange={setFilterLevel} 
          disabled={filterProgram === "all"}
        >
          <SelectTrigger className="w-full min-w-0">
            <SelectValue placeholder={
              filterProgram === "all" ? "Sélectionnez d'abord un programme" :
              filteredLevels.length > 0 ? "Sélectionnez un curriculum" :
              "Aucun curriculum disponible"
            } />
          </SelectTrigger>
          <SelectContent className="w-full min-w-0">
            <SelectItem value="all">Tous les curriculums</SelectItem>
            {filteredLevels.length > 0 ? (
              filteredLevels.map(c => (
                <SelectItem key={c.curriculum_code} value={c.curriculum_code}>{c.curriculum_name}</SelectItem>
              ))
            ) : (
              <SelectItem value="no-levels" disabled>Aucun curriculum disponible</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-0">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full min-w-0">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent className="w-full min-w-0">
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="ENROLLED">Inscrit</SelectItem>
            <SelectItem value="ACTIVE">Actif</SelectItem>
            <SelectItem value="PENDING">En attente</SelectItem>
            <SelectItem value="SUSPENDED">Suspendu</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});

// ---------------- BADGES ----------------
const getStatusBadge = (status: string) => {
  if (!status) return null;
  const statusMap: Record<string, { label: string; className: string }> = {
    PROMOTED: { label: "PROMOTED", className: "bg-blue-100/50 text-blue-800" },
    REPEATER: { label: "REPEATER", className: "bg-red-100/50 text-red-800" },
    GRADUATED: { label: "GRADUATED", className: "bg-blue-100/50 text-blue-800" },
    DROPPED_OUT: { label: "DROPPED OUT", className: "bg-red-100/50 text-red-800" },
    TRANSFERRED: { label: "TRANSFERRED", className: "bg-purple-100/50 text-purple-800" },
    ENROLLED: { label: "ENROLLED", className: "bg-green-100/50 text-green-800" },
    ACTIVE: { label: "ACTIVE", className: "bg-green-100/50 text-green-800" },
    INACTIVE: { label: "INACTIVE", className: "bg-gray-200/50 text-gray-600" },
    PENDING: { label: "PENDING", className: "bg-yellow-100/50 text-yellow-800" },
    APPROVED: { label: "APPROVED", className: "bg-green-100/50 text-green-800" },
    REJECTED: { label: "REJECTED", className: "bg-red-100/50 text-red-800" },
    WITHDRAWN: { label: "WITHDRAWN", className: "bg-red-100/50 text-red-800" },
    SUSPENDED: { label: "SUSPENDED", className: "bg-orange-100/50 text-orange-800" }
  };
  const info = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" };
  return <Badge variant="outline" className={cn("text-xs font-medium capitalize", info.className)}>{info.label}</Badge>;
};

const getFinancialStatusBadge = (status: string) => {
  const map: Record<string, { label: string; className: string }> = {
    PAID: { label: "PAID", className: "bg-green-500 text-white" },
    PENDING: { label: "PENDING", className: "bg-yellow-100 text-yellow-800" },
    PARTIALLY_PAID: { label: "PARTIALLY PAID", className: "bg-blue-100 text-blue-800" },
    OVERDUE: { label: "OVERDUE", className: "bg-red-500 text-white" },
    EXEMPTED: { label: "EXEMPTED", className: "bg-purple-100 text-purple-800" },
    UNPAID: { label: "UNPAID", className: "bg-red-100 text-red-800" },
    REFUNDED: { label: "REFUNDED", className: "bg-gray-100 text-gray-800" },
  };
  const info = map[status] || { label: status, className: "bg-gray-100 text-gray-800" };
  return <Badge className={`capitalize ${info.className}`}>{info.label}</Badge>;
};

// ---------------- COMPONENT ----------------
type CurrentStudentsProps = {
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
}: CurrentStudentsProps) => {
  const [students, setStudents] = useState<IListStudent[]>(initialStudentList);
  const [filterProgram, setFilterProgram] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { factorizedPrograms, fetchPrograms } = useFactorizedProgramStore();
  const router = useRouter();
  const { studentStatuses, updateStudentStatuses } = useStudentStore();

  useEffect(() => {
    if (!initialStudentList.length) return;

    const statusMap = initialStudentList.reduce<Record<string, string>>((acc, s) => {
      if (s.user_code && s.status_code) acc[s.user_code] = s.status_code;
      return acc;
    }, {});
    if (Object.keys(statusMap).length) updateStudentStatuses(statusMap);

    setStudents(initialStudentList.map(s => ({
      ...s,
      status_code: s.status_code || "PENDING",
      financial_status: s.financial_status || "PENDING"
    })));

   const unsubscribe = useStudentStore.subscribe((state) => {
  const newStatuses = state.studentStatuses;
  setStudents(prev =>
    prev.map(student => {
      const newStatus = newStatuses[student.user_code] || student.status_code;
      if (newStatus === student.status_code) return student;
      return { ...student, status_code: newStatus };
    })
  );
});



    return () => unsubscribe();
  }, [initialStudentList, updateStudentStatuses]);

  useEffect(() => { fetchPrograms(); }, [fetchPrograms]);
  useEffect(() => { if (filterProgram === "all") setFilterLevel("all"); }, [filterProgram]);

  const filteredStudents = useMemo(() => students.filter(s => 
    (filterProgram === "all" || s.cirriculum?.program_name === filterProgram) &&
    (filterLevel === "all" || s.cirriculum?.curriculum_code === filterLevel) &&
    (filterStatus === "all" || s.status_code === filterStatus)
  ), [students, filterProgram, filterLevel, filterStatus]);

  const handleViewStudentDetails = (id: string) => router.push(`/admin/students/annual-enrollment/${id}`);
  const handleDownloadBulletin = (student: IListStudent) => {};

  const columns: TableColumn<IListStudent>[] = [
    { key: "student", label: "Étudiant", render: (_, row) => (
      <div>
        <div className="font-medium">{row.first_name} {row.last_name}</div>
        <div className="text-sm text-muted-foreground">{row.student_number}</div>
        <div className="text-sm text-muted-foreground">{row.email}</div>
      </div>
    )},
    { key: "formation", label: "Formation", render: (_, row) => (
      <div>
        <div className="font-medium">{row.cirriculum.program_name}</div>
        <div className="text-sm text-muted-foreground">{row.cirriculum.study_level}</div>
      </div>
    )},
    { key: "status_code", label: "Statut", render: (v) => getStatusBadge(v) },
    { key: "financial_status", label: "Financier", render: (v) => getFinancialStatusBadge(v) },
    { key: "actions", label: "Actions", render: (_, row) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleViewStudentDetails(row.user_code)}><Eye className="mr-2 h-4 w-4"/> Voir dossier complet</DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            setSelectedStudent(row); setAction("UPDATE");
            setFormData({ 
              password_plaintext: "", email: row.email, first_name: row.first_name,
              last_name: row.last_name, gender: "MALE", phone_number: row.phone_number,
              curriculum_code: row.cirriculum.curriculum_code,
              student_number: row.student_number, education_level_code: "LICENCE"
            });
            setIsStudentDialogOpen(true);
          }}><Edit className="mr-2 h-4 w-4"/> Modifier</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDownloadBulletin(row)}><FileText className="mr-2 h-4 w-4"/> Télécharger bulletin</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem><Mail className="mr-2 h-4 w-4"/> Envoyer notification</DropdownMenuItem>
          <DropdownMenuItem><MessageSquare className="mr-2 h-4 w-4"/> Contacter</DropdownMenuItem>
          <DropdownMenuSeparator />
          {row.status_code === "ACTIVE" ? (
            <DropdownMenuItem className="text-red-600"><Lock className="mr-2 h-4 w-4"/> Suspendre</DropdownMenuItem>
          ) : (
            <DropdownMenuItem className="text-green-600"><Unlock className="mr-2 h-4 w-4"/> Réactiver</DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => { setStudentToDelete(row.user_code); setDeleteDialogOpen(true); }}><Trash2 className="mr-2 h-4 w-4"/> Supprimer</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )},
  ];

  return (
    <TabsContent value="etudiants" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Étudiants actuels</CardTitle>
          <CardDescription>Liste des étudiants actuellement inscrits</CardDescription>
        </CardHeader>
        <CardContent className="overflow-visible">
          <StudentFilters 
            filterProgram={filterProgram} setFilterProgram={setFilterProgram}
            filterLevel={filterLevel} setFilterLevel={setFilterLevel}
            filterStatus={filterStatus} setFilterStatus={setFilterStatus}
            factorizedPrograms={factorizedPrograms}
          />
          <ResponsiveTable<IListStudent>
            columns={columns}
            data={filteredStudents}
            searchKey={["first_name","last_name","student_number","email","user_code"]}
            paginate={10}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default CurrentStudents;







// 'use client'
// import React, { Dispatch, SetStateAction, useEffect, useState, useCallback, useMemo } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { TabsContent } from "@/components/ui/tabs";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { MoreHorizontal, Edit, Trash2, Eye, Lock, Unlock, Mail, MessageSquare, FileText } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { ICreateStudent, IListStudent } from "@/types/staffType";
// import { useStudentStore } from "@/store/studentStore";
// import { useFactorizedProgramStore } from "@/store/programStore";
// import { ResponsiveTable, TableColumn } from "@/components/tables/ResponsiveTable";
// import { IFactorizedProgram } from "@/types/programTypes";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { cn } from "@/lib/utils";

// // Memoized StudentFilters component to prevent unnecessary re-renders
// const StudentFilters = React.memo(({
//   filterProgram,
//   setFilterProgram,
//   filterLevel,
//   setFilterLevel,
//   filterStatus,
//   setFilterStatus,
//   factorizedPrograms,
// }: {
//   filterProgram: string;
//   setFilterProgram: (value: string) => void;
//   filterLevel: string;
//   setFilterLevel: (value: string) => void;
//   filterStatus: string;
//   setFilterStatus: (value: string) => void;
//   factorizedPrograms: IFactorizedProgram[];
// }) => {
//   // Memoize program options with stable references
//   const programOptions = useMemo(() => {
//     const uniquePrograms = Array.from(new Set(factorizedPrograms.map(p => p.program.program_name)));
//     return uniquePrograms.map((program: string) => ({
//       value: program,
//       label: program
//     }));
//   }, [factorizedPrograms]);

//   // Memoize filtered levels with stable references
//   const filteredLevels = useMemo(() => {
//     if (filterProgram === "all") return [];
//     const program = factorizedPrograms.find(p => p.program.program_name === filterProgram);
//     return program?.curriculums || [];
//   }, [filterProgram, factorizedPrograms]);
  
//   // Memoize the program select component to prevent re-creation
//   const programSelect = useMemo(() => (
//     <div className="w-48">
//       <Select 
//         value={filterProgram}
//         onValueChange={setFilterProgram}
//       >
//         <SelectTrigger>
//           <SelectValue placeholder="Programme" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">Tous les programmes</SelectItem>
//           {programOptions.map((program) => (
//             <SelectItem key={`prog-${program.value}`} value={program.value}>
//               {program.label}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </div>
//   ), [filterProgram, programOptions, setFilterProgram]);
  
//   // Memoize the level select component
//   const levelSelect = useMemo(() => (
//     <div className="w-64">
//       <Select 
//         value={filterLevel}
//         onValueChange={setFilterLevel}
//         disabled={filterProgram === "all"}
//       >
//         <SelectTrigger>
//           <SelectValue 
//             placeholder={
//               filterProgram === "all" 
//                 ? "Sélectionnez d'abord un programme" 
//                 : filteredLevels.length > 0 
//                   ? "Sélectionnez un curriculum" 
//                   : "Aucun curriculum disponible"
//             } 
//           />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">Tous les curriculums</SelectItem>
//           {filteredLevels.length > 0 ? (
//             filteredLevels.map((curriculum) => (
//               <SelectItem 
//                 key={`lvl-${curriculum.curriculum_code}`} 
//                 value={curriculum.curriculum_code}
//               >
//                 {curriculum.curriculum_name}
//               </SelectItem>
//             ))
//           ) : (
//             <SelectItem value="no-levels" disabled>
//               Aucun curriculum disponible
//             </SelectItem>
//           )}
//         </SelectContent>
//       </Select>
//     </div>
//   ), [filterProgram, filterLevel, filteredLevels, setFilterLevel]);
  
//   // Memoize the status select component
//   const statusSelect = useMemo(() => (
//     <div className="w-48">
//       <Select 
//         value={filterStatus} 
//         onValueChange={setFilterStatus}
//       >
//         <SelectTrigger>
//           <SelectValue placeholder="Statut" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">Tous les statuts</SelectItem>
//           <SelectItem value="ENROLLED">Inscrit</SelectItem>
//           <SelectItem value="ACTIVE">Actif</SelectItem>
//           <SelectItem value="PENDING">En attente</SelectItem>
//           <SelectItem value="SUSPENDED">Suspendu</SelectItem>
//         </SelectContent>
//       </Select>
//     </div>
//   ), [filterStatus, setFilterStatus]);

//   return (
//     <div className="flex flex-wrap gap-2 mb-4">
//       {programSelect}
//       {levelSelect}
//       {statusSelect}
//     </div>
//   );
// });


// // ---------------- BADGES ----------------
// const getStatusBadge = (status: string) => {
//   if (!status) return null;

//   const statusMap: Record<string, { label: string; className: string }> = {
//     PROMOTED: { label: "PROMOTED", className: "bg-blue-100/50 text-blue-800" },
//     REPEATER: { label: "REPEATER", className: "bg-red-100/50 text-red-800" },
//     GRADUATED: { label: "GRADUATED", className: "bg-blue-100/50 text-blue-800" },
//     DROPPED_OUT: { label: "DROPPED OUT", className: "bg-red-100/50 text-red-800" },
//     TRANSFERRED: { label: "TRANSFERRED", className: "bg-purple-100/50 text-purple-800" },
//     ENROLLED: { label: "ENROLLED", className: "bg-green-100/50 text-green-800" },
//     ACTIVE: { label: "ACTIVE", className: "bg-green-100/50 text-green-800" },
//     INACTIVE: { label: "INACTIVE", className: "bg-gray-200/50 text-gray-600" },
//     PENDING: { label: "PENDING", className: "bg-yellow-100/50 text-yellow-800" },
//     APPROVED: { label: "APPROVED", className: "bg-green-100/50 text-green-800" },
//     REJECTED: { label: "REJECTED", className: "bg-red-100/50 text-red-800" },
//     WITHDRAWN: { label: "WITHDRAWN", className: "bg-red-100/50 text-red-800" },
//     SUSPENDED: { label: "SUSPENDED", className: "bg-orange-100/50 text-orange-800" }
//   };

//   const statusInfo = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" };
  
//   return (
//     <Badge variant="outline" className={cn("text-xs font-medium capitalize", statusInfo.className)}>
//       {statusInfo.label}
//     </Badge>
//   );
// };

// const getFinancialStatusBadge = (status: string) => {
//   const statusMap: Record<string, { label: string; className: string }> = {
//     PAID: { label: "PAID", className: "bg-green-500 text-white" },
//     PENDING: { label: "PENDING", className: "bg-yellow-100 text-yellow-800" },
//     PARTIALLY_PAID: { label: "PARTIALLY PAID", className: "bg-blue-100 text-blue-800" },
//     OVERDUE: { label: "OVERDUE", className: "bg-red-500 text-white" },
//     EXEMPTED: { label: "EXEMPTED", className: "bg-purple-100 text-purple-800" },
//     UNPAID: { label: "UNPAID", className: "bg-red-100 text-red-800" },
//     REFUNDED: { label: "REFUNDED", className: "bg-gray-100 text-gray-800" },
//   };

//   const statusInfo = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" };

//   return <Badge className={`capitalize ${statusInfo.className}`}>{statusInfo.label}</Badge>;
// };

// // ---------------- COMPONENT ----------------
// type MyComponentProps = {
//   setSelectedStudent: Dispatch<SetStateAction<IListStudent | null>>;
//   setIsStudentDialogOpen: Dispatch<SetStateAction<boolean>>;
//   setStudentToDelete: Dispatch<SetStateAction<string | null>>;
//   setDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
//   setIsRequestDialogOpen: Dispatch<SetStateAction<boolean>>;
//   studentList: IListStudent[];
//   setAction: Dispatch<SetStateAction<"CREATE" | "UPDATE">>;
//   setFormData: Dispatch<React.SetStateAction<Partial<ICreateStudent>>>;
// };

// const CurrentStudents = ({
//   setSelectedStudent,
//   setFormData,
//   setIsStudentDialogOpen,
//   setStudentToDelete,
//   setDeleteDialogOpen,
//   setIsRequestDialogOpen,
//   studentList: initialStudentList,
//   setAction,
// }: MyComponentProps) => {
//   const [students, setStudents] = useState<IListStudent[]>(initialStudentList);
//   const [filterProgram, setFilterProgram] = useState("all");
//   const [filterLevel, setFilterLevel] = useState("all");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const { factorizedPrograms, fetchPrograms } = useFactorizedProgramStore();
//   const router = useRouter();
//   const { studentStatuses, updateStudentStatuses } = useStudentStore();

//   // Handle status updates in a single effect
//   useEffect(() => {
//     // Only proceed if we have initial student data
//     if (initialStudentList.length === 0) return;

//     // Create a map of user_code to status_code
//     const statusMap = initialStudentList.reduce<Record<string, string>>((acc, student) => {
//       if (student.user_code && student.status_code) {
//         acc[student.user_code] = student.status_code;
//       }
//       return acc;
//     }, {});

//     // Update the store with initial statuses if we have any
//     if (Object.keys(statusMap).length > 0) {
//       updateStudentStatuses(statusMap);
//     }

//     // Set up the initial students state with proper statuses
//     setStudents(initialStudentList.map(student => ({
//       ...student,
//       status_code: studentStatuses[student.user_code] || student.status_code || 'PENDING',
//       financial_status: student.financial_status || 'PENDING',
//     })));

//     // Subscribe to store changes
//     return useStudentStore.subscribe(
//       (state) => state.studentStatuses,
//       (newStatuses) => {
//         setStudents(prevStudents => {
//           // Check if any statuses have actually changed
//           const hasChanges = prevStudents.some(
//             student => newStatuses[student.user_code] && 
//                       newStatuses[student.user_code] !== student.status_code
//           );

//           if (!hasChanges) return prevStudents;

//           return prevStudents.map(student => ({
//             ...student,
//             status_code: newStatuses[student.user_code] || student.status_code || 'PENDING',
//           }));
//         });
//       },
//       {
//         equalityFn: (a, b) => {
//           const aKeys = Object.keys(a);
//           const bKeys = Object.keys(b);
          
//           if (aKeys.length !== bKeys.length) return false;
//           return aKeys.every(key => a[key] === b[key]);
//         },
//         fireImmediately: false // Don't fire on subscription
//       }
//     );
//   }, [initialStudentList, updateStudentStatuses]);

//   // Fetch programs on mount
//   useEffect(() => {
//     fetchPrograms();
//   }, [fetchPrograms]);

//   // Memoize filtered students to prevent unnecessary re-renders
//   const filteredStudents = useMemo(() => {
//     return students.filter((student) => {
//       const matchesProgram = filterProgram === "all" || student.cirriculum?.program_name === filterProgram;
//       const matchesLevel = filterLevel === "all" || student.cirriculum?.curriculum_code === filterLevel;
//       const matchesStatus = filterStatus === "all" || student.status_code === filterStatus;
//       return matchesProgram && matchesLevel && matchesStatus;
//     });
//   }, [students, filterProgram, filterLevel, filterStatus]);


//   // Reset level filter when program changes
//   useEffect(() => {
//     if (filterProgram === "all") {
//       setFilterLevel("all");
//     }
//   }, [filterProgram]);

//   // Actions
//   const handleViewStudentDetails = (studentId: string) => router.push(`/admin/students/annual-enrollment/${studentId}`);
//   const handleDownloadBulletin = (student: IListStudent) => {};

//   // Table Columns
//   const columns: TableColumn<IListStudent>[] = [
//     {
//       key: "student",
//       label: "Étudiant",
//       render: (_, row) => (
//         <div>
//           <div className="font-medium">{row.first_name} {row.last_name}</div>
//           <div className="text-sm text-muted-foreground">{row.student_number}</div>
//           <div className="text-sm text-muted-foreground">{row.email}</div>
//         </div>
//       ),
//     },
//     {
//       key: "formation",
//       label: "Formation",
//       render: (_, row) => (
//         <div>
//           <div className="font-medium">{row.cirriculum.program_name}</div>
//           <div className="text-sm text-muted-foreground">{row.cirriculum.study_level}</div>
//         </div>
//       ),
//     },
//     { key: "status_code", label: "Statut", render: (v) => getStatusBadge(v) },
//     { key: "financial_status", label: "Financier", render: (v) => getFinancialStatusBadge(v) },
//     {
//       key: "actions",
//       label: "Actions",
//       render: (_, row) => (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem onClick={() => handleViewStudentDetails(row.user_code)}><Eye className="mr-2 h-4 w-4" /> Voir dossier complet</DropdownMenuItem>
//             <DropdownMenuItem onClick={() => {
//               setSelectedStudent(row);
//               setAction("UPDATE");
//               setFormData({
//                 password_plaintext: "",
//                 email: row.email,
//                 first_name: row.first_name,
//                 last_name: row.last_name,
//                 gender: "MALE",
//                 phone_number: row.phone_number,
//                 curriculum_code: row.cirriculum.curriculum_code,
//                 student_number: row.student_number,
//                 education_level_code: "LICENCE",
//               });
//               setIsStudentDialogOpen(true);
//             }}><Edit className="mr-2 h-4 w-4" /> Modifier</DropdownMenuItem>
//             <DropdownMenuItem onClick={() => handleDownloadBulletin(row)}><FileText className="mr-2 h-4 w-4" /> Télécharger bulletin</DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem><Mail className="mr-2 h-4 w-4" /> Envoyer notification</DropdownMenuItem>
//             <DropdownMenuItem><MessageSquare className="mr-2 h-4 w-4" /> Contacter</DropdownMenuItem>
//             <DropdownMenuSeparator />
//             {row.status_code === "ACTIVE" ? (
//               <DropdownMenuItem className="text-red-600">
//                 <Lock className="mr-2 h-4 w-4" /> Suspendre
//               </DropdownMenuItem>
//             ) : (
//               <DropdownMenuItem className="text-green-600">
//                 <Unlock className="mr-2 h-4 w-4" /> Réactiver
//               </DropdownMenuItem>
//             )}
//             <DropdownMenuItem onClick={() => { setStudentToDelete(row.user_code); setDeleteDialogOpen(true); }}>
//               <Trash2 className="mr-2 h-4 w-4" /> Supprimer
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       ),
//     },
//   ];

//   return (
//     <TabsContent value="etudiants" className="space-y-4">
//       <Card>
//         <CardHeader>
//           <CardTitle>Étudiants actuels</CardTitle>
//           <CardDescription>Liste des étudiants actuellement inscrits</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {/* Filters */}
//           <StudentFilters
//             filterProgram={filterProgram}
//             setFilterProgram={setFilterProgram}
//             filterLevel={filterLevel}
//             setFilterLevel={setFilterLevel}
//             filterStatus={filterStatus}
//             setFilterStatus={setFilterStatus}
//             factorizedPrograms={factorizedPrograms}
//           />

//           <ResponsiveTable<IListStudent>
//             columns={columns}
//             data={filteredStudents}
//             searchKey={["first_name", "last_name", "student_number", "email", "user_code"]}
//             paginate={10}
//           />
//         </CardContent>
//       </Card>
//     </TabsContent>
//   );
// };

// export default CurrentStudents;

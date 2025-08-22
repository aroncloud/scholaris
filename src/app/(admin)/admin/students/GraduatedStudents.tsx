'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
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
import { IEnrollmentRequest, IListStudent, IStudent } from "@/types/userTypes";
import Header from "./Header";
import { getMentionColor, getStatutColor } from "@/lib/utils";
import { getUserList } from "@/actions/programsAction";


type MyComponentProps = {
    studentList: IListStudent[];
    setSelectedStudent: Dispatch<SetStateAction<IListStudent | null>>;
    setFormData: Dispatch<React.SetStateAction<Partial<IStudent>>>;
    setIsStudentDialogOpen: Dispatch<SetStateAction<boolean>>;
    setStudentToDelete: Dispatch<SetStateAction<string | null>>;
    setDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
    setIsRequestDialogOpen: Dispatch<SetStateAction<boolean>>;

};

const GraduatedStudents = ({
    studentList
}: MyComponentProps) => {
    const router = useRouter();
    const handleViewStudentDetails = (studentId: string) => {
        router.push(`/student-details/${studentId}`);
    };
    const handleDownloadBulletin = (student: IListStudent) => {
    
    };
  return (
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
                {studentList.map((graduate) => (
                    <TableRow key={graduate.user_code}>
                    <TableCell>
                        <div>
                        <div className="font-medium">
                            {graduate.first_name} {graduate.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {graduate.student_number}
                        </div>
                        </div>
                    </TableCell>
                    <TableCell>{graduate.email}</TableCell>
                    <TableCell>
                        <div>
                        <div className="font-medium">
                            {graduate.cirriculum.program_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {/* Promotion {graduate.promotion} */}
                            Promotion 2025
                        </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        12/3/2025
                    </TableCell>
                    <TableCell>
                        {/* <Badge variant="default">
                        {graduate.moyenneFinale}/20
                        </Badge> */}
                        -
                    </TableCell>
                    <TableCell>
                        {/* <Badge
                        className={getMentionColor(graduate.mention || "")}
                        >
                        {graduate.mention}
                        </Badge> */}
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
                                handleViewStudentDetails(graduate.user_code)
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
  )
}

export default GraduatedStudents
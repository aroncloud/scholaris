"use client";
import React, { useMemo, useState } from "react";
import {
  Eye,
  Download,
  MoreHorizontal,
  Search,
  CheckCircle,
  UserCheck,
  AlertTriangle,
  UserPlus,
  Plus,
  Edit,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GetTeacherApplication, ApplicationStatus, CreateTeacherApplication } from "../../../types/teacherTypes"; // <-- à adapter à ton modèle
import { ApplicantTabSkeleton } from "./skeleton/ApplicantTabSkeleton";
import { getStatusColor } from "@/lib/utils";
import { APPLICATION_STATUS } from "@/constant";
import DialogCreateApplication from "./modal/DialogCreateApplication";
import DialogUpdateApplication from "./modal/DialogUpdateApplication";

interface ApplicantTabProps {
  applicants: GetTeacherApplication[];
  isDataLoading: boolean;
}


const ApplicantTab = ({ applicants, isDataLoading }: ApplicantTabProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatut, setFilterStatut] = useState("ALL");
    const [isCreateApplicationrOpen, setIsCreateApplicationOpen] = useState(false);
    const [isUpdateApplicationOpen, setIsUpdateApplicationOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<CreateTeacherApplication | null>(null);

    const filteredApplicants = useMemo(() => {
        return applicants.filter((a) => {
        const matchesSearch =
            `${a.applicant_first_name} ${a.applicant_last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.applicant_email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatut = filterStatut === "all" || a.status_code === filterStatut;
        return matchesSearch && matchesStatut;
        });
    }, [applicants, searchTerm, filterStatut]);

    // Actions
    const onApprove = (id: string) => {
        toast(`Candidature ${id} acceptée`);
    };
    const onReject = (id: string) => {
        console.log(`Candidature refusée`, id);
    };
    const onChangeToInterview = (id: string) => {
        toast(`Candidature ${id} convoquée pour entretien`);
    };
    const onConvertToTeacher = (id: string) => {
        console.log(`Candidat converti en enseignant`, id);
    };
    const handleCreateApplication = async (application: CreateTeacherApplication) => {
        console.log("Creating application:", application);
    }
    const handleUpdateApplication = async (application: CreateTeacherApplication) => {
        console.log("Creating application:", application);
    }

  return (
    <TabsContent value="candidatures" className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span>
            <CardTitle>Candidatures d&apos;enseignement</CardTitle>
            <CardDescription>Gestion des candidatures et recrutements</CardDescription>
          </span>
          <span className="text-sm">
            <Button onClick={() => {setIsCreateApplicationOpen(true)}} variant='info'>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle candidature
            </Button>
          </span>
        </CardHeader>
        <CardContent>
          {/* Barre de recherche et filtre */}
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
            <Select value={filterStatut} onValueChange={setFilterStatut}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                {APPLICATION_STATUS.map(status => (
                    <SelectItem key={uuidv4()} value={status.value}>{status.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tableau */}
          {isDataLoading ? (
            <ApplicantTabSkeleton />
          ) : (
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Candidat</TableHead>
                    <TableHead>Poste visé</TableHead>
                    <TableHead>Expérience</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredApplicants.map((a) => (
                    <TableRow key={uuidv4()}>
                        <TableCell>
                        <div>
                            <div className="font-medium">
                            {a.applicant_first_name} {a.applicant_last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">{a.applicant_email}</div>
                            <div className="text-sm text-muted-foreground">{a.phone_number}</div>
                        </div>
                        </TableCell>
                        <TableCell>
                        <div className="font-medium">{a.job.job_offer_title}</div>
                        <div className="text-sm text-muted-foreground">{a.specialty}</div>
                        </TableCell>
                        <TableCell>{a.years_experience} ans</TableCell>
                        <TableCell>
                        <Badge className={getStatusColor(a.status_code)}>
                            {a.status_code}
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
                                    <DropdownMenuItem>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Voir la candidature
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                        setSelectedApplication({
                                            job_offer_code: a.job.job_offer_code,
                                            applicant_email: a.applicant_email,
                                            applicant_first_name: a.applicant_first_name,
                                            applicant_last_name: a.applicant_last_name,
                                            is_from_previous_institution: a.is_from_previous_institution,
                                            years_experience: a.years_experience,
                                            phone_number: a.phone_number,
                                            specialty: a.specialty,
                                        });
                                        setIsUpdateApplicationOpen(true);
                                    }}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Modifier
                                    </DropdownMenuItem>
                                    {a.documents && a.documents.length > 0 && (
                                        <DropdownMenuItem>
                                        <Download className="mr-2 h-4 w-4" />
                                        Télécharger CV
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    {a.status_code === ApplicationStatus.PENDING && (
                                        <>
                                        <DropdownMenuItem className="text-green-600" onClick={() => onApprove(a.application_code)}>
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Accepter
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-blue-600" onClick={() => onChangeToInterview(a.application_code)}>
                                            <UserCheck className="mr-2 h-4 w-4" />
                                            Convoquer entretien
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600" onClick={() => onReject(a.application_code)}>
                                            <AlertTriangle className="mr-2 h-4 w-4" />
                                            Refuser
                                        </DropdownMenuItem>
                                        </>
                                    )}
                                    {a.status_code === ApplicationStatus.ACCEPTED && (
                                        <DropdownMenuItem className="text-green-600" onClick={() => onConvertToTeacher(a.application_code)}>
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
          )}
        </CardContent>
      </Card>

        {/* Create Application Dialog */}
        <DialogCreateApplication
            open={isCreateApplicationrOpen}
            onOpenChange={setIsCreateApplicationOpen}
            onSave={handleCreateApplication}
        />
        
        {/* Update Teacher Dialog */}
        {(selectedApplication && isUpdateApplicationOpen) && <DialogUpdateApplication
            open={isUpdateApplicationOpen}
            onOpenChange={setIsUpdateApplicationOpen}
            application={selectedApplication}
            onSave={handleUpdateApplication}
        />}
    </TabsContent>
  );
};

export default ApplicantTab;

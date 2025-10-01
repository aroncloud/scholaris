/* eslint-disable @typescript-eslint/no-unused-vars */
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
import ContentLayout from "@/layout/ContentLayout";
import { ResponsiveTable } from "@/components/tables/ResponsiveTable";

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
    <>
      <ContentLayout
        title={`Personnel enseignant`}
        description="Gestion du corps professoral"
        actions
      >
        {/* <ResponsiveTable
            data={filteredTeachers}
            columns={teacherColumns}
            paginate={20}
            searchKey={["first_name", "last_name", "email"]}
            isLoading={isDataLoading}
        /> */}
        Test
      </ContentLayout>

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
    </>
  );
};

export default ApplicantTab;

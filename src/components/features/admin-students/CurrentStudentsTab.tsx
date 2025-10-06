/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Eye, Plus, Download, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { ICreateStudent, IListStudent } from "@/types/staffType";
import { ResponsiveTable, TableColumn } from "@/components/tables/ResponsiveTable";
import {  getStatusColor } from "@/lib/utils";
import ContentLayout from "@/layout/ContentLayout";
import ApplicationImportWizard, { FieldMapping } from "../students/ApplicationImportWizard";



type CurrentStudentsProps = {
  setIsStudentDialogOpen: Dispatch<SetStateAction<boolean>>;
  setStudentToDelete: Dispatch<SetStateAction<string | null>>;
  setDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
  studentList: IListStudent[];
  setAction: Dispatch<SetStateAction<"CREATE" | "UPDATE">>;
  setFormData: Dispatch<React.SetStateAction<Partial<ICreateStudent>>>;
  loading: boolean;
};

const CurrentStudents = ({
  setFormData,
  setIsStudentDialogOpen,
  setStudentToDelete,
  setDeleteDialogOpen,
  studentList,
  setAction,
  loading
}: CurrentStudentsProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const handleViewStudentDetails = (id: string) => router.push(`/dashboard/admin/students/annual-enrollment/${id}`);
  const mappingConfig: FieldMapping[] = [
    { key: 'curriculum_code', label: 'Curriculum', type: 'SHEET_NAME' as const, dataType: 'string', required: true },
    { key: 'last_name', label: 'Nom', type: 'COLUMN' as const, dataType: 'string', required: true },
    { key: 'first_name', label: 'Prénom', type: 'COLUMN' as const, dataType: 'string', required: true },
    { key: 'email', label: 'Email', type: 'COLUMN' as const, dataType: 'string', required: true },
    { key: 'phone_number', label: 'Contact', type: 'COLUMN' as const, dataType: 'string', required: false }
  ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSave = async (data: any) => {
      // console.log('-->handleSave.data', data);
      // const response = await fetch('/api/import', {
      //   method: 'POST',
      //   body: JSON.stringify(data)
      // });
      return false;
    };
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
    { key: "status_code", label: "Statut", render: (_, row) => (<Badge className={getStatusColor(row.status_code)}>{row.status_code}</Badge>) },
    { key: "financial_status", label: "Financier", render: (_, row) => (<Badge className={getStatusColor(row.financial_status ?? "N/A")}>{row.financial_status ?? "N/A"}</Badge>) },
    { key: "actions", label: "Actions", render: (_, row) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleViewStudentDetails(row.user_code)}><Eye className="mr-2 h-4 w-4"/> Voir dossier complet</DropdownMenuItem>
          <DropdownMenuItem onClick={
            () => {
            setAction("UPDATE");
            setFormData({ 
              password_plaintext: "", email: row.email, first_name: row.first_name,
              last_name: row.last_name, gender: "MALE", phone_number: row.phone_number,
              curriculum_code: row.cirriculum.curriculum_code,
              student_number: row.student_number, education_level_code: "LICENCE"
            });
            setIsStudentDialogOpen(true);
            }}><Edit className="mr-2 h-4 w-4"/> Modifier
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )},
  ];

  return (
    <>
      <ContentLayout
        title={`Étudiants actuels`}
        description="Liste des étudiants actuellement inscrits"
        actions = {
          <div className="mt-4 md:mt-0 space-x-3">
            <Button
              onClick={() => {
                setAction("CREATE");
                setFormData({
                  password_plaintext: "",
                  email: "",
                  first_name: "",
                  last_name: "",
                  gender: "MALE",
                  phone_number: "",
                  curriculum_code: "",
                  student_number: "",
                  education_level_code: "LICENCE"
                });
                setIsStudentDialogOpen(true);
              }}
              variant="info"
              className="ml-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvel étudiant
            </Button>         
            <Button variant="outline" className="text-sm w-full sm:w-fit flex-1 sm:flex-none">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline" className="text-sm w-full sm:w-fit flex-1 sm:flex-none" onClick={() => setDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Importer
            </Button>
          </div>
        }
      >

        <ResponsiveTable<IListStudent>
          columns={columns}
          data={studentList}
          searchKey={["first_name","last_name","student_number","email","user_code"]}
          paginate={10}
          isLoading={loading}
        />
      </ContentLayout>
        <ApplicationImportWizard
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="Import de demande d'inscription depuis Excel"
          onSave={handleSave}
          mapping={mappingConfig}
        />
    </>
  );
};

export default CurrentStudents;







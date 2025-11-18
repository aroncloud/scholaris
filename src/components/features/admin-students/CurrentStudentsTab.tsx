/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import Badge from '@/components/custom-ui/Badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Eye, Plus, Download, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { ICreateStudent, IListStudent } from "@/types/staffType";
import { ResponsiveTable, TableColumn } from "@/components/tables/ResponsiveTable";
import ContentLayout from "@/layout/ContentLayout";
import ApplicationImportWizard, { FieldMapping } from "../students/ApplicationImportWizard";
import { Avatar } from "@/components/custom-ui/Avatar";



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
    return false;
  };
  const columns: TableColumn<IListStudent>[] = [
    {
      key: "first_name",
      label: "Étudiant",
      priority: 'medium',
      render: (_, data) => (
        <div className="flex items-center gap-3">
          <Avatar
            fallback={`${data.first_name} ${data.last_name}`}
            variant={"info"}
            className="hidden md:flex"
          />
          <div>
            <div className="font-semibold text-gray-900">
              {data.first_name} {data.last_name}
            </div>
            <div className="text-sm text-gray-500">{data.student_number}</div>
          </div>
        </div>
      ),
    },
    {
      key: "formation", label: "Formation", priority: 'medium', render: (_, row) => (
      <div>
        <div className="font-medium">{row.cirriculum.program_name}</div>
        <div className="text-sm text-muted-foreground">{row.cirriculum.study_level}</div>
      </div>
    )},
    { key: "status_code", label: "Statut", priority: 'low', render: (_, row) => (
      <Badge size="sm" value={row.status_code} label={row.status_code} />) },
    { key: "financial_status", label: "Financier", render: (_, row) => (<Badge size="sm" value={row.financial_status ?? "N/A"} label={row.financial_status ?? "N/A"}/>) },
    { key: "actions", label: "Actions", priority: 'high', render: (_, row) => (
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
          <div className="mt-4 md:mt-0 space-x-3 space-y-2 w-full">
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
              className="w-full sm:w-fit"
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







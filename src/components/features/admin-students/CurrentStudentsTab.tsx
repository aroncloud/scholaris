/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Eye, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ICreateStudent, IListStudent } from "@/types/staffType";
import { ResponsiveTable, TableColumn } from "@/components/tables/ResponsiveTable";
import {  getStatusColor } from "@/lib/utils";
import ContentLayout from "@/layout/ContentLayout";



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
  const router = useRouter();
  const handleViewStudentDetails = (id: string) => router.push(`/admin/students/annual-enrollment/${id}`);

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
    </>
  );
};

export default CurrentStudents;







/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Dispatch, SetStateAction, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Badge from '@/components/custom-ui/Badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  MoreHorizontal,
  Plus,
  Eye,
  Download,
  Upload,
  Edit,
} from "lucide-react";
import { getStatusColor, formatDateToText } from "@/lib/utils";
import { ResponsiveTable, TableColumn } from "@/components/tables/ResponsiveTable";
import ContentLayout from "@/layout/ContentLayout";
import { IGetEnrollmentRequest } from "@/types/staffType";
import { useRouter } from "@bprogress/next/app";
import ApplicationImportWizard, { FieldMapping } from "../students/ApplicationImportWizard";
import { importStudentsInBulkJSON } from "@/actions/studentAction";
import { showToast } from "@/components/ui/showToast";
import { IImportStudentApplicationInBulkJSON } from "@/types/userType";
import { useFactorizedProgramStore } from "@/store/programStore";

type MyComponentProps = {
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setFilterStatut: Dispatch<SetStateAction<string>>;
  filterStatut: string;
  handleApproveRequest: (id: string) => void;
  enrollmentRequests: IGetEnrollmentRequest [];
  searchTerm: string;
  onCreateEnrollment?: () => void;
  onUpdateEnrollment?: (application: IGetEnrollmentRequest) => void;
  loading: boolean;
};

const EnrollmentRequests = ({
  enrollmentRequests,
  handleApproveRequest,
  onCreateEnrollment,
  onUpdateEnrollment,
  loading
}: MyComponentProps) => {

  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { factorizedPrograms } = useFactorizedProgramStore();
  const curriculumList = factorizedPrograms.flatMap((fp) => fp.curriculums);

  // Créer les options de filtre pour les curriculums
  const curriculumFilterOptions = useMemo(() =>
    curriculumList.map(curriculum => ({
      value: curriculum.curriculum_code,
      label: curriculum.curriculum_name
    }))
  , [curriculumList]);

  const mappingConfig: FieldMapping[] = [
    { key: 'curriculum_code', label: 'Curriculum', type: 'SHEET_NAME' as const, required: true, dataType: "string" },
    { key: 'student_number', label: 'Matricule', type: 'COLUMN' as const, required: true, dataType: "string" },
    { key: 'last_name', label: 'Nom', type: 'COLUMN' as const, required: true, dataType: "string" },
    { key: 'first_name', label: 'Prénom', type: 'COLUMN' as const, required: false, dataType: "string" },
    { key: 'email', label: 'Email', type: 'COLUMN' as const, required: false, dataType: "string" },
    { key: 'phone_number', label: 'Contact', type: 'COLUMN' as const, required: false, dataType: "string" },
    { key: 'gender', label: 'Sexe', type: 'COLUMN' as const, required: false, dataType: "string" },
    { key: 'date_of_birth', label: 'Date de naissance', type: 'COLUMN' as const, required: false, dataType: "date" },
    { key: 'place_of_birth', label: 'Lieu de naissance', type: 'COLUMN' as const, required: false, dataType: "string" }
  ];

  const columns: TableColumn<IGetEnrollmentRequest >[] = [
    {
      key: "last_name",
      label: "Candidat",
      priority: "medium",
      render: (_, row) => (
        <div>
          <div className="font-medium">
            {row.first_name} {row.last_name}
          </div>
          <div className="text-sm text-muted-foreground">
            {row.application_code}
          </div>
          <div className="text-sm text-muted-foreground">
            {row.email}
          </div>
        </div>
      ),
    },
    {
      key: "filiere",
      label: "Formation",
      priority: "medium",
      render: (_, row) => <div>
        <div className="font-medium">
          {row.cirriculum.curriculum_name}
        </div>
        <div className="text-sm text-muted-foreground">
          {row.cirriculum.study_level}
        </div>
      </div>,
    },
    {
      key: "datedemande",
      label: "Date demande",
      priority: "medium",
      render: (_, row) => formatDateToText(row.submitted_at),
    },
    {
      key: "statut",
      label: "Statut",
      priority: "low",
      render: (_, row) => (
        <div>
          <Badge
            size="sm"
            value={row.application_status_code}
            label={row.application_status_code}
          />
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      priority: "high",
      render: (_, row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dashboard/admin/students/enrollment/${row.application_code}`);
              }}
            >
              <Eye className="mr-2 h-4 w-4" /> Voir détails
            </DropdownMenuItem>

            {row.application_status_code === "DRAFT" && onUpdateEnrollment && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateEnrollment(row);
                }}
              >
                <Edit className="mr-2 h-4 w-4" /> Modifier
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" /> Documents
            </DropdownMenuItem>

            {/* {row.application_status_code === "en_attente" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-green-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApproveRequest(row.application_code);
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Approuver
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" /> Rejeter
                </DropdownMenuItem>
              </>
            )} */}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleSave = async (data: any) => {
    const payload: IImportStudentApplicationInBulkJSON [] = data.map((item: IImportStudentApplicationInBulkJSON) => ({
      curriculum_code: item?.curriculum_code ?? "",
      first_name: item?.first_name ?? "",
      last_name: item?.last_name ?? "",
      email: item?.email ?? "",
      phone_number: item?.phone_number ?? "",
      student_number: item?.student_number ?? "",
      gender: item?.gender ?? "",
      date_of_birth: new Date(item?.date_of_birth).toJSON().split("T")[0] ?? "",
      place_of_birth: item?.place_of_birth ?? "",
    }));
    console.log('payload', payload)
    const result = await importStudentsInBulkJSON(payload)
    if(result.code == 'success') {
      showToast({
        variant: "success-solid",
        message: 'Action éffectuée avec succès',
        description: `${data.length} fiches d'étudiant ont été importés avec succès`,
        position: 'top-center',
      });
      return true;
    } else {
      showToast({
        variant: "error-solid",
        message: "Erreur lors de la sauvegarde",
        description:result.error ?? "Une erreur est survenue lors de l'import des fiches, essayez encore ou veuillez contacter l'administrateur",
        position: 'top-center',
      });
    }
    return false;
  };

  return (
    <>
     <ContentLayout
        title={`Demandes d'inscription`}
        description="Traitement des nouvelles demandes d'inscription"
        actions = {
          <div className="mt-4 md:mt-0 space-x-3 space-y-2">
            <Button
              onClick={onCreateEnrollment}
              variant="info"
              className="w-full md:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle demande
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

        <ResponsiveTable
          columns={columns}
          data={enrollmentRequests}
          searchKey={['first_name', 'last_name', 'email']}
          onRowClick={(row: IGetEnrollmentRequest ) => {
            router.push(`/dashboard/admin/students/enrollment/${row.application_code}`);
          }}
          isLoading={loading}
          paginate={15}
          filters={[
            {
              key: 'cirriculum.curriculum_code',
              values: curriculumFilterOptions
            }
          ]}
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

export default EnrollmentRequests;

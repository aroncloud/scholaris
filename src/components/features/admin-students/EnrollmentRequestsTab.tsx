"use client";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { getStatusColor, formatDateToText } from "@/lib/utils";
import { ResponsiveTable, TableColumn } from "@/components/tables/ResponsiveTable";
import ContentLayout from "@/layout/ContentLayout";
import { IGetEnrollmentRequest } from "@/types/staffType";
import { useRouter } from "@bprogress/next/app";

type MyComponentProps = {
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setFilterStatut: Dispatch<SetStateAction<string>>;
  filterStatut: string;
  handleApproveRequest: (id: string) => void;
  enrollmentRequests: IGetEnrollmentRequest [];
  searchTerm: string;
  onCreateEnrollment?: () => void;
  loading: boolean;
};

const EnrollmentRequests = ({
  enrollmentRequests,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleApproveRequest,
  onCreateEnrollment,
  loading
}: MyComponentProps) => {

  const router = useRouter();
  const columns: TableColumn<IGetEnrollmentRequest >[] = [
    {
      key: "last_name",
      label: "Candidat",
      render: (_, row) => (
        <div>
          <div className="font-medium">
            {row.first_name} {row.last_name}
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
      render: (_, row) => formatDateToText(row.submitted_at),
    },
    {
      key: "statut",
      label: "Statut",
      render: (_, row) => (
        <div>
          <Badge className={getStatusColor(row.application_status_code)}>
            {row.application_status_code}
          </Badge>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
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
                router.push(`/admin/students/enrollment/${row.application_code}`);
              }}
            >
              <Eye className="mr-2 h-4 w-4" /> Voir détails
            </DropdownMenuItem>
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

  return (
    <>
     <ContentLayout
        title={`Demandes d'inscription`}
        description="Traitement des nouvelles demandes d'inscription"
        actions = {
          <div className="mt-4 md:mt-0 space-x-3">
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
            <Button variant="outline" className="text-sm w-full sm:w-fit flex-1 sm:flex-none">
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
            router.push(`/admin/students/enrollment/${row.application_code}`);
          }}
          isLoading={loading}
          paginate={15}
        />
      </ContentLayout>
    </>
  );
};

export default EnrollmentRequests;

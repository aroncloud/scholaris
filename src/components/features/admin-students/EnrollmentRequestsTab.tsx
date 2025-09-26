"use client";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  MoreHorizontal,
  Plus,
  Eye,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload,
} from "lucide-react";
import { IEnrollmentRequest } from "@/types/staffType";
import { getStatusColor, formatDateToText } from "@/lib/utils";
import { ResponsiveTable, TableColumn } from "@/components/tables/ResponsiveTable";

type MyComponentProps = {
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setFilterStatut: Dispatch<SetStateAction<string>>;
  setSelectedRequest: Dispatch<SetStateAction<IEnrollmentRequest | null>>;
  filterStatut: string;
  handleApproveRequest: (id: string) => void;
  enrollmentRequests: IEnrollmentRequest[];
  setIsRequestDialogOpen: Dispatch<SetStateAction<boolean>>;
  searchTerm: string;
  onCreateEnrollment?: () => void;
};

const EnrollmentRequests = ({
  setIsRequestDialogOpen,
  setSelectedRequest,
  enrollmentRequests,
  filterStatut,
  setFilterStatut,
  searchTerm,
  handleApproveRequest,
  onCreateEnrollment,
}: MyComponentProps) => {
  const router = useRouter();

  // Define status filter options
  const filterOptions = [
    { value: "all", label: "Toutes" },
    { value: "en_attente", label: "En attente" },
    { value: "approuve", label: "Approuvées" },
    { value: "rejete", label: "Rejetées" },
    { value: "converti", label: "Converties" },
  ];

  // Filter requests based on search + status
  const filteredRequests = useMemo(() => {
    return enrollmentRequests.filter((request) => {
      const matchesSearch =
        searchTerm === "" ||
        (request.nom && request.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (request.prenom && request.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (request.email && request.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = filterStatut === "all" || request.statut === filterStatut;

      return matchesSearch && matchesStatus;
    });
  }, [enrollmentRequests, searchTerm, filterStatut]);

  // Define columns for ResponsiveTable
  const columns: TableColumn<IEnrollmentRequest>[] = [
    {
      key: "prenom",
      label: "Candidat",
      render: (_, row) => (
        <div>
          <div className="font-medium">
            {row.prenom} {row.nom}
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
      render: (filiere) => <div className="font-medium">{filiere}</div>,
    },
    {
      key: "datedemande",
      label: "Date demande",
      render: (date) => formatDateToText(date),
    },
    {
      key: "documents",
      label: "Documents",
      render: (documents) => (
        <div className="space-y-1">
          {documents.map((doc: string, i: number) => (
            <Badge key={i} variant="outline" className="text-xs">
              {doc}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "statut",
      label: "Statut",
      render: (statut, row) => (
        <div>
          <Badge className={getStatusColor(statut)}>
            {statut}
          </Badge>
          {row.commentaire && (
            <div className="text-xs text-red-600 mt-1">
              {row.commentaire}
            </div>
          )}
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
                router.push(`/admin/students/enrollment/${row.id}`);
              }}
            >
              <Eye className="mr-2 h-4 w-4" /> Voir détails
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" /> Documents
            </DropdownMenuItem>

            {row.statut === "en_attente" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-green-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApproveRequest(row.id);
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Approuver
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRequest(row);
                    setIsRequestDialogOpen(true);
                  }}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" /> Rejeter
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <TabsContent value="inscriptions" className="space-y-4">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
            <div>
              <CardTitle>Demandes d&apos;inscription</CardTitle>
              <CardDescription>
                Traitement des nouvelles demandes d&apos;inscription
              </CardDescription>
            </div>
          </div>
            <div className="flex justify-between items-center">
              <div>
                <Select value={filterStatut} onValueChange={setFilterStatut}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
            </div>
        </CardHeader>
        <CardContent>
          {/* Status filter dropdown */}
          

          {/* ResponsiveTable */}
          <div>
            <div className="w-full overflow-x-auto">
              <ResponsiveTable
                columns={columns}
                data={filteredRequests}
                searchKey={['nom', 'prenom', 'email']}
                onRowClick={(row: IEnrollmentRequest) => {
                  router.push(`/admin/students/enrollment/${row.id}`);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default EnrollmentRequests;

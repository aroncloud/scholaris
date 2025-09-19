'use client'
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { Dispatch, SetStateAction } from "react";
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
  Search,
  MoreHorizontal,
  Plus,
  Eye,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "@bprogress/next/app";
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


const EnrollmentRequests = ({ setIsRequestDialogOpen, setSelectedRequest, enrollmentRequests, filterStatut, setFilterStatut, searchTerm, setSearchTerm, handleApproveRequest, onCreateEnrollment }: MyComponentProps) => {
  const router = useRouter();
  
  const columns: TableColumn<IEnrollmentRequest>[] = [
    {
      key: "prenom",
      label: "Candidat",
      render: (_, row) => (
        <div>
          <div className="font-medium">{row.prenom} {row.nom}</div>
          <div className="text-sm text-muted-foreground">{row.email}</div>
        </div>
      ),
    },
    {
      key: "filiere",
      label: "Formation",
      render: (_, row) => (
        <div>
          <div className="font-medium">{row.filiere}</div>
          <div className="text-sm text-muted-foreground">{row.niveau}</div>
        </div>
      ),
    },
    {
      key: "datedemande",
      label: "Date demande",
      render: (value) => formatDateToText(value),
    },
    {
      key: "documents",
      label: "Documents",
      render: (docs) => (
        <div className="space-y-1">
          {docs.map((doc: string, i: number) => (
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
      render: (value, row) => (
        <div>
          <Badge className={getStatusColor(row.statut)}>{value}</Badge>
          {row.commentaire && (
            <div className="text-xs text-red-600 mt-1">{row.commentaire}</div>
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
              onClick={() =>
                router.push(`/admin/students/enrollment/${row.id}`)
              }
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
                  onClick={() => handleApproveRequest(row.id)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Approuver
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => {
                    setSelectedRequest(row)
                    setIsRequestDialogOpen(true)
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
  ]


  return (
    <TabsContent value="inscriptions" className="space-y-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div className="space-y-2">
            <CardTitle>Demandes d'inscription</CardTitle>
            <CardDescription>
              Traitement des nouvelles demandes d'inscription
            </CardDescription>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <Select
                value={filterStatut}
                onValueChange={setFilterStatut}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="approuve">Approuvé</SelectItem>
                  <SelectItem value="rejete">Rejeté</SelectItem>
                  <SelectItem value="converti">Converti</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={onCreateEnrollment}
                variant='info'
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle demande
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <ResponsiveTable
              columns={columns}
              data={enrollmentRequests}
              paginate={20}
              searchKey={["nom"]}
            />
          </div>

        </CardContent>
      </Card>
    </TabsContent>
  )
}

export default EnrollmentRequests
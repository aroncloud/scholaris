'use client'
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { Dispatch, SetStateAction, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Search,
  Filter,
  MoreHorizontal,
  Plus,
  Eye,
  AlertTriangle,
  CheckCircle,
  Mail,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { IEnrollmentRequest, IStudent } from "@/types/staffType";
import Header from "./Header";
import { getStatusColor, formatDateToText } from "@/lib/utils";


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
  
  return (
    <TabsContent value="inscriptions" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Demandes d'inscription</CardTitle>
          <CardDescription>
            Traitement des nouvelles demandes d'inscription
          </CardDescription>
        </CardHeader>
        <CardContent>
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidat</TableHead>
                <TableHead>Formation</TableHead>
                <TableHead>Date demande</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollmentRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {request.prenom} {request.nom}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {request.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.filiere}</div>
                      <div className="text-sm text-muted-foreground">
                        {request.niveau}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDateToText(request.datedemande)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {request.documents.map((doc, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.statut)}>
                      {request.statut}
                    </Badge>
                    {request.commentaire && (
                      <div className="text-xs text-red-600 mt-1">
                        {request.commentaire}
                      </div>
                    )}
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
                          onClick={() => router.push(`/admin/students/enrollment/${request.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Documents
                        </DropdownMenuItem>
                        {request.statut === "en_attente" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-green-600"
                              onClick={() =>
                                handleApproveRequest(request.id)
                              }
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approuver
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedRequest(request);
                                setIsRequestDialogOpen(true);
                              }}
                            >
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              Rejeter
                            </DropdownMenuItem>
                          </>
                        )}
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

export default EnrollmentRequests
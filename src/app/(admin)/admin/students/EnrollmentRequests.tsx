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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  GraduationCap,
  Users,
  BookOpen,
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Eye,
  UserPlus,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  DollarSign,
  Bell,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { IEnrollmentRequest, IStudent } from "@/types/userTypes";
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
                </SelectContent>
              </Select>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={onCreateEnrollment}
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
                <TableHead>Contact</TableHead>
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
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1" />
                        {request.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1" />
                        {request.telephone}
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
                      {request.statut === "en_attente"
                        ? "En attente"
                        : request.statut === "approuve"
                          ? "Approuvé"
                          : "Rejeté"}
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
                        <DropdownMenuItem>
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
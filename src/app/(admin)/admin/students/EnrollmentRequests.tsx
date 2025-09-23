"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { Dispatch, SetStateAction, useMemo } from "react";
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
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "@bprogress/next/app";
import { IEnrollmentRequest } from "@/types/staffType";
import { getStatusColor, formatDateToText } from "@/lib/utils";

// ✅ import your shadcn/ui Table
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { v4 as uuidv4 } from "uuid";

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
  setSearchTerm,
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
        request.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatut === "all" || request.statut === filterStatut;

      return matchesSearch && matchesStatus;
    });
  }, [enrollmentRequests, searchTerm, filterStatut]);

  // ✅ Instead of ResponsiveTable, we’ll render manually
  const columns = [
    { key: "prenom", label: "Candidat" },
    { key: "filiere", label: "Formation" },
    { key: "datedemande", label: "Date demande" },
    { key: "documents", label: "Documents" },
    { key: "statut", label: "Statut" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <TabsContent value="inscriptions" className="space-y-4">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
            <div>
              <CardTitle>Demandes d'inscription</CardTitle>
              <CardDescription>
                Traitement des nouvelles demandes d'inscription
              </CardDescription>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                onClick={onCreateEnrollment}
                variant="info"
                className="w-full md:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle demande
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 🔍 Search + Filter Row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            {/* Search input */}
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, prénom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Status filter dropdown */}
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

          {/* ✅ Updated Table (no scrollbar, clean wrap) */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table className="w-full table-fixed border-collapse">
              <TableHeader className="bg-gray-100">
                <TableRow>
                  {columns.map((col, index) => (
                    <TableHead
                      key={uuidv4()}
                      className={`px-4 py-2 text-left whitespace-normal break-words ${
                        index < columns.length - 1
                          ? "border-r border-gray-200"
                          : ""
                      }`}
                    >
                      {col.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center py-4 text-gray-500"
                    >
                      Aucun résultat trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((row, rowIndex) => (
                    <TableRow
                      key={uuidv4()}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        rowIndex < filteredRequests.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      }`}
                      onClick={() => {}}
                    >
                      {/* Candidat */}
                      <TableCell className="px-4 py-2 whitespace-normal break-words border-r border-gray-200">
                        <div className="font-medium">
                          {row.prenom} {row.nom}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {row.email}
                        </div>
                      </TableCell>

                      {/* Formation */}
                      <TableCell className="px-4 py-2 whitespace-normal break-words border-r border-gray-200">
                        <div className="font-medium">{row.filiere}</div>
                        <div className="text-sm text-muted-foreground">
                          {row.niveau}
                        </div>
                      </TableCell>

                      {/* Date demande */}
                      <TableCell className="px-4 py-2 whitespace-normal break-words border-r border-gray-200">
                        {formatDateToText(row.datedemande)}
                      </TableCell>

                      {/* Documents */}
                      <TableCell className="px-4 py-2 whitespace-normal break-words border-r border-gray-200">
                        <div className="space-y-1">
                          {row.documents.map((doc, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>

                      {/* Statut */}
                      <TableCell className="px-4 py-2 whitespace-normal break-words border-r border-gray-200">
                        <Badge className={getStatusColor(row.statut)}>
                          {row.statut}
                        </Badge>
                        {row.commentaire && (
                          <div className="text-xs text-red-600 mt-1">
                            {row.commentaire}
                          </div>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-4 py-2 whitespace-normal break-words">
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
                                router.push(
                                  `/admin/students/enrollment/${row.id}`
                                )
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
                                  <CheckCircle className="mr-2 h-4 w-4" />{" "}
                                  Approuver
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setSelectedRequest(row);
                                    setIsRequestDialogOpen(true);
                                  }}
                                >
                                  <AlertTriangle className="mr-2 h-4 w-4" />{" "}
                                  Rejeter
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default EnrollmentRequests;

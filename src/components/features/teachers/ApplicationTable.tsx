import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MoreHorizontal,
  Eye,
  Download,
  CheckCircle,
  UserCheck,
  AlertTriangle,
  UserPlus,
} from "lucide-react";
import { Application, statutApplicationLabels } from "../../../app/(admin)/admin/teachers/types";

interface ApplicationTableProps {
  applications: Application[];
  onApprove: (applicationId: string) => void;
  onReject: (application: Application) => void;
  onConvertToTeacher: (application: Application) => void;
  onChangeToInterview: (applicationId: string) => void;
}


export function ApplicationTable({
  applications,
  onApprove,
  onReject,
  onConvertToTeacher,
  onChangeToInterview,
}: ApplicationTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Candidat</TableHead>
            <TableHead className="min-w-[180px]">Poste visé</TableHead>
            <TableHead className="min-w-[120px]">Qualification</TableHead>
            <TableHead className="min-w-[100px]">Expérience</TableHead>
            <TableHead className="min-w-[120px]">Salaire</TableHead>
            <TableHead className="min-w-[140px]">Statut</TableHead>
            <TableHead className="min-w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell>
                <div className="min-w-[200px]">
                  <div className="font-medium">
                    {application.prenom} {application.nom}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {application.email}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {application.telephone}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="min-w-[180px]">
                  <div className="font-medium">{application.posteVise}</div>
                  <div className="text-sm text-muted-foreground">
                    {application.specialite}
                  </div>
                </div>
              </TableCell>
              <TableCell className="min-w-[120px]">{application.qualification}</TableCell>
              <TableCell className="min-w-[100px]">{application.experience} ans</TableCell>
              <TableCell className="min-w-[120px]">
                {application.salaireSouhaite && (
                  <span className="text-green-600">
                    {application.salaireSouhaite}€/mois
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="min-w-[140px]">
                  <Badge
                    className={statutApplicationLabels[application.statut].color}
                  >
                    {statutApplicationLabels[application.statut].label}
                  </Badge>
                  {application.commentaire && (
                    <div className="text-xs text-muted-foreground mt-1 truncate max-w-[120px]">
                      {application.commentaire}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="min-w-[100px]">
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
                      Voir la candidature
                    </DropdownMenuItem>
                    {application.cv && (
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger CV
                      </DropdownMenuItem>
                    )}
                    {application.lettreMotivation && (
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Lettre de motivation
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {application.statut === "en_attente" && (
                      <>
                        <DropdownMenuItem
                          className="text-green-600"
                          onClick={() => onApprove(application.id)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Accepter
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-blue-600"
                          onClick={() => onChangeToInterview(application.id)}
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          Convoquer entretien
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => onReject(application)}
                        >
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Refuser
                        </DropdownMenuItem>
                      </>
                    )}
                    {application.statut === "accepte" && (
                      <DropdownMenuItem
                        className="text-green-600"
                        onClick={() => onConvertToTeacher(application)}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Convertir en enseignant
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
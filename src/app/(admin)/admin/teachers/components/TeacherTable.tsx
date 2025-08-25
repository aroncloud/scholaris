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
  Edit,
  Trash2,
  Eye,
  FileText,
  Calendar,
  Mail,
  MessageSquare,
  Lock,
  Unlock,
  UserX,
} from "lucide-react";
import { Teacher, statutLabels, typeCodeLabels } from "../types";

interface TeacherTableProps {
  teachers: Teacher[];
  onViewTeacher: (teacher: Teacher) => void;
  onEditTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (teacherId: string) => void;
  onChangeStatus: (teacherId: string, newStatus: string) => void;
}


export function TeacherTable({
  teachers,
  onViewTeacher,
  onEditTeacher,
  onDeleteTeacher,
  onChangeStatus,
}: TeacherTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Enseignant</TableHead>
          <TableHead>Spécialité</TableHead>
          <TableHead>Contrat</TableHead>
          <TableHead>Date d&apos;embauche</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teachers.map((teacher) => (
          <TableRow key={teacher.id}>
            <TableCell>
              <div>
                <div className="font-medium">
                  {teacher.prenom} {teacher.nom}
                </div>
                <div className="text-sm text-muted-foreground">
                  {teacher.matricule}
                </div>
                <div className="text-sm text-muted-foreground">
                  {teacher.email}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div className="font-medium">{teacher.specialite}</div>
                <div className="text-sm text-muted-foreground">
                  {teacher.departement}
                </div>
                <div className="text-sm text-muted-foreground">
                  {teacher.qualification}
                </div>
              </div>
            </TableCell>
            <TableCell>
              {teacher.typeCode && (
                <Badge className={typeCodeLabels[teacher.typeCode].color}>
                  {typeCodeLabels[teacher.typeCode].label}
                </Badge>
              )}
            </TableCell>
            <TableCell>
              {/* <div className="text-sm">
                {new Date(teacher.dateEmbauche).toLocaleDateString("fr-FR")}
              </div> */}
              -
            </TableCell>
            <TableCell>
              <Badge className={statutLabels[teacher.statut].color}>
                {statutLabels[teacher.statut].label}
              </Badge>
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
                  <DropdownMenuItem onClick={() => onViewTeacher(teacher)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Voir le dossier
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditTeacher(teacher)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    Contrat
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calendar className="mr-2 h-4 w-4" />
                    Planning
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    Envoyer notification
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contacter
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {teacher.statut === "actif" ? (
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onChangeStatus(teacher.id, "suspendu")}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Suspendre
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="text-green-600"
                      onClick={() => onChangeStatus(teacher.id, "actif")}
                    >
                      <Unlock className="mr-2 h-4 w-4" />
                      Réactiver
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => onChangeStatus(teacher.id, "archive")}
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Archiver
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDeleteTeacher(teacher.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, BookOpen, Star } from "lucide-react";
import { Teacher, Application } from "../types";

interface TeacherStatsCardsProps {
  teachers: Teacher[];
  applications: Application[];
}

export function TeacherStatsCards({ teachers, applications }: TeacherStatsCardsProps) {
  const activeTeachers = teachers.filter((t) => t.statut === "actif").length;
  const pendingApplications = applications.filter((a) => a.statut === "en_attente").length;
  const totalHours = teachers.reduce((sum, t) => sum + (t.heuresEnseignement || 0), 0);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Enseignants actifs
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeTeachers}</div>
          <p className="text-xs text-muted-foreground">
            Personnel en activité
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Candidatures
          </CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingApplications}</div>
          <p className="text-xs text-muted-foreground">
            En attente de traitement
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Heures d&apos;enseignement
          </CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalHours}</div>
          <p className="text-xs text-muted-foreground">Total annuel</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Note moyenne
          </CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4.5</div>
          <p className="text-xs text-muted-foreground">
            Évaluations étudiants
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
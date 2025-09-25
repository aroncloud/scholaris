'use client'
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger, TabsContents } from '@/components/animate-ui/components/animate/tabs';
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  Search,
  Edit,
  Eye,
  BarChart3,
  Target,
  Play,
  Settings,
} from "lucide-react";
import MyCoursesTab from "@/components/features/cours/MyCoursesTab";
import TeacherCoursePlanningTab from "@/components/features/cours/TeacherCoursePlanningTab";
import TeacherSessionTab from "@/components/features/cours/TeacherSessionTab";

interface Course {
  id: string;
  name: string;
  code: string;
  filiere: string;
  niveau: string;
  semester: string;
  credits: number;
  totalHours: number;
  completedHours: number;
  students: number;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "upcoming" | "paused";
  description: string;
  objectives: string[];
  sessions: CourseSession[];
}

interface CourseSession {
  id: string;
  title: string;
  type: "cours" | "tp" | "td";
  date: string;
  duration: number;
  completed: boolean;
  attendance?: number;
}

const mockCourses: Course[] = [
  {
    id: "1",
    name: "Anatomie générale",
    code: "ANAT101",
    filiere: "Pharmacie",
    niveau: "Année 1",
    semester: "Semestre 1",
    credits: 6,
    totalHours: 45,
    completedHours: 30,
    students: 45,
    startDate: "2023-09-01",
    endDate: "2024-01-31",
    status: "active",
    description:
      "Introduction à l'anatomie humaine avec focus sur les systèmes cardiovasculaire, respiratoire et nerveux.",
    objectives: [
      "Comprendre la structure anatomique du corps humain",
      "Identifier les organes et leurs fonctions",
      "Maîtriser la terminologie anatomique",
      "Analyser les relations entre structure et fonction",
    ],
    sessions: [
      {
        id: "1",
        title: "Introduction à l'anatomie",
        type: "cours",
        date: "2024-01-15",
        duration: 1.5,
        completed: true,
        attendance: 44,
      },
      {
        id: "2",
        title: "Système cardiovasculaire",
        type: "cours",
        date: "2024-01-18",
        duration: 2,
        completed: true,
        attendance: 43,
      },
      {
        id: "3",
        title: "TP Dissection",
        type: "tp",
        date: "2024-01-22",
        duration: 3,
        completed: false,
      },
    ],
  },
  {
    id: "2",
    name: "Physiologie spécialisée",
    code: "PHYS201",
    filiere: "Médecine",
    niveau: "Année 2",
    semester: "Semestre 2",
    credits: 8,
    totalHours: 60,
    completedHours: 45,
    students: 38,
    startDate: "2024-02-01",
    endDate: "2024-06-30",
    status: "active",
    description: "Étude approfondie des mécanismes physiologiques complexes.",
    objectives: [
      "Analyser les mécanismes de régulation physiologique",
      "Comprendre les interactions entre systèmes",
      "Interpréter les données physiologiques",
      "Appliquer les connaissances en contexte clinique",
    ],
    sessions: [
      {
        id: "4",
        title: "Régulation hormonale",
        type: "cours",
        date: "2024-01-20",
        duration: 2,
        completed: true,
        attendance: 36,
      },
      {
        id: "5",
        title: "TP Électrophysiologie",
        type: "tp",
        date: "2024-01-25",
        duration: 4,
        completed: false,
      },
    ],
  },
  {
    id: "3",
    name: "TP Anatomie pratique",
    code: "TPAN101",
    filiere: "Kinésithérapie",
    niveau: "Année 1",
    semester: "Semestre 1",
    credits: 4,
    totalHours: 30,
    completedHours: 20,
    students: 22,
    startDate: "2023-09-15",
    endDate: "2024-01-15",
    status: "completed",
    description:
      "Travaux pratiques d'anatomie avec manipulation et observation directe.",
    objectives: [
      "Manipuler les préparations anatomiques",
      "Observer et identifier les structures",
      "Développer les compétences pratiques",
      "Comprendre l'anatomie palpatoire",
    ],
    sessions: [
      {
        id: "6",
        title: "Membre supérieur",
        type: "tp",
        date: "2024-01-10",
        duration: 3,
        completed: true,
        attendance: 22,
      },
      {
        id: "7",
        title: "Membre inférieur",
        type: "tp",
        date: "2024-01-15",
        duration: 3,
        completed: true,
        attendance: 21,
      },
    ],
  },
];

const statusLabels = {
  active: { label: "En cours", color: "bg-green-100 text-green-800" },
  completed: { label: "Terminé", color: "bg-blue-100 text-blue-800" },
  upcoming: { label: "À venir", color: "bg-yellow-100 text-yellow-800" },
  paused: { label: "En pause", color: "bg-gray-100 text-gray-800" },
};

const sessionTypeLabels = {
  cours: { label: "Cours magistral", color: "bg-blue-100 text-blue-800" },
  tp: { label: "Travaux pratiques", color: "bg-green-100 text-green-800" },
  td: { label: "Travaux dirigés", color: "bg-purple-100 text-purple-800" },
};

export default function TeacherCourses() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = mockCourses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.filiere.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const activeCourses = mockCourses.filter(
    (course) => course.status === "active",
  );
  const totalStudents = mockCourses.reduce(
    (sum, course) => sum + course.students,
    0,
  );
  const totalHours = mockCourses.reduce(
    (sum, course) => sum + course.completedHours,
    0,
  );
  const averageProgress = Math.round(
    mockCourses.reduce(
      (sum, course) => sum + (course.completedHours / course.totalHours) * 100,
      0,
    ) / mockCourses.length,
  );



  const upcomingSessions = mockCourses
    .flatMap((course) => course.sessions)
    .filter((session) => !session.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle><h2 className="text-3xl font-bold tracking-tight">Mes Cours</h2></CardTitle>
            <CardDescription>
             <p className="text-muted-foreground">
                Gestion et suivi de vos enseignements assignés par l&apos;administration
              </p>
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Cours actifs
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeCourses.length}</div>
                  <p className="text-xs text-muted-foreground">
                    En cours cette année
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total étudiants
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalStudents}</div>
                  <p className="text-xs text-muted-foreground">
                    Tous cours confondus
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Heures enseignées
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalHours}h</div>
                  <p className="text-xs text-muted-foreground">
                    Cette année académique
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Progression moyenne
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageProgress}%</div>
                  <p className="text-xs text-muted-foreground">
                    Avancement des cours
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
              {/* Search */}
              <div className="flex justify-between items-center">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un cours..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
          </CardHeader>
          <CardContent>
            {/* Main Content */}
            <Tabs defaultValue="courses" className="space-y-4">
              <TabsList className="w-full">
                <TabsTrigger value="courses">Mes cours</TabsTrigger>
                <TabsTrigger value="sessions">Prochaines séances</TabsTrigger>
                <TabsTrigger value="planning">Planification</TabsTrigger>
              </TabsList>
              <TabsContents>
                <TabsContent value="courses" className="space-y-4">
                  <MyCoursesTab courses={filteredCourses} />
                </TabsContent>

                <TabsContent value="sessions" className="space-y-4">
                  <TeacherSessionTab sessionList={upcomingSessions} courseList={mockCourses}/>
                </TabsContent>

                <TabsContent value="planning" className="space-y-4">
                  <TeacherCoursePlanningTab />
                </TabsContent>
              </TabsContents>
            </Tabs>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

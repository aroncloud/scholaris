/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { getStatusColor } from "@/lib/utils";

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

interface MyProps {
  courses: Course[];
}


const MyCoursesTab = ({ courses }: MyProps) => {
    const getProgressColor = (progress: number) => {
        if (progress >= 80) return "bg-green-500";
        if (progress >= 60) return "bg-blue-500";
        if (progress >= 40) return "bg-yellow-500";
        return "bg-red-500";
    };
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
            const progress = Math.round(
                (course.completedHours / course.totalHours) * 100,
            );
            const nextSession = course.sessions.find((s) => !s.completed);

            return (
                <Card
                key={course.id}
                className="hover:shadow-lg transition-shadow"
                >
                <CardHeader>
                    <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <CardTitle className="text-lg">
                        {course.name}
                        </CardTitle>
                        <CardDescription>
                        {course.code} • {course.filiere} - {course.niveau}
                        </CardDescription>
                    </div>
                    <Badge className={getStatusColor(course.status)}>
                        {course.status}
                    </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress
                        value={progress}
                        className={`h-2 ${getProgressColor(progress)}`}
                    />
                    <div className="text-xs text-muted-foreground">
                        {course.completedHours}h / {course.totalHours}h
                    </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{course.students} étudiants</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span>{course.credits} crédits</span>
                    </div>
                    </div>

                    {/* Next Session */}
                    {nextSession && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm font-medium text-blue-900">
                        Prochaine séance
                        </div>
                        <div className="text-sm text-blue-700">
                        {nextSession.title}
                        </div>
                        <div className="text-xs text-blue-600 flex items-center space-x-2 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                            {new Date(nextSession.date).toLocaleDateString(
                            "fr-FR",
                            )}
                        </span>
                        <Clock className="h-3 w-3 ml-2" />
                        <span>{nextSession.duration}h</span>
                        </div>
                    </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2">
                    <Button
                        variant="info"
                        size="sm"
                        className="flex-1"
                        onClick={() => {}}
                    >
                        <Eye className="h-4 w-4 mr-1" />
                        Détails
                    </Button>
                    <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                    </Button>
                    </div>
                </CardContent>
                </Card>
            );
        })}
    </div>
  )
}

export default MyCoursesTab
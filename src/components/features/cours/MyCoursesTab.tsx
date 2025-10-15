'use client';import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button";
import Badge from '@/components/custom-ui/Badge';
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Edit,
  Eye,
  Target,
  Settings,
} from "lucide-react";
import { useCoursData } from "@/hooks/feature/cours/useCoursData";





const MyCoursesTab = () => {
  const { teacherCoures } = useCoursData();

    const getProgressColor = (progress: number) => {
        if (progress >= 80) return "bg-green-500";
        if (progress >= 60) return "bg-blue-500";
        if (progress >= 40) return "bg-yellow-500";
        return "bg-red-500";
    };
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teacherCoures.map((course) => {

                return (
                    <Card key={uuidv4()} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <CardTitle className="text-lg">
                                    {course.course_unit_name}
                                    </CardTitle>
                                    <CardDescription>
                                    {course.description && <>{course.description} •</>} {course.curriculum_name} - {course.study_level}
                                    </CardDescription>
                                </div>
                                <Badge
                                    size="sm"
                                    value={course.status_code}
                                    label={course.status_code}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Progress */}
                            <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Progression</span>
                                <span className="font-medium">{10}%</span>
                            </div>
                            <Progress
                                value={20}
                                className={`h-2 ${getProgressColor(20)}`}
                            />
                            <div className="text-xs text-muted-foreground">
                                {10}h / {course.lecture_hours}h
                                {/* {course.lecture_hours}h */}
                            </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>45 étudiants</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Target className="h-4 w-4 text-muted-foreground" />
                                {/* <span>{course.credits} crédits</span> */}
                                <span>10 crédits</span>
                            </div>
                            </div>

                            {/* Next Session */}
                            {/* {nextSession && (
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
                            )} */}

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
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Badge from '@/components/custom-ui/Badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ICourse } from '@/types/courseType';
import { 
  BookOpen, 
  Users, 
  Eye, 
  Calendar, 
  Clock, 
  Edit, 
  Settings,
  GraduationCap
} from 'lucide-react';

interface CourseCardProps {
  course: ICourse;
  onViewDetails: (courseId: string) => void;
  onEdit: (courseId: string) => void;
  onSettings: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onViewDetails,
  onEdit,
  onSettings
}) => {


  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {course.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <BookOpen className="w-4 h-4" />
              <span>{course.code} • {course.program} - Année {course.year}</span>
            </div>
          </div>
          <Badge
            size="sm"
            value={course.status}
            label={course.status}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progression</span>
            <span className="font-medium mb-2">{course.progress}%</span>
          </div>
          <Progress 
            value={course.progress} 
            // className="h-2"
            className="h-2 [&>div]:bg-blue-500"
          />
          <div className="text-sm text-gray-500">
            {course.completedHours}h / {course.totalHours}h
          </div>
        </div>

        {/* Course Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{course.students} étudiants</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{course.credits} crédits</span>
          </div>
        </div>

        {/* Next Session */}
        {course.nextSession && (
          <div className="bg-blue-100 rounded-lg p-3 space-y-2">
            <div className="text-sm font-medium text-blue-700">Prochaine séance</div>
            <div className="text-sm text-blue-600">{course.nextSession.type}</div>
            <div className="flex items-center gap-4 text-xs text-blue-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{course.nextSession.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{course.nextSession.duration}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(course.id)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            Détails
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(course.id)}
            className="p-2"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSettings(course.id)}
            className="p-2"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;

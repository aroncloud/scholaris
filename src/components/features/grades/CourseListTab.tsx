'use client';

import { TeacherCourse } from '@/types/gradeTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users } from 'lucide-react';

export default function CourseListSection({ courses, onOpen }: { courses: TeacherCourse[]; onOpen: (id: string) => void; }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {courses.map((c) => (
        <Card key={c.id} className="w-full hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900">{c.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BookOpen className="w-4 h-4" />
              <span>{c.code} • {c.filiere} - {c.niveau}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{c.studentsCount} étudiants</span>
            </div>
            <Button 
              className="w-full hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200" 
              variant="outline" 
              onClick={() => onOpen(c.id)}
            >
              Ouvrir
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}



'use client';

import { useState } from 'react';
import { useGradesData } from '@/hooks/feature/grades/useGradesData';
import CourseListSection from '@/components/features/grades/CourseListTab';
import GradeEntrySection from '@/components/features/grades/GradeEntryTab';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Users, BarChart3, Calendar, Download, Upload, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/cards/StatCard';
import SaisirNoteModal from '@/components/modal/SaisirNoteModal';
import SaisieParUEModal from '@/components/modal/SaisieParUEModal';
import { GRADES_ENTRY_CONSTANTS } from '@/constant';

export default function GradesEntryPage() {
  const { courses, selectedCourse, students, grades, activeEval, stats, selectCourse, changeEvaluation, addGrade } = useGradesData();
  const [activeTab, setActiveTab] = useState(selectedCourse ? 'saisie' : 'matieres');
  const [saisirNoteModalOpen, setSaisirNoteModalOpen] = useState(false);
  const [saisieParUEModalOpen, setSaisieParUEModalOpen] = useState(false);

  const handleBackToMatieres = () => {
    setActiveTab('matieres');
  };

  const handleSaisirNote = (data: any) => {
    console.log('Saisir note data:', data);
    // Handle the note data here
  };

  const handleSaisieParUE = (data: any) => {
    console.log('Saisie par UE data:', data);
    // Handle the UE data here
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{GRADES_ENTRY_CONSTANTS.PAGE_TITLE}</h1>
          <p className="text-gray-600">{GRADES_ENTRY_CONSTANTS.PAGE_DESCRIPTION}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {GRADES_ENTRY_CONSTANTS.BUTTONS.EXPORT}
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            {GRADES_ENTRY_CONSTANTS.BUTTONS.IMPORT}
          </Button>
          <Button variant="outline" onClick={() => setSaisieParUEModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {GRADES_ENTRY_CONSTANTS.BUTTONS.SAISIE_UE}
          </Button>
          <Button className="bg-blue-700" onClick={() => setSaisirNoteModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2 " />
            {GRADES_ENTRY_CONSTANTS.BUTTONS.SAISIR_NOTE}
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title={GRADES_ENTRY_CONSTANTS.STATS.TOTAL_GRADES}
            value={stats.totalGrades}
            icon={<BarChart3 className="w-4 h-4" />}
          />
          <StatCard
            title={GRADES_ENTRY_CONSTANTS.STATS.AVERAGE}
            value={`${stats.averageOn20}/20`}
            icon={<Award className="w-4 h-4" />}
          />
          <StatCard
            title={GRADES_ENTRY_CONSTANTS.STATS.EVALUATED_STUDENTS}
            value={stats.distinctStudents}
            icon={<Users className="w-4 h-4" />}
          />
          <StatCard
            title={GRADES_ENTRY_CONSTANTS.STATS.PENDING}
            value={stats.pendingCount}
            icon={<Calendar className="w-4 h-4" />}
          />
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="matieres">{GRADES_ENTRY_CONSTANTS.TABS.MATIERES}</TabsTrigger>
          <TabsTrigger value="saisie" disabled={!selectedCourse}>
            {GRADES_ENTRY_CONSTANTS.TABS.SAISIE}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matieres" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{GRADES_ENTRY_CONSTANTS.COURSE_LIST_TITLE}</CardTitle>
            </CardHeader>
            <CardContent>
              <CourseListSection courses={courses} onOpen={selectCourse} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saisie" className="space-y-4">
          {selectedCourse && (
            <>
              {/* Back button */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToMatieres}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Retour aux matières</span>
                </Button>
              </div>
              
              <GradeEntrySection
                course={selectedCourse}
                students={students}
                grades={grades}
                activeEval={activeEval}
                onChangeEval={changeEvaluation}
                onSave={async ({ studentId, value, max, evaluation, courseId }) => {
                  await addGrade({ courseId, studentId, evaluation, value, max });
                }}
              />
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <SaisirNoteModal
        open={saisirNoteModalOpen}
        onOpenChange={setSaisirNoteModalOpen}
        onSave={handleSaisirNote}
      />

      <SaisieParUEModal
        open={saisieParUEModalOpen}
        onOpenChange={setSaisieParUEModalOpen}
        onSave={handleSaisieParUE}
      />
    </div>
  );
}


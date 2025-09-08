'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGradesData } from '@/hooks/feature/grades/useGradesData';
import CourseListSection from '@/components/features/grades/CourseListTab';
import GradeEntrySection from '@/components/features/grades/GradeEntryTab';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Users, BarChart3, Calendar, Download, Upload, Plus, ArrowLeft, X, Save, ChevronLeft } from 'lucide-react';
import { UESELECTION_CONSTANTS } from '@/constant';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/cards/StatCard';
import SaisirNoteModal from '@/components/modal/grades/SaisirNoteModal';
import { GRADES_ENTRY_CONSTANTS } from '@/constant';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UESelectionProps {
  onSelect?: (data: { filiere: string; niveau: string; ue: string }) => void;
  className?: string;
}

const UESelection: React.FC<UESelectionProps> = ({ onSelect, className = '' }) => {
  const router = useRouter();
  const [filiere, setFiliere] = useState('');
  const [niveau, setNiveau] = useState('');
  const [ue, setUe] = useState('');
  
  const handleBack = () => {
    // Navigate to the main grades entry page with the matieres tab active
    router.push('/admin/grades-entry?tab=matieres');
  };

  const filieres = [
    { id: 'info', name: 'Informatique' },
    { id: 'gestion', name: 'Gestion' },
    { id: 'compta', name: 'Comptabilité' },
  ];

  const niveaux = [
    { id: 'l1', name: 'Licence 1' },
    { id: 'l2', name: 'Licence 2' },
    { id: 'l3', name: 'Licence 3' },
  ];

  const ues = [
    { id: 'ue1', name: 'UE1 - Programmation avancée' },
    { id: 'ue2', name: 'UE2 - Base de données' },
    { id: 'ue3', name: 'UE3 - Réseaux' },
  ];

  const isFormValid = filiere && niveau && ue;

  const handleSave = () => {
    if (isFormValid && onSelect) {
      onSelect({ filiere, niveau, ue });
    }
  };

  return (
    <div className={`${className} bg-gray-50 min-h-screen`}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="flex items-center space-x-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>{UESELECTION_CONSTANTS.HEADER.BACK}</span>
              </Button>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900">{UESELECTION_CONSTANTS.TITLE}</h1>
                <p className="text-sm text-gray-500 mt-1">{UESELECTION_CONSTANTS.SUBTITLE}</p>
              </div>
            </div>
        
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline"
                className="text-gray-700 hover:bg-gray-50 border-gray-300"
                onClick={() => {
                  setFiliere('');
                  setNiveau('');
                  setUe('');
                }}
              >
                <X className="h-4 w-4 mr-2" />
                {UESELECTION_CONSTANTS.HEADER.RESET}
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!isFormValid}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed px-6"
              >
                <Save className="h-4 w-4 mr-2" />
                {UESELECTION_CONSTANTS.HEADER.SAVE}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900">{UESELECTION_CONSTANTS.FORM.TITLE}</h2>
            <p className="text-sm text-gray-500 mt-1">{UESELECTION_CONSTANTS.FORM.DESCRIPTION}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {UESELECTION_CONSTANTS.FORM.FIELDS.FILIERE.LABEL}
              </label>
              <Select value={filiere} onValueChange={setFiliere}>
                <SelectTrigger>
                  <SelectValue placeholder={UESELECTION_CONSTANTS.FORM.FIELDS.FILIERE.PLACEHOLDER} />
                </SelectTrigger>
                <SelectContent>
                  {filieres.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {UESELECTION_CONSTANTS.FORM.FIELDS.NIVEAU.LABEL}
              </label>
              <Select value={niveau} onValueChange={setNiveau}>
                <SelectTrigger>
                  <SelectValue placeholder={UESELECTION_CONSTANTS.FORM.FIELDS.NIVEAU.PLACEHOLDER} />
                </SelectTrigger>
                <SelectContent>
                  {niveaux.map((n) => (
                    <SelectItem key={n.id} value={n.id}>
                      {n.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {UESELECTION_CONSTANTS.FORM.FIELDS.UE.LABEL}
              </label>
              <Select value={ue} onValueChange={setUe}>
                <SelectTrigger>
                  <SelectValue placeholder={UESELECTION_CONSTANTS.FORM.FIELDS.UE.PLACEHOLDER} />
                </SelectTrigger>
                <SelectContent>
                  {ues.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function GradesEntryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { courses, selectedCourse, students, grades, activeEval, stats, selectCourse, changeEvaluation, addGrade } = useGradesData();
  const [activeTab, setActiveTab] = useState(selectedCourse ? 'saisie' : 'matieres');
  const [saisirNoteModalOpen, setSaisirNoteModalOpen] = useState(false);

  // Update tab based on URL parameter
  useEffect(() => {
    const tab = searchParams?.get('tab');
    if (tab && ['matieres', 'saisie', 'saisie-ue'].includes(tab)) {
      setActiveTab(tab);
    } else {
      // Default to matieres if no valid tab is specified
      setActiveTab(selectedCourse ? 'saisie' : 'matieres');
    }
  }, [searchParams, selectedCourse]);

  const handleBackToMatieres = () => {
    setActiveTab('matieres');
  };

  const handleSaisirNote = (data: any) => {
    console.log('Saisir note data:', data);
    // Handle the note data here
  };

  const handleUESelect = (data: any) => {
    console.log('UE Selection data:', data);
    // Handle UE selection here
  };

  if (activeTab === 'saisie-ue') {
    return (
      <div className="p-6">
        <UESelection onSelect={handleUESelect} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{GRADES_ENTRY_CONSTANTS.PAGE_TITLE}</h1>
          <p className="text-gray-600">{GRADES_ENTRY_CONSTANTS.PAGE_DESCRIPTION}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200">
            <Download className="h-4 w-4 mr-2" />
            {GRADES_ENTRY_CONSTANTS.BUTTONS.EXPORT}
          </Button>
          <Button variant="outline" className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200">
            <Upload className="h-4 w-4 mr-2" />
            {GRADES_ENTRY_CONSTANTS.BUTTONS.IMPORT}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/grades-entry?tab=saisie-ue')}
            className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            {GRADES_ENTRY_CONSTANTS.BUTTONS.SAISIE_UE}
          </Button>
          <Button 
            className="bg-blue-700 hover:bg-blue-800" 
            onClick={() => setSaisirNoteModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
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
            description="Notes saisies"
            icon={<BarChart3 className="w-4 h-4" />}
          />
          <StatCard
            title={GRADES_ENTRY_CONSTANTS.STATS.AVERAGE}
            value={`${stats.averageOn20}/20`}
             description="Toutes matières"
            icon={<Award className="w-4 h-4" />}
          />
          <StatCard
            title={GRADES_ENTRY_CONSTANTS.STATS.EVALUATED_STUDENTS}
            value={stats.distinctStudents}
             description="Ayant des notes"
            icon={<Users className="w-4 h-4" />}
          />
          <StatCard
            title={GRADES_ENTRY_CONSTANTS.STATS.PENDING}
            value={stats.pendingCount}
             description="Notes à saisir"
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
              <GradeEntrySection
                course={selectedCourse}
                students={students}
                grades={grades}
                activeEval={activeEval}
                onChangeEval={changeEvaluation}
                onSave={async ({ studentId, value, max, evaluation, courseId }) => {
                  // Find the student to get their matricule
                  const student = students.find(s => s.id === studentId);
                  if (!student) return;
                  
                  await addGrade({ 
                    courseId, 
                    studentId, 
                    evaluation, 
                    value, 
                    max,
                    matricule: student.matricule
                  });
                }}
                onDelete={async (gradeId: string) => {
                  // Implement delete functionality here
                  console.log('Deleting grade:', gradeId);
                  // Add your delete API call here
                  // await deleteGrade(gradeId);
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
    </div>
  );
}


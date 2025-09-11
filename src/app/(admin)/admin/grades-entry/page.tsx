'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
    router.push('/admin/grades-entry?tab=matieres');
  };

  const filieres = [
    { id: 'pharmacie', name: 'Pharmacie' },
    { id: 'medecine', name: 'Medecine' },
    { id: 'kinesitherapie', name: 'Kinesitherapie' },
  ];

  const niveaux = [
    { id: 'annee1', name: 'Année 1' },
    { id: 'annee2', name: 'Année 2' },
    { id: 'annee3', name: 'Année 3' },
  ];

  const ues = [
    { id: 'ue1', name: 'UE1 - Physiologie spécialisée' },
    { id: 'ue2', name: 'UE2 - Anatomie générale' },
    { id: 'ue3', name: 'UE3 - Biochimie' },
    { id: 'ue4', name: 'UE4 - Biophysique' },
    { id: 'ue5', name: 'UE5 - Pharmacologie' },
  ];

  const isFormValid = filiere && niveau && ue;

  const handleSave = () => {
    if (isFormValid && onSelect) {
      onSelect({ filiere, niveau, ue });
    }
  };

  // Dummy student data
  const dummyStudents = useMemo(() => [
    { id: 's1', matricule: 'ETU25001', nom: 'Dupont', prenom: 'Marie', note: '15.5/20', statut: 'Validé' },
    { id: 's2', matricule: 'ETU25002', nom: 'Martin', prenom: 'Jean', note: '12.0/20', statut: 'Validé' },
    { id: 's3', matricule: 'ETU25003', nom: 'Bernard', prenom: 'Sophie', note: '08.5/20', statut: 'Rattrapage' },
    { id: 's4', matricule: 'ETU25004', nom: 'Petit', prenom: 'Pierre', note: '16.0/20', statut: 'Validé' },
    { id: 's5', matricule: 'ETU25005', nom: 'Durand', prenom: 'Julie', note: '09.0/20', statut: 'Rattrapage' },
  ], []);

  return (
    <div className={className}>
      <div className="relative mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-white"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Saisir des Notes</h1>
              <p className="text-gray-600">Saisie des notes par unité d'enseignement</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFiliere('');
                setNiveau('');
                setUe('');
              }}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
            >
              Réinitialiser
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!isFormValid}
            >
              Sauvegarder
            </Button>
          </div>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Sélection de l'Unité d'Enseignement</h2>
            <p className="text-sm text-gray-500 mt-1">Choisissez la filière, le niveau et l'UE pour saisir les notes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filière
              </label>
              <Select value={filiere} onValueChange={setFiliere}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une filière" />
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
                Niveau
              </label>
              <Select value={niveau} onValueChange={setNiveau}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un niveau" />
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
                  Unité d'enseignement
                </label>
                <Select value={ue} onValueChange={setUe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une UE" />
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
            
            {isFormValid && (
              <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Liste des étudiants - {ues.find(u => u.id === ue)?.name}</h3>
                  {/* <div className="flex space-x-3">
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                      Exporter en Excel
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Enregistrer les modifications
                    </Button>
                  </div> */}
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="font-semibold text-gray-700">Matricule</TableHead>
                        <TableHead className="font-semibold text-gray-700">Nom</TableHead>
                        <TableHead className="font-semibold text-gray-700">Prénom</TableHead>
                        <TableHead className="font-semibold text-gray-700">Note</TableHead>
                        <TableHead className="font-semibold text-gray-700">Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dummyStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.matricule}</TableCell>
                          <TableCell>{student.nom}</TableCell>
                          <TableCell>{student.prenom}</TableCell>
                          <TableCell className={parseFloat(student.note) < 10 ? 'text-red-600' : 'text-green-600'}>
                            {student.note}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              student.statut === 'Validé' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {student.statut}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                      Exporter en Excel
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Enregistrer les modifications
                    </Button>
                  </div>
                </div>
              </div>
            )}
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

        <TabsContent value="matieres">
          <Card>
            <CardHeader>
              <CardTitle>{GRADES_ENTRY_CONSTANTS.COURSE_LIST_TITLE}</CardTitle>
            </CardHeader>
            <CardContent>
              <CourseListSection courses={courses} onOpen={selectCourse} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saisie">
          {selectedCourse && (
            <GradeEntrySection
              course={selectedCourse}
              students={students}
              grades={grades}
              activeEval={activeEval}
              onChangeEval={changeEvaluation}
              onSave={async (payload) => {
                try {
                  // Create the grade object with the expected structure
                  const gradeData = {
                    studentId: payload.studentId,
                    value: payload.value,
                    max: payload.max,
                    evaluation: payload.evaluation,
                    courseId: selectedCourse.id,
                    // Add any additional required fields here
                    matricule: payload.studentId, // Assuming studentId can be used as matricule
                    date: new Date().toISOString()
                  };
                  
                  await addGrade(gradeData);
                  // Don't return anything (implicitly returns Promise<void>)
                } catch (error) {
                  console.error('Failed to save grade:', error);
                  throw error;
                }
              }}
              onDelete={async (gradeId: string) => {
                console.log('Deleting grade:', gradeId);
                // Add your delete API call here
                // await deleteGrade(gradeId);
              }}
            />
          )}
        </TabsContent>
      </Tabs>

      <SaisirNoteModal
        open={saisirNoteModalOpen}
        onOpenChange={setSaisirNoteModalOpen}
        onSave={handleSaisirNote}
      />
    </div>
  );
}

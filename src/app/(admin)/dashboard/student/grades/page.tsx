"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Download, CheckCircle, XCircle, Clock, ChevronDown, ChevronRight, FileText, BookOpen, GraduationCap } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Types simplifiés
interface CCGrade {
  id: string;
  grade: number | null;
  maxGrade: number;
  date: string;
  published: boolean;
}

interface UE {
  id: string;
  name: string;
  code: string;
  credits: number;
  ccGrade: CCGrade;
  validated: boolean | null;
}

interface SequentialExam {
  id: string;
  grade: number | null;
  maxGrade: number;
  date: string;
  published: boolean;
}

interface Module {
  id: string;
  name: string;
  code: string;
  category: string;
  totalCredits: number;
  coefficient: number;
  ues: UE[];
  sequentialExam: SequentialExam;
  finalGrade: number | null;
  validated: boolean | null;
}

interface Curriculum {
  id: string;
  name: string;
  level: string;
  semester: string;
  period: string;
  modules: Module[];
  generalAverage: number | null;
  totalCredits: number;
  validatedCredits: number;
  juryDecision: 'ADMIS' | 'REFUSE' | 'RATTRAPAGE' | 'EN_COURS';
  published: boolean;
}

const HealthStudentPortal: React.FC = () => {
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>('inf-l2-s3');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['mod-soins-inf']));

  const studentInfo = {
    name: 'Marie DUBOIS',
    studentId: '2024-INF-001',
    program: 'Formation Infirmier',
    academicYear: '2024-2025'
  };

  const curriculums: Curriculum[] = [
    {
      id: 'inf-l2-s3',
      name: 'Formation Infirmier L2',
      level: 'Licence 2',
      semester: 'Semestre 3',
      period: 'Sept 2024 - Jan 2025',
      generalAverage: 14.2,
      totalCredits: 30,
      validatedCredits: 28,
      juryDecision: 'ADMIS',
      published: true,
      modules: [
        {
          id: 'mod-soins-inf',
          name: 'Soins Infirmiers',
          code: 'SI-300',
          category: 'Formation Clinique',
          totalCredits: 12,
          coefficient: 4,
          finalGrade: 15.2,
          validated: true,
          sequentialExam: {
            id: 'seq-si',
            grade: 14.5,
            maxGrade: 20,
            date: '2024-12-15',
            published: true
          },
          ues: [
            {
              id: 'ue-soins-fund',
              name: 'Soins Fondamentaux',
              code: 'UE 4.1',
              credits: 6,
              validated: true,
              ccGrade: {
                id: 'cc-fund',
                grade: 16.0,
                maxGrade: 20,
                date: '2024-11-20',
                published: true
              }
            },
            {
              id: 'ue-hygiene',
              name: 'Hygiène et Prévention',
              code: 'UE 2.10',
              credits: 6,
              validated: true,
              ccGrade: {
                id: 'cc-hygiene',
                grade: 14.5,
                maxGrade: 20,
                date: '2024-11-25',
                published: true
              }
            }
          ]
        },
        {
          id: 'mod-pharma',
          name: 'Pharmacologie',
          code: 'PHARM-300',
          category: 'Sciences Biomédicales',
          totalCredits: 8,
          coefficient: 3,
          finalGrade: 13.8,
          validated: true,
          sequentialExam: {
            id: 'seq-pharm',
            grade: 13.2,
            maxGrade: 20,
            date: '2024-12-10',
            published: true
          },
          ues: [
            {
              id: 'ue-pharma-gen',
              name: 'Pharmacologie Générale',
              code: 'UE 2.11',
              credits: 4,
              validated: true,
              ccGrade: {
                id: 'cc-pharma',
                grade: 14.0,
                maxGrade: 20,
                date: '2024-11-10',
                published: true
              }
            },
            {
              id: 'ue-therap',
              name: 'Thérapeutiques',
              code: 'UE 2.12',
              credits: 4,
              validated: true,
              ccGrade: {
                id: 'cc-therap',
                grade: 13.5,
                maxGrade: 20,
                date: '2024-11-15',
                published: true
              }
            }
          ]
        },
        {
          id: 'mod-patho',
          name: 'Pathologie',
          code: 'PATH-300',
          category: 'Sciences Biomédicales',
          totalCredits: 10,
          coefficient: 3,
          finalGrade: 14.0,
          validated: true,
          sequentialExam: {
            id: 'seq-path',
            grade: 13.5,
            maxGrade: 20,
            date: '2024-12-12',
            published: true
          },
          ues: [
            {
              id: 'ue-anat',
              name: 'Anatomie Pathologique',
              code: 'UE 2.2',
              credits: 5,
              validated: true,
              ccGrade: {
                id: 'cc-anat',
                grade: 14.5,
                maxGrade: 20,
                date: '2024-11-05',
                published: true
              }
            },
            {
              id: 'ue-physio-path',
              name: 'Physiopathologie',
              code: 'UE 2.3',
              credits: 5,
              validated: true,
              ccGrade: {
                id: 'cc-physio',
                grade: 13.5,
                maxGrade: 20,
                date: '2024-11-12',
                published: true
              }
            }
          ]
        }
      ]
    },
    {
      id: 'inf-l2-s2',
      name: 'Formation Infirmier L2',
      level: 'Licence 2',
      semester: 'Semestre 2',
      period: 'Jan 2024 - Jun 2024',
      generalAverage: 13.5,
      totalCredits: 30,
      validatedCredits: 30,
      juryDecision: 'ADMIS',
      published: true,
      modules: [
        {
          id: 'mod-bio-fund',
          name: 'Biologie Fondamentale',
          code: 'BIO-200',
          category: 'Sciences Biomédicales',
          totalCredits: 15,
          coefficient: 4,
          finalGrade: 13.2,
          validated: true,
          sequentialExam: {
            id: 'seq-bio',
            grade: 13.0,
            maxGrade: 20,
            date: '2024-06-10',
            published: true
          },
          ues: [
            {
              id: 'ue-bio-cell',
              name: 'Biologie Cellulaire',
              code: 'UE 2.1',
              credits: 7,
              validated: true,
              ccGrade: {
                id: 'cc-cell',
                grade: 13.5,
                maxGrade: 20,
                date: '2024-05-15',
                published: true
              }
            },
            {
              id: 'ue-microbi',
              name: 'Microbiologie',
              code: 'UE 2.4',
              credits: 8,
              validated: true,
              ccGrade: {
                id: 'cc-micro',
                grade: 12.8,
                maxGrade: 20,
                date: '2024-05-20',
                published: true
              }
            }
          ]
        }
      ]
    }
  ];

  const currentCurriculum = curriculums.find(c => c.id === selectedCurriculum);

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const getGradeColor = (grade: number | null | undefined) => {
    if (grade === null || grade === undefined) return 'text-gray-400';
    if (grade >= 16) return 'text-emerald-600 font-semibold';
    if (grade >= 14) return 'text-blue-600 font-semibold';
    if (grade >= 10) return 'text-amber-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  const getValidationBadge = (validated: boolean | null) => {
    if (validated === true) {
      return <Badge variant="outline" className="text-emerald-600 border-emerald-200"><CheckCircle className="w-3 h-3 mr-1" />Validé</Badge>;
    }
    if (validated === false) {
      return <Badge variant="outline" className="text-red-600 border-red-200"><XCircle className="w-3 h-3 mr-1" />Non validé</Badge>;
    }
    return <Badge variant="outline" className="text-gray-500"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Formation Clinique':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'Sciences Biomédicales':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'Sciences Humaines':
        return 'bg-green-50 border-green-200 text-green-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Info étudiant */}
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Relevé de Notes
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  {studentInfo.name} • {studentInfo.program}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <Button size="sm" variant="info" className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Vue d'ensemble */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Moyenne générale */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <div
                  className={`text-2xl sm:text-3xl font-bold ${getGradeColor(
                    currentCurriculum?.generalAverage
                  )}`}
                >
                  {currentCurriculum?.generalAverage
                    ? `${currentCurriculum.generalAverage.toFixed(1)}/20`
                    : "N/A"}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Moyenne Générale
                </p>
                <Progress
                  value={
                    currentCurriculum?.generalAverage
                      ? (currentCurriculum.generalAverage / 20) * 100
                      : 0
                  }
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Crédits */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {currentCurriculum?.validatedCredits || 0}/
                  {currentCurriculum?.totalCredits || 0}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Crédits ECTS
                </p>
                <Progress
                  value={
                    currentCurriculum
                      ? (currentCurriculum.validatedCredits /
                          currentCurriculum.totalCredits) *
                        100
                      : 0
                  }
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Décision */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  {currentCurriculum?.juryDecision === "ADMIS" && (
                    <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
                  )}
                  {currentCurriculum?.juryDecision === "REFUSE" && (
                    <XCircle className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" />
                  )}
                  {currentCurriculum?.juryDecision === "EN_COURS" && (
                    <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                  )}
                </div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base">
                  {currentCurriculum?.juryDecision === "ADMIS"
                    ? "ADMIS(E)"
                    : currentCurriculum?.juryDecision === "REFUSE"
                    ? "REFUSÉ(E)"
                    : "EN COURS"}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Décision du Jury
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <Tabs value={selectedCurriculum} onValueChange={setSelectedCurriculum}>
          <TabsList className="w-full">
            {curriculums.map((curriculum) => (
              <TabsTrigger
                key={curriculum.id}
                value={curriculum.id}
                className="flex flex-col text-xs sm:text-sm"
              >
                <div className="font-medium">{curriculum.semester}</div>
              </TabsTrigger>
            ))}
          </TabsList>

          {curriculums.map((curriculum) => (
            <TabsContent key={curriculum.id} value={curriculum.id}>
              <div className="space-y-4">
                {curriculum.modules.map((module) => (
                  <Card key={module.id}>
                    <Collapsible
                      open={expandedModules.has(module.id)}
                      onOpenChange={() => toggleModule(module.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-gray-50">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center space-x-3">
                              {expandedModules.has(module.id) ? (
                                <ChevronDown className="w-5 h-5" />
                              ) : (
                                <ChevronRight className="w-5 h-5" />
                              )}
                              <div>
                                <div className="flex flex-wrap items-center space-x-2">
                                  <CardTitle className="text-base sm:text-lg">
                                    {module.name}
                                  </CardTitle>
                                  <Badge className={getCategoryColor(module.category)}>
                                    {module.category}
                                  </Badge>
                                </div>
                                <CardDescription className="text-xs sm:text-sm">
                                  {module.code} • {module.totalCredits} crédits
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div
                                  className={`text-lg sm:text-xl font-bold ${getGradeColor(
                                    module.finalGrade
                                  )}`}
                                >
                                  {module.finalGrade
                                    ? `${module.finalGrade.toFixed(1)}/20`
                                    : "N/A"}
                                </div>
                              </div>
                              {getValidationBadge(module.validated)}
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <CardContent className="space-y-6">
                          {/* Examen séquentiel */}
                          <div>
                            <h4 className="font-medium mb-3 flex items-center text-sm sm:text-base">
                              <FileText className="w-4 h-4 mr-2" />
                              Examen Séquentiel
                            </h4>
                            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                              <div className="flex flex-wrap justify-between items-center gap-2">
                                <div>
                                  <span className="text-xs sm:text-sm text-gray-600">
                                    {new Date(
                                      module.sequentialExam.date
                                    ).toLocaleDateString("fr-FR")}
                                  </span>
                                  {module.sequentialExam.published ? (
                                    <Badge
                                      variant="outline"
                                      className="text-green-600 border-green-200 ml-2"
                                    >
                                      Publié
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="text-gray-500 ml-2"
                                    >
                                      En attente
                                    </Badge>
                                  )}
                                </div>
                                <span
                                  className={`text-base sm:text-lg font-semibold ${getGradeColor(
                                    module.sequentialExam.grade
                                  )}`}
                                >
                                  {module.sequentialExam.grade !== null
                                    ? `${module.sequentialExam.grade}/${module.sequentialExam.maxGrade}`
                                    : "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* UE et CC */}
                          <div>
                            <h4 className="font-medium mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Unités d&apos;Enseignement (UE)
                            </h4>
                            <div className="space-y-3">
                              {module.ues.map((ue) => (
                                <div
                                  key={ue.id}
                                  className="flex flex-wrap items-center justify-between p-3 sm:p-4 bg-white border border-gray-200 rounded-lg gap-2"
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <h5 className="font-medium text-sm sm:text-base">
                                        {ue.name}
                                      </h5>
                                      {getValidationBadge(ue.validated)}
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-600">
                                      {ue.code} • {ue.credits} crédits
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-4">
                                    <div className="text-xs sm:text-sm text-gray-500">
                                      CC:{" "}
                                      {new Date(
                                        ue.ccGrade.date
                                      ).toLocaleDateString("fr-FR")}
                                    </div>
                                    <span
                                      className={`text-sm sm:text-lg font-semibold ${getGradeColor(
                                        ue.ccGrade.grade
                                      )}`}
                                    >
                                      {ue.ccGrade.grade !== null
                                        ? `${ue.ccGrade.grade}/${ue.ccGrade.maxGrade}`
                                        : "N/A"}
                                    </span>
                                    {ue.ccGrade.published ? (
                                      <Badge
                                        variant="outline"
                                        className="text-green-600 border-green-200"
                                      >
                                        Publié
                                      </Badge>
                                    ) : (
                                      <Badge
                                        variant="outline"
                                        className="text-gray-500"
                                      >
                                        En attente
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>

  );
};

export default HealthStudentPortal;
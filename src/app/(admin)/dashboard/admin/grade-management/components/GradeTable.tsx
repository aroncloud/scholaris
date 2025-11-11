import React, { useMemo, useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Badge from "@/components/custom-ui/Badge";
import { EvaluationSheet } from "@/types/examTypes";
import { StudentRow } from "./StudentRow";

interface GradeTableProps {
  examSheet: EvaluationSheet;
  studentGrades: Map<string, number>;
  modifiedStudents: Set<string>;
  isLoadingExamDetail: boolean;
  isSaving: boolean;
  onScoreChange: (studentCode: string, score: number) => void;
}

export const GradeTable: React.FC<GradeTableProps> = ({
  examSheet,
  studentGrades,
  modifiedStudents,
  isLoadingExamDetail,
  isSaving,
  onScoreChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filtrage des étudiants
  const filteredStudents = useMemo(() => {
    if (!examSheet?.students) return [];

    if (!searchQuery) return examSheet.students;

    const query = searchQuery.toLowerCase();
    return examSheet.students.filter(
      (student) =>
        student.first_name.toLowerCase().includes(query) ||
        student.last_name.toLowerCase().includes(query) ||
        student.student_number.toLowerCase().includes(query)
    );
  }, [examSheet?.students, searchQuery]);

  // Pagination
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredStudents.slice(startIndex, endIndex);
  }, [filteredStudents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // Réinitialiser à la page 1 quand la recherche change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <Card className="w-full pt-0 overflow-hidden my-6">
      {/* Header */}
      <CardHeader className="flex flex-col space-y-4 pt-4 border-b bg-gray-50 px-4 md:px-6">
        {/* Ligne 1: Titre et Badge de statut */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <CardTitle className="text-xl lg:text-2xl font-bold tracking-tight">
              {examSheet.evaluation.title}
            </CardTitle>
            <Badge
              value={examSheet.evaluation.status}
              label={examSheet.evaluation.status}
              size="sm"
            />
          </div>

          {/* Badge de modifications - visible sur tous les écrans */}
          {modifiedStudents.size > 0 && (
            <Badge
              value="modification"
              label={`${modifiedStudents.size} modification(s)`}
              variant="neutral"
              size="sm"
              className="shrink-0"
            />
          )}
        </div>

        {/* Ligne 2: Informations de l'évaluation */}
        <CardDescription>
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              Date d&apos;évaluation:{" "}
              {examSheet.evaluation.evaluation_date
                ? new Date(examSheet.evaluation.evaluation_date).toLocaleDateString()
                : "Non programmée"}
            </span>

            <Separator orientation="vertical" className="hidden sm:block h-4" />

            <span className="flex items-center gap-2">
              Note maximale: {examSheet.evaluation.max_score}
            </span>

            <Separator orientation="vertical" className="hidden sm:block h-4" />

            <span className="flex items-center gap-2">
              Coefficient: {examSheet.evaluation.coefficient}
            </span>
          </div>
        </CardDescription>
      </CardHeader>

      {/* Table */}
      <CardContent className="px-2 md:px-6 pt-6">
        {/* Barre de recherche */}
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher par nom ou numéro d'étudiant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredStudents.length} étudiant{filteredStudents.length > 1 ? "s" : ""}
          </div>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  N° Étudiant
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Nom Complet
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Statut</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Note (/{examSheet.evaluation.max_score})
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoadingExamDetail || isSaving ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <div className="flex flex-col justify-center items-center gap-3">
                      <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-gray-600 font-medium">
                        {isSaving ? "Enregistrement en cours..." : "Chargement des données..."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle className="w-12 h-12 text-gray-400" />
                      <div>
                        <p className="text-gray-700 font-medium">
                          {searchQuery ? "Aucun étudiant trouvé" : "Aucun étudiant"}
                        </p>
                        {searchQuery && (
                          <p className="text-sm text-gray-500 mt-1">
                            Essayez avec d&apos;autres critères de recherche
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => (
                  <StudentRow
                    key={student.enrollment_code}
                    student={student}
                    maxScore={examSheet.evaluation.max_score}
                    currentScore={studentGrades.get(student.enrollment_code) ?? student.score}
                    isModified={modifiedStudents.has(student.enrollment_code)}
                    onScoreChange={onScoreChange}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-gray-500">
              Page {currentPage} sur {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

import React from "react";
import { BookOpen, Calendar, AlertCircle } from "lucide-react";
import { Combobox } from "@/components/ui/Combobox";
import { IGetCurriculum } from "@/types/programTypes";
import { IGetAcademicYearsSchedulesForCurriculum } from "@/types/planificationType";
import { IGetEvaluationsForScheduleResponse } from "@/types/examTypes";

interface FilterSectionProps {
  // Curriculum
  curriculumList: IGetCurriculum[];
  selectedCurriculum: string;
  onCurriculumChange: (value: string) => void;

  // Schedule
  scheduleList: IGetAcademicYearsSchedulesForCurriculum[];
  selectedSchedule: string;
  onScheduleChange: (value: string) => void;
  isLoadingSchedules: boolean;

  // Exam
  examList: IGetEvaluationsForScheduleResponse[];
  selectedExam: string;
  onExamChange: (value: string) => void;
  isLoadingExams: boolean;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  curriculumList,
  selectedCurriculum,
  onCurriculumChange,
  scheduleList,
  selectedSchedule,
  onScheduleChange,
  isLoadingSchedules,
  examList,
  selectedExam,
  onExamChange,
  isLoadingExams,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 md:px-0">
      {/* Curriculum */}
      <div>
        <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
          <span className="flex items-center">
            <BookOpen className="w-4 h-4 inline mr-2" />
            Curriculum
          </span>
        </label>
        <Combobox
          options={curriculumList.map((curriculum) => ({
            value: curriculum.curriculum_code,
            label: curriculum.curriculum_name,
          }))}
          value={selectedCurriculum}
          onChange={onCurriculumChange}
          placeholder="Sélectionner un curriculum"
          className="py-5"
        />
      </div>

      {/* Trimestre/Semestre */}
      <div>
        <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
          <span className="flex items-center">
            <BookOpen className="w-4 h-4 inline mr-2" />
            Trimestre/Semestre
          </span>
          {isLoadingSchedules && (
            <span className="flex items-center gap-2 text-xs text-gray-500 font-normal">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              Chargement...
            </span>
          )}
          {!isLoadingSchedules && selectedCurriculum && scheduleList.length === 0 && (
            <span className="flex items-center gap-1 text-xs text-amber-600 font-normal">
              <AlertCircle className="w-3 h-3" />
              Aucun trimestre/semestre trouvé
            </span>
          )}
        </label>
        <Combobox
          options={scheduleList.map((sch) => ({
            value: sch.schedule_code,
            label: sch.sequence_name,
          }))}
          value={selectedSchedule}
          onChange={onScheduleChange}
          placeholder={
            isLoadingSchedules
              ? "Chargement..."
              : selectedCurriculum
              ? scheduleList.length === 0
                ? "Aucun trimestre/semestre disponible"
                : "Sélectionner un trimestre/semestre"
              : "Sélectionnez d'abord un curriculum"
          }
          className="py-5"
          disabled={!selectedCurriculum || isLoadingSchedules}
        />
      </div>

      {/* Évaluation */}
      <div>
        <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 inline mr-2" />
            Évaluation
          </span>
          {isLoadingExams && (
            <span className="flex items-center gap-2 text-xs text-gray-500 font-normal">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              Chargement...
            </span>
          )}
          {!isLoadingExams && selectedSchedule && examList.length === 0 && (
            <span className="flex items-center gap-1 text-xs text-amber-600 font-normal">
              <AlertCircle className="w-3 h-3" />
              Aucune évaluation trouvée
            </span>
          )}
        </label>
        <Combobox
          options={examList.map((exam) => ({
            value: exam.evaluation_code,
            label: exam.title,
          }))}
          value={selectedExam}
          onChange={onExamChange}
          placeholder={
            isLoadingExams
              ? "Chargement..."
              : selectedSchedule
              ? examList.length === 0
                ? "Aucune évaluation disponible"
                : "Sélectionner une évaluation"
              : "Sélectionnez d'abord un trimestre/semestre"
          }
          className="py-5"
          disabled={!selectedSchedule || isLoadingExams}
        />
      </div>
    </div>
  );
};

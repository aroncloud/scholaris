/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Save, Download, Award } from "lucide-react";
import { useFactorizedProgramStore } from "@/store/programStore";
import { useEvaluationData } from "@/hooks/feature/exam/useEvaluationData";
import { getEvaluationSheet, submitGrades } from "@/actions/examAction";
import { EvaluationSheet } from "@/types/examTypes";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/showToast";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { getListAcademicYearsSchedulesForCurriculum } from "@/actions/programsAction";
import { IGetAcademicYearsSchedulesForCurriculum } from "@/types/planificationType";
import PageHeader from "@/layout/PageHeader";
import ContentLayout from "@/layout/ContentLayout";
import { FilterSection } from "./components/FilterSection";
import { EvaluationInfo } from "./components/EvaluationInfo";
import { GradeTable } from "./components/GradeTable";

const Page = () => {
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>("");
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedSchedule, setSelectedSchedule] = useState<string>("");
  const [examSheet, setExamSheet] = useState<EvaluationSheet | undefined>(undefined);
  const [isLoadingExamDetail, setIsLoadingExamDetail] = useState<boolean>(false);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState<boolean>(false);
  const [isLoadingExams, setIsLoadingExams] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [scheduleList, setScheduleList] = useState<IGetAcademicYearsSchedulesForCurriculum[]>([]);

  const [modifiedStudents, setModifiedStudents] = useState<Set<string>>(new Set());
  const [studentGrades, setStudentGrades] = useState<Map<string, number>>(new Map());

  const { factorizedPrograms } = useFactorizedProgramStore();
  const { examList, fetchtEvaluationsForSchedule } = useEvaluationData();
  const { selectedAcademicYear } = useAcademicYearStore();

  const curriculumList = factorizedPrograms.flatMap((fp) => fp.curriculums);

  const fetchListAcademicYearsSchedulesForCurriculum = async (
    curriculum_code: string,
    academic_year_code: string
  ) => {
    setIsLoadingSchedules(true);
    try {
      const result = await getListAcademicYearsSchedulesForCurriculum(
        curriculum_code,
        academic_year_code
      );
      setScheduleList(result.data.body);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setScheduleList([]);
    } finally {
      setIsLoadingSchedules(false);
    }
  };

  const updateStudentScore = useCallback((userCode: string, score: number) => {
    setStudentGrades((prev) => new Map(prev.set(userCode, score)));
    setModifiedStudents((prev) => new Set(prev).add(userCode));
  }, []);

  const handleSaveGrades = async () => {
    if (!examSheet || modifiedStudents.size === 0) return;

    setIsSaving(true);
    try {
      const gradesData = Array.from(modifiedStudents).map((enrollmentCode) => ({
        enrollment_code: enrollmentCode,
        score: studentGrades.get(enrollmentCode) || 0,
        status_code: "SUBMITTED",
        comments: "RAS",
      }));

      console.log("Submitting grades:", gradesData);

      const result = await submitGrades(selectedExam, gradesData);
      console.log("Submit grades result:", result);
      if (result.code == "success") {
        const updatedStudents = examSheet.students.map((student) => {
          const newScore = studentGrades.get(student.enrollment_code);
          return newScore !== undefined ? { ...student, score: newScore, graded: true } : student;
        });

        setExamSheet({
          ...examSheet,
          students: updatedStudents,
        });

        setModifiedStudents(new Set());

        showToast({
          variant: "success-solid",
          message: "Notes enregistré avec succès",
          description: `Les notes ont été sauvegardées.`,
          position: "top-center",
        });
      } else {
        showToast({
          variant: "error-solid",
          message: "Erreur lors de la sauvegarde",
          description:
            result.error ??
            "Une erreur est survenue, essayez encore ou veuillez contacter l'administrateur",
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error saving grades:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getEvaluationInfo = useCallback(async () => {
    if (!selectedExam) return;

    setIsLoadingExamDetail(true);
    try {
      const result = await getEvaluationSheet(selectedExam);
      console.log("Fetched evaluation sheet:", result);
      if (result.code === "success") {
        setExamSheet(result.data.body);
        const existingGrades = new Map();
        if (result.data.body.students) {
          result.data.body.students.forEach((student: any) => {
            if (student.score !== undefined && student.score !== null) {
              existingGrades.set(student.enrollment_code, student.score);
            }
          });
        }

        setStudentGrades(existingGrades);
        setModifiedStudents(new Set());
      }
    } catch (error) {
      console.error("Error fetching evaluation:", error);
    } finally {
      setIsLoadingExamDetail(false);
    }
  }, [selectedExam]);

  // Gestion cohérente des filtres en cascade
  const handleCurriculumChange = (value: string) => {
    setSelectedCurriculum(value);
    // Réinitialiser les filtres dépendants
    setSelectedSchedule("");
    setSelectedExam("");
    setScheduleList([]);
    setExamSheet(undefined);
    setModifiedStudents(new Set());
    setStudentGrades(new Map());
  };

  const handleScheduleChange = (value: string) => {
    setSelectedSchedule(value);
    // Réinitialiser les filtres dépendants
    setSelectedExam("");
    setExamSheet(undefined);
    setModifiedStudents(new Set());
    setStudentGrades(new Map());
  };

  useEffect(() => {
    if (selectedCurriculum && selectedAcademicYear) {
      fetchListAcademicYearsSchedulesForCurriculum(selectedCurriculum, selectedAcademicYear);
    }
  }, [selectedCurriculum, selectedAcademicYear]);

  useEffect(() => {
    if (selectedCurriculum && selectedSchedule) {
      setIsLoadingExams(true);
      fetchtEvaluationsForSchedule(selectedSchedule).finally(() => {
        setIsLoadingExams(false);
      });
    }
  }, [selectedCurriculum, selectedSchedule, fetchtEvaluationsForSchedule]);

  useEffect(() => {
    getEvaluationInfo();
  }, [getEvaluationInfo, selectedExam]);

  return (
    <>
      {/* Header */}
      <PageHeader title="Saisie des Notes" description="Module de gestion des évaluations" Icon={Award}>
        <div className="flex items-center space-x-3 w-full">
          <Button variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button
            onClick={handleSaveGrades}
            disabled={modifiedStudents.size === 0 || isSaving}
            variant={"info"}
            className="flex-1"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </PageHeader>

      <div className="px-2 pb-2 mt-4 md:px-6 md:pb-6 md:pt-0 mx-auto">
        {/* Selection Panel */}
        <ContentLayout title="Curriculum">
          <>
            <FilterSection
              curriculumList={curriculumList}
              selectedCurriculum={selectedCurriculum}
              onCurriculumChange={handleCurriculumChange}
              scheduleList={scheduleList}
              selectedSchedule={selectedSchedule}
              onScheduleChange={handleScheduleChange}
              isLoadingSchedules={isLoadingSchedules}
              examList={examList}
              selectedExam={selectedExam}
              onExamChange={setSelectedExam}
              isLoadingExams={isLoadingExams}
            />

            {selectedCurriculum && selectedExam && examSheet && (
              <EvaluationInfo examSheet={examSheet} />
            )}
          </>
        </ContentLayout>

        {/* Students Table */}
        {examSheet && (
          <GradeTable
            examSheet={examSheet}
            studentGrades={studentGrades}
            modifiedStudents={modifiedStudents}
            isLoadingExamDetail={isLoadingExamDetail}
            isSaving={isSaving}
            onScoreChange={updateStudentScore}
          />
        )}
      </div>
    </>
  );
};

export default Page;

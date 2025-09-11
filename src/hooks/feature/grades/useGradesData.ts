'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { EvaluationKind, GradeEntry, Student, TeacherCourse, GradesStats } from '@/types/gradeTypes';
import { getCourseGrades, getCourseStudents, getGradesStats, getTeacherCourses, saveGrade, updateGrade } from '@/actions/gradesAction';

export function useGradesData() {
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const [activeEval, setActiveEval] = useState<EvaluationKind>('TP');
  const [stats, setStats] = useState<GradesStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCourse = useMemo(() => courses.find(c => c.id === selectedCourseId) || null, [courses, selectedCourseId]);

  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);
      setCourses(await getTeacherCourses());
      setStats(await getGradesStats());
    } catch (e) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCourseData = useCallback(async (courseId: string, evaluation: EvaluationKind) => {
    try {
      setLoading(true);
      setStudents(await getCourseStudents(courseId));
      setGrades(await getCourseGrades(courseId, evaluation));
      setStats(await getGradesStats(courseId));
    } catch (e) {
      setError('Failed to load course data');
    } finally {
      setLoading(false);
    }
  }, []);

  const selectCourse = useCallback(async (courseId: string) => {
    setSelectedCourseId(courseId);
    await loadCourseData(courseId, activeEval);
  }, [activeEval, loadCourseData]);

  const changeEvaluation = useCallback(async (evaluation: EvaluationKind) => {
    setActiveEval(evaluation);
    if (selectedCourseId) {
      await loadCourseData(selectedCourseId, evaluation);
    }
  }, [selectedCourseId, loadCourseData]);

  const addGrade = useCallback(async (payload: Omit<GradeEntry, 'id' | 'date'>) => {
    const created = await saveGrade(payload);
    setGrades(prev => [created, ...prev]);
    setStats(await getGradesStats(selectedCourseId));
    return created;
  }, [selectedCourseId]);

  const editGrade = useCallback(async (entryId: string, patch: Partial<GradeEntry>) => {
    const updated = await updateGrade(entryId, patch);
    if (updated) {
      setGrades(prev => prev.map(g => g.id === updated.id ? updated : g));
      setStats(await getGradesStats(selectedCourseId));
    }
    return updated;
  }, [selectedCourseId]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  return {
    // data
    courses,
    selectedCourse,
    selectedCourseId,
    students,
    grades,
    activeEval,
    stats,

    // state
    loading,
    error,

    // actions
    selectCourse,
    changeEvaluation,
    addGrade,
    editGrade,
    reload: loadCourses,
  };
}



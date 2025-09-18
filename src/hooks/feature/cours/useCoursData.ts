/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { CourseStats, CourseFilters, CourseSession } from '@/types/courseType';
import { 
  getCourses, 
  getCourseStats, 
  getCourseById, 
  updateCourseProgress, 
  getCourseSessions,
  getPrograms 
} from '@/actions/coursAction';

interface UseCoursDataReturn {
  // Data
  courses: any[];
  stats: CourseStats | null;
  programs: string[];
  selectedCourse: any | null;
  courseSessions: CourseSession[];
  
  // Loading states
  loading: boolean;
  loadingStats: boolean;
  loadingPrograms: boolean;
  loadingCourse: boolean;
  loadingSessions: boolean;
  saving: boolean;
  
  // Error states
  error: string | null;
  statsError: string | null;
  programsError: string | null;
  courseError: string | null;
  sessionsError: string | null;
  saveError: string | null;
  
  // Actions
  fetchCourses: (filters?: CourseFilters) => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchPrograms: () => Promise<void>;
  fetchCourseById: (id: string) => Promise<void>;
  fetchCourseSessions: (courseId: string) => Promise<void>;
  updateCourse: (id: string, progress: number) => Promise<any>;
  searchCourses: (searchTerm: string) => Promise<void>;
  filterCourses: (filters: CourseFilters) => Promise<void>;
  refreshData: () => Promise<void>;
  
  // State management
  setSelectedCourse: (course: any | null) => void;
  clearErrors: () => void;
}

export const useCoursData = (): UseCoursDataReturn => {
  // Data states
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [programs, setPrograms] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [courseSessions, setCourseSessions] = useState<CourseSession[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Error states
  const [error, setError] = useState<string | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [programsError, setProgramsError] = useState<string | null>(null);
  const [courseError, setCourseError] = useState<string | null>(null);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Fetch courses with optional filters
  const fetchCourses = useCallback(async (filters?: CourseFilters) => {
    try {
      setLoading(true);
      setError(null);
      const coursesData = await getCourses(filters);
      setCourses(coursesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch courses';
      setError(errorMessage);
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch course statistics
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      setStatsError(null);
      const statsData = await getCourseStats();
      setStats(statsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch course statistics';
      setStatsError(errorMessage);
      console.error('Error fetching course stats:', err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch available programs
  const fetchPrograms = useCallback(async () => {
    try {
      setLoadingPrograms(true);
      setProgramsError(null);
      const programsData = await getPrograms();
      setPrograms(programsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch programs';
      setProgramsError(errorMessage);
      console.error('Error fetching programs:', err);
    } finally {
      setLoadingPrograms(false);
    }
  }, []);

  // Fetch course by ID
  const fetchCourseById = useCallback(async (id: string) => {
    try {
      setLoadingCourse(true);
      setCourseError(null);
      const courseData = await getCourseById(id);
      setSelectedCourse(courseData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch course';
      setCourseError(errorMessage);
      console.error('Error fetching course by ID:', err);
    } finally {
      setLoadingCourse(false);
    }
  }, []);

  // Fetch course sessions
  const fetchCourseSessions = useCallback(async (courseId: string) => {
    try {
      setLoadingSessions(true);
      setSessionsError(null);
      const sessionsData = await getCourseSessions(courseId);
      setCourseSessions(sessionsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch course sessions';
      setSessionsError(errorMessage);
      console.error('Error fetching course sessions:', err);
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  // Update course progress
  const updateCourse = useCallback(async (id: string, progress: number): Promise<any> => {
    try {
      setSaving(true);
      setSaveError(null);
      const updatedCourse = await updateCourseProgress(id, progress);
      
      // Update the course in the local state
      setCourses(prev => prev.map(course => 
        course.id === id ? updatedCourse : course
      ));
      
      // Update selected course if it's the same
      if (selectedCourse?.id === id) {
        setSelectedCourse(updatedCourse);
      }
      
      // Refresh stats to reflect changes
      await fetchStats();
      
      return updatedCourse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update course';
      setSaveError(errorMessage);
      console.error('Error updating course:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [selectedCourse, fetchStats]);

  // Search courses
  const searchCourses = useCallback(async (searchTerm: string) => {
    const filters: CourseFilters = {
      search: searchTerm,
      status: '',
      program: '',
      year: null
    };
    await fetchCourses(filters);
  }, [fetchCourses]);

  // Filter courses
  const filterCourses = useCallback(async (filters: CourseFilters) => {
    await fetchCourses(filters);
  }, [fetchCourses]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    try {
      await Promise.all([
        fetchCourses(),
        fetchStats(),
        fetchPrograms()
      ]);
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  }, [fetchCourses, fetchStats, fetchPrograms]);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setError(null);
    setStatsError(null);
    setProgramsError(null);
    setCourseError(null);
    setSessionsError(null);
    setSaveError(null);
  }, []);

  // Initial data fetch
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    // Data
    courses,
    stats,
    programs,
    selectedCourse,
    courseSessions,
    
    // Loading states
    loading,
    loadingStats,
    loadingPrograms,
    loadingCourse,
    loadingSessions,
    saving,
    
    // Error states
    error,
    statsError,
    programsError,
    courseError,
    sessionsError,
    saveError,
    
    // Actions
    fetchCourses,
    fetchStats,
    fetchPrograms,
    fetchCourseById,
    fetchCourseSessions,
    updateCourse,
    searchCourses,
    filterCourses,
    refreshData,
    
    // State management
    setSelectedCourse,
    clearErrors
  };
};

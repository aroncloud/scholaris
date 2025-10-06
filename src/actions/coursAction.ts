'use server';

import { ICourse, CourseStats, CourseFilters, CourseSession } from '@/types/courseType';

// Mock data - In a real application, this would come from a database
const mockCourses: ICourse[] = [
  {
    id: '1',
    title: 'Anatomie générale',
    code: 'ANAT101',
    program: 'Pharmacie',
    year: 1,
    status: 'En cours',
    progress: 67,
    totalHours: 45,
    completedHours: 30,
    students: 45,
    credits: 6,
    nextSession: {
      type: 'TP Dissection',
      date: '21/01/2024',
      duration: '3h'
    },
    teacher: 'Dr. Martin Dubois',
    description: 'Cours d\'anatomie générale pour les étudiants de première année de pharmacie',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Physiologie spécialisée',
    code: 'PHYS201',
    program: 'Médecine',
    year: 2,
    status: 'En cours',
    progress: 75,
    totalHours: 60,
    completedHours: 45,
    students: 38,
    credits: 8,
    nextSession: {
      type: 'TP Électrophysiologie',
      date: '24/01/2024',
      duration: '4h'
    },
    teacher: 'Dr. Sophie Laurent',
    description: 'Physiologie spécialisée pour les étudiants de deuxième année de médecine',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    title: 'TP Anatomie pratique',
    code: 'TPAN101',
    program: 'Kinésithérapie',
    year: 1,
    status: 'Terminé',
    progress: 100,
    totalHours: 30,
    completedHours: 30,
    students: 22,
    credits: 4,
    teacher: 'Dr. Pierre Moreau',
    description: 'Travaux pratiques d\'anatomie pour les étudiants de kinésithérapie',
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2023-12-15')
  }
];

export async function getCourses(filters?: CourseFilters): Promise<ICourse[]> {
  try {
    let filteredCourses = [...mockCourses];

    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredCourses = filteredCourses.filter(course =>
          course.title.toLowerCase().includes(searchLower) ||
          course.code.toLowerCase().includes(searchLower) ||
          course.program.toLowerCase().includes(searchLower)
        );
      }

      if (filters.status) {
        filteredCourses = filteredCourses.filter(course => course.status === filters.status);
      }

      if (filters.program) {
        filteredCourses = filteredCourses.filter(course => course.program === filters.program);
      }

      if (filters.year) {
        filteredCourses = filteredCourses.filter(course => course.year === filters.year);
      }
    }

    return filteredCourses;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw new Error('Failed to fetch courses');
  }
}

export async function getCourseStats(): Promise<CourseStats> {
  try {
    const activeCourses = mockCourses.filter(course => course.status === 'En cours').length;
    const totalStudents = mockCourses.reduce((sum, course) => sum + course.students, 0);
    const hoursTaught = mockCourses.reduce((sum, course) => sum + course.completedHours, 0);
    const averageProgress = Math.round(
      mockCourses.reduce((sum, course) => sum + course.progress, 0) / mockCourses.length
    );

    return {
      activeCourses,
      totalStudents,
      hoursTaught,
      averageProgress
    };
  } catch (error) {
    console.error('Error fetching course stats:', error);
    throw new Error('Failed to fetch course stats');
  }
}

export async function getCourseById(id: string): Promise<ICourse | null> {
  try {
    const course = mockCourses.find(course => course.id === id);
    return course || null;
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    throw new Error('Failed to fetch course');
  }
}

export async function updateCourseProgress(id: string, progress: number): Promise<ICourse> {
  try {
    const courseIndex = mockCourses.findIndex(course => course.id === id);
    if (courseIndex === -1) {
      throw new Error('Course not found');
    }

    mockCourses[courseIndex].progress = progress;
    mockCourses[courseIndex].completedHours = Math.round(
      (progress / 100) * mockCourses[courseIndex].totalHours
    );
    mockCourses[courseIndex].updatedAt = new Date();

    return mockCourses[courseIndex];
  } catch (error) {
    console.error('Error updating course progress:', error);
    throw new Error('Failed to update course progress');
  }
}

export async function getCourseSessions(courseId: string): Promise<CourseSession[]> {
  try {
    // Mock sessions data
    const mockSessions: CourseSession[] = [
      {
        id: '1',
        courseId: courseId,
        type: 'Cours magistral',
        date: new Date('2024-01-25'),
        duration: 2,
        location: 'Amphithéâtre A',
        description: 'Introduction à l\'anatomie générale',
        status: 'Planifié'
      },
      {
        id: '2',
        courseId: courseId,
        type: 'TP',
        date: new Date('2024-01-28'),
        duration: 3,
        location: 'Laboratoire 1',
        description: 'Dissection pratique',
        status: 'Planifié'
      }
    ];

    return mockSessions.filter(session => session.courseId === courseId);
  } catch (error) {
    console.error('Error fetching course sessions:', error);
    throw new Error('Failed to fetch course sessions');
  }
}

export async function getPrograms(): Promise<string[]> {
  try {
    const programs = [...new Set(mockCourses.map(course => course.program))];
    return programs;
  } catch (error) {
    console.error('Error fetching programs:', error);
    throw new Error('Failed to fetch programs');
  }
}



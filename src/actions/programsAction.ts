'use server'

import { verifySession } from "@/lib/session";
import { ICreateStudent } from "@/types/staffType";
import { ICreateEnrollment } from "@/types/programTypes"
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";
import { ICreateCurriculum, ICreateDomain, ICreateModule, ICreateProgram, ICreateSemester, ICreateUE, IEnrollmentHistory, IEnrollmentResponse } from "@/types/programTypes";

export interface IReenrollmentPrerequisites {
  isEligible: boolean;
  message: string;
  lastEnrollment?: {
    academic_year_code: string;
    curriculum_code: string;
    status: string;
  };
  requirements: {
    hasOutstandingFees: boolean;
    hasCompletedPreviousYear: boolean;
    isAccountActive: boolean;
  };
}

export type ReenrollmentResponse = 
  | { 
      code: 'success';
      data: IReenrollmentPrerequisites;
      error: null;
    }
  | {
      code: 'error';
      data: null | IReenrollmentPrerequisites;
      error: string;
    };


export async function checkReenrollmentPrerequisites(studentCode: string) {
  try {
    console.log(`[checkReenrollmentPrerequisites] Checking re-enrollment prerequisites for student: ${studentCode}`);
    
    if (!studentCode) {
      console.error('No student code provided to checkReenrollmentPrerequisites');
      return {
        code: 'error' as const,
        data: null,
        error: 'No student code provided',
      };
    }

    const session = await verifySession();
    if (!session?.accessToken) {
      console.error('No access token available');
      return {
        code: 'error' as const,
        data: null,
        error: 'Authentication required',
      };
    }

    const token = session.accessToken;
    const apiUrl = `${process.env.AIM_WORKER_ENDPOINT}/api/students/${studentCode}/reenrollment-prerequisites`;
    
    console.log(`[checkReenrollmentPrerequisites] Calling API: ${apiUrl}`);
    
    const response = await axios.get<IReenrollmentPrerequisites>(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-API-Key': process.env.PUBLIC_API_KEY || '',
      },
      timeout: 10000,
      validateStatus: () => true, // Don't throw for any status code
    });

    console.log(`[checkReenrollmentPrerequisites] API response status: ${response.status}`, response.data);
    
    if (response.status === 200) {
      return {
        code: 'success' as const,
        data: response.data,
        error: null,
      };
    }
    
    // Handle 403 - Forbidden (e.g., outstanding debts)
    if (response.status === 403) {
      return {
        code: 'error' as const,
        data: {
          isEligible: false,
          message: response.data?.message || 'Re-enrollment not allowed',
          requirements: {
            hasOutstandingFees: true,
            hasCompletedPreviousYear: false,
            isAccountActive: true
          }
        },
        error: response.data?.message || 'Re-enrollment not allowed',
      };
    }
    
    // Handle 404 - Not Found (e.g., no previous enrollment)
    if (response.status === 404) {
      return {
        code: 'error' as const,
        data: {
          isEligible: false,
          message: 'No previous enrollment found or student not eligible for re-enrollment',
          requirements: {
            hasOutstandingFees: false,
            hasCompletedPreviousYear: false,
            isAccountActive: false
          }
        },
        error: 'No previous enrollment found or student not eligible for re-enrollment',
      };
    }
    
    // Handle other error status codes
    const errorMessage = response.data?.message || `API returned status ${response.status}`;
    console.error(`[checkReenrollmentPrerequisites] API error: ${errorMessage}`);
    return {
      code: 'error' as const,
      data: null,
      error: errorMessage,
    };
    
  } catch (error: any) {
    console.error('Error in checkReenrollmentPrerequisites:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    return {
      code: 'error' as const,
      data: null,
      error: error.message || 'An error occurred while checking re-enrollment prerequisites',
    };
  }
}

export async function getStudentEnrollmentHistory(studentCode: string) {
  try {
    console.log(`[getStudentEnrollmentHistory] Fetching enrollment history for student: ${studentCode}`);
    
    if (!studentCode) {
      console.error('No student code provided to getStudentEnrollmentHistory');
      return {
        code: 'error' as const,
        data: [],
        error: 'No student code provided',
      };
    }

    const session = await verifySession();
    if (!session?.accessToken) {
      console.error('No access token available');
      return {
        code: 'error' as const,
        data: [],
        error: 'Authentication required',
      };
    }

    const token = session.accessToken;
    const apiUrl = `${process.env.AIM_WORKER_ENDPOINT}/api/students/${studentCode}/enrollments`;
    
    console.log(`[getStudentEnrollmentHistory] Calling API: ${apiUrl}`);
    
    const response = await axios.get<IEnrollmentResponse>(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-API-Key': process.env.PUBLIC_API_KEY || '',
      },
      timeout: 10000, // 10 seconds timeout
      validateStatus: (status) => status < 500, // Don't throw for 404
    });

    console.log(`[getStudentEnrollmentHistory] API response status: ${response.status}`, response.data);
    
    // Handle 404 - No enrollments found (not necessarily an error)
    if (response.status === 404) {
      console.log(`[getStudentEnrollmentHistory] No enrollments found for student ${studentCode}`);
      return {
        code: 'success' as const,
        data: [],
        error: null,
      };
    }

    // Handle other error status codes
    if (response.status >= 400) {
      const errorMessage = response.data?.message || `API returned status ${response.status}`;
      console.error(`[getStudentEnrollmentHistory] API error: ${errorMessage}`);
      return {
        code: 'error' as const,
        data: [],
        error: errorMessage,
      };
    }
    
    // Handle successful response
    if (response.data && response.data.code === '200') {
      return {
        code: 'success' as const,
        data: response.data.body || [],
        error: null,
      };
    }
    
    // Handle unexpected response format
    console.error('Unexpected API response format:', response.data);
    return {
      code: 'error' as const,
      data: [],
      error: 'Unexpected API response format',
    };
    
  } catch (error: any) {
    console.error('Error in getStudentEnrollmentHistory:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      return {
        code: 'error' as const,
        data: [],
        error: 'Request timed out. Please try again.',
      };
    }
    
    // Handle other errors
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Failed to fetch enrollment history';
    
    return {
      code: 'error' as const,
      data: [],
      error: errorMessage,
    };
  }
}

export async function createUser (student: ICreateStudent) {
    console.log('-->createStudent', student)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.post(`${process.env.AIM_WORKER_ENDPOINT}/api/students/enroll-existing`, {
        ...student
        },{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        console.log('-->result', response.data);
        
        return {
        code: 'success',
        error: null,
        data: response.data
        }
    } catch (error: unknown) {
        console.log('-->createStudent.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function updateUser (student: ICreateStudent) {
    console.log('-->updateUser', student)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.put(`${process.env.AIM_WORKER_ENDPOINT}/api/students/enroll-existing`, {
        ...student
        },{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        console.log('-->result', response.data);
        
        return {
        code: 'success',
        error: null,
        data: response.data
        }
    } catch (error: unknown) {
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function getUserList(){
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.get(`${process.env.AIM_WORKER_ENDPOINT}/api/users/profiles/students`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        console.log('-->result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->createStudent.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}



export async function createEnrollment(studentCode: string, enrollmentData: ICreateEnrollment) {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    if (!process.env.AIM_WORKER_ENDPOINT) {
      throw new Error('AIM_WORKER_ENDPOINT is not defined in environment variables');
    }

    const payload = {
      academic_year_code: enrollmentData.academic_year_code,
      curriculum_code: enrollmentData.curriculum_code,
      notes: enrollmentData.notes || '', // Use empty string as default instead of 'Enrollment created'
    };
    
    console.log('Enrollment notes being sent:', enrollmentData.notes); // Debug log

    console.log('Creating enrollment with payload:', JSON.stringify(payload, null, 2));
    console.log('Student code:', studentCode);
    console.log('API Endpoint:', `${process.env.AIM_WORKER_ENDPOINT}/api/students/${studentCode}/enrollments`);

    const response = await axios.post(
      `https://student-worker-dev.scholaris-sys.workers.dev/api/students/${studentCode}/enrollments`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-API-Key': process.env.PUBLIC_API_KEY || '',
        },
      }
    );

    console.log('Enrollment response:', response.data);

    return {
      code: 'success' as const,
      error: null,
      data: response.data,
    };
  } catch (error: unknown) {
    console.error('Error creating enrollment:', error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.data?.error || error.message;
      } else if (error.request) {
        errorMessage = 'No response received from the server';
      } else {
        errorMessage = error.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      code: 'error' as const,
      error: errorMessage,
      data: null,
    };
  }
}


export async function createProgram(programInfo: ICreateProgram){
    console.log('-->createProgram', programInfo)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.post(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/programs`, {
        ...programInfo
        },{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        console.log('-->result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->createProgram.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}
export async function updateProgram(programInfo: ICreateProgram){
    console.log('-->updateProgram', programInfo)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.put(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/programs/${programInfo.program_code}`, {
        ...programInfo
        },{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        console.log('-->result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->createProgram.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}
export async function getProgramList(){
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.get(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/programs`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        console.log('-->result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->createStudent.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}
export async function getProgramDetail(programCode: string) {
  console.log('-->getProgramDetail', programCode);
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.get(
      `${process.env.CURRICULUM_WORKER_ENDPOINT}/api/programs/${programCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('-->result', response.data);

    return {
      code: 'success',
      error: null,
      data: response.data,
    };
  } catch (error: unknown) {
    console.log('-->getProgramDetail.error');
    const errResult = actionErrorHandler(error);
    return errResult;
  }
}


export async function createCurriculum(curriculumInfo: ICreateCurriculum){
    console.log('-->createCurriculum', curriculumInfo)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.post(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/curriculums`, {
        ...curriculumInfo
        },{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        console.log('-->result', response.data.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->createCurriculum.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}
export async function updateCurriculum(curriculumInfo: ICreateCurriculum, curriculum_code: string){
    console.log('-->updateCurriculum', curriculumInfo)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.put(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/curriculums/${curriculum_code}`, {
        ...curriculumInfo
        },{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        console.log('-->result', response.data.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->updateCurriculum.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}
export async function getCurriculumList(){
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.get(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/curriculums`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        console.log('-->result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->createCurriculum.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}
export async function getCurriculumDetail(curriculumCode: string) {
  console.log('-->getCurriculumDetail', curriculumCode);
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.get(
      `${process.env.CURRICULUM_WORKER_ENDPOINT}/api/curriculums/${curriculumCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('-->result', response.data);

    return {
      code: 'success',
      error: null,
      data: response.data,
    };
  } catch (error: unknown) {
    console.log('-->getCurriculumDetail.error');
    const errResult = actionErrorHandler(error);
    return errResult;
  }
}
export async function getListAcademicYearsSchedulesForCurriculum(curriculum_code: string, academic_year_code?: string) {
    try {
        const session = await verifySession();
        const token = session.accessToken;

        const response = await axios.get(
        `${process.env.CURRICULUM_WORKER_ENDPOINT}/api/academics/academic-years/schedules`,
        {
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            },
            params: {
                academic_year_code,
                curriculum_code,
            },
        }
        );

        console.log("-->result", response.data);

        return {
        code: "success" as const,
        error: null,
        data: response.data,
        };
    } catch (error: unknown) {
        console.log("-->getListAcademicYearsSchedulesForCurriculum.error");
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}




export async function createSemester(semesterInfo: ICreateSemester){
    console.log('-->createSemester', semesterInfo)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.post(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/sequences`, {
        ...semesterInfo
        },{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        console.log('-->result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->createSemester.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}
export async function updateSemester(semesterInfo: ICreateSemester, semester_code: string){
    console.log('-->updateSemester', semesterInfo)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.put(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/sequences/${semester_code}`, {
        ...semesterInfo
        },{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        console.log('-->result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->updateSemester.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}
export async function getSemesterList(idCurriculum: string){
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.get(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/sequences/for-curriculum/${idCurriculum}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        console.log('-->result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->getSemesterList.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}
export async function getSemesterForCurriculum(idCurriculum: string){
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.get(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/sequences/for-curriculum/${idCurriculum}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        console.log('-->result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->getSemesterList.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

// matiere
export async function createDomain(domainInfo: ICreateDomain){
    console.log('-->createDomain', domainInfo)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.post(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/domains`, {
        ...domainInfo
        },{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        console.log('-->result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->createDomain.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}
export async function updateDomain(domainInfo: ICreateDomain){
    console.log('-->updateDomain', domainInfo)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.put(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/domains/${domainInfo.domain_code}`, {
        ...domainInfo
        },{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        console.log('-->result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->updateDomain.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}
export async function getDomainListPerCurriculum(idCurriculum: string){
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.get(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/domains/for-curriculum/${idCurriculum}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        console.log('-->result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->getDomainListPerCurriculum.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}



// Sous matiere
export async function createModule(moduleInfo: ICreateModule){
    console.log('-->createProgram', moduleInfo)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.post(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/modules`, {
        ...moduleInfo
        },{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        console.log('-->result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->createModule.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}
export async function updateModule(moduleInfo: ICreateModule){
    console.log('-->updateModule', moduleInfo)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.put(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/modules/${moduleInfo.module_code}`, {
        ...moduleInfo
        },{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        console.log('-->result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->updateModule.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}
export async function getModuleListPerDomain(idDomain: string){
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.get(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/modules/for-domain/${idDomain}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        console.log('-->result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->createStudent.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}
export async function getModuleListPerCurriculum(curriculum_code: string){
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.get(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/modules/for-curriculum/${curriculum_code}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        console.log('-->result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->getModuleListPerCurriculum.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}



export async function createUE(UEInfo: ICreateUE){
    console.log('-->createUE', UEInfo)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.post(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/course-units`, {
        ...UEInfo
        },{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        console.log('-->result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->createUE.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}
export async function updateUE(UEInfo: ICreateUE){
    console.log('-->updateUE', UEInfo)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.put(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/course-units/${UEInfo.course_unit_code}`, {
        ...UEInfo
        },{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        console.log('-->result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->updateUE.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}
export async function getUEListPerModule(moduleId: string){
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.get(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/course-units/for-module/${moduleId}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        console.log('-->result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->getUEListPerModule.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}
export async function getUEListPerCurriculum(curriculumId: string){
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.get(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/course-units/for-curriculum/${curriculumId}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        console.log('-->result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->getUEListPerCurriculum.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}


export async function getListModulesEvaluationsForCurriculum (curriculum_code: string) {
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.get(`${process.env.GRADE_WORKER_ENDPOINT}/api/evaluations/for-curriculum/${curriculum_code}/modules`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        console.log('-->result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->getListModulesEvaluationsForCurriculum.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

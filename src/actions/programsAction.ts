'use server'

import { verifySession } from "@/lib/session";
import { ICreateStudent } from "@/types/staffType";
import { ICreateEnrollment } from "@/types/programTypes"
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";
import { ICreateCurriculum, ICreateDomain, ICreateModule, ICreateProgram, ICreateSemester, ICreateUE } from "@/types/programTypes";


export async function checkReenrollmentPrerequisites(studentCode: string) {
  try {

    const session = await verifySession();
    const token = session.accessToken;

    const apiUrl = `${process.env.STUDENT_AIM_WORKER_ENDPOINT}/api/students/${studentCode}/reenrollment-prerequisites`;

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    return {
      code: 'success' as const,
      data: response.data,
      error: null,
    };
  } catch (error: unknown) {
    console.log('-->checkReenrollmentPrerequisites.error')
    const errResult = actionErrorHandler(error);
    return errResult;
  }
}

export async function getStudentEnrollmentHistory(studentCode: string) {
  try {

    const session = await verifySession();
    const token = session.accessToken;

    const apiUrl = `${process.env.STUDENT_AIM_WORKER_ENDPOINT}/api/students/${studentCode}/enrollments`;

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    return {
      code: 'success' as const,
      data: response.data?.body || [],
      error: null,
    };
  } catch (error: unknown) {
    console.log('-->getStudentEnrollmentHistory.error')
    const errResult = actionErrorHandler(error);
    return errResult
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
export async function getUEListForTeacher(teacher_user_code: string){
  try {
      const session = await verifySession();
      
      const token = session.accessToken;
      

      const response = await axios.get(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/course-units/for-teacher/${teacher_user_code}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      
      return {
          code: 'success',
          error: null,
          data: response.data
      }
  } catch (error: unknown) {
      console.log('-->getUEListForTeacher.error')
      const errResult = actionErrorHandler(error);
      return errResult;
  }
}
export async function assignATeacherToACourseUnit(course_unit_code: string, teacher_user_code: string) {
  try {
    const session = await verifySession();
    
    const token = session.accessToken;
    
    const response = await axios.patch(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/course-units/${course_unit_code}/assign-teacher`,
      {teacher_user_code: teacher_user_code},
      {headers: {Authorization: `Bearer ${token}`}}
    );
    
    
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


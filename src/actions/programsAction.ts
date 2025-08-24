'use server'

import { verifySession } from "@/lib/session";
import { ICreateStudent } from "@/types/userTypes";
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";
import { ICreateCurriculum, ICreateDomain, ICreateModule, ICreateProgram, ICreateSemester, ICreateUE } from "@/types/programTypes";

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
export async function createModule(programInfo: ICreateModule){
    console.log('-->createProgram', programInfo)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.post(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/modules`, {
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
        console.log('-->createModule.error')
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



export async function createUE(programInfo: ICreateUE){
    console.log('-->createUE', programInfo)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.post(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/course-units`, {
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
        console.log('-->createUE.error')
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
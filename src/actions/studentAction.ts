/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { verifySession } from "@/lib/session";
import { IInitiateStudentApplication, IUpdateStudentApplication } from "@/types/staffType";
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";
import { IImportStudentApplicationInBulkJSON } from "@/types/userType";

export async function initiateStudentApplication(applicationData: IInitiateStudentApplication) {
    console.log('-->initiateStudentApplication', applicationData)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        
        const response = await axios.post(`${process.env.APPLICATION_WORKER_ENDPOINT}/api/admin/student-applications/initiate`, {
            ...applicationData
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('-->initiateStudentApplication.result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->initiateStudentApplication.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function updateStudentApplication(payload: IUpdateStudentApplication, application_code: string) {
    try {
        const session = await verifySession();
        const token = session.accessToken;

        const response = await axios.put(
            `${process.env.APPLICATION_WORKER_ENDPOINT}/api/admin/student-applications/${application_code}`,
            payload,
            { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );

        return { code: "success", error: null, data: response.data };
    } catch (error: unknown) {
        console.log('-->updateStudentApplication.error')
        return actionErrorHandler(error);
    }
}
export async function getStudentApplication(applicationCode: string) {
    console.log('-->getStudentApplication', applicationCode)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        const response = await axios.get(`${process.env.APPLICATION_WORKER_ENDPOINT}/api/admin/student-applications/${applicationCode}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('-->getStudentApplication.result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->getStudentApplication.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function getStudentApplicationList() {
    console.log('-->getStudentApplicationList')
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        
        const response = await axios.get(`${process.env.APPLICATION_WORKER_ENDPOINT}/api/admin/student-applications`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('-->getStudentApplicationList.result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->getStudentApplicationList.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function reviewStudentApplication(applicationCode: string, status: 'APPROVED' | 'REJECTED', rejectionReason?: string) {
    console.log('-->reviewStudentApplication', applicationCode, status)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        
        const requestBody: any = { status };
        if (status === 'REJECTED' && rejectionReason) {
            requestBody.reason = rejectionReason;
        }
        
        const response = await axios.post(`${process.env.APPLICATION_WORKER_ENDPOINT}/api/admin/student-applications/${applicationCode}/review`, requestBody, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('-->reviewStudentApplication.result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->reviewStudentApplication.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function convertStudentApplication(applicationCode: string) {
    console.log('-->convertStudentApplication', applicationCode)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        
        const response = await axios.post(`${process.env.APPLICATION_WORKER_ENDPOINT}/api/admin/student-applications/${applicationCode}/convert`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('-->convertStudentApplication.result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->convertStudentApplication.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function getStudentDetails(userCode: string) {
    console.log('-->getStudentDetails', userCode);
    try {
        const session = await verifySession();
        const token = session.accessToken;
        
        const response = await axios.get(`${process.env.STUDENT_WORKER_ENDPOINT}/api/students/${userCode}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        
        console.log('-->getStudentDetails.result', response.data);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        };
    } catch (error: unknown) {
        console.error('-->getStudentDetails.error', error);
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function importStudentsInBulkJSON(payload: IImportStudentApplicationInBulkJSON[]) {
    try {
        // console.log('-->payload', payload);
        const session = await verifySession();
        
        const token = session.accessToken;
        
        const response = await axios.post(`${process.env.APPLICATION_WORKER_ENDPOINT}/api/admin/student-applications/initiate-bulk`, payload, {
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
        console.log('-->importStudentsInBulkJSON.error', error)
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function createNewAnnualEnrollment(student_code: string, academic_year_code: string, curriculum_code: string) {
    try {
        const session = await verifySession();

        const token = session.accessToken;

        const response = await axios.post(`${process.env.STUDENT_WORKER_ENDPOINT}/api/students/${student_code}/enrollments`, {
            "academic_year_code": academic_year_code,
            "curriculum_code": curriculum_code,
            "notes": "RAS"
        }, {
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
        console.log('-->createNewAnnualEnrollment.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function downloadDocument(documentUrl: string) {
    console.log('-->downloadDocument', documentUrl);
    try {
        const response = await axios.get(documentUrl, {
            responseType: 'arraybuffer',
        });

        const contentType = response.headers['content-type'] || 'application/octet-stream';
        const base64 = Buffer.from(response.data).toString('base64');

        return {
            code: 'success',
            error: null,
            data: {
                content: base64,
                contentType: contentType
            }
        };
    } catch (error: unknown) {
        console.log('-->downloadDocument.error', error);
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function getCurriculumnEnrollments (curriculum_code: string, academic_year_code: string) {
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        const response = await axios.get(`${process.env.STUDENT_WORKER_ENDPOINT}/api/students/enrollments/${curriculum_code}/years/${academic_year_code}`, {
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
        console.log('-->getCurriculumnEnrollments.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

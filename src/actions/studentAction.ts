'use server'

import { verifySession } from "@/lib/session";
import { IInitiateStudentApplication } from "@/types/userTypes";
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";

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

export async function getStudentApplication(applicationCode: string) {
    console.log('-->getStudentApplication', applicationCode)
    try {
        const response = await axios.get(`${process.env.APPLICATION_WORKER_ENDPOINT}/api/public/student-applications/${applicationCode}`);
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
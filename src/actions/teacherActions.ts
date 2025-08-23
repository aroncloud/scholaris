'use server'

import { verifySession } from "@/lib/session";
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";
import { CreateTeacherRequest, UpdateTeacherRequest } from "@/app/(admin)/admin/teachers/types";

export async function getTeachers(){
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.get(`${process.env.AIM_WORKER_ENDPOINT}/api/users/profiles/teachers`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        console.log('-->getTeachers result', response);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->teacherActions.getTeachers.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}


export async function getStaffs(){
    return getTeachers();
}

export async function createTeacher(teacherData: CreateTeacherRequest) {
    console.log('-->createTeacher', teacherData)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.post(`${process.env.AIM_WORKER_ENDPOINT}/api/teachers/hire-existing`,
            {...teacherData},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('-->result', response);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->teacherActions.createTeacher.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function updateTeacher(teacherData: UpdateTeacherRequest) {
    console.log('-->updateTeacher', teacherData)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.post(`${process.env.AIM_WORKER_ENDPOINT}/api/teachers/hire-existing`,
            {...teacherData},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('-->updateTeacher result', response);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->teacherActions.updateTeacher.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}
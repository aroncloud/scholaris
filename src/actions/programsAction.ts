'use server'

import { verifySession } from "@/lib/session";
import { ICreateStudent } from "@/types/userTypes";
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";

export async function createUser (student: ICreateStudent) {
    console.log('-->createAsset', student)
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
        console.log('-->result', response);
        
        return {
        code: 'success',
        error: null,
        data: response.data
        }
    } catch (error: unknown) {
        console.log('-->createAsset.error', error)
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
        console.log('-->result', response);
        
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
        console.log('-->result', response);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->createAsset.error', error)
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}
'use server'

import { verifySession } from "@/lib/session";
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";
import { ICreateUser } from "@/types/userTypes";




export async function createUser (user: ICreateUser) {
    console.log('-->createUser', user)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.post(`${process.env.AIM_WORKER_ENDPOINT}/api/users`,
            {...user},
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
        console.log('-->createUser.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function getUserList(){
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.get(`${process.env.AIM_WORKER_ENDPOINT}/api/users/profiles?limit=10&offset=0`,{
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
        console.log('-->userAction.getUserList.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function deactivateUser (userCode: string) {
    console.log('-->deactivateUser', userCode)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        
        const response = await axios.patch(`${process.env.AIM_WORKER_ENDPOINT}/api/users/${userCode}/deactivate`, {}, {
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
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function deleteUser (userCode: string) {
    console.log('-->deleteUser', userCode)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        
        const response = await axios.delete(`${process.env.AIM_WORKER_ENDPOINT}/api/users/${userCode}`, {
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
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function updateUser (user: ICreateUser) {
    console.log('-->updateUser', user)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.put(`${process.env.AIM_WORKER_ENDPOINT}/api/users/enroll-existing`, {
        ...user
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
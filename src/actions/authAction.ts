'use server'
import { createSession } from "@/lib/session";
import { SessionPayload } from "@/types/authTypes";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILoginForm } from "@/types/staffType";
import axios from "axios";
export async function login (data: ILoginForm) {
    try {
        const response = await axios.post(
            `${process.env.AIM_WORKER_ENDPOINT}/api/auth/login`,
            {username: data.username, password: data.password},
        );

        console.log('-->response', response.data)
    
        const sessionInfo: SessionPayload = {
            accessToken: response.data.body.accessToken,
            refreshToken: response.data.body.refreshToken,
            roles: response.data.body.roles,
            email: data.username,
            expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000)
        }
        console.log('-->sessionInfo', sessionInfo);
        await createSession(sessionInfo);
        return {
            code: 'success',
            error: null,
            data: response.data
        };
    } catch (error: any) {
        console.log('-->login.Cloudflare', error.response)
        return {
            code: error.code ?? "unknown",
            error: error.response?.data?.message ?? "An unexpected error occurred",
            data: null
        };
    }
}
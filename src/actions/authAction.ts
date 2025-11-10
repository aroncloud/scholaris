'use server'
import { createSession, verifySession } from "@/lib/session";
import { SessionPayload } from "@/types/authTypes";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILoginForm } from "@/types/staffType";
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";
export async function login (data: ILoginForm) {
    console.log('-->Data', data);
    console.log('-->URL', `${process.env.AIM_WORKER_ENDPOINT}/api/auth/login`)
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
            expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
            user: response.data.body.user
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

export async function getMyProfile() {
    try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.get(
      `${process.env.AIM_WORKER_ENDPOINT}/api/users/me`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { code: "success", error: null, data: response.data };
  } catch (error: unknown) {
    return actionErrorHandler(error);
  }
}
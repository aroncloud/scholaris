'use server'

import { verifySession } from "@/lib/session";
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";
import { IGetAbsencesListRequest } from "@/types/planificationType";


export async function getSessionAttendees(session_code: string) {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.get(
      `${process.env.ATTENDACE_WORKER_ENDPOINT}/api/sessions/${session_code}/attendees`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return { code: "success", error: null, data: response.data };
  } catch (error: unknown) {
    return actionErrorHandler(error);
  }
}

export async function recordAbsences(session_code: string, studentCode : string[]) {
    console.log('-->studentCode', studentCode)
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.post(
      `${process.env.ATTENDACE_WORKER_ENDPOINT}/api/sessions/${session_code}/absences`,
      {
        absent_enrollment_codes: studentCode
      },
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );

    return { code: "success", error: null, data: response.data };
  } catch (error: unknown) {
    return actionErrorHandler(error);
  }
}

export async function getAbsencesList(payload: IGetAbsencesListRequest) {
    try {
    const session = await verifySession();
    const token = session.accessToken;


    const response = await axios.get(
      `${process.env.ATTENDACE_WORKER_ENDPOINT}/api/sessions/absences`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { ...payload },
      }
    );

    return { code: "success", error: null, data: response.data };
  } catch (error: unknown) {
    return actionErrorHandler(error);
  }
}

export async function getAbsencesDetail(absence_code: string) {
    try {
    const session = await verifySession();
    const token = session.accessToken;


    const response = await axios.get(
      `${process.env.ATTENDACE_WORKER_ENDPOINT}/api/absences/${absence_code}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return { code: "success", error: null, data: response.data };
  } catch (error: unknown) {
    return actionErrorHandler(error);
  }
}


export async function getJustificationDetails (justification_code: string) {
    try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.get(
      `${process.env.ATTENDACE_WORKER_ENDPOINT}/api/justifications/${justification_code}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return { code: "success", error: null, data: response.data };
  } catch (error: unknown) {
    return actionErrorHandler(error);
  }
}


export async function reviewJustification(status: "APPROVED" | "REJECTED", justification_code: string, reason: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {status};
    if(status == "REJECTED"){payload.reason = reason}

    try {
        const session = await verifySession();
        const token = session.accessToken;

        const response = await axios.post(
        `${process.env.ATTENDACE_WORKER_ENDPOINT}/api/justifications/${justification_code}/review`,
        payload,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );

        return { code: "success", error: null, data: response.data };
    } catch (error: unknown) {
        return actionErrorHandler(error);
    }
}

export async function terminateSession (session_code: string, status: "CANCELLED" | "IN_PROGRESS" | "COMPLETED" | "TERMINATED") {
    
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        
        const response = await axios.patch(`${process.env.TIMETABLE_WORKER_ENDPOINT}/api/sessions/${session_code}/status`,
          {status_code: status},
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
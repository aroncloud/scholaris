'use server'

import { verifySession } from "@/lib/session";
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";
import { ICreateAcademicYear, ICreateAcademicYearSchedules, ICreateSession, ICreateValidationRule } from "@/types/planificationType";
import { IUpdateSessionForm } from "@/types/programTypes";


export async function createSession(sessionData: ICreateSession) {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.post(
      `${process.env.TIMETABLE_WORKER_ENDPOINT}/api/sessions`,
      sessionData,
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );

    return { code: "success", error: null, data: response.data };
  } catch (error: unknown) {
    return actionErrorHandler(error);
  }
}

export async function updateSession(sessionData: IUpdateSessionForm, session_code: string) {
  console.log('-->sessionData', sessionData)
  console.log('-->session_code', session_code)
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.put(
      `${process.env.TIMETABLE_WORKER_ENDPOINT}/api/sessions/${session_code}`,
      sessionData,
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );

    return { code: "success", error: null, data: response.data };
  } catch (error: unknown) {
    return actionErrorHandler(error);
  }
}

export async function getSessionList() {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.get(
      `${process.env.TIMETABLE_WORKER_ENDPOINT}/api/sessions`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { code: "success", error: null, data: response.data };
  } catch (error: unknown) {
    return actionErrorHandler(error);
  }
}

export async function cancelSession(session_code: string) {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.patch(
      `${process.env.TIMETABLE_WORKER_ENDPOINT}/api/sessions/${session_code}/status`,
      {"status_code": "TERMINATED"},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { code: "success", error: null, data: response.data };
  } catch (error: unknown) {
    return actionErrorHandler(error);
  }
}

export async function createAcademicYearSchedule(scheduleData: ICreateAcademicYearSchedules) {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.post(
      `${process.env.CURRICULUM_WORKER_ENDPOINT}/api/academics/schedules`,
      scheduleData,
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );

    return { code: "success", error: null, data: response.data };
  } catch (error: unknown) {
    return actionErrorHandler(error);
  }
}
// Mettre à jour un schedule
export async function updateAcademicYearSchedule(
  scheduleData: ICreateAcademicYearSchedules,
  schedule_code: string
) {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.put(
      `${process.env.CURRICULUM_WORKER_ENDPOINT}/api/academic-years/schedules/${schedule_code}`,
      scheduleData,
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );

    return { code: "success", error: null, data: response.data };
  } catch (error: unknown) {
    return actionErrorHandler(error);
  }
}
export async function createAcademicYear(scheduleData: ICreateAcademicYear) {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.post(
      `${process.env.CURRICULUM_WORKER_ENDPOINT}/api/academics/academic-years`,
      scheduleData,
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );

    return { code: "success", error: null, data: response.data };
  } catch (error: unknown) {
    return actionErrorHandler(error);
  }
}



export async function getAcademicYearSchedulesList(academic_year_code: string) {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.get(
      `${process.env.CURRICULUM_WORKER_ENDPOINT}/api/academics/academic-years/schedules`,
      { 
        headers: { Authorization: `Bearer ${token}` }, 
        params: { academic_year_code }
      }
      ,
    );

    return { code: "success", error: null, data: response.data };
  } catch (error: unknown) {
    return actionErrorHandler(error);
  }
}

export async function getAcademicYear() {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.get(
      `${process.env.CURRICULUM_WORKER_ENDPOINT}/api/academics/academic-years`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { code: "success", error: null, data: response.data };
  } catch (error: unknown) {
    return actionErrorHandler(error);
  }
}

export async function getCurrentAcademicYear() {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.get(
      `${process.env.CURRICULUM_WORKER_ENDPOINT}/api/academics/academic-years/current`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { code: "success", error: null, data: response.data };
  } catch (error: unknown) {
    return actionErrorHandler(error);
  }
}

export async function deleteAcademicYearSchedule(schedule_code: string) {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.delete(
      `${process.env.CURRICULUM_WORKER_ENDPOINT}/api/academic-years/schedules/${schedule_code}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { code: "success", error: null, data: response.data };
  } catch (error: unknown) {
    return actionErrorHandler(error);
  }
}


export async function getCurriculumSchedule(curriculum_code: string, start_date: string, end_date: string) {
  try {
    const session = await verifySession();
    const token = session.accessToken;
    console.log('-->url', `${process.env.TIMETABLE_WORKER_ENDPOINT}/api/schedule?curriculum_code=${curriculum_code}&start_date=${start_date}&end_date=${end_date}`)
    const response = await axios.get(
      `${process.env.TIMETABLE_WORKER_ENDPOINT}/api/schedule?curriculum_code=${curriculum_code}&start_date=${start_date}&end_date=${end_date}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { code: "success", error: null, data: response.data };
  } catch (error: unknown) {
    return actionErrorHandler(error);
  }
}


// Teacher
export async function getTeacherSchedule(teacher_user_code: string, start_date: string, end_date: string) {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.get(
      `${process.env.TIMETABLE_WORKER_ENDPOINT}/api/schedule`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { teacher_user_code, start_date, end_date },
      }
    );

    return { code: "success", error: null, data: response.data };
  } catch (error: unknown) {
    return actionErrorHandler(error);
  }
}

// Resource
export async function getResourceSchedule(resource_code: string, start_date: string, end_date: string) {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.get(
      `${process.env.TIMETABLE_WORKER_ENDPOINT}/api/schedule`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { resource_code, start_date, end_date },
      }
    );

    return { code: "success", error: null, data: response.data };
  } catch (error: unknown) {
    return actionErrorHandler(error);
  }
}

export async function createValidationRule(payload: ICreateValidationRule) {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.post(
      `${process.env.GRADE_WORKER_ENDPOINT}/api/rules`,
      payload,
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );

    return { code: "success", error: null, data: response.data };
  } catch (error: unknown) {
    return actionErrorHandler(error);
  }
}
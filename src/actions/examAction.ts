'use server'

import { verifySession } from "@/lib/session";
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";
import { ICreateEvaluation } from "@/types/examTypes";


export async function createEvaluation(evaluation: ICreateEvaluation) {
  console.log("-->createEvaluation", evaluation);
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.post(
      `${process.env.GRADE_WORKER_ENDPOINT}/api/evaluations`,
      { ...evaluation },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("-->createEvaluation.result", response.data);

    return {
      code: "success" as const,
      error: null,
      data: response.data,
    };
  } catch (error: unknown) {
    console.log("-->createEvaluation.error");
    const errResult = actionErrorHandler(error);
    return errResult;
  }
}


export async function getEvaluationListForCurriculum(curriculum_code: string) {
    try {
        const session = await verifySession();
        const token = session.accessToken;

        const response = await axios.get(
        `${process.env.GRADE_WORKER_ENDPOINT}/api/evaluations/for-curriculum/${curriculum_code}`,
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );

        return {
        code: "success",
        error: null,
        data: response.data,
    };
  } catch (error: unknown) {
    console.log("-->getEvaluationListForCurriculum.error");
    const errResult = actionErrorHandler(error);
    return errResult;
  }
}

export async function getEvaluationListForTeacher(teacher_code: string) {
    try {
        const session = await verifySession();
        const token = session.accessToken;

        const response = await axios.get(
        `${process.env.GRADE_WORKER_ENDPOINT}/api/evaluations/for-teacher/${teacher_code}`,
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );

        return {
        code: "success",
        error: null,
        data: response.data,
    };
  } catch (error: unknown) {
    console.log("-->getEvaluationListForTeacher.error");
    const errResult = actionErrorHandler(error);
    return errResult;
  }
}
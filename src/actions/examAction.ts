'use server'

import { verifySession } from "@/lib/session";
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";
import { ICreateEvaluation, ISubmitGrades } from "@/types/examTypes";


export async function createEvaluation(evaluation: ICreateEvaluation) {
  console.log("-->createEvaluation", evaluation);
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.post(
      `${process.env.GRADE_WORKER_ENDPOINT}/api/evaluations/generate`,
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

export async function getModulesEvaluationsForCurriculum(curriculum_code: string, schedule_code: string) {
  try {
      const session = await verifySession();
      const token = session.accessToken;

      // Construction de l'URL avec le paramètre de requête schedule_code
      const url = `${process.env.GRADE_WORKER_ENDPOINT}/api/evaluations/for-curriculum/${curriculum_code}/modules?schedule_code=${schedule_code}`;

      const response = await axios.get(
          url,
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

export async function getEvaluationsForSchedule(schedule_code: string) {
  try {
      const session = await verifySession();
      const token = session.accessToken;

      // Construction de l'URL avec le paramètre de requête schedule_code
      const url = `${process.env.GRADE_WORKER_ENDPOINT}/api/evaluations/for-schedule/${schedule_code}`;

      const response = await axios.get(
          url,
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


export async function getListModulesEvaluationsForCurriculum(
  curriculum_code: string,
  schedule_code: string
) {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.get(
      `${process.env.GRADE_WORKER_ENDPOINT}/api/evaluations/for-curriculum/${curriculum_code}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          schedule_code, // sera automatiquement ajouté comme ?schedule_code=xxx
        },
      }
    );

    return {
      code: "success",
      error: null,
      data: response.data,
    };
  } catch (error: unknown) {
    console.log("-->getListModulesEvaluationsForCurriculum.error");
    const errResult = actionErrorHandler(error);
    return errResult;
  }
}


export async function getEvaluationListForTeacher(teacher_code: string, schedule_code: string) {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.get(
      `${process.env.GRADE_WORKER_ENDPOINT}/api/evaluations/for-teacher/${teacher_code}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          schedule_code,
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

export async function getEvaluationSheet(evaluation_code: string) {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.get(
      `${process.env.GRADE_WORKER_ENDPOINT}/api/evaluations/${evaluation_code}/sheet`,
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
    console.log("-->getEvaluationSheet.error");
    const errResult = actionErrorHandler(error);
    return errResult;
  }
}

export async function submitGrades (evaluation_code: string, submissions: ISubmitGrades[]) {
  console.log("-->submitGrades", submissions);
  console.log("-->evaluation_code", evaluation_code);
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.post(
      `${process.env.GRADE_WORKER_ENDPOINT}/api/evaluations/${evaluation_code}/grades`,
      { submissions: submissions },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      code: "success" as const,
      error: null,
      data: response.data,
    };
  } catch (error: unknown) {
    console.log("-->submitGrades.error");
    const errResult = actionErrorHandler(error);
    return errResult;
  }
}

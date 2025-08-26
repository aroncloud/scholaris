'use server'
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";
import { CreateApplicantRequest } from "@/types/requestSubmissionTypes";

export async function searchStudentByMatricule(matricule: string) {
    try {
        const response = await axios.get(
            `${process.env.APPLICATION_WORKER_ENDPOINT}/api/public/student-applications/${matricule}`,
            {
                headers: {
                    "X-API-Key": process.env.X_API,
                },
            }
        );

        // console.log('-->getTeachers result', response);

        return {
            code: "success",
            error: null,
            data: response.data,
        };
    } catch (error: unknown) {
        console.log("-->requestSubmissionActions.searchStudentByMatricule.error");
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function submitAdmissionRequest(formData: CreateApplicantRequest, applicationCode: string) {
    try {
        const response = await axios.put(
            `${process.env.APPLICATION_WORKER_ENDPOINT}/api/public/student-applications/${applicationCode}/complete`,
            formData,
            {
                headers: {
                    "X-API-Key": process.env.X_API,
                },
            }
        );

        // console.log('-->submitAdmissionRequest result', response);

        return {
            code: "success",
            error: null,
            data: response.data,
        };
    } catch (error: unknown) {
        console.log("-->requestSubmissionActions.submitAdmissionRequest.error");
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

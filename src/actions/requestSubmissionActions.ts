'use server'
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";

export async function searchStudentByMatricule(matricule: string) {
    try {
        console.log('endPoint', `${process.env.APPLICATION_WORKER_ENDPOINT}/api/public/student-applications/${matricule}`)
        const response = await axios.get(
            `${process.env.APPLICATION_WORKER_ENDPOINT}/api/public/student-applications/${matricule}`,
            {
                headers: {
                    "X-API-Key": process.env.PUBLIC_API_KEY,
                },
            }
        );

        console.log('-->getTeachers result', response);

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

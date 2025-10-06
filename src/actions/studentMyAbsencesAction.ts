'use server'

import { verifySession } from "@/lib/session";
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";
import { SubmitJustificationPayload } from "@/types/studentmyabsencesTypes";

export async function getMyAbsencesList() {
    try {
        const session = await verifySession();
        const token = session.accessToken;

        const endpoint = `${process.env.ATTENDACE_WORKER_ENDPOINT}/api/absences`;
        const response = await axios.get(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("✅ API raw response:", response.data);
        //  Extract the nested body array
        const absencesArray = Array.isArray(response.data.body)
            ? response.data.body
            : [];

        return {
            code: 'success',
            message: 'Données récupérées avec succès',
            exit: 'OK',
            body: absencesArray,
        };
    } catch (error: any) {
        console.log(
            "💥 API call failed:",
            error.response?.status,
            error.response?.data || error.message
        );
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function submitJustification(payload: SubmitJustificationPayload) {
  console.log("--> submitJustification: starting with payload", payload);

  try {
    //  Verify session and get token
    const session = await verifySession();
    const token = session.accessToken;

    //  Define endpoint
    const endpoint = `${process.env.ATTENDACE_WORKER_ENDPOINT}/api/justifications`;

    //  Perform POST request
    const response = await axios.post(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(" Justification submitted successfully:", response.data);

    return {
      code: "success",
      message: "Justification soumise avec succès",
      data: response.data,
    };
  } catch (error: any) {
    console.log(" submitJustification.error:", error.response?.data || error.message);
    const errResult = actionErrorHandler(error);
    return errResult;
  }
}

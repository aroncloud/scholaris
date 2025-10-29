/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { verifySession } from "@/lib/session";
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";
import { SubmitJustificationPayload, JustificationFile } from "@/types/studentmyabsencesTypes";
import { useUserStore } from "@/store/useAuthStore";
import { SessionPayload } from "@/types/authTypes";

import { uploadFile } from "@/lib/fileUpload";


export async function fetchAndStoreUserProfile() {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const endpoint = `${process.env.AIM_WORKER_ENDPOINT}/api/users/me`;

    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = response.data?.body;

    if (!userData) {
      console.error("❌ No user data found in response.");
      return null;
    }

    const payload: SessionPayload = {
      accessToken: token,
      refreshToken: session.refreshToken ?? "",
      email: userData.email,
      roles: userData.roles ?? [],
      expiresAt: new Date(),
      user: {
        user_code: userData.user_code,
        user_name: userData.user_name,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        gender: userData.gender ?? "MALE",
        phone_number: userData.phone_number ?? "",
      },
    };

    useUserStore.getState().setUser(payload);

    console.log("✅ User profile stored in Zustand:", payload.user.user_code);

    return userData;
  } catch (error: any) {
    console.error("Failed to fetch user profile:", error.message);
    return null;
  }
}
export async function submitJustification(
  payload: SubmitJustificationPayload,
  file: File,
  userCode: string
) {
  try {
    if (!userCode) {
      return { code: "USER_NOT_FOUND", error: "Utilisateur introuvable", data: null };
    }

    const session = await verifySession();
    const token = session.accessToken;

    const processName = "Justification";
    const absenceCode = payload.absence_codes[0];
    const fileName = `${file.name}`;
    const filePath = `${process.env.STUDENT_FILE_NAME_SRC}/${userCode}/${processName}/${absenceCode}/${fileName}`;


    const uploadResult = await uploadFile(file, filePath);
    if (uploadResult.error) {
      return {
        code: uploadResult.code ?? "UPLOAD_ERROR",
        error: "Erreur lors du téléversement du fichier",
        data: null,
      };
    }

    const uploadedFile: JustificationFile = {
      content_url: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${filePath}`,
      title:
        payload.files[0]?.title ||
        (payload.files[0]?.type_code === "MEDICAL_CERTIFICATE" ? "Certificat Médical" : file.name),
        type_code: payload.files[0]?.type_code || "OTHER",
    };


    // 3️⃣ Prepare final payload
    const fullPayload: SubmitJustificationPayload = {
      absence_codes: payload.absence_codes,
      reason: payload.reason,
      files: [uploadedFile],
    };

    console.log("➡️ Payload sent to backend:", JSON.stringify(fullPayload, null, 2));

    // 4️⃣ Send POST request
    const endpoint = `${process.env.NEXT_PUBLIC_ATTENDANCE_WORKER_ENDPOINT}/api/justifications`;
    console.log("🚀 Sending final payload to API:", fullPayload);
    console.log("🔗 Endpoint:", endpoint);

    const response = await axios.post(endpoint, fullPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });


    return { code: "success", error: null, data: response.data };
  } catch (error: any) {
    console.error("💥 submitJustification.error:", error.response?.data || error.message);

    // Handle 403 and 400
    if (error.response?.status === 403) {
      return { code: "FORBIDDEN", error: "Vous n'avez pas les droits nécessaires (STUDENT role requis)", data: null };
    }
    if (error.response?.status === 400) {
      return { code: "BAD_REQUEST", error: "Requête invalide. Vérifiez les données envoyées.", data: null };
    }

    return { code: "UNKNOWN_ERROR", error: error.message ?? "Une erreur est survenue", data: null };
  }
}

export async function getMyAbsencesList() {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const endpoint = `${process.env.NEXT_PUBLIC_ATTENDANCE_WORKER_ENDPOINT}/api/absences`;
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
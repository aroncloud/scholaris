'use server'
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";
import { CreateApplicantRequest, Document } from "@/types/requestSubmissionTypes";
import { uploadFile } from "@/lib/fileUpload";
import { getExtension } from "@/lib/utils";

export async function searchStudentByMatricule(matricule: string) {
    try {
        const response = await axios.get(
            `${process.env.APPLICATION_WORKER_ENDPOINT}/api/public/student-applications/${matricule}`,
            {
                headers: {
                    "X-API-Key": process.env.PUBLIC_API_KEY,
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

interface UploadDocumentsParams {
    cniRecto: File;
    cniVerso: File;
    photo4x4: File;
    releveNotes: File;
    diplome: File;
    acteNaissance: File;
    pageResultatConcours: File;
    pageNomConcours: File;
    applicationCode: string;
}

export async function uploadApplicationDocuments(params: UploadDocumentsParams) {
    try {
        const {
            cniRecto,
            cniVerso,
            photo4x4,
            releveNotes,
            diplome,
            acteNaissance,
            pageResultatConcours,
            pageNomConcours,
            applicationCode
        } = params;

        const basePath = `${process.env.APPLICATION_FILE_NAME_SRC}/${applicationCode}`;

        // Définir les chemins pour chaque document
        const cniRectoPath = `${basePath}/CNI_RECTO${getExtension(cniRecto.name)}`;
        const cniVersoPath = `${basePath}/CNI_VERSO${getExtension(cniVerso.name)}`;
        const photo4x4Path = `${basePath}/PHOTO4X4${getExtension(photo4x4.name)}`;
        const releveNotesPath = `${basePath}/RELEVE_NOTES${getExtension(releveNotes.name)}`;
        const diplomePath = `${basePath}/DIPLOME${getExtension(diplome.name)}`;
        const acteNaissancePath = `${basePath}/BIRTH_CERTIFICATE${getExtension(acteNaissance.name)}`;
        const pageResultatConcoursPath = `${basePath}/CONTENT_RESULT_PAGE${getExtension(pageResultatConcours.name)}`;
        const pageNomConcoursPath = `${basePath}/HEADER_RESULT_PAGE${getExtension(pageNomConcours.name)}`;

        // Upload de chaque fichier
        const uploadedCniRecto = await uploadFile(cniRecto, cniRectoPath);
        if (uploadedCniRecto.error) return { error: "Erreur lors de l'upload de la CNI recto", code: uploadedCniRecto.code, data: null };

        const uploadedCniVerso = await uploadFile(cniVerso, cniVersoPath);
        if (uploadedCniVerso.error) return { error: "Erreur lors de l'upload de la CNI verso", code: uploadedCniVerso.code, data: null };

        const uploadedPhoto4x4 = await uploadFile(photo4x4, photo4x4Path);
        if (uploadedPhoto4x4.error) return { error: "Erreur lors de l'upload de la photo 4x4", code: uploadedPhoto4x4.code, data: null };

        const uploadedReleveNotes = await uploadFile(releveNotes, releveNotesPath);
        if (uploadedReleveNotes.error) return { error: "Erreur lors de l'upload du relevé de notes", code: uploadedReleveNotes.code, data: null };

        const uploadedDiplome = await uploadFile(diplome, diplomePath);
        if (uploadedDiplome.error) return { error: "Erreur lors de l'upload du diplôme", code: uploadedDiplome.code, data: null };

        const uploadedActeNaissance = await uploadFile(acteNaissance, acteNaissancePath);
        if (uploadedActeNaissance.error) return { error: "Erreur lors de l'upload de l'acte de naissance", code: uploadedActeNaissance.code, data: null };

        const uploadedPageResultatConcours = await uploadFile(pageResultatConcours, pageResultatConcoursPath);
        if (uploadedPageResultatConcours.error) return { error: "Erreur lors de l'upload de la page d'entente du résultat", code: uploadedPageResultatConcours.code, data: null };

        const uploadedPageNomConcours = await uploadFile(pageNomConcours, pageNomConcoursPath);
        if (uploadedPageNomConcours.error) return { error: "Erreur lors de l'upload de la page avec le nom", code: uploadedPageNomConcours.code, data: null };

        // Créer le tableau de documents
        const documents: Document[] = [
            {
                type_code: "CNI_RECTO",
                title: "CNI Recto",
                content_url: uploadedCniRecto.filePath!
            },
            {
                type_code: "CNI_VERSO",
                title: "CNI Verso",
                content_url: uploadedCniVerso.filePath!
            },
            {
                type_code: "PHOTO4X4",
                title: "Photo 4x4",
                content_url: uploadedPhoto4x4.filePath!
            },
            {
                type_code: "RELEVE_NOTES",
                title: "Relevé de notes",
                content_url: uploadedReleveNotes.filePath!
            },
            {
                type_code: "DIPLOME",
                title: "Diplôme",
                content_url: uploadedDiplome.filePath!
            },
            {
                type_code: "BIRTH_CERTIFICATE",
                title: "Acte de naissance",
                content_url: uploadedActeNaissance.filePath!
            },
            {
                type_code: "CONTENT_RESULT_PAGE",
                title: "Page d'entente du résultat de concours",
                content_url: uploadedPageResultatConcours.filePath!
            },
            {
                type_code: "HEADER_RESULT_PAGE",
                title: "Page avec le nom du résultat de concours",
                content_url: uploadedPageNomConcours.filePath!
            }
        ];

        return {
            code: "success",
            error: null,
            data: documents
        };
    } catch (error: unknown) {
        console.log("-->requestSubmissionActions.uploadApplicationDocuments.error", error);
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
                    "X-API-Key": process.env.PUBLIC_API_KEY,
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

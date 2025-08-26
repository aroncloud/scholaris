import { useState, useEffect, useCallback } from "react";
import { Teacher, TeacherAPIResponse } from "../../../app/(admin)/admin/teachers/types";
import { getTeachers } from "@/actions/teacherActions";

export function useTeacherData() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Fonction de fetch globale
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        const result = await getTeachers();
        
        console.log('API Response:', result);
        
        if (result.code === 'success' && result.data && result.data.body && Array.isArray(result.data.body)) {
            const transformedTeachers: Teacher[] = result.data.body.map((apiTeacher: TeacherAPIResponse) => 
                formatAPIResponseToTeacher(apiTeacher)
            );
            console.log('Transformed teachers:', transformedTeachers);
            setTeachers(transformedTeachers);
        } else {
            setError(result.error);
        }
    }, []);

    function formatAPIResponseToTeacher(apiResponse: TeacherAPIResponse): Teacher {
        return {
            id: apiResponse.user_code,
            matricule: apiResponse.teacher_number,
            nom: apiResponse.last_name,
            prenom: apiResponse.first_name,
            email: apiResponse.email,
            telephone: apiResponse.phone_number,
            userName: apiResponse.user_name, 
            gender: apiResponse.gender,
            specialite: apiResponse.specialty,
            departement: "", 
            statut: apiResponse.status_code === "ACTIVE" ? "actif" : apiResponse.status_code === "SUSPENDED" ? "suspendu" : "archive",
            typeContrat: apiResponse.type_code === "PERMANENT" ? "CDI" : apiResponse.type_code === "TEMPORARY" ? "CDD" : "Vacataire",
            typeCode: apiResponse.type_code,
            // dateEmbauche: apiResponse.hiring_date,
            salaire: apiResponse.salary,
            qualification: apiResponse.qualifications || "",
            experience: 0,
            evaluation: undefined, 
            matieres: [], 
            heuresEnseignement: undefined, 
        };
    }
    // Fetch initial
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Méthode pour rafraîchir après une action (création / édition)
    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return {
        teachers,
        setTeachers,
        loading,
        error,
        refetch,
    };
}

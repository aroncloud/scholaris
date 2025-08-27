import { useState, useEffect, useCallback } from "react";
import { GetTeacherApplication, Teacher } from "../../../types/teacherTypes";
import { getTeachers } from "@/actions/teacherActions";

export function useTeacherData() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [applications, setApplications] = useState<GetTeacherApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        const result = await getTeachers();
        
        console.log('API Response:', result);
        
        if (result.code === 'success') {
            setTeachers(result.data.body);
        } else {
            setError(result.error);
        }
        setLoading(false);
    }, []);


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refresh = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return {
        teachers,
        setTeachers,
        loading,
        error,
        refresh,
        applications,
        setApplications
    };
}

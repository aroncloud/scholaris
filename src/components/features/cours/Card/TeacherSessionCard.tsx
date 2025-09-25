"use client"
import { terminateSession } from '@/actions/attendeesAction';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { showToast } from '@/components/ui/showToast';
import { formatDateToText, getStatusColor } from '@/lib/utils';
import { IGetSchedule } from '@/types/planificationType'
import { Calendar, Clock, Edit, Play, Users } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react'

interface Myprops {
    session: IGetSchedule;
    refresh: () => Promise<void>;
}
const TeacherSessionCard = ({ session, refresh }: Myprops) => {
    
    const [isTerminatingSession, setIsTerminatingSession] = useState(false);
    const startSession = async () => {
        setIsTerminatingSession(true)
        const result =  await terminateSession(session.session_code, "IN_PROGRESS");
        if(result.code == "success") {
            showToast({
            variant: "success-solid",
            message: "Session démarrée",
            description: "Vous venez de démarrer avec succès.",
            position: 'top-center',
            });
            await refresh();
        } else {
            showToast({
            variant: "error-solid",
            message: "Erreur d'enregistrement",
            description: result.error ?? "Une erreur est survenue lors du démarrage de la session. Essayez à nouveau ou contactez l'administrateur",
            position: 'top-center',
            });
        }
        setIsTerminatingSession(false)
        }
    return (
        <div
            className="flex items-center justify-between p-4 border rounded-lg"
        >
            <div className="flex-1">
                    
                <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(session.status_code)}>
                        {session.status_code}
                    </Badge>
                    <div className="font-medium">{session.session_title}</div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                    {session.course_unit_code} - FILIERE
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                            {formatDateToText(session.start_time)} - {formatDateToText(session.end_time)}
                        </span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Duration h</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>45 étudiants</span>
                    </div>
                </div>
            </div>
            <div className="flex space-x-2">
                <Button variant="info" size="sm" onClick={startSession} disabled={isTerminatingSession || session.status_code === "IN_PROGRESS" || session.status_code === "COMPLETED" || session.status_code === "TERMINATED"}>
                    <Play className="h-4 w-4 mr-2" />
                    
                    {isTerminatingSession ? "Lancement ..." : "Démarrer"}
                </Button>
                <Button variant="outline-info" size="sm">
                    <Link href={`/teacher/cours/${session.session_code}`} className='flex flex-nowrap gap-3 items-center'>
                        <Edit className="h-4 w-4" />
                        Detail
                    </Link>
                </Button>
            </div>
        </div>
    )
}

export default TeacherSessionCard
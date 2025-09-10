'use client'

import { Dispatch, SetStateAction } from "react";
import { v4 as uuidv4 } from 'uuid';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Users,
  Download,
  Upload,
  Plus,
  Award,
  Clock,
} from "lucide-react";
import { IEnrollmentRequest } from "@/types/staffType";


type MyComponentProps = {
  setIsCreateStudentOpen: Dispatch<SetStateAction<boolean>>;
  enrollmentRequests: IEnrollmentRequest[];
};


const Header = ({ setIsCreateStudentOpen }: MyComponentProps) => {
    const StatsCardList = [
        {
            title: 'Demandes en attente',
            value: 1,
            description: 'Inscriptions à traiter',
            Icon: <Clock className="h-6 w-6 text-muted-foreground" />,
        },
        {
            title: 'Étudiants actifs',
            value: 2,
            description: 'Actuellement inscrits',
            Icon: <Users className="h-6 w-6 text-muted-foreground" />,
        },
        {
            title: 'Diplômés',
            value: 2,
            description: 'Cette année',
            Icon: <GraduationCap className="h-6 w-6 text-muted-foreground" />,
        },
        {
            title: 'Moyenne générale',
            value: 13.8,
            description: 'Tous étudiants confondus',
            Icon: <Award className="h-6 w-6 text-muted-foreground" />,
        },
    ]
  return (
    <>
        
        {/* Header */}
        <div className="flex flex-col gap-4 w-full">
            {/* Bloc texte prend toute la largeur */}
            <div className="w-full">
                <h2 className="text-2xl sm:text-3xl font-medium tracking-tight w-full">
                Gestion des Étudiants
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base w-full">
                Gestion des inscriptions, étudiants actuels et diplômés
                </p>
            </div>

            <div className="flex gap-2 w-full justify-end">
                <Button variant="outline" className="text-sm w-full sm:w-fit flex-1 sm:flex-none">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                </Button>
                <Button variant="outline" className="text-sm w-full sm:w-fit flex-1 sm:flex-none">
                    <Upload className="h-4 w-4 mr-2" />
                    Importer
                </Button>
                <Button
                    onClick={() => setIsCreateStudentOpen(true)}
                    variant="info"
                    className="text-sm w-full sm:w-fit flex-1 sm:flex-none"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvel étudiant
                </Button>
            </div>


        </div>



        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4">
            {StatsCardList.map((card) => (
                <Card key={uuidv4()}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
                        {card.Icon}
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold">{card.value}</div>
                        <p className="text-muted-foreground">{card.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>

    </>
  )
}

export default Header
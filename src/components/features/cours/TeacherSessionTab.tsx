/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserStore } from "@/store/useAuthStore";
import { getTeacherSchedule } from "@/actions/planificationAction";
import { IGetSchedule } from "@/types/planificationType";
import { showToast } from "@/components/ui/showToast";
import TeacherSessionCard from "./Card/TeacherSessionCard";
import { getWeekRange } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface MyProps {
  sessionList: unknown[];
  courseList: unknown[];
}

const TeacherSessionTab = ({ sessionList, courseList }: MyProps) => {
  const [teacherSessions, setTeacherSessions] = useState<IGetSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUserStore();

  const getTeacherSessions = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        const { start, end } = getWeekRange();
        const result = await getTeacherSchedule(
          user.user.user_code,
          start,
          end
        );
        if (result.code === "success") {
          setTeacherSessions(result.data.body || []);
        } else {
          showToast({
            variant: "error-solid",
            message: "Erreur lors de la récupération des données",
            description:
              "Une erreur est survenue lors de la récupération des données. Veuillez réessayer ultérieurement.",
            position: "top-center",
          });
        }
      } catch (error) {
        showToast({
          variant: "error-solid",
          message: "Erreur inattendue",
          description:
            "Impossible de charger vos séances pour le moment. Veuillez réessayer.",
          position: "top-center",
        });
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    getTeacherSessions();
  }, [getTeacherSessions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prochaines séances</CardTitle>
        <CardDescription>
          Vos cours et travaux dirigés/TP à venir
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Loader corporate */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            <span className="ml-3 text-gray-600 text-sm">
              Chargement de vos séances en cours...
            </span>
          </div>
        )}

        {/* Pas de session trouvée */}
        {!loading && teacherSessions.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            <p className="font-medium text-gray-700">
              Aucune séance planifiée cette semaine
            </p>
            <p className="mt-1 text-gray-500">
              Vous serez notifié dès que vos prochaines séances seront
              disponibles.
            </p>
          </div>
        )}

        {/* Liste des sessions */}
        {!loading && teacherSessions.length > 0 && (
          <div className="space-y-4">
            {teacherSessions.map((session) => (
              <TeacherSessionCard
                refresh={getTeacherSessions}
                session={session}
                key={session.session_code}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeacherSessionTab;

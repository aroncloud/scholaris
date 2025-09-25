/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";
import { IGetSchedule } from "@/types/planificationType";
import {
  getCurriculumSchedule,
  getResourceSchedule,
  getTeacherSchedule,
} from "@/actions/planificationAction";
import { useFactorizedProgramStore } from "@/store/programStore";
import Calendar, {
  convertIntoFullCalendarFormat,
  IFullCalendarEvent,
} from "@/components/features/planification/Calendar/CalendarPlanification";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PLANIFICATION_FILTER } from "@/constant";
import { PlanificationStatus, Teacher } from "@/types/teacherTypes";
import { useTeacherStore } from "@/store/useTeacherStore";
import { useClassroomStore } from "@/store/useClassroomStore";
import { IGetClassroom } from "@/types/classroomType";

interface FilterItem {
  value: string;
  label: string;
}

export default function CoursePlanningTab() {
  const [selectedFilter, setSelectedFilter] = useState(PLANIFICATION_FILTER[0]);
  const [subFilterValue, setSubFilterValue] = useState<FilterItem[]>([]);
  const [selectedSubFilter, setSelectedSubFilter] = useState<FilterItem | null>(
    null
  );
  const [timetableData, setTimetableData] = useState<IGetSchedule[]>([]);
  const [isLoadingCalendarData, setIsLoadingCalendarData] = useState(false);

  const { factorizedPrograms } = useFactorizedProgramStore();
  const { teacherList } = useTeacherStore();
  const { classrooms } = useClassroomStore();

  // Mettre à jour les sous-filtres selon le filtre principal
  useEffect(() => {
    const key = String(selectedFilter.value);

    switch (key) {
      case String(PlanificationStatus.CURRICULUM):
        setSubFilterValue(
          factorizedPrograms
            .flatMap((fp) => fp.curriculums || [])
            .map((curr) => ({ value: curr.curriculum_code, label: curr.curriculum_name }))
        );
        break;

      case String(PlanificationStatus.TEACHER):
        setSubFilterValue(
          teacherList.map((t: Teacher) => ({
            value: String(t.user_code),
            label: `${t.last_name ?? ""} ${t.first_name ?? ""}`.trim(),
          }))
        );
        break;

      case String(PlanificationStatus.RESSOURCE):
        setSubFilterValue(
          classrooms.map((r: IGetClassroom) => ({
            value: String(r.resource_code),
            label: r.resource_name,
          }))
        );
        break;

      default:
        setSubFilterValue([]);
        break;
    }

    setSelectedSubFilter(null); // reset sous-filtre à chaque changement de filtre
  }, [selectedFilter, factorizedPrograms, teacherList, classrooms]);

  // Fonction pour récupérer les données filtrées
  const fetchFilteredData = useCallback(
    async (start: string, end: string) => {
      if (!selectedSubFilter?.value) {
        console.log("Pas de sous-filtre sélectionné");
        setTimetableData([]);
        return;
      }

      const key = String(selectedFilter.value);
      setIsLoadingCalendarData(true);
      console.log("Fetching data for:", { key, subFilter: selectedSubFilter.value, start, end });

      try {
        let result: any;

        switch (key) {
          case String(PlanificationStatus.CURRICULUM):
            result = await getCurriculumSchedule(selectedSubFilter.value, start, end);
            break;
          case String(PlanificationStatus.TEACHER):
            result = await getTeacherSchedule(selectedSubFilter.value, start, end);
            break;
          case String(PlanificationStatus.RESSOURCE):
            result = await getResourceSchedule(selectedSubFilter.value, start, end);
            break;
          default:
            result = null;
            break;
        }

        console.log("API Result:", result);

        if (result?.code === "success") {
          setTimetableData(result.data.body || []);
        } else {
          setTimetableData([]);
          console.error("Erreur API:", result?.error);
        }
      } catch (err) {
        console.error("Erreur récupération calendrier :", err);
        setTimetableData([]);
      } finally {
        setIsLoadingCalendarData(false);
      }
    },
    [
      selectedSubFilter?.value,
      selectedFilter?.value,
      setTimetableData,
      setIsLoadingCalendarData,
    ]
  );

  // Centraliser les dates du mois courant
  const getMonthRange = () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
    return { start, end };
  };

  // Recharge le calendrier quand filtre ou sous-filtre changent
  useEffect(() => {
    if (selectedSubFilter?.value) {
      const { start, end } = getMonthRange();
      fetchFilteredData(start, end);
    } else {
      setTimetableData([]);
    }
  }, [fetchFilteredData, selectedFilter, selectedSubFilter]);

  // Fonction de refresh pour le calendrier
  const handleRefreshData = async () => {
    if (selectedSubFilter?.value) {
      const { start, end } = getMonthRange();
      await fetchFilteredData(start, end);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Calendriers de séquences
        </CardTitle>
        <CardDescription className="text-gray-600">
          Dates de début et fin de chaque séquence par filière et niveau
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Filtre principal */}
          <div className="space-y-1">
            <Label>Filtrer par <span className="text-red-600">*</span></Label>
            <Select
              value={selectedFilter.value}
              onValueChange={(value) => {
                const newFilter = PLANIFICATION_FILTER.find((f) => f.value === value) || PLANIFICATION_FILTER[0];
                setSelectedFilter(newFilter);
                setTimetableData([]); // Reset des données
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisissez un filtre" />
              </SelectTrigger>
              <SelectContent>
                {PLANIFICATION_FILTER.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sous-filtre */}
          {subFilterValue.length > 0 && (
            <div className="space-y-1">
              <Label>Choisissez une valeur <span className="text-red-600">*</span></Label>
              <Select
                value={selectedSubFilter?.value || ""}
                onValueChange={(value) => {
                  const selected = subFilterValue.find((f) => f.value === value) || null;
                  setSelectedSubFilter(selected);
                  if (!selected) {
                    setTimetableData([]); // Reset des données si pas de sélection
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisissez une valeur" />
                </SelectTrigger>
                <SelectContent>
                  {subFilterValue.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Indicateur de chargement */}
        {isLoadingCalendarData && (
          <div className="text-center py-8">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-gray-100">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Chargement du calendrier...
            </div>
          </div>
        )}

        {/* Calendrier */}
        {!isLoadingCalendarData && (
          <Calendar
            events={convertIntoFullCalendarFormat(
              timetableData.map((item) => ({
                ...item,
                resource_code:
                  classrooms.find((c) => c.resource_code === item.resource_code)?.resource_name ?? "",
                teacher_user_code:
                  teacherList.find((t) => t.user_code === item.teacher_user_code)?.last_name ?? "",
              }))
            ) as IFullCalendarEvent[]}
            onDateChange={fetchFilteredData}
            curriculum_code={
              String(selectedFilter.value) === String(PlanificationStatus.CURRICULUM) 
                ? selectedSubFilter?.value ?? null 
                : null
            }
            refreshData={handleRefreshData}
          />
        )}

        {/* Message si pas de sous-filtre sélectionné */}
        {!isLoadingCalendarData && subFilterValue.length > 0 && !selectedSubFilter && (
          <div className="text-center py-8 text-gray-500">
            Veuillez sélectionner une valeur pour afficher le calendrier
          </div>
        )}

        {/* Message si pas de données */}
        {!isLoadingCalendarData && selectedSubFilter && timetableData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucune session trouvée pour cette sélection
          </div>
        )}
      </CardContent>
    </Card>
  );
}
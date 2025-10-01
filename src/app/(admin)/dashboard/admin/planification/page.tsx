/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react"; // Importer une icône pour le chargement
import {  IGetSchedule } from "@/types/planificationType";
import { getCurriculumSchedule, getResourceSchedule, getTeacherSchedule } from "@/actions/planificationAction";
import { useFactorizedProgramStore } from "@/store/programStore";
import Calendar, { convertIntoFullCalendarFormat, IFullCalendarEvent } from "@/components/features/planification/Calendar/CalendarPlanification";
import { Label } from "@/components/ui/label";
import { PLANIFICATION_FILTER } from "@/constant";
import { PlanificationStatus, Teacher } from "@/types/teacherTypes";
import { useTeacherStore } from "@/store/useTeacherStore";
import { useClassroomStore } from "@/store/useClassroomStore";
import { IGetClassroom } from "@/types/classroomType";
import ContentLayout from "@/layout/ContentLayout";
import PageHeader from "@/layout/PageHeader";
import { Combobox } from "@/components/ui/Combobox";

interface FilterItem {
  value: string;
  label: string;
}

export default function CoursePlanningTab() {
  const [selectedFilter, setSelectedFilter] = useState(PLANIFICATION_FILTER[0]);
  const [subFilterValue, setSubFilterValue] = useState<FilterItem[]>([]);
  const [selectedSubFilter, setSelectedSubFilter] = useState<FilterItem | null>(null);
  const [timetableData, setTimetableData] = useState<IGetSchedule[]>([]);
  const [isLoadingCalendarData, setIsLoadingCalendarData] = useState(false);
  
  const { factorizedPrograms} = useFactorizedProgramStore();
  const {teacherList} = useTeacherStore();
  const {classrooms} = useClassroomStore();

  const getFilteredResult = useCallback(async (start: string, end: string) => {
    if (!selectedSubFilter) {
      setTimetableData([]);
      return
    };

    const key = String(selectedFilter.value);
    setIsLoadingCalendarData(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let result: any;
      switch (key) {
        case String(PlanificationStatus.CURRICULUM):
          result = await getCurriculumSchedule(selectedSubFilter.value, start, end);
          if (result.code === "success") setTimetableData(result.data.body);
          break;
        case String(PlanificationStatus.TEACHER):
          result = await getTeacherSchedule(selectedSubFilter.value, start, end);
          if (result?.code === "success") setTimetableData(result.data.body);
          break;
        case String(PlanificationStatus.RESSOURCE):
          result = await getResourceSchedule(selectedSubFilter.value, start, end);
          if (result?.code === "success") setTimetableData(result.data.body);
          break;
        default:
          setSubFilterValue([]);
          setIsLoadingCalendarData(false);
          return;
      }
    } catch (error) {
      console.error(error);
      // Optionnel: ajouter un toast pour notifier l'utilisateur de l'erreur
    } finally {
      setIsLoadingCalendarData(false);
    }
  }, [selectedFilter, selectedSubFilter]);

  useEffect(() => {
    setTimetableData([])
    const key = String(selectedFilter.value);
    switch (key) {
      case String(PlanificationStatus.CURRICULUM): {
        const allCurriculums = (factorizedPrograms || []).flatMap((fp) => fp.curriculums || []);
        setSubFilterValue(allCurriculums.map((curr) => ({ value: curr.curriculum_code, label: curr.curriculum_name })));
        break;
      }
      case String(PlanificationStatus.TEACHER): {
        setSubFilterValue((teacherList || []).map((t: Teacher) => ({ value: String(t.user_code), label: `${t?.first_name ?? ""} ${t?.last_name ?? ""}`.trim() })));
        break;
      }
      case String(PlanificationStatus.RESSOURCE): {
        setSubFilterValue((classrooms || []).map((r: IGetClassroom) => ({ value: String(r.resource_code), label: r.resource_name })));
        break;
      }
      default:
        setSubFilterValue([]);
        break;
    }
  }, [selectedFilter, classrooms, factorizedPrograms, teacherList]);

  useEffect(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0];
    getFilteredResult(start, end);
  }, [getFilteredResult, selectedFilter]);

  const loadCalendarData = async (curriculum_code: string | null) =>{
    if(curriculum_code) {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0];
      const result = await getCurriculumSchedule(curriculum_code, start, end);
      if (result.code === "success") {
        setTimetableData(result.data.body);
      }
    }
  }

  return (
    <>
      <PageHeader
          title="Calendriers de séquences"
          description="Dates de début et fin de chaque séquence par filière et niveau"
      />
      <div className="p-6">
        <ContentLayout>
          <div className="text-gray-700 bg-white p-4 sm:p-6 rounded-lg shadow">
            <div>
              <div className="flex flex-col mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="sequence_code" className="mb-1 font-bold text-lg">Filtrer par <span className="text-red-600">*</span></Label>
                    <Combobox
                      options={PLANIFICATION_FILTER}
                      value={selectedFilter.value || ""}
                      onChange={(value) => {
                        setSelectedFilter(PLANIFICATION_FILTER.find(filter => filter.value === value) || PLANIFICATION_FILTER[0])
                        setSelectedSubFilter(null);
                        setSubFilterValue([]);
                      }}
                      placeholder="Sélectionner un cours"
                      className='py-5'
                    />
                  </div>
                  { subFilterValue.length > 0 &&
                    <div className="space-y-1">
                      <Label htmlFor="sequence_code" className="mb-1 font-bold text-lg">Veuillez choisir une valeur <span className="text-red-600">*</span></Label>
                      <Combobox
                        options={subFilterValue}
                        value={selectedSubFilter?.value || ""}
                        onChange={(value) => {
                          const selected = subFilterValue.find(f => f.value === value) || null;
                          setSelectedSubFilter(selected);
                        }}
                        placeholder="Choisissez une séquence"
                        className='py-5'
                      />
                    </div>
                  }
                </div>
              </div>

              {/* ----- DÉBUT DES MODIFICATIONS POUR L'EXPÉRIENCE DE CHARGEMENT ----- */}

              <div className="relative min-h-[500px]">
                {/* 1. L'indicateur de chargement en superposition */}
                {isLoadingCalendarData && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center space-y-4 bg-white/80 backdrop-blur-sm rounded-md">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                    <p className="text-lg font-semibold text-gray-700">Chargement des données...</p>
                  </div>
                )}
                
                {/* 2. Affichage conditionnel : soit le calendrier, soit un message guide */}
                {selectedSubFilter ? (
                  // Le bloc Calendar est exactement le même, non modifié.
                  <Calendar
                    events={convertIntoFullCalendarFormat(
                      timetableData.map(item => {
                        return {
                          ...item,
                          resource_code: classrooms.find(c => c.resource_code === item.resource_code)?.resource_name ?? "",
                          teacher_user_code: teacherList.find(t => t.user_code === item.teacher_user_code)?.last_name ?? "",
                        }
                      }) 
                    ) as IFullCalendarEvent[]}
                    onDateChange={getFilteredResult}
                    curriculum_code={String(selectedFilter.value) == PlanificationStatus.CURRICULUM ? selectedSubFilter ? selectedSubFilter?.value : null : null}
                    refreshData={loadCalendarData}
                  />
                ) : (
                  // Message affiché quand aucun sous-filtre n'est sélectionné
                  <div className="flex h-full min-h-[500px] items-center justify-center rounded-lg border-2 border-dashed bg-gray-50">
                    <p className="text-center text-lg text-gray-500">
                      Veuillez sélectionner un filtre et une valeur pour afficher le calendrier.
                    </p>
                  </div>
                )}
              </div>

              {/* ----- FIN DES MODIFICATIONS ----- */}
            </div>
          </div>
        </ContentLayout>
      </div>
    </>
  );
}
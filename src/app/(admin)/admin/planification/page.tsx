/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useCallback, useEffect, useState } from "react";
import { ICreateSession, IGetSchedule } from "@/types/planificationType";
import { getCurriculumSchedule, getResourceSchedule, getTeacherSchedule } from "@/actions/planificationAction";
import { useFactorizedProgramStore } from "@/store/programStore";
import Calendar, { convertIntoFullCalendarFormat, IFullCalendarEvent } from "@/components/features/planification/Calendar/CalendarPlanification";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PLANIFICATION_FILTER } from "@/constant";
import { PlanificationStatus, Teacher } from "@/types/teacherTypes";
import { useTeacherStore } from "@/store/useTeacherStore";
import { useClassroomStore } from "@/store/useClassroomStore";
import { IGetClassroom } from "@/types/classroomType";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
          result = await getCurriculumSchedule(
            selectedSubFilter.value,
            start,
            end
          );
          console.log("CURRICULUM.result", result);
          if (result.code === "success") {
            setTimetableData(result.data.body);
          }
          break;

        case String(PlanificationStatus.TEACHER):
          result = await getTeacherSchedule(
            selectedSubFilter.value,
            start,
            end
          );
          console.log("TEACHER.result", result);
          if (result?.code === "success") {
            setTimetableData(result.data.body);
          }
          break;

        case String(PlanificationStatus.RESSOURCE):
          result = await getResourceSchedule(
            selectedSubFilter.value,
            start,
            end
          );
          console.log("RESSOURCE.result", result);
          if (result?.code === "success") {
            setTimetableData(result.data.body);
          }
          break;

        default:
          setSubFilterValue([]);
          setIsLoadingCalendarData(false);
          return;
      }

      if (result?.code === "success") {
        console.log("result", result);
      }
    } catch (error) {
      console.error(error);
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

        setSubFilterValue(
          allCurriculums.map((curr) => ({
            value: curr.curriculum_code,
            label: curr.curriculum_name,
          }))
        );
        break;
      }

      case String(PlanificationStatus.TEACHER): {
        setSubFilterValue(
          (teacherList || []).map((t: Teacher) => ({
            value: String(t.user_code),
            label: t.last_name ?? `${t.first_name ?? ""} ${t.last_name ?? ""}`.trim(),
          }))
        );
        break;
      }

      case String(PlanificationStatus.RESSOURCE): {
        setSubFilterValue(
          (classrooms || []).map((r: IGetClassroom) => ({
            value: String(r.resource_code),
            label: r.resource_name,
          }))
        );
        break;
      }

      default:
        setSubFilterValue([]);
        break;
    }

  }, [selectedFilter, classrooms, factorizedPrograms, teacherList]);

  useEffect(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split("T")[0];

    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
    getFilteredResult(start, end);
  }, [getFilteredResult, selectedFilter]);


  const loadCalendarData = async (curriculum_code: string | null) =>{
      console.log('-->loadCalendarData.curriculum_code', curriculum_code)
    if(curriculum_code) {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];

      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0];
      const result = await getCurriculumSchedule(
        curriculum_code,
        start,
        end
      );
      console.log("CURRICULUM.result", result);
      
      if (result.code === "success") {
        setTimetableData(result.data.body);
      }
    }
  }
  


  return (
    <Card className="w-full p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Calendriers de séquences
        </CardTitle>
        <CardDescription className="text-gray-600">
          Dates de début et fin de chaque séquence par filière et niveau
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="text-gray-700 bg-white">
          <div>
            <div className="flex flex-col mb-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Code séquence */}
                <div className="space-y-1">
                  <Label htmlFor="sequence_code">Filtrer par <span className="text-red-600">*</span></Label>
                  <Select
                    value={selectedFilter.value || ""}
                    onValueChange={(value) => {
                      setSelectedFilter(PLANIFICATION_FILTER.find(filter => filter.value === value) || PLANIFICATION_FILTER[0])
                      setSelectedSubFilter(null);
                      setSubFilterValue([]);
                    }}
                  >
                      <SelectTrigger className={`w-full`}>
                          <SelectValue placeholder="Choisissez une séquence" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                          {PLANIFICATION_FILTER.map(filter => (
                              <SelectItem
                                  key={filter.value}
                                  value={filter.value}
                              >
                                  {filter.label}
                              </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                </div>
                { subFilterValue.length > 0 &&
                  <div className="space-y-1">
                    <Label htmlFor="sequence_code">Veillez choisir une valeur <span className="text-red-600">*</span></Label>
                    
                    <Select
                      value={selectedSubFilter?.value || ""}
                      onValueChange={(value) => {
                        const selected = subFilterValue.find(f => f.value === value) || null;
                        setSelectedSubFilter(selected);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisissez une séquence" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {subFilterValue.map(filter => (
                          <SelectItem key={filter.value} value={filter.value}>
                            {filter.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select> 
                  </div>
                }

              </div>
            </div>
            <div>
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
            </div>
          </div>
        </div>
      </CardContent>
  </Card>
  );
}

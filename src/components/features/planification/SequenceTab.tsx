/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { CardContent } from "@/components/ui/card";
// import { DialogCreateSession } from "./Modal/DialogCreateSequence";
import { useCallback, useEffect, useState } from "react";
import { ICreateSession, IGetSchedule } from "@/types/planificationType";
import { showToast } from "@/components/ui/showToast";
import { useClassroomData } from "@/hooks/feature/classroom/useClassroomData";
import { createSession, getCurriculumSchedule, getResourceSchedule, getTeacherSchedule } from "@/actions/planificationAction";
import { useFactorizedProgramStore } from "@/store/programStore";
import { useAcademicYearSchedules } from "@/hooks/feature/planifincation/useAcademicYearSchedules";
import Calendar, { convertIntoFullCalendarFormat, IFullCalendarEvent } from "@/components/features/planification/Calendar/CalendarPlanification";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PLANIFICATION_FILTER } from "@/constant";
import { PlanificationStatus, Teacher } from "@/types/teacherTypes";
import { useTeacherStore } from "@/store/useTeacherStore";
import { useClassroomStore } from "@/store/useClassroomStore";
import { IGetClassroom } from "@/types/classroomType";
import { getUEListPerCurriculum } from "@/actions/programsAction";
import { IGetUEPerModule } from "@/types/programTypes";

interface FilterItem {
  value: string;
  label: string;
}



export default function SequenceTab() {
  const [isCreateSequenceDialogOpen, setIsCreateSequenceDialogOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(PLANIFICATION_FILTER[0]);
  const [subFilterValue, setSubFilterValue] = useState<FilterItem[]>([]);
  const [selectedSubFilter, setSelectedSubFilter] = useState<FilterItem | null>(null);
  const [timetableData, setTimetableData] = useState<IGetSchedule[]>([]);
  const [isLoadingCalendarData, setIsLoadingCalendarData] = useState(false);
  const [fetchedUEList, setFetchedUEList] = useState<IGetUEPerModule[]>([])
  
  const {data} = useClassroomData();
  const {UEPerCurriculumList, factorizedPrograms} = useFactorizedProgramStore();
  const { academicYearSchedule } = useAcademicYearSchedules();
  const {teacherList} = useTeacherStore();
  const {classrooms} = useClassroomStore();

  useEffect(() => {
    const key = String(selectedFilter.value);

    switch (key) {
      case String(PlanificationStatus.CURRICULUM): {
        const allCurriculums = (factorizedPrograms || [])
          .flatMap((fp) => fp.curriculums || []);

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

  }, [selectedFilter, UEPerCurriculumList, academicYearSchedule, classrooms, factorizedPrograms, teacherList]);

  const getFilteredResult = useCallback(async (start: string, end: string) => {
    if (!selectedSubFilter) return;

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
          if (result?.code === "success") {
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
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split("T")[0];

    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
    getFilteredResult(start, end);
  }, [getFilteredResult, selectedFilter]);

  const handleSesionsession = async (session: ICreateSession) => {
    console.log('session', session)
    const result = await createSession(session);
    console.log("Create session result:", result);

    if (result.code === 'success') {
      setIsCreateSequenceDialogOpen(false);
      showToast({
        variant: "success-solid",
        message: 'Seqie,ce de classe créé avec succès',
        description: `${session.session_title} a été ajouté.`,
        position: 'top-center',
      });
      console.log('before refresh')
      
      
      console.log('after refresh')
      return true
    } else {
      showToast({
        variant: "error-solid",
        message: "Impossible de créer la salle de classe",
        description:result.error ?? "Une erreur est survenue, essayez encore ou veuillez contacter l'administrateur",
        position: 'top-center',
      });
    }
    return false
  };

  const initCalendar = async (curriculum_code: string | null) =>{
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split("T")[0];

    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
    const result = await getCurriculumSchedule(
      curriculum_code ?? "CURR_TPMS_Y1",
      start,
      end
    );
    console.log("CURRICULUM.result", result);
    if (result?.code === "success") {
      setTimetableData(result.data.body);
    }
  }
  
  useEffect(() => {
    const key = String(selectedFilter.value);
    console.log('-->key', key)
    if(key ==  PlanificationStatus.CURRICULUM) {
      if(selectedSubFilter)
        getUEInfo(selectedSubFilter.value)
    }
  }, [selectedSubFilter, selectedFilter]);

  const getUEInfo = async (curriculum_code: string) => {
    const UEResult = await getUEListPerCurriculum(curriculum_code)
    console.log('UEResult', UEResult)
    if (UEResult.code == 'success') {
      setFetchedUEList(UEResult.data.body);
    }
  }


  return (
    <div className="text-gray-700">
      <CardContent>
        <div className="flex flex-col mb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Calendriers de séquences
            </h1>
            <p className="text-gray-600">
              Dates de début et fin de chaque séquence par filière et niveau
            </p>
          </div>
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
            UEList={fetchedUEList}
            curriculum_code={String(selectedFilter.value) == PlanificationStatus.CURRICULUM ? selectedSubFilter ? selectedSubFilter?.value : null : null}
            course_unit_code={null}
            refreshData={initCalendar}
          />
        </div>
      </CardContent>

      {/* <DialogCreateSession
        open = {isCreateSequenceDialogOpen}
        onSave={handleSesionsession}
        onOpenChange={setIsCreateSequenceDialogOpen}
        teachers={teacherList}
        classrooms={data}
        UEPerCurriculumList={UEPerCurriculumList}
        academicYearSchedule={academicYearSchedule}
        factorizedPrograms={factorizedPrograms}
      /> */}
    </div>
  );
}

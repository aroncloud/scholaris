"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  EventContentArg,
} from "@fullcalendar/core";
import { ICreateSession, IGetSchedule } from "@/types/planificationType";
import { CALENDAR_COLORS } from "@/constant";
import { format } from "date-fns";
import { IGetUEPerModule } from "@/types/programTypes";
import { DialogCreateSession } from "../Modal/DialogCreateSession";
import { createSession } from "@/actions/planificationAction";
import { showToast } from "@/components/ui/showToast";


export interface IFullCalendarEvent extends EventInput {
  id: string;
  title: string;
  teacher: string;
  classroom: string;
  start: string; // ISO string
  end: string;   // ISO string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extendedProps?: Record<string, any>;
}

interface CalendarPlanificationProps {
  events: IFullCalendarEvent[];
  onDateChange: (start: string, end: string) => Promise<void>;
  UEList: IGetUEPerModule[];
  curriculum_code: string | null;
  course_unit_code: string | null;
  refreshData: (curriculum_code: string | null) => Promise<void>;
}

export function convertIntoFullCalendarFormat(sessions: IGetSchedule[]): IFullCalendarEvent[] {
  return sessions.map((session) => ({
    id: session.session_code,
    title: session.session_title,
    start: new Date(session.start_time).toJSON(),
    end: new Date(session.end_time).toJSON(),
    classroom: session.resource_code,
    teacher: session.teacher_user_code,
    extendedProps: { calendar: "Success" },
  }));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CalendarPlanification: React.FC<CalendarPlanificationProps> = ({ events: propsEvents, onDateChange, curriculum_code, course_unit_code, refreshData }) => {
  const [events, setEvents] = useState<IFullCalendarEvent[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);


  useEffect(() => {
    if (propsEvents && propsEvents.length > 0) {
      console.log('-->propsEvents', propsEvents)
      setEvents(propsEvents);
    }
  }, [propsEvents]);




  const handleAddEvent = async (session: ICreateSession) => {
    console.log('session', session)
    const result = await createSession(
      {
        ...session, 
        end_time: session.end_time + 'Z',
        start_time: session.start_time + 'Z',
      }
    );
    console.log("Create Session result:", result);

    if (result.code === 'success') {
      setIsOpen(false);
      showToast({
        variant: "success-solid",
        message: 'Session programméé avec succès',
        description: `La session ${session.session_title} a été programméé avec succès.`,
        position: 'top-center',
      });

      refreshData(session.curriculum_code)
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

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          selectable={true}
          eventContent={renderEventContent}
          customButtons={{
            addEventButton: {
              text: "Add Event +",
              click: () => setIsOpen(true),
            },
          }}
          datesSet={async (dateInfo) => {
            const start = format(dateInfo.start, "yyyy-MM-dd");
            const end = format(dateInfo.end, "yyyy-MM-dd");
            console.log("Nouvelle plage :", start, end);
            await onDateChange(start, end);
          }}
        />
      </div>



      <DialogCreateSession
        open={isOpen}
        onOpenChange={setIsOpen}
        onSave={handleAddEvent}
        // curriculum_code={curriculum_code}
        // course_unit_code={course_unit_code}
      />
    </div>
  );
};


const titleColorMap: Record<string, string> = {};

const getColorForTitle = (title: string) => {
  if (!titleColorMap[title]) {
    const randomColor = CALENDAR_COLORS[Math.floor(Math.random() * CALENDAR_COLORS.length)];
    titleColorMap[title] = randomColor;
  }
  return titleColorMap[title];
};

export const renderEventContent = (eventInfo: EventContentArg) => {
  const colorClass = `fc-bg-${getColorForTitle(eventInfo.event.title)}`;

  return (
    <div
      className={`event-fc-color fc-event-main ${colorClass} rounded-md text-xs leading-tight`}
    >
      <ul className="list-disc pl-5 space-y-1 py-2">
        <li className="font-semibold text-gray-900 break-words whitespace-normal">
          {eventInfo.event.title}
        </li>
        <li className="text-gray-700 capitalize break-words whitespace-normal">
          {eventInfo.event.extendedProps.teacher}
        </li>
        <li className="text-gray-700 break-words whitespace-normal">
          {eventInfo.event.extendedProps.classroom}
        </li>
      </ul>
    </div>
  );
};



export default CalendarPlanification;

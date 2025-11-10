"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from '@fullcalendar/core/locales/fr';
import {
  EventInput,
  EventContentArg,
  EventClickArg,
} from "@fullcalendar/core";
import { ICreateSession, IGetSchedule } from "@/types/planificationType";
import { CALENDAR_COLORS, SESSION_STATUS_TERMINATED } from "@/constant";
import { format } from "date-fns";
import { cancelSession, createSession, updateSession } from "@/actions/planificationAction";
import { showToast } from "@/components/ui/showToast";
import { DialogUpdateSession } from "../Modal/DialogUpdateSession";
import { DialogCreateSession } from "../Modal/DialogCreateSession";
import { IUpdateSessionForm } from "@/types/programTypes";


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
  curriculum_code: string | null;
  refreshData: (curriculum_code: string | null) => Promise<void>;
}

export function convertIntoFullCalendarFormat(sessions: IGetSchedule[]): IFullCalendarEvent[] {
  return sessions.filter(session => (session.status_code != SESSION_STATUS_TERMINATED)).map((session) => ({
    id: session.session_code,
    title: session.session_title,
    start: session.start_time,
    end: session.end_time,
    classroom: session.resource_code,
    teacher: session.teacher_user_code,
    extendedProps: {
      calendar: "Success",
      course_unit_code: session.course_unit_code,
      schedule_code: session.schedule_code,
      teacher_user_code: session.teacher_user_code,
      resource_code: session.resource_code,
    },
  }));
}

const CalendarPlanification: React.FC<CalendarPlanificationProps> = ({ events: propsEvents, onDateChange, curriculum_code, refreshData }) => {
  const [events, setEvents] = useState<IFullCalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<IFullCalendarEvent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    console.log("-->curriculum_code", curriculum_code)
  }, [curriculum_code])

  useEffect(() => {
    if (propsEvents && propsEvents.length > 0) {
      setEvents(propsEvents);
    } else{
      setEvents([]);
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

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    const currentEvent = {
      id: event.id,
      title: event.title,
      start: event.start?.toISOString() ?? "",
      end: event.end?.toISOString() ?? "",
      classroom: event.extendedProps.classroom,
      teacher: event.extendedProps.teacher,
      extendedProps: event.extendedProps,
    } as IFullCalendarEvent
    setSelectedEvent(currentEvent);

    setIsUpdateOpen(true);
  };

  const handleCancelEvent = async () => {
    if(selectedEvent) {
      console.log('session canceled', selectedEvent.id)
      const result = await cancelSession(selectedEvent.id);
      console.log("Create Session result:", result);

      if (result.code === 'success') {
        setIsOpen(false);
        showToast({
          variant: "success-solid",
          message: 'Session programméé avec succès',
          description: `La session ${selectedEvent.title} a été annulée avec succès.`,
          position: 'top-center',
        });

        refreshData(curriculum_code)
        return true
      } else {
        showToast({
          variant: "error-solid",
          message: "Echec de l'action",
          description:result.error ?? "Une erreur est survenue. Essayer encore ou veillez contacter l'administrateur",
          position: 'top-center',
        });
      }
    }
      return false
  };


  const handleSaveEvent = async (session: IUpdateSessionForm) => {
    console.log('handleSaveEvent.session', session)
    if(selectedEvent) {
      const result = await updateSession(session, selectedEvent.id);
      console.log("handleSaveEvent result:", result);

      if (result.code === 'success') {
        setIsOpen(false);
        showToast({
          variant: "success-solid",
          message: 'Session mise à jour avec succès',
          description: `La session ${session.session_title} a été mise à jour avec succès.`,
          position: 'top-center',
        });

        refreshData(curriculum_code)
        return true
      } else {
        showToast({
          variant: "error-solid",
          message: "Impossible de créer la salle de classe",
          description:result.error ?? "Une erreur est survenue, essayez encore ou veuillez contacter l'administrateur",
          position: 'top-center',
        });
      }
    }
    return false
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"

          // Configuration pour le format 24h et français
          locale={frLocale}
          timeZone="UTC"
          slotMinTime="06:00:00"
          slotMaxTime="18:30:00"
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // Format 24h
          }}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // Format 24h
          }}
          
          headerToolbar={{
            left: "prev,next addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          selectable={true}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          customButtons={{
            addEventButton: {
              text: "Planifier un cours +",
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
        curriculum_code={curriculum_code ?? ""}
      />

      <DialogUpdateSession
        eventData={selectedEvent}
        onCancelSession={handleCancelEvent}
        onOpenChange={setIsUpdateOpen}
        onSave={handleSaveEvent}
        open={isUpdateOpen}
      
      
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

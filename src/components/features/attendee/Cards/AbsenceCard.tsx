/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Absence } from "@/app/(admin)/admin/my-absences/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Calendar, Clock, Eye, MapPin, Send, User } from "lucide-react";
import { useState } from "react";


interface AbsenceCardProps {
  absence: Absence;
  onOpenJustification: (a: Absence) => void; // ouvre modal de justification / édition
  onViewJustification: (a: Absence) => void; // voir seulement
  formatDateToText: (d: string) => string;
}

export function AbsenceCard({
  absence,
  onOpenJustification,
  onViewJustification,
  formatDateToText,
}: AbsenceCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className=" shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          {/* LEFT: contenu principal */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 h-9 w-9 rounded-md bg-slate-50 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className=" font-semibold text-slate-900 truncate">
                        {absence.course_name}
                      </h4>
                      <span className="text-sm text-slate-500 truncate">
                        {absence.group_name ? `· ${absence.group_name}` : ""}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 truncate">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateToText(absence.session_date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {absence.start_time ?? "—"} • {absence.end_time ?? "—"}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {absence.room ?? "—"}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {absence.instructor_name ?? "—"}
                      </span>
                      {/* Statut intégré dans la meta */}
                      {/* <StatusBadge status={absence.justification_status} /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Justification */}
            {absence.justification_status !== "NOT_SUBMITTED" && (
              <div
                className={`mt-3 pl-3 border-l-2 border-slate-100 ${
                  expanded ? "pb-3" : "pb-0"
                }`}
              >
                <div className="min-w-0">
                  <div className=" text-slate-700 font-medium truncate">
                    {absence.justification_reason ?? "Motif non spécifié"}
                  </div>
                  <div className=" text-slate-600 mt-1 line-clamp-3">
                    {absence.justification_details ?? "Aucun détail fourni."}
                  </div>
                  {absence.submitted_at && (
                    <div className="text-sm text-slate-400 mt-1">
                      Soumise le {formatDateToText(absence.submitted_at)}
                    </div>
                  )}
                </div>

                {/* réponse (approbation/rejet) */}
                {absence.reviewer_comment && (
                  <div
                    className={`mt-3 p-3 rounded-md  ${
                      absence.justification_status === "APPROVED"
                        ? "bg-green-50 text-green-800"
                        : "bg-red-50 text-red-800"
                    }`}
                  >
                    <span className="font-medium">Réponse :</span>
                    <p className="mt-1">{absence.reviewer_comment}</p>
                  </div>
                )}

                {/* expand toggle */}
                {/* <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setExpanded((s) => !s)}
                    className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
                    aria-expanded={expanded}
                  >
                    {expanded ? (
                      <>
                        <ChevronsUp className="h-3 w-3" /> Masquer
                      </>
                    ) : (
                      <>
                        <ChevronsDown className="h-3 w-3" /> Lire la suite
                      </>
                    )}
                  </button>
                </div> */}
              </div>
            )}
          </div>

          {/* RIGHT: actions */}
          <div className="grid grid-cols-2 items-end gap-2 shrink-0">
            <Button
              size="sm"
              className="flex items-center gap-2"
              onClick={() => onOpenJustification(absence)}
              variant={
                absence.justification_status === "NOT_SUBMITTED"
                  ? "default"
                  : "outline"
              }
            >
              <Send className="h-4 w-4" />
              {absence.justification_status === "NOT_SUBMITTED"
                ? "Justifier"
                : "Modifier"}
            </Button>

            <Button
              size="sm"
              className="flex items-center gap-2"
              variant="secondary"
              onClick={() => onViewJustification(absence)}
            >
              <Eye className="h-4 w-4" />
              Détails
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
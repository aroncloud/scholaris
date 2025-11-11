import React from "react";
import { CheckCircle } from "lucide-react";
import { EvaluationSheet } from "@/types/examTypes";

interface EvaluationInfoProps {
  examSheet: EvaluationSheet;
}

export const EvaluationInfo: React.FC<EvaluationInfoProps> = ({ examSheet }) => {
  if (!examSheet?.evaluation || !examSheet?.students) return null;

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200 px-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
          <div>
            <p className="text-sm font-medium text-blue-900">{examSheet.evaluation.title}</p>
            <p className="text-sm text-blue-700">
              Coefficient: {examSheet.evaluation.coefficient} | Note max:{" "}
              {examSheet.evaluation.max_score} | {examSheet.students.length} étudiants
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

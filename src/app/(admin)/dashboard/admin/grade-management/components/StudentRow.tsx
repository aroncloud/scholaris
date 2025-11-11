import React from "react";
import Badge from "@/components/custom-ui/Badge";
import { IStudentEvaluationInfo } from "@/types/examTypes";
import { ScoreInput } from "./ScoreInput";

interface StudentRowProps {
  student: IStudentEvaluationInfo;
  maxScore: number;
  currentScore: number | null | undefined;
  isModified: boolean;
  onScoreChange: (studentCode: string, score: number) => void;
}

export const StudentRow = React.memo<StudentRowProps>(
  ({ student, maxScore, currentScore, isModified, onScoreChange }) => {
    return (
      <tr className="border-b hover:bg-gray-50">
        <td className="px-4 py-3">
          <div className="font-mono text-sm font-medium">{student.student_number}</div>
        </td>
        <td className="px-4 py-3">
          <div className="font-medium">
            {student.first_name} {student.last_name}
          </div>
        </td>
        <td className="px-4 py-3">
          <Badge
            value={student.graded ? "APPROVED" : "PENDING"}
            label={student.graded ? "APPROVED" : "PENDING"}
            size="sm"
          />
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center space-x-2">
            <ScoreInput
              enrollmentCode={student.enrollment_code}
              initialScore={currentScore}
              maxScore={maxScore}
              onScoreChange={onScoreChange}
              isModified={isModified}
              isGraded={student.graded}
              locale="fr"
            />
            <span className="text-sm text-muted-foreground">/ {maxScore}</span>
          </div>
        </td>
      </tr>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.student.enrollment_code === nextProps.student.enrollment_code &&
      prevProps.currentScore === nextProps.currentScore &&
      prevProps.maxScore === nextProps.maxScore &&
      prevProps.isModified === nextProps.isModified &&
      prevProps.student.graded === nextProps.student.graded &&
      prevProps.onScoreChange === nextProps.onScoreChange
    );
  }
);

StudentRow.displayName = "StudentRow";

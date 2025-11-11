import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface ScoreInputProps {
  enrollmentCode: string;
  initialScore: number | null | undefined;
  maxScore: number;
  onScoreChange: (studentCode: string, score: number) => void;
  isModified: boolean;
  isGraded: boolean;
  locale: "fr" | "en";
}

export const ScoreInput = React.memo<ScoreInputProps>(
  ({ enrollmentCode, initialScore, maxScore, onScoreChange, isModified, isGraded, locale }) => {
    const [localScore, setLocalScore] = useState(initialScore?.toString() || "");
    const [isValid, setIsValid] = useState(true);

    // Synchroniser avec le score initial
    useEffect(() => {
      setLocalScore(initialScore?.toString() || "");
    }, [initialScore]);

    const handleChange = (value: string) => {
      setLocalScore(value);

      if (value === "") {
        setIsValid(true);
        onScoreChange(enrollmentCode, 0);
        return;
      }

      const numericValue = parseFloat(value);

      if (isNaN(numericValue) || numericValue < 0 || numericValue > maxScore) {
        setIsValid(false);
        return;
      }

      setIsValid(true);
      onScoreChange(enrollmentCode, numericValue);
    };

    const getInputClassName = () => {
      let baseClass = "w-20 text-center";
      if (!isValid) {
        baseClass += " border-red-500 focus:border-red-500";
      } else if (isModified) {
        baseClass += " border-yellow-500 bg-yellow-50";
      } else if (isGraded) {
        baseClass += " border-green-500 bg-green-50";
      }
      return baseClass;
    };

    return (
      <div className="relative">
        <Input
          type="number"
          value={localScore}
          onChange={(e) => handleChange(e.target.value)}
          min={0}
          max={maxScore}
          step={0.5}
          className={getInputClassName()}
          placeholder="--"
        />
        {!isValid && (
          <div className="absolute -bottom-5 left-0 text-xs text-red-600">
            {locale === "fr" ? "Note invalide" : "Invalid score"}
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Ne re-render que si ces propriétés changent
    return (
      prevProps.enrollmentCode === nextProps.enrollmentCode &&
      prevProps.initialScore === nextProps.initialScore &&
      prevProps.maxScore === nextProps.maxScore &&
      prevProps.isModified === nextProps.isModified &&
      prevProps.isGraded === nextProps.isGraded &&
      prevProps.onScoreChange === nextProps.onScoreChange
    );
  }
);

ScoreInput.displayName = "ScoreInput";

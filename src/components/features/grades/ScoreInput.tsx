import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { IStudentEvaluationInfo } from '@/types/examTypes';

interface ScoreInputProps {
    student: IStudentEvaluationInfo;
    maxScore: number;
    onScoreChange: (studentCode: string, score: number) => void;
    isModified: boolean;
    locale: "fr" | "en";
}

export const ScoreInput: React.FC<ScoreInputProps> = ({
    student,
    maxScore,
    onScoreChange,
    isModified,
    locale
}) => {
    const [localScore, setLocalScore] = useState(student.score?.toString() || '');
    const [isValid, setIsValid] = useState(true);

    const handleChange = (value: string) => {
        setLocalScore(value);

        if (value === '') {
            setIsValid(true);
            onScoreChange(student.enrollment_code, 0);
            return;
        }

        const numericValue = parseFloat(value);

        if (isNaN(numericValue) || numericValue < 0 || numericValue > maxScore) {
            setIsValid(false);
            return;
        }

        setIsValid(true);
        onScoreChange(student.enrollment_code, numericValue);
    };

    const getInputClassName = () => {
        let baseClass = "w-20 text-center";
        if (!isValid) {
            baseClass += " border-red-500 focus:border-red-500";
        } else if (isModified) {
            baseClass += " border-yellow-500 bg-yellow-50";
        } else if (student.graded) {
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
};

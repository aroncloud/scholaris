import { useState, useCallback, useEffect } from 'react';
import { showToast } from '@/components/ui/showToast';
import { getAbsencesDetail, getAbsencesList, reviewJustification } from '@/actions/attendeesAction';
import { getListAcademicYearsSchedulesForCurriculum } from '@/actions/programsAction';
import {
  IGetAbsencesListRequest,
  IGetAcademicYearsSchedulesForCurriculum,
  IGetJustificationDetail
} from '@/types/planificationType';
import { IGetStudentAbsence } from '@/types/absenceTypes';

export const useAbsenceData = (
  selectedCurriculum: string | undefined,
  selectedSchedule: string | undefined,
  selectedAcademicYear: string | undefined | null
) => {
  const [absences, setAbsences] = useState<IGetStudentAbsence[]>([]);
  const [scheduleList, setScheduleList] = useState<IGetAcademicYearsSchedulesForCurriculum[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedJustification, setSelectedJustification] = useState<IGetJustificationDetail | null>(null);

  // Charger les séquences
  const fetchSchedules = useCallback(async (curriculumCode: string, academicYearCode: string) => {
    const result = await getListAcademicYearsSchedulesForCurriculum(curriculumCode, academicYearCode);
    if (result.code === 'success') {
      setScheduleList(result.data.body);
    }
  }, []);

  // Charger les absences
  const loadAbsences = useCallback(async () => {
    if (!selectedCurriculum || !selectedSchedule) return;

    setIsLoadingData(true);
    setHasSearched(true);
    const payload: IGetAbsencesListRequest = {
      curriculumn_code: selectedCurriculum,
      limit: 100,
      offset: 0,
      schedule_code: selectedSchedule
    };

    const result = await getAbsencesList(payload);
    if (result.code === 'success') {
      setAbsences(result.data.body);
    } else {
      setAbsences([]);
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Impossible de charger les absences.',
      });
    }
    setIsLoadingData(false);
  }, [selectedCurriculum, selectedSchedule]);


  const loadJustificationDetail = useCallback(async (absenceCode: string) => {
    const result = await getAbsencesDetail(absenceCode);
    if (result.code === 'success' && result.data.body) {
      setSelectedJustification(result.data.body);
      return result.data.body;
    } else {
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Impossible de charger les détails de la justification.',
      });
    }
    return null;
  }, []);

  // Review d'une justification (Approuver ou Rejeter)
  const handleReviewJustification = useCallback(async (
    action: 'APPROVE' | 'REJECT',
    justificationCode: string,
    comment: string
  ) => {
    console.log('-->JustificationCode', justificationCode)
    const status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    const result = await reviewJustification(status, justificationCode, comment);

    if (result.code === 'success') {
      showToast({
        variant: 'success-solid',
        message: action === 'APPROVE' ? 'Justification approuvée' : 'Justification rejetée',
        description: action === 'APPROVE'
          ? 'La justification a été approuvée avec succès.'
          : 'La justification a été rejetée.',
      });
      await loadAbsences();
      return true;
    } else {
      showToast({
        variant: 'error-solid',
        message: 'Erreur',
        description: 'Impossible de traiter la justification.',
      });
      return false;
    }
  }, [loadAbsences]);

  // Effet pour charger les séquences
  useEffect(() => {
    if (selectedCurriculum && selectedAcademicYear) {
      fetchSchedules(selectedCurriculum, selectedAcademicYear);
    }
  }, [selectedCurriculum, selectedAcademicYear, fetchSchedules]);

  return {
    absences,
    scheduleList,
    isLoadingData,
    hasSearched,
    selectedJustification,
    loadAbsences,
    loadJustificationDetail,
    handleReviewJustification,
    setSelectedJustification
  };
}; 
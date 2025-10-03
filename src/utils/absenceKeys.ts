import { UIAbsence } from "@/types/studentmyabsencesTypes";

export const getAbsenceKey = (absence: UIAbsence): string => {
  // Use absence_code if available
  if (absence.absence_code) {
    return absence.absence_code;
  }
  
  // Fallback to composite key
  const ue = (absence.ue || '').toLowerCase().trim();
  const cours = (absence.cours || '').toLowerCase().trim();
  const date = (absence.dateAbsence || '').toLowerCase().trim();
  const heure = (absence.heureDebut || '').toLowerCase().trim();
  
  return `${ue}_${cours}_${date}_${heure}`.toLowerCase().trim();
};

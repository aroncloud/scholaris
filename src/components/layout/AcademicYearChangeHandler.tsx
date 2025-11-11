"use client";

import { useEffect } from "react";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";

/**
 * Composant pour gérer la réinitialisation de l'état de changement d'année
 * après le rechargement de la page
 */
const AcademicYearChangeHandler: React.FC = () => {
  const { isChangingYear, setIsChangingYear } = useAcademicYearStore();

  useEffect(() => {
    // Après le montage du composant (donc après le reload),
    // on réinitialise l'état de changement d'année avec un délai
    // pour permettre à l'overlay de s'afficher brièvement
    if (isChangingYear) {
      const timer = setTimeout(() => {
        setIsChangingYear(false);
        console.log("[AcademicYearChangeHandler] Reset isChangingYear after reload");
      }, 1000); // 1 seconde pour que l'utilisateur voie l'overlay

      return () => clearTimeout(timer);
    }
  }, [isChangingYear, setIsChangingYear]);

  return null;
};

export default AcademicYearChangeHandler;

"use client";

import { useState } from "react";

export default function useFAQLogic() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Quelles sont les conditions d'admission ?",
      reponse:
        "Les conditions varient selon la formation : BEPC pour Aide-soignant, Baccalauréat pour Infirmier. Consultez notre page Admissions pour plus de détails.",
    },
    {
      question: "Combien coûtent les formations ?",
      reponse:
        "Les frais varient de 120 000 à 200 000 FCFA par an selon la formation, plus les frais d'inscription. Des facilités de paiement sont disponibles.",
    },
    {
      question: "Les diplômes sont-ils reconnus ?",
      reponse:
        "Oui, tous nos diplômes sont reconnus par le Ministère de la Santé Publique du Cameroun et permettent l'exercice professionnel.",
    },
    {
      question: "Y a-t-il des stages pratiques ?",
      reponse:
        "Oui, 50% de la formation se déroule en stages dans nos hôpitaux partenaires pour une expérience pratique complète.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return {
    faqs,
    openIndex,
    toggleFAQ,
  };
}

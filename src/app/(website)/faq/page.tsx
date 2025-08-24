import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import LandingHeader from "../components/LandingHeader";
import LandingFooter from "../components/LandingFooter";
import HeroImage from "@/assets/images/landingpageimage/group_five_african_college_students_spending_time_together_campus-min.jpg";

const FAQ: React.FC = () => {
  const { t } = useTranslation();
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

  return (
    <div className="landing-page">
      <LandingHeader />

      <main>
        <section
          className="relative bg-[#3b2c6a] text-white pt-32 pb-20 md:py-48"
          style={{
            backgroundImage: `url(${HeroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="heading-font text-4xl md:text-6xl font-bold mb-6">
              <span className="text-[#ff9900]">{t("pages.faq")}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {t("faq.subtitle")}
            </p>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <button
                    className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                  >
                    <h3 className="font-bold text-[#3b2c6a]">{faq.question}</h3>
                    <svg
                      className={`w-6 h-6 text-[#ff9900] transform transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600">{faq.reponse}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default FAQ;

import React from "react";
import { useTranslation } from "react-i18next";
import LandingHeader from "../components/LandingHeader";
import LandingFooter from "../components/LandingFooter";
import HeroImage from "@/assets/images/landingpageimage/group_five_african_college_students_spending_time_together_campus-min.jpg";

const Recrutement: React.FC = () => {
  const { t } = useTranslation();

  const postes = [
    {
      titre: "Formateur en Soins Infirmiers",
      type: "CDI",
      lieu: "Meiganga",
      description:
        "Recherchons un(e) formateur(trice) expérimenté(e) en soins infirmiers pour rejoindre notre équipe pédagogique.",
      exigences: [
        "Diplôme d'État d'Infirmier",
        "Master en Sciences de l'Éducation",
        "5 ans d'expérience minimum",
      ],
    },
    {
      titre: "Coordinateur Pédagogique",
      type: "CDI",
      lieu: "Meiganga",
      description:
        "Poste de coordination des programmes de formation et suivi des étudiants en stage.",
      exigences: [
        "Formation en Santé",
        "Expérience en gestion pédagogique",
        "Maîtrise de l'informatique",
      ],
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
              <span className="text-[#ff9900]">{t("pages.recruitment")}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {t("recruitment.subtitle")}
            </p>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {postes.map((poste, index) => (
                <div key={index} className="bg-white rounded-3xl shadow-lg p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="heading-font text-xl font-bold text-[#3b2c6a]">
                      {poste.titre}
                    </h3>
                    <span className="bg-[#ff9900] text-white px-3 py-1 rounded-full text-sm">
                      {poste.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{poste.description}</p>
                  <div className="mb-6">
                    <h4 className="font-semibold text-[#3b2c6a] mb-2">
                      Exigences :
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {poste.exigences.map((exigence, idx) => (
                        <li key={idx}>• {exigence}</li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href="/contacts"
                    className="inline-block bg-[#3b2c6a] hover:bg-[#2a2251] text-white font-bold py-2 px-6 rounded-full transition-colors"
                  >
                    Postuler
                  </a>
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

export default Recrutement;

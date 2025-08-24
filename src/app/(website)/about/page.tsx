import React from "react";
import { useTranslation } from "react-i18next";
import LandingHeader from "../components/LandingHeader";
import LandingFooter from "../components/LandingFooter";
import HeroImage from "@/assets/images/landingpageimage/group_five_african_college_students_spending_time_together_campus-min.jpg";
import ClassroomImage from "@/assets/images/landingpageimage/close-up-students-learning-class-min.jpg";
import MyFie from "@/assets/images/landingpageimage/medium-shot-health-worker-wearing-mask-min.jpg";

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="landing-page">
      <LandingHeader />

      <main>
        {/* Section Hero */}
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
              {t("about.title")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {t("about.subtitle")}
            </p>
          </div>
        </section>

        {/* Section Histoire */}
        <section className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="heading-font text-3xl md:text-4xl text-[#3b2c6a] font-bold mb-4">
                  {t("about.history")}
                </h2>
                <div className="w-20 h-1 bg-[#ff9900] mx-auto mb-6"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                <div>
                  <img
                    src={ClassroomImage}
                    alt="Histoire de l'école"
                    className="w-full h-96 object-cover rounded-3xl shadow-lg"
                  />
                </div>
                <div>
                  <h3 className="heading-font text-2xl font-bold text-[#3b2c6a] mb-6">
                    {t("about.historyTitle")}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {t("about.historyText1")}
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {t("about.historyText2")}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {t("about.historyText3")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Mission, Vision, Valeurs */}
        <section className="py-20 md:py-32 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="heading-font text-3xl md:text-4xl text-[#3b2c6a] font-bold mb-4">
                {t("about.foundations")}
              </h2>
              <div className="w-20 h-1 bg-[#ff9900] mx-auto mb-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Mission */}
              <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-[#3b2c6a] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="heading-font text-2xl font-bold text-[#3b2c6a] mb-4">
                  {t("about.mission")}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  L'EPFPS se concentre sur le développement éducatif et
                  socio-économique de la région. Notre mission est de former des
                  leaders et des innovateurs capables de transformer les défis
                  sanitaires actuels en opportunités, en intégrant l'innovation,
                  la responsabilité sociale et le développement durable dans la
                  formation des professionnels de santé.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-[#ff9900] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h3 className="heading-font text-2xl font-bold text-[#3b2c6a] mb-4">
                  {t("about.vision")}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Être l'école de référence en Afrique centrale pour la
                  formation des professionnels de santé, reconnue pour
                  l'innovation pédagogique, la recherche appliquée et l'impact
                  social de ses diplômés.
                </p>
              </div>

              {/* Valeurs */}
              <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-[#3b2c6a] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="heading-font text-2xl font-bold text-[#3b2c6a] mb-4">
                  {t("about.values")}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Excellence, Intégrité, Compassion, Innovation, Respect de la
                  diversité, Engagement communautaire et Développement durable.
                  Ces valeurs guident chacune de nos actions et décisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Nos Missions */}
        <section className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="heading-font text-3xl md:text-4xl text-[#3b2c6a] font-bold mb-4">
                Nos <span className="text-[#ff9900]">Missions</span>
              </h2>
              <div className="w-20 h-1 bg-[#ff9900] mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                L'EPFPS s'engage dans une approche holistique de la formation en
                santé, intégrant innovation, engagement communautaire et
                développement durable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Formation de Qualité */}
              <div className="bg-gray-50 rounded-3xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-[#3b2c6a] rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h4 className="heading-font text-xl font-bold text-[#3b2c6a] mb-4">
                  Formation de Qualité
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Programmes académiques innovants et performants, avec un
                  accent sur les compétences pratiques et l'intégration des
                  technologies modernes dans l'enseignement médical.
                </p>
              </div>

              {/* Engagement Communautaire */}
              <div className="bg-gray-50 rounded-3xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-[#ff9900] rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h4 className="heading-font text-xl font-bold text-[#3b2c6a] mb-4">
                  Engagement Communautaire
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Promotion de l'engagement social des jeunes et implication
                  active dans des projets communautaires de santé publique dans
                  la région de l'Adamaoua.
                </p>
              </div>

              {/* Développement Durable */}
              <div className="bg-gray-50 rounded-3xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-[#3b2c6a] rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="heading-font text-xl font-bold text-[#3b2c6a] mb-4">
                  Développement Durable
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Initiatives de sensibilisation aux enjeux climatiques et
                  sociaux, intégrant les principes de durabilité dans la
                  pratique médicale et les soins de santé.
                </p>
              </div>

              {/* Innovation et Recherche */}
              <div className="bg-gray-50 rounded-3xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-[#ff9900] rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h4 className="heading-font text-xl font-bold text-[#3b2c6a] mb-4">
                  Innovation et Recherche
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Encouragement de la recherche appliquée et de l'innovation
                  locale dans le domaine de la santé, avec un focus sur les
                  solutions adaptées au contexte africain.
                </p>
              </div>

              {/* Technologies TIC */}
              <div className="bg-gray-50 rounded-3xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-[#3b2c6a] rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h4 className="heading-font text-xl font-bold text-[#3b2c6a] mb-4">
                  Technologies TIC
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Intégration des Technologies de l'Information et de la
                  Communication dans nos programmes pour développer des
                  compétences numériques essentielles aux professionnels de
                  santé modernes.
                </p>
              </div>

              {/* Partenariats */}
              <div className="bg-gray-50 rounded-3xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-[#ff9900] rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                    />
                  </svg>
                </div>
                <h4 className="heading-font text-xl font-bold text-[#3b2c6a] mb-4">
                  Partenariats Stratégiques
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Collaborations actives avec des entreprises locales, hôpitaux
                  partenaires et institutions académiques internationales pour
                  enrichir l'expérience étudiante.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Équipe dirigeante */}
        <section className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="heading-font text-3xl md:text-4xl text-[#3b2c6a] font-bold mb-4">
                Notre <span className="text-[#ff9900]">Direction</span>
              </h2>
              <div className="w-20 h-1 bg-[#ff9900] mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Une équipe expérimentée et dévouée à l'excellence de la
                formation en santé
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Directeur */}
              <div className="text-center">
                <div className="relative mb-6">
                  <img
                    src={MyFie}
                    alt="Directeur de l'école"
                    className="w-48 h-48 object-cover rounded-full mx-auto shadow-lg"
                  />
                  <div className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-4 bg-[#3b2c6a] text-white px-4 py-2 rounded-full">
                    <span className="text-sm font-semibold">Directeur</span>
                  </div>
                </div>
                <h3 className="heading-font text-xl font-bold text-[#3b2c6a] mb-2">
                  Dr. Jean MBARGA
                </h3>
                <p className="text-[#ff9900] font-semibold mb-3">
                  Directeur Général
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Docteur en Médecine, spécialiste en Santé Publique avec plus
                  de 20 ans d'expérience dans la formation médicale et la
                  gestion d'établissements de santé.
                </p>
              </div>

              {/* Directrice Pédagogique */}
              <div className="text-center">
                <div className="relative mb-6">
                  <img
                    src={MyFie}
                    alt="Directrice Pédagogique"
                    className="w-48 h-48 object-cover rounded-full mx-auto shadow-lg"
                  />
                  <div className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-4 bg-[#ff9900] text-white px-4 py-2 rounded-full">
                    <span className="text-sm font-semibold">Direction</span>
                  </div>
                </div>
                <h3 className="heading-font text-xl font-bold text-[#3b2c6a] mb-2">
                  Dr. Marie FOUDA
                </h3>
                <p className="text-[#ff9900] font-semibold mb-3">
                  Directrice Pédagogique
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Infirmière diplômée d'État, Master en Sciences de l'Éducation.
                  Experte en développement curriculaire et pédagogie active.
                </p>
              </div>

              {/* Coordonnateur Académique */}
              <div className="text-center">
                <div className="relative mb-6">
                  <img
                    src={MyFie}
                    alt="Coordonnateur Académique"
                    className="w-48 h-48 object-cover rounded-full mx-auto shadow-lg"
                  />
                  <div className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-4 bg-[#3b2c6a] text-white px-4 py-2 rounded-full">
                    <span className="text-sm font-semibold">Académique</span>
                  </div>
                </div>
                <h3 className="heading-font text-xl font-bold text-[#3b2c6a] mb-2">
                  M. Paul NGOA
                </h3>
                <p className="text-[#ff9900] font-semibold mb-3">
                  Coordonnateur Académique
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Kinésithérapeute, Master en Management des Établissements de
                  Santé. Responsable de la coordination des programmes et des
                  stages.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Reconnaissance et Certifications */}
        <section className="py-20 md:py-32 bg-[#3b2c6a] text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="heading-font text-3xl md:text-4xl font-bold mb-4">
                Reconnaissances et{" "}
                <span className="text-[#ff9900]">Certifications</span>
              </h2>
              <div className="w-20 h-1 bg-[#ff9900] mx-auto mb-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#ff9900] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-bold mb-2">Agréée MINSANTE</h4>
                <p className="text-sm text-gray-200">
                  Ministère de la Santé Publique du Cameroun
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#ff9900] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h4 className="font-bold mb-2">Diplômes Reconnus</h4>
                <p className="text-sm text-gray-200">
                  Diplômes d'État officiellement reconnus
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#ff9900] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-bold mb-2">Partenariats</h4>
                <p className="text-sm text-gray-200">
                  Hôpitaux et centres de santé partenaires
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#ff9900] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h4 className="font-bold mb-2">Excellence</h4>
                <p className="text-sm text-gray-200">
                  Taux de réussite de 95% aux examens d'État
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default About;

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LandingHeader from "../components/LandingHeader";
import LandingFooter from "../components/LandingFooter";
import HeroImage from "@/assets/images/landingpageimage/group_five_african_college_students_spending_time_together_campus-min.jpg";
import MyFie from "@/assets/images/landingpageimage/medium-shot-health-worker-wearing-mask-min.jpg";
import ClassroomImage from "@/assets/images/landingpageimage/close-up-students-learning-class-min.jpg";
import StudentsStudying from "@/assets/images/landingpageimage/students-studying-together-medium-shot-min.jpg";

const Formations: React.FC = () => {
  const { t } = useTranslation();

  const epfpsFormations = [
    {
      id: 1,
      title: "Agents Techniques Médico-Sanitaires",
      subtitle: "Option Pharmacie",
      duration: "3 ans",
      level: "Baccalauréat",
      description:
        "Formation complète en techniques pharmaceutiques, gestion des médicaments, préparation magistrale et soins médico-sanitaires spécialisés dans le domaine pharmaceutique.",
      image: MyFie,
      modules: [
        "Pharmacologie et pharmacocinétique",
        "Préparation magistrale",
        "Gestion des stocks pharmaceutiques",
        "Conseil et dispensation",
        "Hygiène et sécurité pharmaceutique",
      ],
      debouches: [
        "Pharmacies d'officine",
        "Pharmacies hospitalières",
        "Grossistes pharmaceutiques",
        "Centres de santé publics",
        "Industries pharmaceutiques",
      ],
    },
    {
      id: 2,
      title: "Agents Techniques Médico-Sanitaires",
      subtitle: "Option Analyses Médicales",
      duration: "3 ans",
      level: "Baccalauréat",
      description:
        "Formation spécialisée en techniques de laboratoire, analyses biologiques, hématologie, biochimie et microbiologie pour le diagnostic médical.",
      image: ClassroomImage,
      modules: [
        "Hématologie et hémostase",
        "Biochimie clinique",
        "Microbiologie médicale",
        "Parasitologie et mycologie",
        "Techniques de laboratoire",
        "Contrôle qualité",
      ],
      debouches: [
        "Laboratoires d'analyses médicales",
        "Laboratoires hospitaliers",
        "Centres de recherche médicale",
        "Laboratoires de santé publique",
        "Industries biomédicales",
      ],
    },
    {
      id: 3,
      title: "Aides de Santé Communautaire",
      subtitle: "",
      duration: "3 ans",
      level: "Baccalauréat",
      description:
        "Formation en soins de santé primaires, prévention, éducation sanitaire et mobilisation communautaire pour améliorer la santé des populations rurales.",
      image: StudentsStudying,
      modules: [
        "Santé communautaire",
        "Éducation pour la santé",
        "Prévention et dépistage",
        "Soins de base",
        "Mobilisation sociale",
        "Surveillance épidémiologique",
      ],
      debouches: [
        "Centres de santé ruraux",
        "Programmes de santé communautaire",
        "ONG de développement sanitaire",
        "Ministère de la Santé Publique",
        "Organisations internationales",
      ],
    },
    {
      id: 4,
      title: "Aides-Soignants Généralistes",
      subtitle: "",
      duration: "3 ans",
      level: "Baccalauréat",
      description:
        "Formation aux soins de base, hygiène hospitalière, accompagnement des patients et assistance aux équipes soignantes dans tous les services.",
      image: MyFie,
      modules: [
        "Soins d'hygiène et de confort",
        "Surveillance des signes vitaux",
        "Aide aux activités de la vie quotidienne",
        "Transmissions ciblées",
        "Relation d'aide",
        "Prévention des infections",
      ],
      debouches: [
        "Hôpitaux publics et privés",
        "Centres de santé intégrés",
        "Maisons de retraite",
        "Services de soins à domicile",
        "Cliniques spécialisées",
      ],
    },
    {
      id: 5,
      title: "Infirmiers Principaux (IDE)",
      subtitle: "",
      duration: "3 ans",
      level: "Baccalauréat",
      description:
        "Formation approfondie en soins infirmiers, pharmacologie, gestion des urgences médicales et encadrement d'équipes soignantes.",
      image: ClassroomImage,
      modules: [
        "Anatomie et physiologie avancées",
        "Pharmacologie clinique",
        "Soins infirmiers spécialisés",
        "Urgences et réanimation",
        "Management d'équipe",
        "Éthique et déontologie",
      ],
      debouches: [
        "Services hospitaliers spécialisés",
        "Centres de santé de référence",
        "Structures de soins d'urgence",
        "Encadrement d'équipes soignantes",
        "Formation et supervision",
      ],
    },
    {
      id: 6,
      title: "Sages-Femmes/Maïeuticiens",
      subtitle: "",
      duration: "1 an",
      level: "BEPC",
      description:
        "Formation spécialisée en obstétrique, suivi de grossesse, accouchement, soins néonataux et planification familiale.",
      image: StudentsStudying,
      modules: [
        "Obstétrique et périnatologie",
        "Surveillance de grossesse",
        "Techniques d'accouchement",
        "Soins néonataux",
        "Planification familiale",
        "Urgences obstétricales",
      ],
      debouches: [
        "Maternités et centres de naissance",
        "Services d'obstétrique",
        "Centres de planification familiale",
        "Centres de santé maternelle",
        "Programmes de santé reproductive",
      ],
    },
    {
      id: 7,
      title: "Techniciens Médico-Sanitaires",
      subtitle: "Option Odontostomatologie/Soins Dentaires",
      duration: "3 ans",
      level: "Baccalauréat",
      description:
        "Formation en soins dentaires, prothèses dentaires, techniques d'hygiène bucco-dentaire et assistance en chirurgie dentaire.",
      image: ClassroomImage,
      modules: [
        "Anatomie bucco-dentaire",
        "Techniques de soins dentaires",
        "Prothèse dentaire",
        "Radiologie dentaire",
        "Hygiène bucco-dentaire",
        "Assistance chirurgicale",
      ],
      debouches: [
        "Cabinets dentaires",
        "Services d'odontostomatologie",
        "Centres de santé bucco-dentaire",
        "Laboratoires de prothèse",
        "Programmes de santé scolaire",
      ],
    },
    {
      id: 8,
      title: "Techniciens Principaux Médico-Sanitaires",
      subtitle: "Option Radiologie et Imagerie Médicale",
      duration: "3 ans",
      level: "Baccalauréat",
      description:
        "Formation avancée en techniques d'imagerie médicale, radiologie conventionnelle, échographie et maintenance des équipements d'imagerie.",
      image: MyFie,
      modules: [
        "Physique des rayonnements",
        "Techniques radiologiques",
        "Imagerie médicale avancée",
        "Radioprotection",
        "Maintenance des équipements",
        "Interprétation des images",
      ],
      debouches: [
        "Services de radiologie hospitali��re",
        "Centres d'imagerie médicale",
        "Cabinets de radiologie",
        "Maintenance d'équipements médicaux",
        "Industries d'imagerie médicale",
      ],
    },
  ];

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
              Nos <span className="text-[#ff9900]">Formations EPFPS</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              8 filières d'excellence pour former les professionnels de santé de
              demain
            </p>
          </div>
        </section>

        {/* Section Introduction */}
        <section className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="heading-font text-3xl md:text-4xl text-[#3b2c6a] font-bold mb-6">
                École Privée de Formation des{" "}
                <span className="text-[#ff9900]">Professionnels</span> de Santé
              </h2>
              <div className="w-20 h-1 bg-[#ff9900] mx-auto mb-8"></div>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                L'EPFPS propose 8 formations reconnues par l'État du Cameroun,
                combinant théorie et pratique pour garantir l'employabilité de
                nos diplômés dans le secteur de la santé.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#3b2c6a] rounded-full flex items-center justify-center mx-auto mb-4">
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
                  <h4 className="font-bold text-[#3b2c6a] mb-2">
                    Diplômes Reconnus
                  </h4>
                  <p className="text-sm text-gray-600">
                    Tous nos diplômes sont reconnus par l'État du Cameroun
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
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-bold text-[#3b2c6a] mb-2">
                    Stages Pratiques
                  </h4>
                  <p className="text-sm text-gray-600">
                    50% du temps en stages dans nos hôpitaux partenaires
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-[#3b2c6a] rounded-full flex items-center justify-center mx-auto mb-4">
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
                  <h4 className="font-bold text-[#3b2c6a] mb-2">
                    Encadrement Personnalisé
                  </h4>
                  <p className="text-sm text-gray-600">
                    Suivi individuel par des professionnels expérimentés
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Formations Détaillées */}
        <section className="py-20 md:py-32 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="heading-font text-3xl md:text-4xl text-[#3b2c6a] font-bold mb-4">
                Nos <span className="text-[#ff9900]">8 Filières</span> EPFPS
              </h2>
              <div className="w-20 h-1 bg-[#ff9900] mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Découvrez toutes nos formations dans le domaine
                médico-sanitaire, conçues pour répondre aux besoins du secteur
                de la santé au Cameroun
              </p>
            </div>

            <div className="space-y-16">
              {epfpsFormations.map((formation, index) => (
                <div
                  key={formation.id}
                  className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12`}
                >
                  {/* Image */}
                  <div className="lg:w-1/2">
                    <div className="relative">
                      <img
                        src={formation.image}
                        alt={formation.title}
                        className="w-full h-96 object-cover rounded-3xl shadow-xl"
                      />
                      <div className="absolute top-6 left-6 bg-[#ff9900] text-white px-4 py-2 rounded-full">
                        <span className="font-semibold">
                          {formation.duration}
                        </span>
                      </div>
                      {formation.subtitle && (
                        <div className="absolute top-6 right-6 bg-[#3b2c6a] text-white px-4 py-2 rounded-full">
                          <span className="font-semibold text-sm">
                            {formation.subtitle}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="lg:w-1/2">
                    <div className="bg-white rounded-3xl shadow-lg p-8">
                      <h3 className="heading-font text-2xl md:text-3xl font-bold text-[#3b2c6a] mb-2">
                        {formation.title}
                      </h3>
                      {formation.subtitle && (
                        <h4 className="text-lg font-semibold text-[#ff9900] mb-4">
                          {formation.subtitle}
                        </h4>
                      )}

                      <div className="flex flex-wrap gap-4 mb-6">
                        <span className="bg-[#3b2c6a] text-white px-3 py-1 rounded-full text-sm">
                          Durée: {formation.duration}
                        </span>
                        <span className="bg-[#ff9900] text-white px-3 py-1 rounded-full text-sm">
                          Niveau: {formation.level}
                        </span>
                      </div>

                      <p className="text-gray-600 leading-relaxed mb-6">
                        {formation.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Modules */}
                        <div>
                          <h4 className="font-bold text-[#3b2c6a] mb-3 flex items-center">
                            <svg
                              className="w-5 h-5 mr-2 text-[#ff9900]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            Modules principaux
                          </h4>
                          <ul className="space-y-2">
                            {formation.modules.map((module, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-gray-600 flex items-start"
                              >
                                <span className="w-2 h-2 bg-[#ff9900] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                {module}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Débouchés */}
                        <div>
                          <h4 className="font-bold text-[#3b2c6a] mb-3 flex items-center">
                            <svg
                              className="w-5 h-5 mr-2 text-[#ff9900]"
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
                            Débouchés
                          </h4>
                          <ul className="space-y-2">
                            {formation.debouches.map((debouche, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-gray-600 flex items-start"
                              >
                                <span className="w-2 h-2 bg-[#3b2c6a] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                {debouche}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <Link
                          to="/admission-request"
                          className="inline-flex items-center bg-[#ff9900] hover:bg-[#e68a00] text-white font-bold py-3 px-6 rounded-full transition-colors"
                        >
                          Candidater pour cette formation
                          <svg
                            className="w-5 h-5 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Processus de Formation */}
        <section className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="heading-font text-3xl md:text-4xl text-[#3b2c6a] font-bold mb-4">
                Notre <span className="text-[#ff9900]">Méthodologie</span>
              </h2>
              <div className="w-20 h-1 bg-[#ff9900] mx-auto mb-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Étape 1 */}
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-[#3b2c6a] rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-px h-12 bg-[#ff9900] hidden lg:block"></div>
                </div>
                <h4 className="font-bold text-[#3b2c6a] mb-3">
                  Cours Théoriques
                </h4>
                <p className="text-sm text-gray-600">
                  Acquisition des connaissances fondamentales avec des
                  professeurs experts
                </p>
              </div>

              {/* Étape 2 */}
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-[#ff9900] rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-px h-12 bg-[#3b2c6a] hidden lg:block"></div>
                </div>
                <h4 className="font-bold text-[#3b2c6a] mb-3">
                  Travaux Pratiques
                </h4>
                <p className="text-sm text-gray-600">
                  Mise en pratique dans nos laboratoires équipés et salles de
                  simulation
                </p>
              </div>

              {/* Étape 3 */}
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-[#3b2c6a] rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-px h-12 bg-[#ff9900] hidden lg:block"></div>
                </div>
                <h4 className="font-bold text-[#3b2c6a] mb-3">
                  Stages Cliniques
                </h4>
                <p className="text-sm text-gray-600">
                  Immersion professionnelle dans nos hôpitaux et centres
                  partenaires
                </p>
              </div>

              {/* Étape 4 */}
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-[#ff9900] rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-white">4</span>
                  </div>
                </div>
                <h4 className="font-bold text-[#3b2c6a] mb-3">
                  Évaluation Continue
                </h4>
                <p className="text-sm text-gray-600">
                  Contrôles réguliers et examens d'État pour valider les
                  compétences
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section CTA */}
        <section className="py-20 bg-[#3b2c6a] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="heading-font text-3xl md:text-4xl font-bold mb-6">
              Prêt à rejoindre l'<span className="text-[#ff9900]">EPFPS</span> ?
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-8">
              Découvrez nos conditions d'admission et commencez votre parcours
              vers une carrière dans la santé
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/admission-request"
                className="bg-[#ff9900] hover:bg-[#e68a00] text-white font-bold py-3 px-8 rounded-full transition-colors"
              >
                Faire une demande d'admission
              </Link>
              <a
                href="/contacts"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-[#3b2c6a] text-white font-bold py-3 px-8 rounded-full transition-colors"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default Formations;

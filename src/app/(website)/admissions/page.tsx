import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LandingHeader from "../components/LandingHeader";
import LandingFooter from "../components/LandingFooter";
import HeroImage from "@/assets/images/landingpageimage/group_five_african_college_students_spending_time_together_campus-min.jpg";
import StudentsStudying from "@/assets/images/landingpageimage/students-studying-together-medium-shot-min.jpg";

const Admissions: React.FC = () => {
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
              <span className="text-[#ff9900]">{t("pages.admissions")}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {t("admissions.subtitle")}
            </p>
          </div>
        </section>

        {/* Section Processus d'admission */}
        <section className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="heading-font text-3xl md:text-4xl text-[#3b2c6a] font-bold mb-4">
                Processus d'<span className="text-[#ff9900]">Admission</span>
              </h2>
              <div className="w-20 h-1 bg-[#ff9900] mx-auto mb-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#3b2c6a] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h4 className="font-bold text-[#3b2c6a] mb-2">
                  Dépôt du dossier
                </h4>
                <p className="text-sm text-gray-600">
                  Soumettez votre candidature avec tous les documents requis
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#ff9900] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h4 className="font-bold text-[#3b2c6a] mb-2">
                  Étude du dossier
                </h4>
                <p className="text-sm text-gray-600">
                  Examen de votre profil par notre commission d'admission
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#3b2c6a] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h4 className="font-bold text-[#3b2c6a] mb-2">Entretien</h4>
                <p className="text-sm text-gray-600">
                  Entretien de motivation avec nos responsables pédagogiques
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#ff9900] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <h4 className="font-bold text-[#3b2c6a] mb-2">Inscription</h4>
                <p className="text-sm text-gray-600">
                  Confirmation de votre place et finalisation de l'inscription
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Conditions par formation */}
        <section className="py-20 md:py-32 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="heading-font text-3xl md:text-4xl text-[#3b2c6a] font-bold mb-4">
                Conditions d'<span className="text-[#ff9900]">Admission</span>
              </h2>
              <div className="w-20 h-1 bg-[#ff9900] mx-auto mb-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Aide-Soignant */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="heading-font text-xl font-bold text-[#3b2c6a] mb-4">
                  Aide-Soignant(e)
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-[#ff9900] mb-2">
                      Diplôme requis :
                    </h4>
                    <p className="text-sm text-gray-600">BEPC ou équivalent</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#ff9900] mb-2">Âge :</h4>
                    <p className="text-sm text-gray-600">17 ans minimum</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[ff9900] mb-2">
                      Documents :
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Certificat de naissance</li>
                      <li>• Diplôme du BEPC</li>
                      <li>• Certificat médical</li>
                      <li>• 4 photos d'identité</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Infirmier */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="heading-font text-xl font-bold text-[#3b2c6a] mb-4">
                  Infirmier(ère) D.E.
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-[#ff9900] mb-2">
                      Diplôme requis :
                    </h4>
                    <p className="text-sm text-gray-600">
                      Baccalauréat toutes séries
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#ff9900] mb-2">Âge :</h4>
                    <p className="text-sm text-gray-600">18 ans minimum</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#ff9900] mb-2">
                      Documents :
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Certificat de naissance</li>
                      <li>• Diplôme du Baccalauréat</li>
                      <li>• Relevés de notes</li>
                      <li>• Certificat médical</li>
                      <li>• 6 photos d'identité</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Agent de Santé */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="heading-font text-xl font-bold text-[#3b2c6a] mb-4">
                  Agent de Santé
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-[#ff9900] mb-2">
                      Diplôme requis :
                    </h4>
                    <p className="text-sm text-gray-600">BEPC minimum</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#ff9900] mb-2">Âge :</h4>
                    <p className="text-sm text-gray-600">18 ans minimum</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#ff9900] mb-2">
                      Documents :
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Certificat de naissance</li>
                      <li>• Diplôme ou attestation</li>
                      <li>• Certificat médical</li>
                      <li>• 4 photos d'identité</li>
                      <li>• Lettre de motivation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Calendrier et Frais */}
        <section className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Calendrier */}
              <div>
                <h2 className="heading-font text-3xl font-bold text-[#3b2c6a] mb-6">
                  Calendrier <span className="text-[#ff9900]">2024-2025</span>
                </h2>
                <div className="bg-gray-50 rounded-3xl p-8">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                      <span className="font-semibold text-[#3b2c6a]">
                        Ouverture des candidatures
                      </span>
                      <span className="text-[#ff9900] font-bold">
                        15 Avril 2024
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                      <span className="font-semibold text-[#3b2c6a]">
                        Date limite de dépôt
                      </span>
                      <span className="text-[#ff9900] font-bold">
                        30 Juin 2024
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                      <span className="font-semibold text-[#3b2c6a]">
                        Entretiens
                      </span>
                      <span className="text-[#ff9900] font-bold">
                        15-30 Juillet
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                      <span className="font-semibold text-[#3b2c6a]">
                        Résultats
                      </span>
                      <span className="text-[#ff9900] font-bold">
                        15 Août 2024
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-[#3b2c6a]">
                        Rentrée académique
                      </span>
                      <span className="text-[#ff9900] font-bold">
                        15 Septembre
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Frais de scolarité */}
              <div>
                <h2 className="heading-font text-3xl font-bold text-[#3b2c6a] mb-6">
                  Frais de <span className="text-[#ff9900]">Scolarité</span>
                </h2>
                <div className="bg-gray-50 rounded-3xl p-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-[#3b2c6a] mb-3">
                        Aide-Soignant(e)
                      </h4>
                      <div className="flex justify-between">
                        <span>Frais d'inscription :</span>
                        <span className="font-bold text-[#ff9900]">
                          25 000 FCFA
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Scolarité annuelle :</span>
                        <span className="font-bold text-[#ff9900]">
                          150 000 FCFA
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-bold text-[#3b2c6a] mb-3">
                        Infirmier(ère) D.E.
                      </h4>
                      <div className="flex justify-between">
                        <span>Frais d'inscription :</span>
                        <span className="font-bold text-[#ff9900]">
                          35 000 FCFA
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Scolarité annuelle :</span>
                        <span className="font-bold text-[#ff9900]">
                          200 000 FCFA
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-bold text-[#3b2c6a] mb-3">
                        Agent de Santé
                      </h4>
                      <div className="flex justify-between">
                        <span>Frais d'inscription :</span>
                        <span className="font-bold text-[#ff9900]">
                          20 000 FCFA
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Scolarité annuelle :</span>
                        <span className="font-bold text-[#ff9900]">
                          120 000 FCFA
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#3b2c6a] text-white p-4 rounded-2xl mt-6">
                      <p className="text-sm">
                        <strong>Note :</strong> Possibilité de paiement
                        échelonné. Bourses disponibles pour les étudiants
                        méritants.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section CTA */}
        <section className="py-20 bg-[#3b2c6a] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="heading-font text-3xl md:text-4xl font-bold mb-6">
              Prêt à <span className="text-[#ff9900]">candidater</span> ?
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-8">
              Téléchargez le dossier de candidature et commencez votre parcours
              avec nous
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

export default Admissions;

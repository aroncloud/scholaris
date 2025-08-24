import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import LandingHeader from "../components/LandingHeader";
import LandingFooter from "../components/LandingFooter";
import HeroImage from "@/assets/images/landingpageimage/group_five_african_college_students_spending_time_together_campus-min.jpg";

const Contacts: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'envoi du formulaire
    console.log("Formulaire soumis:", formData);
    alert(t("contact.formSubmitMessage"));
    setFormData({ nom: "", email: "", telephone: "", sujet: "", message: "" });
  };

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
              <span className="text-[#ff9900]">{t("contact.title")}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {t("contact.subtitle")}
            </p>
          </div>
        </section>

        {/* Section Formulaire et Infos */}
        <section className="py-20 md:py-32 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Formulaire de contact */}
              <div>
                <div className="bg-white rounded-3xl shadow-xl p-8">
                  <h2 className="heading-font text-3xl font-bold text-[#3b2c6a] mb-6">
                    {t("contact.sendMessage")}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="nom"
                        className="block text-sm font-semibold text-[#3b2c6a] mb-2"
                      >
                        {t("contact.fullName")} *
                      </label>
                      <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff9900] focus:border-transparent"
                        placeholder={t("contact.fullNamePlaceholder")}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-[#3b2c6a] mb-2"
                      >
                        {t("contact.email")} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff9900] focus:border-transparent"
                        placeholder={t("contact.emailPlaceholder")}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="telephone"
                        className="block text-sm font-semibold text-[#3b2c6a] mb-2"
                      >
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="telephone"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff9900] focus:border-transparent"
                        placeholder="+237 6XX XXX XXX"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="sujet"
                        className="block text-sm font-semibold text-[#3b2c6a] mb-2"
                      >
                        {t("contact.subject")} *
                      </label>
                      <select
                        id="sujet"
                        name="sujet"
                        value={formData.sujet}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff9900] focus:border-transparent"
                      >
                        <option value="">{t("contact.selectSubject")}</option>
                        <option value="admission">
                          {t("contact.admissionRequest")}
                        </option>
                        <option value="formations">
                          {t("contact.trainingInfo")}
                        </option>
                        <option value="frais">
                          {t("contact.tuitionFees")}
                        </option>
                        <option value="stages">
                          {t("contact.internshipsJobs")}
                        </option>
                        <option value="autre">{t("contact.other")}</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold text-[#3b2c6a] mb-2"
                      >
                        {t("contact.message")} *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff9900] focus:border-transparent resize-none"
                        placeholder={t("contact.messagePlaceholder")}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#ff9900] hover:bg-[#e68a00] text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      {t("contact.sendMessageButton")}
                    </button>
                  </form>
                </div>
              </div>

              {/* Informations de contact */}
              <div>
                <h2 className="heading-font text-3xl font-bold text-[#3b2c6a] mb-8">
                  Nos <span className="text-[#ff9900]">Coordonnées</span>
                </h2>

                <div className="space-y-6">
                  {/* Adresse */}
                  <div className="bg-white rounded-3xl shadow-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#3b2c6a] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#3b2c6a] mb-2">
                          Adresse
                        </h4>
                        <p className="text-gray-600">
                          École Privée de Formation des Professionnels de Santé
                          <br />
                          Quartier Sabongari Gbaboy
                          <br />
                          BP 123, Meiganga
                          <br />
                          Région de l'Adamaoua, Cameroun
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div className="bg-white rounded-3xl shadow-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#ff9900] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#3b2c6a] mb-2">
                          Téléphone
                        </h4>
                        <p className="text-gray-600">
                          <strong>Standard :</strong> +237 696 568 669
                          <br />
                          <strong>Admissions :</strong> +237 694 591 634
                          <br />
                          <strong>Direction :</strong> +237 674 317 387
                          <br />
                          <strong>Scolarité :</strong> +237 699 475 876
                          <br />
                          <span className="text-sm text-gray-500">
                            Lundi - Vendredi : 8h - 17h
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="bg-white rounded-3xl shadow-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#3b2c6a] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#3b2c6a] mb-2">Email</h4>
                        <p className="text-gray-600">
                          <strong>Général :</strong> contact@epfps-meiganga.cm
                          <br />
                          <strong>Admissions :</strong>{" "}
                          admissions@epfps-meiganga.cm
                          <br />
                          <strong>Direction :</strong>{" "}
                          direction@epfps-meiganga.cm
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Horaires */}
                  <div className="bg-white rounded-3xl shadow-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#ff9900] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#3b2c6a] mb-2">
                          Horaires d'ouverture
                        </h4>
                        <div className="text-gray-600 space-y-1">
                          <p>
                            <strong>Lundi - Vendredi :</strong> 7h30 - 17h00
                          </p>
                          <p>
                            <strong>Samedi :</strong> 8h00 - 12h00
                          </p>
                          <p>
                            <strong>Dimanche :</strong> Fermé
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Plan d'accès */}
        <section className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="heading-font text-3xl md:text-4xl text-[#3b2c6a] font-bold mb-4">
                Comment nous <span className="text-[#ff9900]">trouver</span>
              </h2>
              <div className="w-20 h-1 bg-[#ff9900] mx-auto mb-6"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Carte (simulation) */}
              <div className="bg-gray-200 rounded-3xl h-96 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  <p className="text-gray-500">
                    Carte interactive de localisation
                  </p>
                  <p className="text-sm text-gray-400">
                    Meiganga, Adamaoua, Cameroun
                  </p>
                </div>
              </div>

              {/* Instructions d'accès */}
              <div>
                <h3 className="heading-font text-2xl font-bold text-[#3b2c6a] mb-6">
                  Accès à l'école
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#ff9900] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#3b2c6a] mb-1">
                        En voiture
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Depuis le centre-ville de Meiganga, prendre la route de
                        Ngaoundéré sur 2 km, puis tourner à droite au panneau
                        EPFPS.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#3b2c6a] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#3b2c6a] mb-1">
                        En transport public
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Prendre un taxi-moto ou un taxi depuis le marché
                        central. Destination : "École de Santé EPFPS" (5 minutes
                        du centre).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#ff9900] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#3b2c6a] mb-1">
                        Points de repère
                      </h4>
                      <p className="text-gray-600 text-sm">
                        L'école se trouve près de l'hôpital régional de
                        Meiganga, en face de la station-service Total.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-[#3b2c6a] text-white rounded-2xl">
                  <h4 className="font-bold mb-2">Parking disponible</h4>
                  <p className="text-sm text-gray-200">
                    Stationnement gratuit disponible sur le campus pour les
                    visiteurs et étudiants.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default Contacts;

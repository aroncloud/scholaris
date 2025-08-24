import React from "react";
import { useTranslation } from "react-i18next";
import LandingHeader from "../components/LandingHeader";
import LandingFooter from "../components/LandingFooter";
import HeroImage from "@/assets/images/landingpageimage/group_five_african_college_students_spending_time_together_campus-min.jpg";
import MyFie from "@/assets/images/landingpageimage/medium-shot-health-worker-wearing-mask-min.jpg";
import ClassroomImage from "@/assets/images/landingpageimage/close-up-students-learning-class-min.jpg";

const Actualites: React.FC = () => {
  const { t } = useTranslation();

  const articles = [
    {
      id: 1,
      titre: "Nouvelle formation en soins d'urgence",
      date: "15 Janvier 2024",
      categorie: "Formation",
      image: MyFie,
      extrait:
        "L'EPFPS lance un nouveau programme spécialisé en soins d'urgence pour répondre aux besoins croissants du secteur de la santé au Cameroun.",
      contenu: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    },
    {
      id: 2,
      titre: "Partenariat avec l'hôpital régional",
      date: "10 Janvier 2024",
      categorie: "Partenariat",
      image: ClassroomImage,
      extrait:
        "Signature d'un accord de partenariat avec l'hôpital régional de Meiganga pour renforcer la formation pratique de nos étudiants.",
      contenu: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
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
              <span className="text-[#ff9900]">{t("pages.news")}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {t("news.subtitle")}
            </p>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={article.image}
                      alt={article.titre}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-[#ff9900] text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {article.categorie}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-3">
                      {article.date}
                    </div>
                    <h3 className="heading-font text-xl font-bold text-[#3b2c6a] mb-3">
                      {article.titre}
                    </h3>
                    <p className="text-gray-600 mb-4">{article.extrait}</p>
                    <a
                      href="#"
                      className="inline-flex items-center text-[#ff9900] font-semibold hover:text-[#e68a00] transition-colors"
                    >
                      Lire la suite
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default Actualites;

/* eslint-disable react/no-unescaped-entities */
'use client';
import React from 'react';
// import HeroImage from '@/assets/images/landingpageimage/group_five_african_college_students_spending_time_together_campus-min.jpg';
// import MyFie from '@/assets/images/landingpageimage/medium-shot-health-worker-wearing-mask-min.jpg';
// import StudentsStudying from '@/assets/images/landingpageimage/students-studying-together-medium-shot-min.jpg';
// import ClassroomImage from '@/assets/images/landingpageimage/close-up-students-learning-class-min.jpg';
// // import StudyGroupImage from '@/assets/images/landingpageimage/study-group-african-people-min.jpg';
// import StudentWoman from '@/assets/images/landingpageimage/african_american_woman_wearing_student_backpack_holding_books_smiling-min.jpg';
// import StudyGroup2 from '@/assets/images/landingpageimage/study-group-african-people (1)-min.jpg';
// import CollegeStudents from '@/assets/images/landingpageimage/college-students-different-ethnicities-cramming-min.jpg';
import LandingHeader from '@/components/website/LandingHeader';
import LandingFooter from '@/components/website/LandingFooter';
import Link from 'next/link';
import Image from 'next/image';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <style>
        {`
          @keyframes slideInFromLeft {
            0% {
              transform: translateX(-100px);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes slideInFromRight {
            0% {
              transform: translateX(100px);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
          @keyframes float {
            0%, 100% {
              transform: translateY(-20px);
              opacity: 0.3;
            }
            50% {
              transform: translateY(20px);
              opacity: 0.8;
            }
          }
          .animate-slideInFromLeft {
            animation: slideInFromLeft 0.8s ease-out forwards;
          }
          .animate-slideInFromRight {
            animation: slideInFromRight 0.8s ease-out forwards;
          }
          .animate-fadeIn {
            animation: fadeIn 1s ease-in forwards;
          }
          .animate-float-1 { animation: float 3s infinite ease-in-out; }
          .animate-float-2 { animation: float 3.5s infinite ease-in-out; }
          .animate-float-3 { animation: float 4s infinite ease-in-out; }
          .animate-float-4 { animation: float 4.5s infinite ease-in-out; }
          .animate-float-5 { animation: float 5s infinite ease-in-out; }
          .animate-float-6 { animation: float 5.5s infinite ease-in-out; }
        `}
      </style>
      <LandingHeader />
      <main>
        {/* Section Héroïque (Hero Section) */}
        <section
          className="relative bg-[#3b2c6a] bg-[url(/images/landingpageimage/group_five_african_college_students_spending_time_together_campus-min.jpg)] bg-cover text-white pt-32 pb-20 md:py-48 overflow-hidden animate-fadeIn"
          // style={{
          //   backgroundImage: `url(${HeroImage.src})`,
          //   backgroundSize: 'cover',
          //   backgroundPosition: 'center',
          // }}
          
        >
          <div className="absolute inset-0 bg-black/50 animate-fadeIn" style={{ animationDelay: '0.2s' }} />

          {/* Floating particles animation */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-amber-400/30 rounded-full animate-float-${i + 1}`}
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
              {/* Bloc de texte avec fond semi-transparent */}
              <div
                className="md:w-1/2 p-8 bg-black/60 backdrop-blur-sm rounded-lg rounded-br-[80px] shadow-lg animate-slideInFromLeft"
                style={{ animationDelay: '0.3s' }}
              >
                <h2
                  className="heading-font text-lg font-black mb-2 opacity-0 animate-fadeIn"
                  style={{ animationDelay: '0.5s' }}
                >
                  École Privée de Formation des Professionnels de Santé de Meiganga
                </h2>
                <h1
                  className="heading-font text-3xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight opacity-0 animate-fadeIn"
                  style={{ animationDelay: '0.7s' }}
                >
                  Votre avenir dans le secteur de la santé commence ici
                </h1>
                <div
                  className="space-y-4 opacity-0 animate-fadeIn"
                  style={{ animationDelay: '0.9s' }}
                >
                  <Link
                    href="/admission-request"
                    className="block w-full text-center md:w-auto bg-[#ff9900] hover:bg-[#e68a00] text-white heading-font font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    Demander une admission
                  </Link>
                  <Link
                    href="/formations"
                    className="block w-full text-center md:w-auto bg-transparent border-2 border-white hover:bg-white hover:text-[#3b2c6a] text-white heading-font font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    Voir nos filières
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Présentation */}
        <section id="presentation" className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="md:flex items-start gap-12">
              <div className="md:w-1/2 mb-8 md:mb-0 opacity-0 animate-slideInFromLeft" style={{ animationDelay: '0.2s' }}>
                <h2 className="heading-font text-3xl md:text-4xl text-[#3b2c6a] font-bold mb-4 opacity-0 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                  À propos de l'EPFPS
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6 opacity-0 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                  École Privée de Formation des Professionnels de Santé de Meiganga
                </p>
                <p className="text-gray-600 leading-relaxed opacity-0 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
                  L'École Privée de Formation des Professionnels de Santé de Meiganga (EPFPS) a été créée en réponse au besoin croissant de professionnels de santé qualifiés dans la région de l'Adamaoua et au Cameroun en général.
                </p>
              </div>
              <div className="md:w-1/2 rounded-3xl overflow-hidden shadow-2xl transform opacity-0 scale-90 transition-all duration-800 animate-slideInFromRight" style={{ animationDelay: '0.3s' }}>
                {/* Placeholder de lecteur vidéo YouTube */}
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/rhgwIhB58PA"
                    title="The Biggest Myth In Education"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Nos Filières Phares */}
        <section id="filieres" className="bg-gradient-to-br from-[#3b2c6a] to-[#2a2251] py-20 md:py-32 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="heading-font text-3xl md:text-4xl font-bold mb-12">
              Nos Filières Phares
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Filière 1 - Infirmier Principal */}
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <Image
                  src='/images/landingpageimage/medium-shot-health-worker-wearing-mask-min.jpg'
                  height={1000}
                  width={1000}
                  alt="Infirmier Principal"
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6 text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#3b2c6a] text-white text-xs px-2 py-1 rounded-full">
                      3 ans
                    </span>
                    <span className="bg-[#ff9900] text-white text-xs px-2 py-1 rounded-full">
                      Baccalauréat
                    </span>
                  </div>
                  <h3 className="heading-font text-xl font-semibold text-[#3b2c6a] mb-2">
                    Infirmier Principal
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Former des professionnels capables de prodiguer des soins complets, de gérer des situations d'urgence et de promouvoir la santé communautaire.
                  </p>
                  <Link
                    href="/admission-request"
                    className="inline-flex items-center text-[#ff9900] font-semibold hover:text-[#e68a00] transition-colors text-sm"
                  >
                    Candidater
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
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Filière 2 - Agent Technique Pharmacie */}
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <Image
                  src='/images/landingpageimage/close-up-students-learning-class-min.jpg'
                  height={1000}
                  width={1000}
                  alt="Agent Technique Pharmacie"
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6 text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#3b2c6a] text-white text-xs px-2 py-1 rounded-full">
                      2 ans
                    </span>
                    <span className="bg-[#ff9900] text-white text-xs px-2 py-1 rounded-full">
                      Probatoire
                    </span>
                  </div>
                  <h3 className="heading-font text-xl font-semibold text-[#3b2c6a] mb-1">
                    Agent Technique Pharmacie
                  </h3>
                  <p className="text-[#ff9900] text-sm font-medium mb-2">
                    Brevet de Technicien Supérieur
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    Former des assistants en pharmacie compétents pour la gestion des stocks, la délivrance des médicaments et le conseil à la clientèle.
                  </p>
                  <Link
                    href="/admission-request"
                    className="inline-flex items-center text-[#ff9900] font-semibold hover:text-[#e68a00] transition-colors text-sm"
                  >
                    Candidater
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
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Filière 3 - Sage-Femme */}
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <Image
                  src='/images/landingpageimage/students-studying-together-medium-shot-min.jpg'
                  alt="Sage-Femme"
                  height={500}
                  width={500}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6 text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#3b2c6a] text-white text-xs px-2 py-1 rounded-full">
                      3 ans
                    </span>
                    <span className="bg-[#ff9900] text-white text-xs px-2 py-1 rounded-full">
                      Probatoire
                    </span>
                  </div>
                  <h3 className="heading-font text-xl font-semibold text-[#3b2c6a] mb-2">
                    Sage-Femme
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Former des sages-femmes pour l'accompagnement des femmes pendant la grossesse, l'accouchement et la période post-natale.
                  </p>
                  <Link
                    href="/admission-request"
                    className="inline-flex items-center text-[#ff9900] font-semibold hover:text-[#e68a00] transition-colors text-sm"
                  >
                    Candidater
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
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            {/* Boutons d'action */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/formations"
                className="inline-flex items-center bg-transparent border-2 border-white hover:bg-white hover:text-[#3b2c6a] text-white heading-font font-bold py-3 px-8 rounded-full transition-all duration-300"
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Voir toutes les formations
              </Link>
              <Link
                href="/admission-request"
                className="bg-[#ff9900] hover:bg-[#e68a00] text-white heading-font font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300"
              >
                Inscrivez-vous maintenant
              </Link>
            </div>
          </div>
        </section>

        {/* Section Témoignages Professionnelle */}
        <section id="testimonials" className="bg-gradient-to-br from-gray-50 to-white py-20 md:py-32 relative">
          <div className="container mx-auto px-4 relative z-10">
            {/* En-tête de section professionnelle */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center p-2 bg-[#3b2c6a]/10 rounded-full mb-6">
                <span className="text-[#3b2c6a] text-sm font-semibold px-4 py-2 bg-white rounded-full shadow-sm">
                  Témoignages
                </span>
              </div>
              <h2 className="heading-font text-3xl md:text-5xl text-[#3b2c6a] font-bold mb-6 leading-tight">
                Ce que nos étudiants disent de nous
              </h2>
              <div className="w-24 h-1 bg-[#ff9900] mx-auto mb-8 rounded-full"></div>
              <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
                Notre engagement est de fournir une expérience éducative enrichissante et de préparer nos étudiants à exceller dans leurs carrières.
              </p>
            </div>

            {/* Grille des témoignages */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Témoignage 1 */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#ff9900] fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 leading-relaxed italic">
                  "L'EPFPS m'a donné les compétences pratiques et la confiance nécessaires pour débuter ma carrière. Le soutien des enseignants est exceptionnel."
                </blockquote>
                <div className="flex items-center gap-3">
                  <Image
                    height={600}
                    width={600}
                    src='/images/landingpageimage/african_american_woman_wearing_student_backpack_holding_books_smiling-min.jpg'
                    alt="Fatima Mballa"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-[#3b2c6a]">
                      Fatima Mballa
                    </p>
                    <p className="text-sm text-gray-600">
                      Diplômée en Infirmier Principal
                    </p>
                  </div>
                </div>
              </div>

              {/* Témoignage 2 */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#ff9900] fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 leading-relaxed italic">
                  "Les stages pratiques en hôpital m'ont préparé aux réalités du métier. C'est une formation complète qui fait toute la différence."
                </blockquote>
                <div className="flex items-center gap-3">
                  <Image
                    src='/images/landingpageimage/study-group-african-people (1)-min.jpg'
                    height={600}
                    width={600}
                    alt="Emmanuel Ngono"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-[#3b2c6a]">
                      Emmanuel Ngono
                    </p>
                    <p className="text-sm text-gray-600">
                      Étudiant en Agent Technique Pharmacie
                    </p>
                  </div>
                </div>
              </div>

              {/* Témoignage 3 */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#ff9900] fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 leading-relaxed italic">
                  "J'ai choisi l'EPFPS pour la qualité de son enseignement et la reconnaissance de ses diplômes. Je suis fière d'y avoir étudié."
                </blockquote>
                <div className="flex items-center gap-3">
                  <Image
                    src='/images/landingpageimage/college-students-different-ethnicities-cramming-min.jpg'
                    height={600}
                    width={600}
                    alt="Marie Tchounkeu"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-[#3b2c6a]">
                      Marie Tchounkeu
                    </p>
                    <p className="text-sm text-gray-600">
                      Diplômée en Sage-Femme
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section statistiques de satisfaction */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h3 className="heading-font text-2xl md:text-3xl font-bold text-[#3b2c6a] mb-4">
                  Taux de satisfaction et d'insertion professionnelle
                </h3>
                <p className="text-gray-600">
                  Quelques chiffres clés qui témoignent de notre engagement envers la réussite de nos étudiants.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-[#ff9900] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-white">98%</span>
                  </div>
                  <h4 className="font-semibold text-[#3b2c6a] mb-2">
                    Satisfaction Générale
                  </h4>
                  <p className="text-sm text-gray-600">
                    Niveau de satisfaction globale de nos étudiants diplômés.
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-[#3b2c6a] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-white">96%</span>
                  </div>
                  <h4 className="font-semibold text-[#3b2c6a] mb-2">
                    Qualité de la formation
                  </h4>
                  <p className="text-sm text-gray-600">
                    Pourcentage d'étudiants satisfaits de la qualité de notre enseignement.
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-[#ff9900] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-white">94%</span>
                  </div>
                  <h4 className="font-semibold text-[#3b2c6a] mb-2">
                    Taux d'emploi
                  </h4>
                  <p className="text-sm text-gray-600">
                    Pourcentage de diplômés qui trouvent un emploi dans les 6 mois après l'obtention de leur diplôme.
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-[#3b2c6a] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-white">97%</span>
                  </div>
                  <h4 className="font-semibold text-[#3b2c6a] mb-2">
                    Soutien aux étudiants
                  </h4>
                  <p className="text-sm text-gray-600">
                    Pourcentage d'étudiants satisfaits du soutien administratif et académique.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Statistiques Professionnelle */}
        <section id="numbers" className="bg-gradient-to-br from-[#3b2c6a] to-[#2a2251] py-20 text-white">
          <div className="container mx-auto px-4">
            {/* En-tête de section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center p-2 bg-white/10 rounded-full mb-6">
                <span className="text-white text-sm font-semibold px-4 py-2 bg-[#ff9900] rounded-full">
                  Statistiques
                </span>
              </div>
              <h2 className="heading-font text-3xl md:text-5xl font-bold mb-4">
                L'EPFPS en Chiffres
              </h2>
              <p className="text-gray-200">
                Nos chiffres parlent d'eux-mêmes et témoignent de l'impact de notre établissement.
              </p>
            </div>

            {/* Grille des statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Statistique 1 */}
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300">
                <span className="heading-font text-5xl font-extrabold text-[#ff9900]">
                  500+
                </span>
                <p className="text-lg font-semibold mt-3">Étudiants formés</p>
                <p className="text-sm text-gray-300">Depuis notre fondation.</p>
              </div>
              {/* Statistique 2 */}
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300">
                <span className="heading-font text-5xl font-extrabold text-[#ff9900]">
                  20+
                </span>
                <p className="text-lg font-semibold mt-3">Programmes Académiques</p>
                <p className="text-sm text-gray-300">Offres de formation de qualité.</p>
              </div>
              {/* Statistique 3 */}
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300">
                <span className="heading-font text-5xl font-extrabold text-[#ff9900]">
                  95%
                </span>
                <p className="text-lg font-semibold mt-3">Taux de réussite</p>
                <p className="text-sm text-gray-300">Aux examens d'État.</p>
              </div>
              {/* Statistique 4 */}
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300">
                <span className="heading-font text-5xl font-extrabold text-[#ff9900]">
                  15+
                </span>
                <p className="text-lg font-semibold mt-3">Professeurs Certifiés</p>
                <p className="text-sm text-gray-300">Une équipe d'experts à votre service.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Appel à l'action */}
        <section id="cta" className="bg-[#3b2c6a] text-white py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center p-2 bg-white/10 rounded-full mb-6">
              <span className="text-white text-sm font-semibold px-4 py-2 bg-[#ff9900] rounded-full shadow-sm">
                CONTACTEZ-NOUS
              </span>
            </div>
            <h2 className="heading-font text-3xl md:text-5xl font-bold mb-4">
              Prêt à rejoindre l'EPFPS ?
            </h2>
            <p className="text-gray-200 max-w-2xl mx-auto mb-12">
              Nous sommes impatients de vous accueillir. Contactez-nous pour en savoir plus sur nos formations et le processus d'admission.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Téléphone */}
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.185l-2.493 1.246a.5.5 0 00-.246.331l-.062.298a2 2 0 00.5 1.5l1.595 1.595a2 2 0 001.5.5l.298-.062a.5.5 0 00.331-.246l1.246-2.493a1 1 0 011.185-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-white font-bold mb-2">
                    Appelez-nous
                  </h4>
                  <p className="text-gray-200 text-sm">
                    (+237) 677 34 89 21
                  </p>
                  <p className="text-gray-200 text-sm">
                    (+237) 699 87 23 45
                  </p>
                </div>
              </div>

              {/* Adresse */}
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
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
                  <h4 className="text-white font-bold mb-2">
                    Venez nous rencontrer
                  </h4>
                  <p className="text-gray-200 text-sm">
                    BP 15 Meiganga, Région de l'Adamaoua, Cameroun
                  </p>
                  <p className="text-gray-200 text-sm">
                    (Carrefour Abattoir, à 50m de la station MRS)
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
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
                        d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-white font-bold mb-2">
                    Écrivez-nous
                  </h4>
                  <p className="text-gray-200 text-sm">{process.env.NEXT_PUBLIC_SCHOOL_EMAIL}</p>
                  <p className="text-gray-200 text-sm">
                    support@epfps.cm
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

export default LandingPage;
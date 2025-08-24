/* eslint-disable react/no-unescaped-entities */
import React from "react";
// import HeroImage from "@/assets/images/landingpageimage/group_five_african_college_students_spending_time_together_campus-min.jpg";
import Link from "next/link";
import Image from "next/image";

const LandingFooter = () => {

  return (
    <footer className="relative bg-[#3b2c6a] text-white pt-20 pb-12 overflow-hidden">
      {/* Background avec image de l'école et overlay */}
      <div
        className="absolute inset-0 z-0"
        // style={{
        //   backgroundImage: `url(${HeroImage})`,
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        //   backgroundAttachment: "fixed",
        // }}
      ></div>
      <div className="absolute inset-0 bg-[#3b2c6a]/85 z-0"></div>

      {/* Éléments décoratifs */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#ff9900] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-[#ff9900] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 items-start">
          {/* Colonne 1: Logo, nom de l'école et réseaux sociaux */}
          <div className="md:col-span-2 lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="bg-white rounded-2xl p-3 mr-4 shadow-lg">
                <Image 
                  src='/images/logo/logoEPFPS.png'
                  alt="Logo EPFPS"
                  className="h-16 w-auto"
                  height={1000}
                  width={1000}
                />
              </div>
              <div>
                <h4 className="font-bold text-xl heading-font text-white leading-tight">
                  École Privée de Formation des
                </h4>
                <h4 className="font-bold text-xl heading-font text-[#ff9900] leading-tight">
                  Professionnels de Santé
                </h4>
                <p className="text-sm text-gray-200 mt-1">
                  Meiganga
                </p>
              </div>
            </div>
            <p className="text-gray-200 mb-6 text-sm leading-relaxed">
              Former les professionnels de santé de demain avec excellence, rigueur et humanité. Votre avenir dans le secteur de la santé commence ici.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                aria-label="Facebook"
                className="p-3 bg-white/20 rounded-full hover:bg-[#ff9900] transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="p-3 bg-white/20 rounded-full hover:bg-[#ff9900] transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37a4 4 0 11-8 0 4 4 0 018 0z" />
                  <path d="M17.5 6.5h.01" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Email"
                className="p-3 bg-white/20 rounded-full hover:bg-[#ff9900] transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            </div>
          </div>
          {/* Colonne 2: Coordonnées */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold text-lg mb-4 text-[#ff9900] flex items-center">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Coordonnées
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <svg
                  className="w-4 h-4 mr-2 mt-0.5 text-[#ff9900]"
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
                </svg>
                <span>
                  Meiganga, Région de l'Adamaoua
                  <br />
                  Cameroun
                </span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-[#ff9900]"
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
                <span>+237 6XX XXX XXX</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-[#ff9900]"
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
                <span>contact@epfps-meiganga.cm</span>
              </div>
            </div>
          </div>
          {/* Colonne 3: Liens de navigation 1 */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold text-lg mb-4 text-[#ff9900]">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:underline">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/formations" className="hover:underline">
                  Formations
                </Link>
              </li>
              <li>
                <Link href="/admissions" className="hover:underline">
                  Admissions
                </Link>
              </li>
            </ul>
          </div>
          {/* Colonne 4: Liens de navigation 2 */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold text-lg mb-4 text-[#ff9900]">
              Plus
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/actualites" className="hover:underline">
                  Actualités
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/recrutement" className="hover:underline">
                  Recrutement
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="hover:underline">
                  Contacts
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Séparateur et copyright */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-300">
              <p>
                © 2025 École Privée de Formation des Professionnels de Santé de Meiganga (EPFPS). Tous droits réservés.
              </p>
            </div>
            <div className="flex space-x-4 text-sm">
              <a
                href="#"
                className="text-gray-300 hover:text-[#ff9900] transition-colors"
              >
                Mentions légales
              </a>
              <span className="text-gray-500">|</span>
              <a
                href="#"
                className="text-gray-300 hover:text-[#ff9900] transition-colors"
              >
                Politique de confidentialité
              </a>
              <span className="text-gray-500">|</span>
              <a
                href="#"
                className="text-gray-300 hover:text-[#ff9900] transition-colors"
              >
                Plan du site
              </a>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-400">Établissement reconnu par le Ministère de la Santé Publique du Cameroun</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
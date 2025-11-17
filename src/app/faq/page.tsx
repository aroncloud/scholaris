"use client";

import React from "react";
import french from "@/i18next/french";
import LandingHeader from '@/components/website/LandingHeader';
import LandingFooter from '@/components/website/LandingFooter';
import useFAQLogic from "@/hooks/feature/websitepage/useFaq";

const FAQ: React.FC = () => {
  const { faqs, openIndex, toggleFAQ } = useFAQLogic();
  return (
    <div className="landing-page">
      <LandingHeader />

      <main>
        <section
          className="relative bg-[#3b2c6a] text-white pt-32 pb-20 md:py-48"
          style={{
            backgroundImage: `url("/images/landingpageimage/group_five_african_college_students_spending_time_together_campus-min.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="heading-font text-4xl md:text-6xl font-bold mb-6">
              <span className="text-[#ff9900]">{french.faq_title}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {french.faq_subtitle}
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
                    onClick={() => toggleFAQ(index)}
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

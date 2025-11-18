"use client";

import { useState } from "react";
import french from "@/i18next/french";

export default function useContactFormLogic() {
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
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert(french.contacts_formSubmitMessage);

    setFormData({
      nom: "",
      email: "",
      telephone: "",
      sujet: "",
      message: "",
    });
  };

  // return everything so the page.tsx can use it
  return {
    formData,
    handleChange,
    handleSubmit,
    setFormData,
  };
}

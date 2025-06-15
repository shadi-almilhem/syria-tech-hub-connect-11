
import { useState } from "react";
import i18n from "@/i18n";

export default function LanguageSwitcher() {
  const [lang, setLang] = useState(i18n.language === "ar" ? "AR" : "EN");

  const toggleLang = () => {
    const newLang = lang === "EN" ? "AR" : "EN";
    setLang(newLang);
    const lng = newLang === "EN" ? "en" : "ar";
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
    // Optionally force reload for Tailwind "dir" support
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  };

  return (
    <button
      title="Switch language"
      className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 border text-sm font-bold text-gray-800"
      onClick={toggleLang}
    >
      {lang === "EN" ? "EN" : "عربي"}
    </button>
  );
}

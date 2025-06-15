
import { useState } from "react";

export default function LanguageSwitcher() {
  const [lang, setLang] = useState("EN");
  return (
    <button
      title="Switch language"
      className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 border text-sm font-bold text-gray-800"
      onClick={() => setLang(lang === "EN" ? "AR" : "EN")}
    >
      {lang === "EN" ? "EN" : "عربي"}
    </button>
  );
}

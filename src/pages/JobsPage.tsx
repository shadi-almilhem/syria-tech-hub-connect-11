import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import "@/i18n";

export default function JobsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <main className="flex-grow w-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-3">{t("jobs_header")}</h1>
          <p className="text-gray-600">{t("jobs_placeholder")}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

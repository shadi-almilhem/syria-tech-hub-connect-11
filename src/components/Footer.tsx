
import { useTranslation } from "react-i18next";
import "@/i18n";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-50 border-t text-gray-700 mt-12">
      <div className="container max-w-screen-2xl mx-auto py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <div>
          <span className="font-bold">{t("brand_title")}</span> &copy; {new Date().getFullYear()}
        </div>
        <div className="flex gap-5">
          <a href="#about" className="hover:underline">{t("about")}</a>
          <a href="#privacy" className="hover:underline">{t("privacy_policy")}</a>
          <a href="#terms" className="hover:underline">{t("terms")}</a>
        </div>
        <div>
          {t("footer_made_with")} <span className="text-pink-500">♥</span> {t("footer_by_stc")}
        </div>
      </div>
    </footer>
  );
}

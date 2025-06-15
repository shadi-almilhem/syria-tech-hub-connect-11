
import SearchBar from "./SearchBar";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between gap-6 py-16 sm:py-24 md:py-32 container">
      <div className="flex-1 space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-primary mb-3">
          {t("hero_title")}
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-xl mb-6">
          {t("hero_subtitle")}
        </p>
        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
          <a
            href="#signup"
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-primary/90 text-base transition"
          >
            {t("join_expert_trainee")}
          </a>
          <a
            href="#post-job"
            className="px-6 py-3 rounded-lg border border-primary text-primary font-semibold text-base hover:bg-primary/10 transition"
          >
            {t("post_job")}
          </a>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center w-full max-w-lg animate-fade-in">
        <img
          src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80"
          alt={t("hero_image_alt")}
          className="rounded-2xl shadow-xl mb-8 max-h-72 object-cover border"
        />
        <SearchBar />
      </div>
    </section>
  );
}

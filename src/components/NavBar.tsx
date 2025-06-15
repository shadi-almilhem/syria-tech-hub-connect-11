
import { Home, Users, Briefcase, MessageSquare, LogIn } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "@/i18n";

const pages = [
  { name: "nav_home", path: "/", icon: Home },
  { name: "nav_experts", path: "/experts", icon: Users },
  { name: "nav_trainees", path: "/trainees", icon: Users },
  { name: "nav_companies", path: "/companies", icon: Briefcase },
  { name: "nav_jobs", path: "/jobs", icon: Briefcase },
  { name: "nav_forum", path: "/forum", icon: MessageSquare },
];

export default function NavBar() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <header className="w-full bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <nav className="container max-w-screen-2xl mx-auto px-4 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary tracking-tight">
          <img src="/logo.svg" alt="Syrian Tech Club" className="w-8 h-8 rounded-lg" />
          {t("brand_title")}
        </Link>
        <ul className="flex items-center gap-2 ml-4">
          {pages.map((page) => {
            const Icon = page.icon;
            const active = location.pathname === page.path || (page.path === "/" && location.pathname === "/");
            return (
              <li key={page.name}>
                <Link
                  to={page.path}
                  className={`flex items-center gap-1 font-semibold px-3 py-1.5 text-primary rounded-md hover:bg-primary hover:text-white transition ${active ? "bg-primary text-white" : ""}`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{t(page.name)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link
            to="/auth"
            className="text-primary border border-primary px-4 py-1.5 rounded-lg flex items-center gap-2 hover:bg-primary hover:text-white transition"
          >
            <LogIn size={18} />
            <span className="font-semibold text-sm hidden sm:inline">{t("login_signup")}</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}

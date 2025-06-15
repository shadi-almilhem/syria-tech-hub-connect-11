
import { Home, Users, Briefcase, MessageSquare, LogIn, UserRound } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "@/i18n";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useState } from "react";
import Modal from "./Modal";
import UserProfile from "./UserProfile";

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
  const { user, session, loading } = useAuthUser();
  const [profileOpen, setProfileOpen] = useState(false);

  // Show loading state for auth
  if (loading) return null;

  // Profile button (avatar or default) if logged in
  let profileButton = null;

  if (user) {
    // Use Supabase user id to fetch the user's profile info for image
    // We'll use the default dicebear image if necessary, since not all info is immediately available
    const defaultPic = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=128&h=128&fit=facearea";
    // We'll let <UserProfile> re-fetch, so for now just use session data
    profileButton = (
      <>
        <button
          className="rounded-full w-10 h-10 bg-gray-100 border hover:shadow transition overflow-hidden focus:ring-2 focus:ring-primary focus:outline-none"
          onClick={() => setProfileOpen(true)}
          aria-label="Open profile"
        >
          <img
            src={defaultPic}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </button>
        <Modal open={profileOpen} onClose={() => setProfileOpen(false)}>
          <UserProfile onClose={() => setProfileOpen(false)} />
        </Modal>
      </>
    );
  }

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
          {!user && (
            <Link
              to="/auth"
              className="text-primary border border-primary px-4 py-1.5 rounded-lg flex items-center gap-2 hover:bg-primary hover:text-white transition"
            >
              <LogIn size={18} />
              <span className="font-semibold text-sm hidden sm:inline">{t("login_signup")}</span>
            </Link>
          )}
          {user && profileButton}
        </div>
      </nav>
    </header>
  );
}

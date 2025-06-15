
import { Home, Users, Briefcase, MessageSquare, LogIn } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { Link, useLocation } from "react-router-dom";

const pages = [
  { name: "Home", path: "/", icon: Home },
  { name: "Experts", path: "/experts", icon: Users },
  { name: "Trainees", path: "/trainees", icon: Users },
  { name: "Companies", path: "/companies", icon: Briefcase },
  { name: "Jobs", path: "/jobs", icon: Briefcase },
  { name: "Forum", path: "/forum", icon: MessageSquare },
];

export default function NavBar() {
  const location = useLocation();

  return (
    <header className="w-full bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <nav className="container max-w-screen-2xl mx-auto px-4 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary tracking-tight">
          <img src="/logo.svg" alt="Syrian Tech Club" className="w-8 h-8 rounded-lg" />
          Syrian Tech Club
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
                  <span className="hidden sm:inline">{page.name}</span>
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
            <span className="font-semibold text-sm hidden sm:inline">Login / Signup</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}

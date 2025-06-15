
import { LogIn } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { Link } from "react-router-dom";

const pages = [
  { name: "Experts", path: "/experts" },
  { name: "Trainees", path: "/trainees" },
  { name: "Companies", path: "/companies" },
];

export default function NavBar() {
  return (
    <header className="w-full bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <nav className="container max-w-screen-2xl mx-auto px-4 flex items-center justify-between h-20">
        <a href="/" className="flex items-center gap-2 font-bold text-xl text-primary tracking-tight">
          <img src="/logo.svg" alt="Syrian Tech Club" className="w-8 h-8 rounded-lg" />
          Syrian Tech Club
        </a>
        <ul className="flex items-center gap-2 ml-4">
          {pages.map((page) => (
            <li key={page.name}>
              <Link
                to={page.path}
                className="font-semibold px-3 py-1.5 text-primary rounded-md hover:bg-primary hover:text-white transition"
              >
                {page.name}
              </Link>
            </li>
          ))}
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

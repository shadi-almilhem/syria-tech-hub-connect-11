
import { LogIn, User, Users, Briefcase, Star } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

const roles = [
  { name: "Visitor", icon: User },
  { name: "Expert", icon: Star },
  { name: "Trainee", icon: Users },
  { name: "Company", icon: Briefcase },
];

export default function NavBar({
  currentRole = "Visitor",
  onRoleChange,
}: {
  currentRole?: string;
  onRoleChange?: (role: string) => void;
}) {
  return (
    <header className="w-full bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <nav className="container max-w-screen-2xl mx-auto px-4 flex items-center justify-between h-20">
        <a href="/" className="flex items-center gap-2 font-bold text-xl text-primary tracking-tight">
          <img src="/logo.svg" alt="Syrian Tech Club" className="w-8 h-8 rounded-lg" />
          Syrian Tech Club
        </a>
        <ul className="flex items-center gap-1">
          {roles.map((role) => (
            <li key={role.name}>
              <button
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-medium transition-colors
                  ${currentRole === role.name
                  ? "bg-primary text-white shadow"
                  : "hover:bg-gray-100 text-gray-700"}
                `}
                onClick={() => onRoleChange?.(role.name)}
              >
                <role.icon size={18} />
                <span className="hidden md:inline">{role.name}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <a
            href="#login"
            className="text-primary border border-primary px-4 py-1.5 rounded-lg flex items-center gap-2 hover:bg-primary hover:text-white transition"
          >
            <LogIn size={18} />
            <span className="font-semibold text-sm hidden sm:inline">Login / Signup</span>
          </a>
        </div>
      </nav>
    </header>
  );
}

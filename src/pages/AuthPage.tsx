import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

const ROLES = [
  { value: "trainee", label: "Trainee" },
  { value: "expert", label: "Expert" },
  { value: "company", label: "Company" },
  { value: "admin", label: "Admin" }, // Added admin to match TS type
];

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState<"trainee" | "expert" | "company" | "admin">("trainee");
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/", { replace: true });
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/", { replace: true });
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  const resetFields = () => {
    setEmail("");
    setPassword("");
    setName("");
    setCountry("");
    setBio("");
    setRole("trainee");
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-background relative">
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute left-4 top-4 flex items-center gap-2 text-gray-600 hover:text-primary px-3 py-2 rounded transition bg-white/80"
        aria-label={t("back_home")}
        type="button"
      >
        <ArrowLeft size={20} />
        <span className="hidden sm:inline font-medium">{t("back")}</span>
      </button>
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 border flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-primary mb-2 text-center">
          {isLogin ? t("login") : t("signup")}
        </h1>
        {isLogin ? (
          <LoginForm
            onSuccess={() => {
              // optionally handle success
            }}
            onError={() => {
              // optionally handle error
            }}
          />
        ) : (
          <SignupForm
            onSuccess={() => {
              // optionally handle success
            }}
            onError={() => {
              // optionally handle error
            }}
          />
        )}
        <button
          className="text-blue-500 mt-2 hover:underline"
          onClick={() => {
            setIsLogin(v => !v);
            resetFields();
          }}
        >
          {isLogin ? t("dont_have_account") : t("already_have_account")}
        </button>
      </div>
    </div>
  );
}

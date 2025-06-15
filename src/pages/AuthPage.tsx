import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    if (isLogin) {
      // Login
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErrorMsg(error.message);
    } else {
      // Simple client validation
      if (!name.trim()) {
        setErrorMsg("Please enter your name.");
        setLoading(false);
        return;
      }
      if (
        name
          .trim()
          .toLowerCase()
          .includes("@")
      ) {
        setErrorMsg("Name cannot be an email address.");
        setLoading(false);
        return;
      }
      if (bio.length > 200) {
        setErrorMsg("Bio should be less than 200 characters.");
        setLoading(false);
        return;
      }
      // Signup
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });
      if (error) {
        setErrorMsg(error.message);
      } else if (data?.user) {
        // Update profile after user created (wait for session to exist)
        await supabase
          .from("profiles")
          .update({
            name,
            country: country || null,
            bio: bio || null,
            role,
          })
          .eq("id", data.user.id);
      }
    }
    setLoading(false);
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
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div>
                <Label htmlFor="name">{t("name")}</Label>
                <Input
                  id="name"
                  required
                  placeholder={t("your_full_name")}
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="country">{t("country")}</Label>
                <Input
                  id="country"
                  placeholder={t("country")}
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bio">
                  {t("bio")}{" "}
                  <span className="text-xs text-muted-foreground">{t("max_chars", { count: 200 })}</span>
                </Label>
                <Textarea
                  id="bio"
                  placeholder={t("about_you")}
                  maxLength={200}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="role">Account Type</Label>
                <select
                  id="role"
                  required
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  {ROLES.map(r => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div>
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder={t("email")}
              className="px-4 py-2 border rounded"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              type="password"
              required
              placeholder={t("password")}
              className="px-4 py-2 border rounded"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>
          {errorMsg && (
            <div className="text-red-600 text-sm rounded bg-red-50 p-2">{errorMsg}</div>
          )}
          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? t("please_wait") : isLogin ? t("login") : t("create_account")}
          </Button>
        </form>
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

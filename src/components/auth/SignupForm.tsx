
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import RoleSelector from "./RoleSelector";
import { useTranslation } from "react-i18next";

type Role = "trainee" | "expert" | "company" | "admin";

export default function SignupForm({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState<Role>("trainee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    // Validation
    if (!name.trim()) {
      const msg = "Please enter your name.";
      setErrorMsg(msg);
      setLoading(false);
      onError?.(msg);
      return;
    }
    if (name.trim().toLowerCase().includes("@")) {
      const msg = "Name cannot be an email address.";
      setErrorMsg(msg);
      setLoading(false);
      onError?.(msg);
      return;
    }
    if (bio.length > 200) {
      const msg = "Bio should be less than 200 characters.";
      setErrorMsg(msg);
      setLoading(false);
      onError?.(msg);
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
      onError?.(error.message);
    } else if (data?.user) {
      await supabase
        .from("profiles")
        .update({
          name,
          country: country || null,
          bio: bio || null,
          role,
        })
        .eq("id", data.user.id);
      onSuccess?.();
    }
    setLoading(false);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
      <RoleSelector value={role} onChange={setRole} />
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
          autoComplete="new-password"
        />
      </div>
      {errorMsg && (
        <div className="text-red-600 text-sm rounded bg-red-50 p-2">{errorMsg}</div>
      )}
      <Button type="submit" disabled={loading} className="mt-2 w-full">
        {loading ? t("please_wait") : t("create_account")}
      </Button>
    </form>
  );
}


import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function LoginForm({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg(error.message);
      onError?.(error.message);
    } else {
      onSuccess?.();
    }
    setLoading(false);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleLogin}>
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
          autoComplete="current-password"
        />
      </div>
      {errorMsg && (
        <div className="text-red-600 text-sm rounded bg-red-50 p-2">{errorMsg}</div>
      )}
      <Button type="submit" disabled={loading} className="mt-2 w-full">
        {loading ? t("please_wait") : t("login")}
      </Button>
    </form>
  );
}

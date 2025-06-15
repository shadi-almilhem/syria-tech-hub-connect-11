
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect home
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/", { replace: true });
      }
    });

    // Listen to auth changes and redirect
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/", { replace: true });
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    if (isLogin) {
      // Login
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setErrorMsg(error.message);
      }
    } else {
      // Signup
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });
      if (error) {
        setErrorMsg(error.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-background">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 border flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-primary mb-2 text-center">
          {isLogin ? "Login" : "Sign up"}
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            placeholder="Email"
            className="px-4 py-2 border rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="username"
          />
          <input
            type="password"
            required
            placeholder="Password"
            className="px-4 py-2 border rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
          {errorMsg && (
            <div className="text-red-600 text-sm rounded bg-red-50 p-2">{errorMsg}</div>
          )}
          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </Button>
        </form>
        <button
          className="text-blue-500 mt-2 hover:underline"
          onClick={() => setIsLogin(v => !v)}
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
}

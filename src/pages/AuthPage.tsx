
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  // New sign up fields
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

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
        await supabase.from("profiles").update({
          name,
          country: country || null,
          bio: bio || null,
        })
        .eq("id", data.user.id);
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
          {!isLogin && (
            <>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  placeholder="Your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="Country"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  />
              </div>
              <div>
                <Label htmlFor="bio">Bio <span className="text-xs text-muted-foreground">(max 200 chars)</span></Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  maxLength={200}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  />
              </div>
            </>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="Email"
              className="px-4 py-2 border rounded"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              placeholder="Password"
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
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </Button>
        </form>
        <button
          className="text-blue-500 mt-2 hover:underline"
          onClick={() => {
            setIsLogin(v => !v);
            resetFields();
          }}
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
}

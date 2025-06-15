import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import ExpertsPage from "./pages/ExpertsPage";
import TraineesPage from "./pages/TraineesPage";
import CompaniesPage from "./pages/CompaniesPage";
import JobsPage from "./pages/JobsPage";
import ForumPage from "./pages/ForumPage";
import ProfilePage from "./pages/ProfilePage";
import { supabase } from "@/integrations/supabase/client";

// Helper component to protect routes that require authentication
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for logged-in status
    supabase.auth.getSession().then(({ data }) => {
      setAuthenticated(!!data.session);
      setChecked(true);
      if (!data.session) {
        navigate("/auth", { replace: true, state: { from: location.pathname } });
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
      setChecked(true);
      if (!session) {
        navigate("/auth", { replace: true, state: { from: location.pathname } });
      }
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
    // eslint-disable-next-line
  }, [location.pathname, navigate]);

  if (!checked) {
    // Loading, or checking session
    return <div className="flex justify-center items-center min-h-screen text-gray-400">Loading...</div>;
  }

  return authenticated ? <>{children}</> : null;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<Index />} />
          <Route path="/experts" element={<ExpertsPage />} />
          <Route path="/trainees" element={<TraineesPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* Future: Protect private routes with PrivateRoute if needed */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

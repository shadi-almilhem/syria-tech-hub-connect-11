
import { useNavigate } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Logged out",
        description: "You have been logged out.",
        variant: "default"
      });
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2">
      <div className="max-w-2xl mx-auto">
        <UserProfile
          onClose={() => navigate(-1)}
          pageView={true}
          onLogout={handleLogout}
        />
      </div>
    </div>
  );
}

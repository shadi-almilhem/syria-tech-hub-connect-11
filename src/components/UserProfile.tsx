
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import EditProfileForm from "./EditProfileForm";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, LogOut } from "lucide-react";

export default function UserProfile({
  onClose,
  pageView,
  onLogout,
}: {
  onClose?: () => void;
  pageView?: boolean;
  onLogout?: () => void;
}) {
  const [profile, setProfile] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setProfile(data);
      }
    };
    getProfile();
    // eslint-disable-next-line
  }, []);

  const handleUpdate = (updated: any) => {
    setProfile(updated);
    setEditOpen(false);
  };

  if (!profile)
    return (
      <div className="py-16 flex justify-center items-center text-gray-500">
        Loading...
      </div>
    );

  const fallbackImage =
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=128&h=128&fit=facearea";

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 relative w-full">
      {pageView && onClose && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute left-2 top-2"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      )}
      <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-8">
        <img
          src={profile.profile_image || fallbackImage}
          alt={profile.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-primary"
        />
        <div className="flex-1 w-full">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-extrabold text-gray-800">
              {profile.name}
            </h1>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-semibold uppercase">
              {profile.main_field || "No Field"}
            </span>
          </div>
          <div className="mt-2 text-gray-500">{profile.bio || "—"}</div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><span className="font-semibold text-gray-800">Phone:</span> {profile.phone || "—"}</div>
            <div><span className="font-semibold text-gray-800">Country:</span> {profile.country || "—"}</div>
            <div><span className="font-semibold text-gray-800">City:</span> {profile.city || "—"}</div>
            <div><span className="font-semibold text-gray-800">Nationality:</span> {profile.nationality || "—"}</div>
          </div>
        </div>
      </div>
      <div className="flex flex-row-reverse gap-2">
        <Button onClick={() => setEditOpen(true)}>Edit Profile</Button>
        {onLogout && (
          <Button
            onClick={onLogout}
            variant="outline"
            className="flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        )}
      </div>
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditOpen(false)}
              className="absolute right-2 top-2"
              aria-label="Close edit"
            >
              ×
            </Button>
            <h2 className="font-bold text-xl mb-3">Edit Profile</h2>
            <EditProfileForm
              profile={profile}
              onSubmit={handleUpdate}
              onCancel={() => setEditOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

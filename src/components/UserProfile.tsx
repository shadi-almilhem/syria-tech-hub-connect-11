
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Modal from "./Modal";
import EditProfileForm from "./EditProfileForm";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

export default function UserProfile({ onClose }: { onClose?: () => void }) {
  const [profile, setProfile] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;
      const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        setProfile(data);
      }
    };
    getProfile();
  }, []);

  const handleUpdate = (updated: any) => {
    setProfile(updated);
    setEditOpen(false);
  };

  if (!profile) return <div className="py-12 text-center text-gray-400">Loading...</div>;

  // Fallback for profile image
  const fallbackImage = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=128&h=128&fit=facearea";

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white shadow rounded-xl p-6">
      <div className="flex gap-4 items-center">
        <img
          src={profile.profile_image || fallbackImage}
          alt={profile.name}
          className="w-20 h-20 rounded-full border object-cover"
        />
        <div>
          <div className="text-2xl font-bold">{profile.name}</div>
          <div className="text-gray-500">{profile.main_field}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto bg-gray-100 p-2 rounded hover:bg-gray-200"
            aria-label="Close profile modal"
          >×</button>
        )}
      </div>
      <div className="my-5">
        <div className="text-gray-700"><strong>Bio:</strong> {profile.bio || "-"}</div>
        <div className="text-gray-700"><strong>Phone:</strong> {profile.phone || "-"}</div>
        <div className="text-gray-700"><strong>Country:</strong> {profile.country || "-"}</div>
        <div className="text-gray-700"><strong>City:</strong> {profile.city || "-"}</div>
        <div className="text-gray-700"><strong>Nationality:</strong> {profile.nationality || "-"}</div>
      </div>
      <Button onClick={() => setEditOpen(true)}>Edit Profile</Button>
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <h2 className="font-bold text-xl mb-3">Edit Profile</h2>
        <EditProfileForm profile={profile} onSubmit={handleUpdate} onCancel={() => setEditOpen(false)} />
      </Modal>
    </div>
  );
}

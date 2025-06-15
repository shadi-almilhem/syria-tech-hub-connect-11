
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

type Props = {
  profile: any;
  onSubmit: (updated: any) => void;
  onCancel: () => void;
};

export default function EditProfileForm({ profile, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    name: profile.name || "",
    phone: profile.phone || "",
    main_field: profile.main_field || "",
    bio: profile.bio || "",
    country: profile.country || "",
    city: profile.city || "",
    nationality: profile.nationality || "",
    profile_image: profile.profile_image || "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error, data } = await supabase
      .from("profiles")
      .update(form)
      .eq("id", profile.id)
      .select()
      .single();
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!", description: "Your profile changes were saved.", variant: "success" });
      onSubmit(data);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <Input name="name" value={form.name} onChange={handleChange} required placeholder="Name" />
      <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
      <Input name="main_field" value={form.main_field} onChange={handleChange} placeholder="Main Field" />
      <Textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Bio" rows={3} />
      <Input name="country" value={form.country} onChange={handleChange} placeholder="Country" />
      <Input name="city" value={form.city} onChange={handleChange} placeholder="City" />
      <Input name="nationality" value={form.nationality} onChange={handleChange} placeholder="Nationality" />
      <Input name="profile_image" value={form.profile_image} onChange={handleChange} placeholder="Profile Image URL" />
      <div className="flex gap-2 mt-3">
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

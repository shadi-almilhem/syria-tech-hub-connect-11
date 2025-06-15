
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, MapPin, Search, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type TraineeProfile = {
  id: string;
  name: string;
  profile_image: string | null;
  country: string | null;
  city: string | null;
  bio: string | null;
};

export default function TraineesPage() {
  const { t, i18n } = useTranslation();
  const [trainees, setTrainees] = useState<TraineeProfile[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<TraineeProfile[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Fetch current user profile to determine role
  useEffect(() => {
    async function fetchRole() {
      setIsAdmin(false);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();
      if (data && data.role === "admin") setIsAdmin(true);
    }
    fetchRole();
  }, []);

  useEffect(() => {
    async function fetchTrainees() {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, profile_image, city, country, bio, role")
        .eq("role", "trainee");
      if (!data || error) return setTrainees([]);
      setTrainees(data);
    }
    fetchTrainees();
  }, []);

  useEffect(() => {
    let list = trainees;
    if (search) {
      const kw = search.trim().toLowerCase();
      list = list.filter(
        t =>
          t.name.toLowerCase().includes(kw) ||
          (t.bio?.toLowerCase().includes(kw)) ||
          (t.city?.toLowerCase().includes(kw)) ||
          (t.country?.toLowerCase().includes(kw))
      );
    }
    setFiltered(list);
  }, [search, trainees]);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Are you sure you want to delete ${name}'s account? This cannot be undone.`)) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);
    setLoading(false);
    if (error) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTrainees(prev => prev.filter(u => u.id !== id));
      toast({
        title: t("user_deleted"),
        description: t("user_deleted_success", { name },
        ),
        variant: "default",
      });
    }
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 min-h-screen" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <h1 className="text-3xl font-bold mb-6 text-primary text-center">{t("trainee_directory")}</h1>
      <div className="flex items-center gap-4 mb-8">
        <Input
          placeholder={t("search_trainees")}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-1/2"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-gray-500">{t("no_trainees_found")}</p>
        )}
        {filtered.map(trainee => (
          <Card key={trainee.id} className="p-0 hover:shadow-lg transition animate-fade-in">
            <CardContent className="flex flex-col items-center p-6 relative">
              {trainee.profile_image ? (
                <img
                  src={trainee.profile_image}
                  alt={trainee.name}
                  className="rounded-lg w-16 h-16 object-cover border mb-3"
                />
              ) : (
                <User className="w-16 h-16 text-gray-400 mb-3" />
              )}
              <div className="text-lg font-bold">{trainee.name}</div>
              <div className="flex gap-1 text-xs text-gray-500 mb-1">
                {trainee.city && (
                  <>
                    <MapPin size={14} />
                    {trainee.city}
                  </>
                )}
                {trainee.country && (
                  <>
                    <span className="mx-1">/</span>
                    {trainee.country}
                  </>
                )}
              </div>
              <div className="text-gray-700 text-sm text-center mb-2 line-clamp-2">
                {trainee.bio || "-"}
              </div>
              {isAdmin && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  title="Delete trainee"
                  disabled={loading}
                  onClick={() => handleDelete(trainee.id, trainee.name)}
                >
                  <Trash2 className="mr-1 w-4 h-4" />
                  {t("delete")}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

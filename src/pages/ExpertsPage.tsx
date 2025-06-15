
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";

type ExpertProfile = {
  id: string;
  name: string;
  main_field: string | null;
  profile_image: string | null;
  city: string | null;
  country: string | null;
  bio: string | null;
  rating?: number;
  skills: string[];
};

export default function ExpertsPage() {
  const [experts, setExperts] = useState<ExpertProfile[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<ExpertProfile[]>([]);
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [filterSkill, setFilterSkill] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterCountry, setFilterCountry] = useState("");

  useEffect(() => {
    // Fetch all expert profiles
    async function fetchExperts() {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id,name,main_field,profile_image,city,country,bio,social_profile"
        )
        .eq("role", "expert");

      if (!data || error) return setExperts([]);

      // Collect skills from social_profile (if any)
      const expertsWithSkills: ExpertProfile[] = data.map((row: any) => ({
        ...row,
        skills:
          row.social_profile?.skills ||
          (row.main_field ? [row.main_field] : []),
      }));

      setExperts(expertsWithSkills);

      // Gather unique skill list for filters
      const s = new Set<string>();
      expertsWithSkills.forEach(e =>
        e.skills.forEach(skill => {
          if (skill && skill.length < 32) s.add(skill.trim());
        })
      );
      setSkillsList([...s]);
    }
    fetchExperts();
  }, []);

  useEffect(() => {
    // Apply all filters
    let list = experts;
    if (search) {
      const kw = search.trim().toLowerCase();
      list = list.filter(
        e =>
          e.name.toLowerCase().includes(kw) ||
          (e.main_field?.toLowerCase().includes(kw)) ||
          e.skills.some(skill => skill.toLowerCase().includes(kw)) ||
          (e.bio?.toLowerCase().includes(kw))
      );
    }
    if (filterSkill) {
      list = list.filter(e =>
        e.skills.some(skill =>
          skill.toLowerCase().includes(filterSkill.toLowerCase())
        )
      );
    }
    if (filterCity) {
      list = list.filter(e =>
        (e.city || "").toLowerCase().includes(filterCity.toLowerCase())
      );
    }
    if (filterCountry) {
      list = list.filter(e =>
        (e.country || "").toLowerCase().includes(filterCountry.toLowerCase())
      );
    }
    setFiltered(list);
  }, [search, filterSkill, filterCity, filterCountry, experts]);

  return (
    <div className="container max-w-6xl mx-auto py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-primary text-center">Expert Directory</h1>
      <div className="flex flex-col gap-3 md:flex-row md:gap-6 items-center mb-8">
        <Input
          placeholder="Search experts by name, skill, or keyword..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-2/5"
        />
        <select
          value={filterSkill}
          onChange={e => setFilterSkill(e.target.value)}
          className="w-full md:w-1/5 border rounded px-3 py-2"
        >
          <option value="">All Skills</option>
          {skillsList.map(skill => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>
        <Input
          placeholder="Filter by city"
          value={filterCity}
          onChange={e => setFilterCity(e.target.value)}
          className="w-full md:w-1/5"
        />
        <Input
          placeholder="Filter by country"
          value={filterCountry}
          onChange={e => setFilterCountry(e.target.value)}
          className="w-full md:w-1/5"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-gray-500">No experts found.</p>
        )}
        {filtered.map(profile => (
          <Card key={profile.id} className="p-0 animate-fade-in hover:shadow-lg transition">
            <CardContent className="flex flex-col items-center p-6">
              <img
                src={
                  profile.profile_image ||
                  "https://api.dicebear.com/7.x/lorelei/svg?seed=" +
                    encodeURIComponent(profile.name)
                }
                alt={profile.name}
                className="rounded-full w-20 h-20 object-cover border mb-3"
              />
              <div className="text-lg font-semibold">{profile.name}</div>
              <div className="flex gap-1 text-xs text-gray-500 mb-1">
                {profile.city && (
                  <>
                    <MapPin size={14} />
                    {profile.city}
                  </>
                )}
                {profile.country && (
                  <>
                    <span className="mx-1">/</span>
                    {profile.country}
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {profile.skills.map(skill => (
                  <span
                    key={skill}
                    className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="text-gray-700 text-sm mb-3 line-clamp-2 text-center">
                {profile.bio || "-"}
              </div>
              <div className="flex items-center gap-1">
                <Star className="text-yellow-400" size={15} />
                <span className="font-semibold">{(profile.rating ?? 5).toFixed(1)}</span>
                <span className="text-xs text-gray-400">/ 5</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

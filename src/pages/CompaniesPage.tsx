import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Building, MapPin, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type CompanyProfile = {
  id: string;
  name: string;
  profile_image: string | null;
  country: string | null;
  city: string | null;
  bio: string | null;
  jobCount: number;
};

export default function CompaniesPage() {
  const { t, i18n } = useTranslation();
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<CompanyProfile[]>([]);

  useEffect(() => {
    async function fetchCompanies() {
      // Get company profiles and count of jobs for each company.
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, profile_image, city, country, bio, jobs:jobs(id)")
        .eq("role", "company");

      if (!data || error) return setCompanies([]);

      setCompanies(
        data.map((row: any) => ({
          ...row,
          jobCount: Array.isArray(row.jobs) ? row.jobs.length : 0,
        }))
      );
    }
    fetchCompanies();
  }, []);

  useEffect(() => {
    let list = companies;
    if (search) {
      const kw = search.trim().toLowerCase();
      list = list.filter(
        c =>
          c.name.toLowerCase().includes(kw) ||
          (c.bio?.toLowerCase().includes(kw)) ||
          (c.city?.toLowerCase().includes(kw)) ||
          (c.country?.toLowerCase().includes(kw))
      );
    }
    setFiltered(list);
  }, [search, companies]);

  const navigate = useNavigate();

  return (
    <div className="container max-w-6xl mx-auto py-8 min-h-screen" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <h1 className="text-3xl font-bold mb-6 text-primary text-center">{t("company_directory")}</h1>
      <div className="flex items-center gap-4 mb-8">
        <Input
          placeholder={t("search_companies")}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-1/2"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-gray-500">{t("no_companies_found")}</p>
        )}
        {filtered.map(company => (
          <Card
            key={company.id}
            className="p-0 hover:shadow-lg transition animate-fade-in cursor-pointer"
            onClick={() => navigate(`/company/${company.id}`)}
            tabIndex={0}
          >
            <CardContent className="flex flex-col items-center p-6">
              {company.profile_image ? (
                <img
                  src={company.profile_image}
                  alt={company.name}
                  className="rounded-lg w-16 h-16 object-cover border mb-3"
                />
              ) : (
                <Building className="w-16 h-16 text-gray-400 mb-3" />
              )}
              <div className="text-lg font-bold">{company.name}</div>
              <div className="flex gap-1 text-xs text-gray-500 mb-1">
                {company.city && (
                  <>
                    <MapPin size={14} />
                    {company.city}
                  </>
                )}
                {company.country && (
                  <>
                    <span className="mx-1">/</span>
                    {company.country}
                  </>
                )}
              </div>
              <div className="text-gray-700 text-sm text-center mb-2 line-clamp-2">
                {company.bio || "-"}
              </div>
              <div className="text-xs text-primary-700 font-semibold">
                {company.jobCount} {t("job", { count: company.jobCount })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

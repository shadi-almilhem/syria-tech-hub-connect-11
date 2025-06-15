
import { Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Result = {
  type: "job" | "expert" | "company" | "trainee";
  id: string;
  title: string;
  subtitle?: string;
  image?: string | null;
};

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    let isActive = true;

    const fetchResults = async () => {
      const kw = keyword.trim();
      // Search jobs
      const jobsPromise = supabase
        .from("jobs")
        .select("id,title,company_id,location")
        .ilike("title", `%${kw}%`)
        .limit(3);
      // Search experts
      const expertsPromise = supabase
        .from("profiles")
        .select("id,name,profile_image,main_field")
        .eq("role", "expert")
        .or(`name.ilike.%${kw}%,main_field.ilike.%${kw}%`)
        .limit(2);
      // Search trainees
      const traineesPromise = supabase
        .from("profiles")
        .select("id,name,profile_image,main_field")
        .eq("role", "trainee")
        .or(`name.ilike.%${kw}%,main_field.ilike.%${kw}%`)
        .limit(2);
      // Search companies
      const companiesPromise = supabase
        .from("profiles")
        .select("id,name,profile_image,city")
        .eq("role", "company")
        .or(`name.ilike.%${kw}%`)
        .limit(3);

      const [
        { data: jobs },
        { data: experts },
        { data: trainees },
        { data: companies },
      ] = await Promise.all([
        jobsPromise,
        expertsPromise,
        traineesPromise,
        companiesPromise,
      ]);

      if (!isActive) return;

      const resultsArr: Result[] = [];
      // Jobs
      (jobs || []).forEach((job: any) => {
        resultsArr.push({
          type: "job",
          id: job.id,
          title: job.title,
          subtitle: job.location || "",
        });
      });
      // Experts
      (experts || []).forEach((ex: any) => {
        resultsArr.push({
          type: "expert",
          id: ex.id,
          title: ex.name,
          subtitle: ex.main_field,
          image: ex.profile_image,
        });
      });
      // Trainees
      (trainees || []).forEach((tr: any) => {
        resultsArr.push({
          type: "trainee",
          id: tr.id,
          title: tr.name,
          subtitle: tr.main_field,
          image: tr.profile_image,
        });
      });
      // Companies
      (companies || []).forEach((co: any) => {
        resultsArr.push({
          type: "company",
          id: co.id,
          title: co.name,
          subtitle: co.city,
          image: co.profile_image,
        });
      });
      setResults(resultsArr);
      setOpen(resultsArr.length > 0);
    };

    // Debounce
    const delay = setTimeout(fetchResults, 170);
    return () => {
      isActive = false;
      clearTimeout(delay);
    };
  }, [keyword]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  // Navigation handler
  const handleResultClick = (res: Result) => {
    setOpen(false);
    setKeyword("");
    switch (res.type) {
      case "job":
        navigate(`/jobs`);
        break;
      case "expert":
        navigate(`/experts`);
        break;
      case "trainee":
        navigate(`/trainees`);
        break;
      case "company":
        navigate(`/companies`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative w-full">
      <form
        className="flex flex-col md:flex-row w-full gap-2 bg-white/70 p-3 rounded-xl shadow border border-gray-100"
        onSubmit={e => {
          e.preventDefault();
          setOpen(true);
        }}
        role="search"
        autoComplete="off"
      >
        <div className="flex items-center flex-1 min-w-0">
          <Search className="mx-2 text-primary" />
          <input
            ref={inputRef}
            className="w-full bg-transparent border-none outline-none px-2 py-1 text-base"
            placeholder="Search jobs, skills, experts, companies..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
        >
          Search
        </button>
      </form>
      {open && results.length > 0 && (
        <div className="absolute mt-1 left-0 right-0 rounded-lg shadow-lg border z-50 bg-white animate-fade-in">
          <ul className="divide-y divide-gray-100 max-h-72 overflow-auto">
            {results.map((item, idx) => (
              <li
                key={item.type + item.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 cursor-pointer transition"
                onClick={() => handleResultClick(item)}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-7 h-7 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 font-bold text-xs">
                    {item.type.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-sm text-primary truncate">{item.title}</span>
                  {item.subtitle && (
                    <span className="text-xs text-gray-500 truncate">{item.subtitle}</span>
                  )}
                  <span className="text-[11px] text-gray-400 uppercase">{item.type}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

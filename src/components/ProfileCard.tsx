
import { Star, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

export type Profile = {
  avatarUrl?: string;
  name: string;
  role: string;
  skills: string[];
  location?: string;
  bio?: string;
  rating?: number;
};

export default function ProfileCard({
  profile,
  onViewProfile
}: {
  profile: Profile;
  onViewProfile?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-xl border shadow hover:shadow-lg transition p-6 flex flex-col gap-3 w-full max-w-xs mx-auto">
      <div className="flex items-center gap-4">
        <img
          src={profile.avatarUrl || "https://api.dicebear.com/7.x/lorelei/svg?seed=" + encodeURIComponent(profile.name)}
          alt={profile.name}
          className="w-16 h-16 rounded-full border object-cover"
        />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-lg">{profile.name}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary text-white">{profile.role}</span>
          </div>
          <div className="flex items-center text-gray-500 gap-1 text-xs">
            {profile.location && (
              <>
                <MapPin size={16} className="inline mr-1" />
                {profile.location}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {profile.skills.map(skill => (
          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium" key={skill}>
            {skill}
          </span>
        ))}
      </div>
      <div className="text-gray-700 text-sm line-clamp-2">{profile.bio || "-"}</div>
      <div className="flex items-center gap-1 mt-1">
        <Star className="text-yellow-400" size={16} />
        <span className="font-semibold">{(profile.rating ?? 5).toFixed(1)}</span>
        <span className="text-xs text-gray-400">/ 5</span>
      </div>
      <button
        className="block mt-2 text-center border border-primary text-primary px-4 py-1.5 rounded hover:bg-primary hover:text-white font-semibold transition"
        onClick={onViewProfile}
      >
        {t("view_profile")}
      </button>
    </div>
  );
}

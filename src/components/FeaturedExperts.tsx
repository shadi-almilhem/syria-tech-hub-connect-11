
import ProfileCard, { Profile } from "./ProfileCard";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Modal from "./Modal";

const profiles: Profile[] = [
  {
    name: "Rami al-Khatib",
    role: "React Developer",
    skills: ["React.js", "TypeScript", "Node.js"],
    location: "Damascus",
    bio: "Front-end engineer with 5+ years of experience.",
    rating: 4.9,
    avatarUrl: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    name: "Maya Salman",
    role: "AI Researcher",
    skills: ["Python", "ML", "TensorFlow"],
    location: "Aleppo",
    bio: "AI innovator driving impact in health tech.",
    rating: 5,
    avatarUrl: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    name: "Yazan Haddad",
    role: "Mobile Developer",
    skills: ["Flutter", "Dart"],
    location: "Latakia",
    bio: "Crafting beautiful mobile apps for iOS/Android.",
    rating: 4.8,
    avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  // ...add more mock profiles if needed...
];

function ProfileDetail({ profile, onClose }: { profile: Profile; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex gap-4 items-center mb-2">
        <img
          src={profile.avatarUrl || "https://api.dicebear.com/7.x/lorelei/svg?seed=" + encodeURIComponent(profile.name)}
          alt={profile.name}
          className="w-16 h-16 rounded-full border object-cover"
        />
        <div>
          <h3 className="font-bold text-xl mb-1 flex items-center gap-2">{profile.name} <span className="bg-primary text-white px-2 py-0.5 rounded text-xs">{profile.role}</span></h3>
          <div className="flex items-center gap-1 text-sm text-gray-500">{profile.location}</div>
        </div>
      </div>
      <div className="mb-2 flex flex-wrap gap-2">
        {profile.skills.map(skill => (
          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium" key={skill}>
            {skill}
          </span>
        ))}
      </div>
      <div className="mb-2 text-gray-700 text-sm">{profile.bio || "-"}</div>
      <div className="flex items-center gap-1">
        <span className="text-yellow-500">★</span>
        <span className="font-semibold">{(profile.rating ?? 5).toFixed(1)}</span>
        <span className="text-xs text-gray-400">/ 5</span>
      </div>
      <button className="mt-5 bg-primary text-white px-4 py-2 rounded font-semibold" onClick={onClose}>
        {t("back")}
      </button>
    </div>
  );
}

export default function FeaturedExperts() {
  const { t } = useTranslation();
  const [profileModal, setProfileModal] = useState<{ open: boolean; profile: Profile | null }>({ open: false, profile: null });

  return (
    <section className="container py-10">
      <h2 className="text-2xl font-bold mb-4 text-primary">{t("featured_experts")}</h2>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {profiles.map((profile, idx) => (
          <div className="shrink-0 w-72" key={idx}>
            <ProfileCard
              profile={profile}
              onViewProfile={() => setProfileModal({ open: true, profile })}
            />
          </div>
        ))}
      </div>
      <Modal open={profileModal.open} onClose={() => setProfileModal({ open: false, profile: null })}>
        {profileModal.profile && (
          <ProfileDetail profile={profileModal.profile} onClose={() => setProfileModal({ open: false, profile: null })} />
        )}
      </Modal>
    </section>
  );
}

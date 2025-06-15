
import ProfileCard, { Profile } from "./ProfileCard";
import { useTranslation } from "react-i18next";

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

export default function FeaturedExperts() {
  const { t } = useTranslation();

  return (
    <section className="container py-10">
      <h2 className="text-2xl font-bold mb-4 text-primary">{t("featured_experts")}</h2>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {profiles.map((profile, idx) => (
          <div className="shrink-0 w-72" key={idx}>
            <ProfileCard profile={profile} />
          </div>
        ))}
      </div>
    </section>
  );
}

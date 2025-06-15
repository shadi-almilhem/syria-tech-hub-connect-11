import { Briefcase, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import Modal from "./Modal";
import { useState } from "react";

const jobs = [
  {
    title: "Senior Front-End Engineer",
    company: "DataCraft",
    location: "Damascus",
    type: "Full-time",
    tags: ["React", "JavaScript", "UI/UX"],
    posted: "2d ago",
  },
  {
    title: "AI/ML Research Intern",
    company: "SyrianAI",
    location: "Aleppo",
    type: "Internship",
    tags: ["Python", "Machine Learning"],
    posted: "1d ago",
  },
  {
    title: "Mobile App Developer",
    company: "Appify",
    location: "Homs",
    type: "Freelance",
    tags: ["Flutter", "Firebase"],
    posted: "3d ago",
  },
  // ...more jobs
];

function JobApplicationForm({ jobTitle, onClose }: { jobTitle: string; onClose: () => void }) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <div>
      <h3 className="text-xl font-bold mb-2">{t("apply")} – {jobTitle}</h3>
      {submitted ? (
        <div className="text-green-600">{t("please_wait")}</div>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();
            setSubmitted(true);
            setTimeout(() => {
              setSubmitted(false);
              onClose();
            }, 1200);
          }}
          className="flex flex-col gap-3"
        >
          <input
            className="border rounded px-3 py-2"
            placeholder={t("your_full_name")}
            required
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            type="email"
            placeholder={t("email")}
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="bg-primary text-white rounded px-4 py-2 font-semibold mt-1 disabled:opacity-50"
            disabled={submitted}
          >
            {t("apply")}
          </button>
        </form>
      )}
    </div>
  );
}

export default function FeaturedJobs() {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<{ title: string } | null>(null);

  return (
    <section className="container py-10">
      <h2 className="text-2xl font-bold mb-4 text-primary">{t("hot_jobs")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {jobs.map((job, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow border hover:shadow-lg p-5 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <Briefcase className="text-primary" size={20} />
              <span className="font-bold text-lg">{job.title}</span>
            </div>
            <div className="text-gray-600">{job.company}</div>
            <div className="flex items-center text-xs gap-2 mt-1 mb-2">
              <MapPin className="text-gray-400" size={16} />
              {job.location}
              <span className="ml-2 rounded bg-blue-50 text-blue-700 px-2 py-0.5">{t(job.type.toLowerCase())}</span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {job.tags.map(tag => (
                <span className="bg-gray-100 text-xs px-2 py-0.5 rounded mr-1" key={tag}>{tag}</span>
              ))}
            </div>
            <span className="text-xs text-gray-400 mt-auto">{job.posted}</span>
            <button
              className="mt-2 w-full text-center bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 font-semibold transition"
              onClick={() => {
                setSelectedJob(job);
                setModalOpen(true);
              }}
            >
              {t("apply")}
            </button>
          </div>
        ))}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedJob && (
          <JobApplicationForm
            jobTitle={selectedJob.title}
            onClose={() => setModalOpen(false)}
          />
        )}
      </Modal>
    </section>
  );
}

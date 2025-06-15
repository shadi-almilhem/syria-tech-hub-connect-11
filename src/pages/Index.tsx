// Home Page for Syrian Tech Club

import NavBar from "../components/NavBar";
import HeroSection from "../components/HeroSection";
import FeaturedJobs from "../components/FeaturedJobs";
import FeaturedExperts from "../components/FeaturedExperts";
import Footer from "../components/Footer";
import { useState } from "react";

// TEMP: simulate simple role logic, in prod connect to Supabase Auth + roles
export default function Index() {
  // Removed role, setRole since we no longer need them
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <main className="flex-grow w-full">
        <HeroSection />
        <FeaturedJobs />
        <FeaturedExperts />
        {/* Future: Forum, Rating, Company panels, Community CTA, etc. */}
      </main>
      <Footer />
    </div>
  );
}

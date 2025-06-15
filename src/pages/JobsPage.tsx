import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function JobsPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <main className="flex-grow w-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-3">Jobs</h1>
          <p className="text-gray-600">This is a placeholder for the Jobs board. Coming soon!</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

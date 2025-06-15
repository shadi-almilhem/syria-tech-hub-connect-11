
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function ForumPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <NavBar />
      <main className="flex-grow w-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-3">Forum</h1>
          <p className="text-gray-600">Welcome to the forum! Community discussion coming soon.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

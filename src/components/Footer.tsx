
export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t text-gray-700 mt-12">
      <div className="container max-w-screen-2xl mx-auto py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <div>
          <span className="font-bold">Syrian Tech Club</span> &copy; {new Date().getFullYear()}
        </div>
        <div className="flex gap-5">
          <a href="#about" className="hover:underline">About</a>
          <a href="#privacy" className="hover:underline">Privacy Policy</a>
          <a href="#terms" className="hover:underline">Terms</a>
        </div>
        <div>
          Made with <span className="text-pink-500">♥</span> by the Syrian Tech Community
        </div>
      </div>
    </footer>
  );
}

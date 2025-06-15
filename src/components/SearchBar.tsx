
import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");
  return (
    <form
      className="flex flex-col md:flex-row w-full gap-2 bg-white/70 p-3 rounded-xl shadow border border-gray-100"
      onSubmit={e => {
        e.preventDefault();
        alert("Search for: " + keyword);
      }}
      role="search"
    >
      <div className="flex items-center flex-1 min-w-0">
        <Search className="mx-2 text-primary" />
        <input
          className="w-full bg-transparent border-none outline-none px-2 py-1 text-base"
          placeholder="Search jobs, skills, experts, companies..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
      >
        Search
      </button>
      {/* Placeholders for future: skills, location, etc */}
      {/* <div className="flex gap-2">
        <select className="bg-gray-50 border rounded p-2 text-sm">
          <option>Skill</option>
        </select>
        <select className="bg-gray-50 border rounded p-2 text-sm">
          <option>Location</option>
        </select>
      </div> */}
    </form>
  );
}

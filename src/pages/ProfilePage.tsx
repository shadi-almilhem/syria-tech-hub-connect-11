
import { useNavigate } from "react-router-dom";
import UserProfile from "../components/UserProfile";

export default function ProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2">
      <div className="max-w-2xl mx-auto">
        <UserProfile
          onClose={() => navigate(-1)}
          pageView={true}
        />
      </div>
    </div>
  );
}

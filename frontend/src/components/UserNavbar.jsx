import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const UserNavbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/auth/user", { withCredentials: true })
      .then((response) => {
        console.log("✅ User Data:", response.data);
        setUser(response.data);
      })
      .catch((error) => console.error("❌ Error fetching user data:", error));
  }, []);

  const handleLogout = () => {
    axios.get("http://localhost:5000/auth/logout", { withCredentials: true })
      .then(() => {
        setUser(null);
        window.location.href = "/";
      })
      .catch((error) => console.error("❌ Logout failed:", error));
  };

  // Function to get the correct avatar URL
  const getAvatarUrl = () => {
    if (user?.avatar) {
      return user.avatar; // Use the avatar from the backend
    }
    if (user?.id) {
      return `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 5}.png`; // Default Discord avatar
    }
    return "https://img.icons8.com/ios-filled/50/000000/user.png"; // Fallback icon
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link to="/dashboard" className="btn btn-ghost text-xl">
          Remote Attendance Tracker
        </Link>
      </div>
      <div className="flex gap-4">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/report">Report</Link></li>
        </ul>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="User Profile"
                src={getAvatarUrl()}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
            {user ? (
              <>
                <li><Link to="/profile">{user.username}</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </>
            ) : (
              <li>
                <a className="text-base" href="http://localhost:5000/auth/discord">
                  Login with Discord
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;

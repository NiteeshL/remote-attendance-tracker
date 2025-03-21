import { useState, useEffect } from "react";
import axios from "axios";

const UserNavbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/auth/user", { withCredentials: true })
      .then((response) => setUser(response.data))
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  const handleLogout = () => {
    axios.get("http://localhost:5000/auth/logout", { withCredentials: true })
      .then(() => {
        setUser(null);
        window.location.href = "/";
      })
      .catch((error) => console.error("Logout failed:", error));
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Remote Attendance Tracker</a>
      </div>
      <div className="flex gap-4">
        <ul className="menu menu-horizontal px-1">
          <li><a className="text-base">Attendance</a></li>
        </ul>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="User Profile"
                src={user 
                  ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` 
                  : "https://img.icons8.com/ios-filled/50/000000/user.png"}
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
            {user ? (
              <>
                <li>
                  <a className="justify-between text-base">
                    {user.username}
                    <span className="badge">New</span>
                  </a>
                </li>
                <li><a className="text-base">Settings</a></li>
                <li><button className="text-base" onClick={handleLogout}>Logout</button></li>
              </>
            ) : (
              <li><a className="text-base" href="http://localhost:5000/auth/discord">Login with Discord</a></li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;

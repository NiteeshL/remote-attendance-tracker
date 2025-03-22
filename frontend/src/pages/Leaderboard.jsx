import { useState, useEffect } from "react";
import axios from "axios";
import { FaUsers, FaClipboardList, FaSignOutAlt, FaChartBar, FaTrophy, FaCrown, FaMedal } from "react-icons/fa";
import { Link } from "react-router-dom";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/admin/leaderboard", { withCredentials: true })
      .then((response) => {
        setLeaderboard(response.data.rankedUsers);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching leaderboard:", error);
        setError("Failed to load leaderboard");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading leaderboard...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-base-200 p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <ul className="menu space-y-4">
          <li>
            <Link to="/admindashboard" className="flex items-center gap-3">
            <FaChartBar size={18} className="text-secondary" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/reports" className="flex items-center gap-3">
            <FaClipboardList size={18} className="text-accent" /> Reports
            </Link>
          </li>
          <li>
            <Link to="/leaderboard" className="flex items-center gap-3 text-primary">
              <FaTrophy size={18} className="text-yellow-500" /> Leaderboard
            </Link>
          </li>
          <li>
            <button className="btn btn-error mt-6 flex items-center gap-3 w-full">
              <FaSignOutAlt size={18} /> Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-primary mb-6">🏆 Leaderboard</h1>

        <div className="bg-base-100 shadow-lg rounded-lg p-6 w-full max-w-4xl">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="p-3 text-left">Rank</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-center">Total Duration (sec)</th>
                <th className="p-3 text-center">Messages Sent</th>
                <th className="p-3 text-center">Voice Time (sec)</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr key={user.userId} className={`border-b ${index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"} hover:bg-gray-300`}>
                  <td className="p-3 flex items-center">
                    {index === 0 ? <FaCrown className="text-yellow-500 text-xl mr-2" /> :
                    index === 1 ? <FaMedal className="text-gray-400 text-xl mr-2" /> :
                    index === 2 ? <FaTrophy className="text-orange-500 text-xl mr-2" /> :
                    `#${index + 1}`}
                  </td>
                  <td className="p-3">{user.username}</td>
                  <td className="p-3 text-center">{user.totalDuration}</td>
                  <td className="p-3 text-center">{user.totalMessages}</td>
                  <td className="p-3 text-center">{user.voiceTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;

import { useState, useEffect } from "react";
import { FaUsers, FaClipboardList, FaSignOutAlt, FaChartBar, FaTrophy } from "react-icons/fa";
import axios from "axios";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0 });
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [errorLeaderboard, setErrorLeaderboard] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]); // ✅ State for recent activity
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    // Fetch admin details
    axios.get("http://localhost:5000/auth/user", { withCredentials: true })
      .then((response) => {
        if (response.data.role !== "Admin") {
          window.location.href = "/dashboard"; // Redirect if not admin
        }
        setAdmin(response.data);
      })
      .catch((error) => console.error("Error fetching admin data:", error));

    // Fetch total users and active users
    axios.get("http://localhost:5000/admin/stats", { withCredentials: true })
      .then((response) => setStats(response.data))
      .catch((error) => console.error("Error fetching stats:", error));

    // Fetch leaderboard data
    axios.get("http://localhost:5000/admin/leaderboard", { withCredentials: true })
      .then((response) => {
        setLeaderboard(response.data.rankedUsers);
        setLoadingLeaderboard(false);
      })
      .catch((error) => {
        console.error("Error fetching leaderboard:", error);
        setErrorLeaderboard("Failed to load leaderboard");
        setLoadingLeaderboard(false);
      });

    // ✅ Fetch recent activity data
    axios.get("http://localhost:5000/admin/recent-activity", { withCredentials: true })
      .then((response) => {
        setRecentActivity(response.data.recentActivity);
        setLoadingActivity(false);
      })
      .catch((error) => {
        console.error("Error fetching recent activity:", error);
        setLoadingActivity(false);
      });

  }, []);

  // Logout function
  const handleLogout = () => {
    axios.get("http://localhost:5000/auth/logout", { withCredentials: true })
      .then(() => {
        setAdmin(null);
        window.location.href = "/";
      })
      .catch((error) => console.error("Logout failed:", error));
  };

  if (!admin) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-base-200 p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <ul className="menu space-y-4">
          <li><a className="flex items-center gap-3"><FaChartBar size={18} /> Dashboard</a></li>
          <li><a className="flex items-center gap-3"><FaUsers size={18} /> Manage Users</a></li>
          <li><a className="flex items-center gap-3"><FaClipboardList size={18} /> Reports</a></li>
          <li><a className="flex items-center gap-3"><FaTrophy size={18} /> Leaderboard</a></li>
          <li>
            <button className="btn btn-error mt-6 flex items-center gap-3 w-full" onClick={handleLogout}>
              <FaSignOutAlt size={18} /> Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold">Welcome, {admin.username}!</h1>
        <p className="text-gray-500">Role: <span className="badge badge-primary">{admin.role}</span></p>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="stat bg-base-100 shadow-md p-6">
            <div className="stat-title">Total Users</div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
          <div className="stat bg-base-100 shadow-md p-6">
            <div className="stat-title">Active Users (Last 7 days)</div>
            <div className="stat-value">{stats.activeUsers}</div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="card bg-base-100 shadow-md p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">Leaderboard</h3>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Total Duration (sec)</th>
                  <th>Messages Sent</th>
                  <th>Voice Time (sec)</th>
                </tr>
              </thead>
              <tbody>
                {loadingLeaderboard ? (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500">Loading...</td>
                  </tr>
                ) : errorLeaderboard ? (
                  <tr>
                    <td colSpan="5" className="text-center text-red-500">{errorLeaderboard}</td>
                  </tr>
                ) : leaderboard.length > 0 ? (
                  leaderboard.map((user) => (
                    <tr key={user.userId}>
                      <td>#{user.rank}</td>
                      <td>{user.username}</td>
                      <td>{user.totalDuration}</td>
                      <td>{user.totalMessages}</td>
                      <td>{user.voiceTime}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card bg-base-100 shadow-md p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Channel ID</th>
                  <th>Duration (sec)</th>
                </tr>
              </thead>
              <tbody>
                {loadingActivity ? (
                  <tr>
                    <td colSpan="3" className="text-center text-gray-500">Loading...</td>
                  </tr>
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <tr key={index}>
                      <td>{activity.username}</td>
                      <td>{activity.channelId}</td>
                      <td>{activity.duration}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-gray-500">No recent activity</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;

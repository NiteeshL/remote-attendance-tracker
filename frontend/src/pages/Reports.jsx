import { useState, useEffect } from "react";
import axios from "axios";
import {
    FaUsers, FaClipboardList, FaSignOutAlt, FaChartBar,
    FaTrophy, FaClock, FaComment, FaMicrophone
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5000/admin/reports", { withCredentials: true })
            .then((response) => {
                setReports(response.data.users);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching reports:", error);
                setError("Failed to load reports");
                setLoading(false);
            });
    }, []);

    return (
        <div className="flex h-screen bg-base-200">
            {/* Sidebar */}
            <aside className="w-72 bg-base-100 p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FaUsers size={24} className="text-primary" /> Admin Panel
                </h2>
                <ul className="menu space-y-4">
                    <li>
                        <Link to="/admindashboard" className="flex items-center gap-3">
                            <FaChartBar size={18} className="text-secondary" /> Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/reports" className="flex items-center gap-3 text-primary font-semibold">
                            <FaClipboardList size={18} className="text-accent" /> Reports
                        </Link>
                    </li>
                    <li>
                        <Link to="/leaderboard" className="flex items-center gap-3">
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

            <main className="flex-1 p-8">
                <h1 className="text-4xl font-bold text-primary mb-6 flex items-center gap-2">
                    <FaClipboardList className="text-secondary" /> User Reports
                </h1>

                {loading && <p className="text-center text-gray-500 mt-10">Loading reports...</p>}
                {error && <p className="text-center text-red-500 mt-10">{error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((user) => (
                        <div key={user.userId} className="card bg-base-100 shadow-xl p-6 border border-gray-300">
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <FaUsers className="text-blue-500" /> {user.username}
                            </h3>
                            <p className="text-gray-500 mb-4 text-sm">User ID: {user.userId}</p>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <FaClock className="text-blue-500" />
                                    <span className="font-medium">Total Duration:</span>
                                    <span className="ml-auto">{user.totalDuration} sec</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaMicrophone className="text-green-500" />
                                    <span className="font-medium">Voice Time:</span>
                                    <span className="ml-auto">{user.voiceTime} sec</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaComment className="text-purple-500" />
                                    <span className="font-medium">Messages Sent:</span>
                                    <span className="ml-auto">{user.totalMessages}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Reports;

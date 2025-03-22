import { useState, useEffect } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Legend
} from "recharts";
import { FiClock, FiMessageSquare, FiPhone, FiDownload } from "react-icons/fi";
import UserNavbar from "../components/UserNavbar";

const GUILD_ID = "1352683297850921061";

const ReportsPage = () => {
    const [userId, setUserId] = useState(null);
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:5000/auth/user", {
                    credentials: "include",
                });

                if (!response.ok) throw new Error("Failed to fetch user");

                const userData = await response.json();
                setUserId(userData.id);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const fetchReports = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/user/activity/${userId}/${GUILD_ID}`);
                if (!response.ok) throw new Error("Failed to fetch reports");

                const data = await response.json();

                const totalMinutes = data.totalDuration / 60;
                const voiceMinutes = data.voiceTime / 60;
                const textMinutes = Math.max(totalMinutes - voiceMinutes, 0).toFixed(2);

                setReports([
                    {
                        period: "Weekly",
                        totalHours: (data.totalDuration / 3600).toFixed(2),
                        messagesSent: data.totalMessages,
                        voiceMinutes: voiceMinutes.toFixed(2),
                        data: [
                            {
                                period: "Weekly",
                                Messages: data.totalMessages,
                                "Voice Minutes": parseFloat(voiceMinutes)
                            }
                        ]
                    },
                    {
                        period: "Monthly",
                        totalHours: (data.monthlyDuration / 3600).toFixed(2),
                        messagesSent: data.totalMessages,
                        voiceMinutes: voiceMinutes.toFixed(2),
                        data: [
                            {
                                period: "Monthly",
                                Messages: data.totalMessages,
                                "Voice Minutes": parseFloat(voiceMinutes)
                            }
                        ]
                    }
                ]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [userId]);

    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (loading) return <p className="text-center">Loading...</p>;

    return (
        <>
            <UserNavbar />
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">Attendance Reports</h1>

                <div className="grid gap-6 md:grid-cols-2">
                    {reports.map((report, index) => (
                        <div key={index} className="card bg-base-100 shadow-md p-6">
                            <h2 className="text-lg font-semibold">{report.period} Report</h2>

                            <div className="stats stats-vertical mt-4">
                                <div className="stat flex items-center gap-3">
                                    <FiClock className="text-primary text-2xl" />
                                    <div>
                                        <div className="stat-title">Total Hours Logged</div>
                                        <div className="stat-value">{report.totalHours} hrs</div>
                                    </div>
                                </div>
                                <div className="stat flex items-center gap-3">
                                    <FiMessageSquare className="text-secondary text-2xl" />
                                    <div>
                                        <div className="stat-title">Messages Sent</div>
                                        <div className="stat-value">{report.messagesSent}</div>
                                    </div>
                                </div>
                                <div className="stat flex items-center gap-3">
                                    <FiPhone className="text-accent text-2xl" />
                                    <div>
                                        <div className="stat-title">Voice Time</div>
                                        <div className="stat-value">{report.voiceMinutes} min</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                                    <FiClock /> Hours Logged ({report.period})
                                </h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={report.data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="period" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="Messages" fill="#6366F1" stackId="a" />
                                        <Bar dataKey="Voice Minutes" fill="#FF9800" stackId="a" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <button className="btn btn-primary mt-4 w-full flex items-center gap-2">
                                <FiDownload /> Download {report.period} Report
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ReportsPage;

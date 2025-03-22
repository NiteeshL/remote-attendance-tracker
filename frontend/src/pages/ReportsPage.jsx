import { useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";
import { FiClock, FiMessageSquare, FiPhone, FiDownload, FiPieChart } from "react-icons/fi";
import UserNavbar from "../components/UserNavbar";

const sampleReports = [
    {
        period: "Weekly",
        totalHours: 35,
        messagesSent: 250,
        voiceMinutes: 120,
        downloadLink: "#",
        data: [
            { day: "Mon", hours: 4 },
            { day: "Tue", hours: 5 },
            { day: "Wed", hours: 6 },
            { day: "Thu", hours: 3 },
            { day: "Fri", hours: 8 },
            { day: "Sat", hours: 2 },
            { day: "Sun", hours: 7 },
        ],
        activityBreakdown: [
            { name: "Messages Sent", value: 40 },
            { name: "Voice Calls", value: 35 },
            { name: "Idle Time", value: 25 },
        ]
    },
    {
        period: "Monthly",
        totalHours: 140,
        messagesSent: 1020,
        voiceMinutes: 480,
        downloadLink: "#",
        data: [
            { week: "Week 1", hours: 30 },
            { week: "Week 2", hours: 35 },
            { week: "Week 3", hours: 25 },
            { week: "Week 4", hours: 50 },
        ],
        activityBreakdown: [
            { name: "Messages Sent", value: 45 },
            { name: "Voice Calls", value: 30 },
            { name: "Idle Time", value: 25 },
        ]
    },
];

const COLORS = ["#4CAF50", "#FF9800", "#F44336"];

const ReportsPage = () => {
    const [reports] = useState(sampleReports);

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
                                        <XAxis dataKey={report.period === "Weekly" ? "day" : "week"} />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="hours" fill="#6366F1" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                                    <FiPieChart /> Activity Breakdown
                                </h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={report.activityBreakdown}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label
                                        >
                                            {report.activityBreakdown.map((entry, i) => (
                                                <Cell key={`cell-${i}`} fill={COLORS[i]} />
                                            ))}
                                        </Pie>
                                        <Legend />
                                    </PieChart>
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

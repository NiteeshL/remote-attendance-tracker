import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import UserNavbar from "../components/UserNavbar";

const sampleActivityData = [
    { day: "Mon", hours: 3 },
    { day: "Tue", hours: 5 },
    { day: "Wed", hours: 4 },
    { day: "Thu", hours: 6 },
    { day: "Fri", hours: 8 },
    { day: "Sat", hours: 2 },
    { day: "Sun", hours: 1 },
];

const UserActivityPage = () => {
    const [user, setUser] = useState({
        name: "John Doe",
        role: "Software Engineer",
        avatar: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
        status: "Online",
    });

    const [activity, setActivity] = useState({
        messagesSent: 124,
        voiceMinutes: 340,
        totalHours: 25,
    });

    return (
        <>
            <UserNavbar />
            <div className="container mx-auto p-6">
                <div className="card bg-base-100 shadow-md p-6 flex items-center gap-4">
                    <div className="avatar">
                        <div className="w-16 rounded-full">
                            <img src={user.avatar} alt="User Avatar" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">{user.name}</h2>
                        <p className="text-gray-500">{user.role}</p>
                        <span className={`badge ${user.status === "Online" ? "badge-success" : "badge-error"}`}>
                            {user.status}
                        </span>
                    </div>
                </div>

                <div className="stats stats-vertical md:stats-horizontal shadow w-full mt-6">
                    <div className="stat">
                        <div className="stat-title">Messages Sent</div>
                        <div className="stat-value">{activity.messagesSent}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title">Voice Minutes</div>
                        <div className="stat-value">{activity.voiceMinutes} min</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title">Total Hours Logged</div>
                        <div className="stat-value">{activity.totalHours} hrs</div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-md p-6 mt-6">
                    <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={sampleActivityData}>
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="hours" stroke="#6366F1" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );
};

export default UserActivityPage;

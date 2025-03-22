import { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const UserActivity = () => {
    const [user, setUser] = useState(null);
    const [activity, setActivity] = useState({
        messagesSent: 0,
        voiceMinutes: 0,
        totalDuration: 0,
    });
    const [weeklyActivity, setWeeklyActivity] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/auth/user", { withCredentials: true })
            .then((response) => {
                console.log("Auth User Data:", response.data);
                setUser(response.data);

                const userId = response.data.id;
                const guildId = response.data.primary_guild || "1352683297850921061"; // Fallback guildId
                return axios.get(`http://localhost:5000/user/activity/${userId}/${guildId}`);
            })
            .then((response) => {
                console.log("User Activity Data:", response.data);

                setActivity({
                    messagesSent: response.data.totalMessages,
                    voiceMinutes: Math.floor(response.data.voiceTime / 60), 
                    totalDuration: Math.floor(response.data.totalDuration / 60),
                });

                const formattedWeeklyStats = response.data.weeklyStats.length > 0
                    ? response.data.weeklyStats
                    : [
                        { day: "Mon", hours: 0 },
                        { day: "Tue", hours: 0 },
                        { day: "Wed", hours: 0 },
                        { day: "Thu", hours: 0 },
                        { day: "Fri", hours: 0 },
                        { day: "Sat", hours: 0 },
                        { day: "Sun", hours: 0 },
                    ];

                setWeeklyActivity(formattedWeeklyStats);
            })
            .catch((error) => {
                console.error("Error fetching user activity data:", error.message);
            });
    }, []);

    return (
        <div className="container mx-auto p-6">
            <div className="card bg-base-100 shadow-md p-6 flex items-center gap-4">
                <div className="avatar">
                    <div className="w-16 rounded-full">
                        <img
                            src={user ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                                : "https://img.icons8.com/ios-filled/50/000000/user.png"}
                            alt="User Avatar"
                        />
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-semibold">{user ? user.username : "Guest"}</h2>
                    <p className="text-gray-500">{user ? user.role || "Member" : "Not Logged In"}</p>
                    <span className={`badge ${user ? "badge-success" : "badge-error"}`}>
                        {user ? "Online" : "Offline"}
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
                    <div className="stat-title">Total Minutes Logged</div>
                    <div className="stat-value">{activity.totalDuration} min</div>
                </div>
            </div>

            <div className="card bg-base-100 shadow-md p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyActivity}>
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="hours" stroke="#6366F1" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default UserActivity;

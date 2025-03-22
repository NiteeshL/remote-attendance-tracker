import { useState, useEffect } from "react";
import UserNavbar from "../components/UserNavbar";

const initialUsers = [
    { id: "123456789", username: "JohnDoe", avatar: "avatar_hash_1", isOnline: true, onlineTime: 45 },
    { id: "987654321", username: "JaneSmith", avatar: "avatar_hash_2", isOnline: true, onlineTime: 20 },
    { id: "567890123", username: "AliceBrown", avatar: "avatar_hash_3", isOnline: false, onlineTime: 90 },
];

const LiveAttendancePage = () => {
    const [userList, setUserList] = useState(initialUsers);

    useEffect(() => {
        const interval = setInterval(() => {
            setUserList((prevUsers) =>
                prevUsers.map((user) => ({
                    ...user,
                    onlineTime: user.isOnline ? user.onlineTime + 5 : user.onlineTime,
                }))
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <UserNavbar />
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4 text-center">Live Attendance Tracker</h1>

                <div className="overflow-x-auto">
                    <table className="table w-full bg-base-100 shadow-md rounded-lg">
                        <thead>
                            <tr>
                                <th>Avatar</th>
                                <th>Username</th>
                                <th>Status</th>
                                <th>Online Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList.length > 0 ? (
                                userList.map((user) => (
                                    <tr key={user.id} className="hover">
                                        <td>
                                            <div className="avatar">
                                                <div className="w-12 rounded-full">
                                                    <img
                                                        src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                                                        alt="User Avatar"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td>{user.username}</td>
                                        <td>
                                            <span className={`badge ${user.isOnline ? "badge-success" : "badge-error"}`}>
                                                {user.isOnline ? "Online" : "Offline"}
                                            </span>
                                        </td>
                                        <td>{user.onlineTime} mins</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">No active users currently</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default LiveAttendancePage;

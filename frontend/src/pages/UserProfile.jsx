import { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiLogOut } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import UserNavbar from "../components/UserNavbar";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000/auth/user", { withCredentials: true })
            .then((response) => {
                setUser(response.data);
                setUsername(response.data.username);
                setStatus(response.data.status || "Active");
                setAvatarUrl(`https://cdn.discordapp.com/avatars/${response.data.id}/${response.data.avatar}.png`);
            })
            .catch((error) => console.error("Error fetching user data:", error));
    }, []);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            axios.get("http://localhost:5000/auth/logout", { withCredentials: true })
                .then(() => {
                    setUser(null);
                    window.location.href = "/";
                })
                .catch((error) => console.error("Logout failed:", error));
        }
    };

    const handleSave = () => {
        alert("Profile updated successfully!");
        setIsEditing(false);
    };

    if (!user) {
        return (
            <div className="container mx-auto p-6 text-center">
                <h2 className="text-2xl font-bold">Profile</h2>
                <p>Please log in to view your profile.</p>
            </div>
        );
    }

    return (
        <>
            <UserNavbar />
            <div className="container mx-auto p-6">
                <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                    <FaUser className="text-primary" /> User Profile
                </h2>

                <div className="card bg-base-100 shadow-lg p-6">
                    <div className="flex items-center gap-6">
                        <img
                            src={avatarUrl}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full border border-gray-300"
                        />
                        <div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="input input-bordered w-full"
                                />
                            ) : (
                                <h3 className="text-xl font-semibold">{user.username}</h3>
                            )}
                            <p className="text-gray-500">User ID: {user.id}</p>
                            <p className="text-gray-500">Status: <span className="badge badge-success">{status}</span></p>
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="mt-4">
                            <button className="btn btn-success mr-2" onClick={handleSave}>Save</button>
                            <button className="btn btn-error" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    ) : (
                        <button className="btn btn-outline mt-4 flex items-center gap-2" onClick={() => setIsEditing(true)}>
                            <FiEdit /> Edit Profile
                        </button>
                    )}
                </div>

                <button className="btn btn-error mt-6 w-full flex items-center gap-2" onClick={handleLogout}>
                    <FiLogOut /> Logout
                </button>
            </div>
        </>
    );
};

export default ProfilePage;

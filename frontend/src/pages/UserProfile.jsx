import { useState, useEffect } from "react";
import axios from "axios";
import { FiLogOut } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import UserNavbar from "../components/UserNavbar";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000/auth/user", { withCredentials: true })
            .then((response) => {
                console.log("✅ User Data:", response.data);
                setUser(response.data);
                setStatus(response.data.status || "Active");
            })
            .catch((error) => console.error("❌ Error fetching user data:", error));
    }, []);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            axios.get("http://localhost:5000/auth/logout", { withCredentials: true })
                .then(() => {
                    setUser(null);
                    window.location.href = "/";
                })
                .catch((error) => console.error("❌ Logout failed:", error));
        }
    };

    // Function to get the correct avatar URL
    const getAvatarUrl = () => {
        if (user?.avatar) {
            return user.avatar; // Use avatar from backend
        }
        if (user?.id) {
            return `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 5}.png`; // Default Discord avatar
        }
        return "https://img.icons8.com/ios-filled/50/000000/user.png"; // Fallback icon
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

                <div className="card bg-base-100 shadow-lg p-6 flex flex-col items-center">
                    <img
                        src={getAvatarUrl()}
                        alt="User Avatar"
                        className="w-32 h-32 rounded-full border border-gray-300"
                    />
                    <h3 className="text-xl font-semibold mt-4">{user.username}</h3>
                    <p className="text-gray-500">User ID: {user.id}</p>
                    <p className="text-gray-500">
                        Status: <span className="badge badge-success">{status}</span>
                    </p>
                    <p className="text-gray-500">
                        Role: <span className="badge badge-primary">{user.role || "Member"}</span>
                    </p>
                </div>

                <button className="btn btn-error mt-6 w-full flex items-center gap-2" onClick={handleLogout}>
                    <FiLogOut /> Logout
                </button>
            </div>
        </>
    );
};

export default ProfilePage;

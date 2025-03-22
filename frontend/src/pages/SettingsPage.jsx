import { useState } from "react";
import { FiUser, FiLock, FiBell, FiMoon } from "react-icons/fi";
import UserNavbar from "../components/UserNavbar";

const SettingsPage = () => {
    const [selectedTab, setSelectedTab] = useState("profile");
    const [darkMode, setDarkMode] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);

    const renderContent = () => {
        switch (selectedTab) {
            case "profile":
                return (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Profile Settings</h2>
                        <div className="space-y-4">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium">Username</span>
                                </label>
                                <input type="text" className="input input-bordered w-full" placeholder="Enter Your Name" />
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium">Email</span>
                                </label>
                                <input type="email" className="input input-bordered w-full" placeholder="Enter Your Email" />
                            </div>

                            <button className="btn btn-success w-full mt-2">Save Changes</button>
                        </div>
                    </div>

                );
            case "account":
                return (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
                        <button className="btn btn-error">Delete Account</button>
                    </div>
                );
            case "privacy":
                return (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Privacy Settings</h2>
                        <label className="cursor-pointer flex justify-between items-center">
                            <span>Enable Two-Factor Authentication</span>
                            <input type="checkbox" className="toggle" />
                        </label>
                    </div>
                );
            case "notifications":
                return (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Notification Preferences</h2>
                        <label className="cursor-pointer flex justify-between items-center">
                            <span>Email Notifications</span>
                            <input type="checkbox" className="toggle" checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
                        </label>
                        <label className="cursor-pointer flex justify-between items-center mt-2">
                            <span>SMS Notifications</span>
                            <input type="checkbox" className="toggle" checked={smsNotifications} onChange={() => setSmsNotifications(!smsNotifications)} />
                        </label>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <UserNavbar />
            <div className="container mx-auto p-6 flex gap-6 min-h-screen">
                {/* Sidebar */}
                <div className="w-1/4 bg-gray-800 text-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Settings</h2>
                    <ul className="menu space-y-2">
                        {["profile", "account", "privacy", "notifications"].map((tab) => (
                            <li key={tab}>
                                <button
                                    onClick={() => setSelectedTab(tab)}
                                    className={`flex gap-2 items-center p-3 w-full rounded-lg transition-all ${selectedTab === tab ? "bg-gray-600 text-white shadow-md" : "hover:bg-gray-700"
                                        }`}
                                >
                                    {tab === "profile" && <FiUser />}
                                    {tab === "account" && <FiLock />}
                                    {tab === "privacy" && <FiLock />}
                                    {tab === "notifications" && <FiBell />}
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            </li>
                        ))}
                        <li className="mt-4">
                            <label className="cursor-pointer flex justify-between items-center">
                                <span>Dark Mode</span>
                                <input type="checkbox" className="toggle" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                            </label>
                        </li>
                    </ul>
                </div>
                <div className="w-3/4 bg-gray-100 p-8 rounded-lg shadow-lg">{renderContent()}</div>
            </div>
        </>
    );
};

export default SettingsPage;

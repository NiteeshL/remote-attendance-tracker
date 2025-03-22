import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserActivity from "./components/UserActivity";
import LiveAttendancePage from "./pages/LiveAttendancePage";
import ReportsPage from "./pages/ReportsPage";
import ProfilePage from "./pages/UserProfile";
import SettingsPage from "./pages/SettingsPage";
import AdminDashboard from "./pages/AdminDashboard";
import Leaderboard from "./pages/Leaderboard";
import Reports from "./pages/Reports";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user-activity" element={<UserActivity />} />
        <Route path="/live-activity" element={<LiveAttendancePage />} />
        <Route path="/report" element={<ReportsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/leaderboard" element={<Leaderboard/>} />
        <Route path="/reports" element={<Reports />} />

      </Routes>
    </Router>
  );
}

export default App;

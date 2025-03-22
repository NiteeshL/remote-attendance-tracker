import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserActivity from "./components/UserActivity";
import ReportsPage from "./pages/ReportsPage";
import ProfilePage from "./pages/UserProfile";
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
        <Route path="/report" element={<ReportsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/leaderboard" element={<Leaderboard/>} />
        <Route path="/reports" element={<Reports />} />

      </Routes>
    </Router>
  );
}

export default App;

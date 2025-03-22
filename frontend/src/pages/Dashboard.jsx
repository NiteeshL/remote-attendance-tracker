import UserActivity from "../components/UserActivity";
import UserNavbar from "../components/UserNavbar";


const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <UserNavbar />
      <UserActivity />
    </div>
  );
};

export default Dashboard;

import { FaDiscord } from "react-icons/fa";

const Login = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/discord"; // Redirects to backend for OAuth login
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Login with Discord</h1>
      <button
        onClick={handleLogin}
        className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4854C5] text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
      >
        <FaDiscord className="text-2xl" />
        Login with Discord
      </button>
    </div>
  );
};

export default Login;

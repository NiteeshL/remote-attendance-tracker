import UserNavbar from "./components/UserNavbar";
import UserActivityPage from "./pages/UserActivityPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserActivityPage />} />
      </Routes>
    </Router>
  );
}

export default App;
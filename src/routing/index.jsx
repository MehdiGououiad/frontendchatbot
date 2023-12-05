import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Sidebar from "../components/Sidebar";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route element={<Sidebar />}>
          <Route path="/" element={<Home />} />
          <Route path="/:conversationId" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;

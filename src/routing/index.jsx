import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

function AppRouter() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <Routes>
        <Route element={<Sidebar isSidebarOpen={isSidebarOpen} />}>
          <Route
            path="/"
            element={
              <Home
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            }
          />
          <Route
            path="/:conversationId"
            element={
              <Home
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

function AppRouter() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const toggleMenu = (id) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
    } else {
      setOpenMenuId(id);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          element={
            <Sidebar
              isSidebarOpen={isSidebarOpen}
              toggleMenu={toggleMenu}
              openMenuId={openMenuId}
            />
          }
        >
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
                toggleMenu={toggleMenu}
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

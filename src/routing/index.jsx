import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import Login from "../pages/Login";

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
  const [isEditing, setIsEditing] = useState(false);


  return (
    <Router>
      <Routes>
        <Route
          element={
            <Sidebar
              isSidebarOpen={isSidebarOpen}
              toggleMenu={toggleMenu}
              setIsEditing={setIsEditing}
              isEditing={isEditing}

              openMenuId={openMenuId}
            />
          }
        >
          <Route
            path="/"
            element={
              <Home
              toggleMenu={toggleMenu}
              setIsEditing={setIsEditing}
              isEditing={isEditing}
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
                setIsEditing={setIsEditing}
                isEditing={isEditing}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            }
          />
                  </Route>

            <Route
            path="/login"
            element={
              <Login />
            }
          />
          
      </Routes>
    </Router>
  );
}

export default AppRouter;

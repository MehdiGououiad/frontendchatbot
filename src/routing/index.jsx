import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import Login from "../pages/Login";
import Popup from "../components/Popup";
function AppRouter() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [idActive, setIdActive] = useState(); // State to store extracted links

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");


  const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(true);

    // Optional: Auto-hide popup after some time
    setTimeout(() => setPopupVisible(false), 3000); // hides after 3 seconds
};

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
            showPopup={showPopup}
              isSidebarOpen={isSidebarOpen}
              toggleMenu={toggleMenu}
              setIsEditing={setIsEditing}
              isEditing={isEditing}
              idActive={idActive}

              openMenuId={openMenuId}
            />
          }
        >
          
          <Route
            path="/:conversationId?"
            element={
              <Home
                showPopup={showPopup}
        
                toggleMenu={toggleMenu}
                setIsEditing={setIsEditing}
                setIdActive={setIdActive}
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
      <Popup message={popupMessage} visible={popupVisible} />

    </Router>
  );
}

export default AppRouter;

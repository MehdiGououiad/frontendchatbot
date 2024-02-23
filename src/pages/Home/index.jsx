import Chat from "../../components/Chat";
import Header from "../../components/Header";
import AsideFiles from "../../components/AsideFiles";
import React, { useState } from "react";
import { useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";

function Home({ isSidebarOpen, setIsSidebarOpen, toggleMenu,setIsEditing,setIdActive,showPopup }) {
   // Get the conversationId from the URL
   const { conversationId } = useParams();
   let navigate = useNavigate()

   const [id, setId] = useState(conversationId);
   const isSessionExpired = () => {
    const loginDate = localStorage.getItem("loginDate");
    if (!loginDate) return true; // Consider session expired if there's no login date
    
    const now = new Date();
    const loginDateTime = new Date(loginDate);
    const differenceInHours = (now - loginDateTime) / 36e5; // Convert milliseconds to hours
    
    // Check if the difference is more than 1 hours
    return differenceInHours > 1;
  };
  useEffect(() => {
    // Check if the session is expired
    if (isSessionExpired()) {
      // Redirect the user to the login page, or handle session expiration as needed
      navigate('/login')
      // If using React Router, you can redirect like this:
      return; // Prevent further execution
    }

    // Session is not expired, proceed with setting ID and active state or fetching new data
    setId(conversationId); 
    setIdActive(conversationId);

    // Your refresh logic here, for example fetching new data based on conversationId

  }, [conversationId]); // Dependency array includes conversationId to run useEffect when it changes

 
  const [links, setLinks] = useState([]); // State to store extracted links
  if(localStorage.getItem("isAuthenticated") === null){
    window.location.href = "/login"
  }
  
  function toggleDark() {
    document.documentElement.classList.toggle("dark");
  }
  const [isChecked, setIsChecked] = useState(true);

  const handleClick = () => {
    if(isChecked){
      setIsChecked(false)
    }
    else{
      setIsChecked(true)
    }

  };
  return (
    <div
      className="w-full lg:h-screen dark:bg-black "
      onClick={() => {toggleMenu(null);setIsEditing(false)}}
    >
      <div>
        <Header
        isChecked={isChecked}
        handleClick={handleClick}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
      <div className="flex" onClick={() => setIsSidebarOpen(false)}>
        <Chat links={links} setLinks={setLinks}  isChecked={isChecked} id={id} showPopup={showPopup} setIsEditing={setIsEditing} />
        <AsideFiles links={links} />
      </div>
    </div>
  );
}

export default Home;

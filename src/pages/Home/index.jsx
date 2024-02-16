import Chat from "../../components/Chat";
import Header from "../../components/Header";
import AsideFiles from "../../components/AsideFiles";
import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function Home({ isSidebarOpen, setIsSidebarOpen, toggleMenu,setIsEditing,setIdActive,showPopup }) {
   // Get the conversationId from the URL
   const { conversationId } = useParams();
   const [id, setId] = useState(conversationId);

   useEffect(() => {
     // This code runs when conversationId changes
setId(conversationId) 
setIdActive(conversationId)

     // Add your refresh logic here. For example, you might want to
     // fetch new data based on the new conversationId
 
   }, [conversationId]); // Dependency array includes conversationId
 
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

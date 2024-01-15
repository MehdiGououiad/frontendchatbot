import Chat from "../../components/Chat";
import Header from "../../components/Header";
import AsideFiles from "../../components/AsideFiles";
import React, { useState } from "react";

function Home({ isSidebarOpen, setIsSidebarOpen, toggleMenu }) {
  const [links, setLinks] = useState([]); // State to store extracted links
  console.log(links);
  function toggleDark() {
    document.documentElement.classList.toggle("dark");
  }
  const [isChecked, setIsChecked] = useState(false);

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
      onClick={() => toggleMenu(null)}
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
        <Chat links={links} setLinks={setLinks}  isChecked={isChecked} />
        <AsideFiles links={links} />
      </div>
    </div>
  );
}

export default Home;

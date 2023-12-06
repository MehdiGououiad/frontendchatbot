import Chat from "../../components/Chat";
import Header from "../../components/Header";
import AsideFiles from "../../components/AsideFiles";
import React, { useState } from "react";

function Home({ isSidebarOpen, setIsSidebarOpen }) {
  return (
    <div className="w-full lg:h-screen ">
      <div>
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
      <div className="flex   " onClick={() => setIsSidebarOpen(false)}>
        <Chat />
        <AsideFiles />
      </div>
    </div>
  );
}

export default Home;

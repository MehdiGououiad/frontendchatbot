import React, { useState } from "react";

function Header({ isSidebarOpen, setIsSidebarOpen, toggleDark }) {
  return (
    <div className="flex justify-between md:block">
      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden p-2 h-10 mt-3" // Only visible on mobile
      >
        {
          /*Icon for toggle*/
          isSidebarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {/* Icon when sidebar is open */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {/* Icon when sidebar is closed */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              ></path>
            </svg>
          )
        }
      </button>
      <div className="flex justify-center">
        <div className="lg:flex items-center justify-between  lg:border-b border-r border-gray-300 w-[80%] hidden">
          <h1 className="text-black text-xl leading-6 font-bold ml-8 ">
            Bienvenue dans MyHR, votre chatbot RH
          </h1>
          {/* <img className="mr-16" src="dark.svg" alt="" onClick={toggleDark} /> */}
          {/* <h2 className="text-zinc-600 text-xl leading-6 ml-5">
            La banque d&apos;un monde qui change
          </h2> */}
        </div>
        <div className="flex    lg:w-[20%] lg:justify-end justify-center   mt-2 lg:border-b border-gray-300 pb-2">
          <div className="mr-5">
            <h2 className="font-bold">Anouar Alaoui</h2>
            <h2 className="text-zinc-600 leading-6">Chargé Clientèle</h2>
          </div>
          <img src="photo.svg" alt="" className="mr-8 mb-2" />
        </div>
      </div>
    </div>
  );
}

export default Header;

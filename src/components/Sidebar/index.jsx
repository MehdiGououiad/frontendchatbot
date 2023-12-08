import { Outlet, Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

function Sidebar({ isSidebarOpen, toggleMenu, openMenuId }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  // State to manage sidebar visibility

  function handleNewConversation() {
    // This is where we'll add the code to create a new conversation
    const apiUrl =
      "http://192.168.3.20:8081/api/conversations/create?user_id=1";

    // Make the POST request using Axios
    axios
      .post(apiUrl)
      .then((response) => {
        // Handle the response here
        console.log(response.data, "response");
        const conversations = response.data;
        setConversations(response.data);

        if (conversations.length > 0) {
          // Get the last conversation from the array
          const lastConversation = conversations[conversations.length - 1];

          // Extract the id from the last conversation
          const lastConversationId = lastConversation.id;

          // Navigate to the new URL using the extracted id
          window.location.href = `/${lastConversationId}`;
        }
      })
      .catch((error) => {
        // Handle any errors here
        console.error("Error:", error);
      });
  }

  function handleLinkClick(conversationId) {
    // Change the URL programmatically to include the conversation ID
    // Build the URL with the conversationId
    const url = `/${conversationId}`;

    // Trigger a full page refresh by setting window.location.href
    window.location.href = url;
  }
  function deleteConversation(id) {
    // This is where we'll add the code to create a new conversation
    const apiUrl =
      "http://192.168.3.20:8081/api/conversations/deleteByConversationId?conversationId=" +
      id +
      "&userId=1";
    axios
      .delete(apiUrl)
      .then((response) => {
        // Handle the response here
        // Handle the response here
        console.log(response.data, "response");
        const conversations = response.data;
        setConversations(response.data);

        if (conversations.length > 0) {
          // Get the last conversation from the array
          const lastConversation = conversations[conversations.length - 1];

          // Extract the id from the last conversation
          const lastConversationId = lastConversation.id;

          // Navigate to the new URL using the extracted id
          window.location.href = `/${lastConversationId}`;
        }
      })
      .catch((error) => {
        // Handle any errors here
        console.error("Error:", error);
      });
  }
  function getConversationIdFromUrl() {
    // Get the pathname from the URL
    const pathname = window.location.pathname;

    // Check if the pathname contains a number (assuming the ID is a number)
    const match = pathname.match(/\/(\d+)/);

    if (match) {
      // Extracted ID from the pathname
      return match[1]; // Use match[1] because the capturing group is inside parentheses
    } else {
      // Handle the case where there is no valid ID in the pathname
      console.error("Invalid conversation ID in URL");
      return null;
    }
  }
  useEffect(() => {
    const apiUrl =
      "http://192.168.3.20:8081/api/conversations/conversationsByUserId?userId=1";

    axios
      .get(apiUrl)
      .then((response) => {
        setConversations(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
    setSelectedConversationId(getConversationIdFromUrl());
  }, []);
  console.log(selectedConversationId, "conversations");

  return (
    <div className="flex">
      <div
        className={`${
          isSidebarOpen
            ? "fixed inset-0 transform translate-x-0 bg-white"
            : "hidden md:flex"
        } flex flex-col justify-between w-60 shadow-lg border-r border-gray-300  transition-transform duration-300 ease-in-out`}
      >
        <div className="">
          {/* Sidebar Header */}
          <div className="p-4 ">
            <a href={"/"}>
              <img src="logo.png" alt="" className="mx-auto" />
            </a>
          </div>
          <div className="w-full mt-10">
            <div className="w-full px-3">
              <button
                onClick={handleNewConversation}
                className="inline-flex items-center gap-1 w-full px-2.5 text-sm h-8 transition-all font-medium bg-zinc-100  rounded-md hover:bg-zinc-200 p-5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="w-4 h-4 stroke-2 stroke-zinc-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  ></path>
                </svg>
                Nouvelle conversation
              </button>
            </div>
            {/* Chat Sections */}
            <div>
              <div className="px-2 pb-2  font-medium text-emerald-700  mt-6 mb-1">
                Historiques
              </div>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div>
                  {conversations.map((conversation, index) => (
                    <div
                      key={index}
                      className="w-full px-3 flex justify-between items-center mb-5"
                    >
                      <a
                        href={`/${conversation.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleLinkClick(conversation.id);
                        }}
                        className={`${
                          selectedConversationId == conversation.id
                            ? "bg-zinc-300"
                            : ""
                        } flex items-center justify-start text-sm h-8 transition-all font-medium bg-zinc-100 rounded-md hover:bg-zinc-200 p-5 flex-grow`}
                      >
                        {/* Conversation Title */}
                        <div className="text-sm truncate">
                          <span className="whitespace-nowrap">
                            <span>{conversation.title}</span>
                          </span>
                        </div>
                      </a>

                      {/* Contextual Menu Icon */}
                      <div className="relative ml-3">
                        <button
                          type="button"
                          onClick={() => toggleMenu(conversation.id)}
                          className="inline-flex w-8 h-8 justify-center items-center text-gray-500 hover:text-gray-700"
                        >
                          <span className="sr-only">Open options</span>
                          {/* Three Dots Icon */}
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 10h.01M12 10h.01M18 10h.01"
                            />
                          </svg>
                        </button>

                        {/* Contextual Menu */}
                        {openMenuId === conversation.id && (
                          <div
                            className="origin-top-right absolute right-0 left-4 mt-2 w-56 rounded-md shadow-lg bg-white z-20 ring-1 ring-black ring-opacity-5 focus:outline-none"
                            role="menu"
                            aria-orientation="vertical"
                            tabIndex="-1"
                          >
                            <div className="py-1" role="none">
                              {/* Menu Items */}
                              <a
                                href="#"
                                className="text-gray-700 flex  gap-2 items-center px-4 py-2 text-sm"
                                role="menuitem"
                                tabIndex="-1"
                              >
                                <img src="pen.svg" className="" alt="" />
                                <p className="mb-[3px] font-bold">Modifier</p>
                              </a>
                              <a
                                href="#"
                                onClick={() =>
                                  deleteConversation(conversation.id)
                                }
                                className="text-gray-700  px-4 py-2 text-sm flex gap-2 items-center"
                                role="menuitem"
                                tabIndex="-1"
                              >
                                <img src="trash.png" alt="" />
                                <p className="mb-[3px] font-bold">Supprimer</p>
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="h-full" onClick={() => toggleMenu(null)}></div>

        {/* Sidebar Footer */}
        {/* <div className="p-4 mb-6">
          <img src="settings.svg" alt="" className="mx-auto" />
        </div> */}
      </div>

      <Outlet />
    </div>
  );
}

export default Sidebar;

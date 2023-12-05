import { Outlet } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

function Sidebar() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  function handleNewConversation() {
    // This is where we'll add the code to create a new conversation
    const apiUrl = "http://localhost:8080/api/conversations/create?user_id=1";

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
      "http://localhost:8080/api/conversations/deleteByConversationId?conversationId=" +
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
  useEffect(() => {
    const apiUrl =
      "http://localhost:8080/api/conversations/conversationsByUserId?userId=1";

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
  }, []);

  return (
    <div className="flex">
      <div className="flex flex-col  justify-between w-60 shadow-lg   border-r border-gray-300">
        <div className="">
          {/* Sidebar Header */}
          <div className="p-4 ">
            <img src="logo.png" alt="" className="mx-auto" />
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
                    <div key={index} className="w-full px-3">
                      <a
                        href={`/${conversation.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleLinkClick(conversation.id);
                        }}
                        className="inline-flex  items-center gap-2 w-full mb-5 px-2.5 text-sm h-8 transition-all font-medium bg-zinc-100 rounded-md hover:bg-zinc-200 p-5"
                      >
                        {/* Conversation Title */}
                        <div className="text-sm truncate">
                          <span className="whitespace-nowrap">
                            <span>{conversation.title}</span>
                            {/* Replace with the appropriate property */}
                          </span>
                        </div>
                        {/* Modify Name Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-blue-500 cursor-pointer"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 19l9 2-2-9-9-2-2 9 9 2zM9 9a3 3 0 100-6 3 3 0 000 6z"
                          />
                        </svg>{" "}
                        {/* Delete Conversation Icon */}
                        <svg
                          onClick={() => deleteConversation(conversation.id)}
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-red-500 cursor-pointer"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Sidebar Footer */}
        <div className="p-4 mb-6">
          <img src="settings.svg" alt="" className="mx-auto" />
        </div>
      </div>

      <Outlet />
    </div>
  );
}

export default Sidebar;

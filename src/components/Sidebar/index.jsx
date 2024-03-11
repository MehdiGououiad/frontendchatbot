import { Outlet, Link ,useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

function Sidebar({ isSidebarOpen, toggleMenu, openMenuId, setIsEditing, isEditing,idActive ,showPopup}) {
  const [conversations, setConversations] = useState([]);
  let navigate = useNavigate()
  const idUser=localStorage.getItem("id")


  const [loading, setLoading] = useState(true);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [deleteTimeoutId, setDeleteTimeoutId] = useState(null);

  const [error, setError] = useState(null);

  const [isEditedId, setisEditedId] = useState();

  const [newTitle, setNewTitle] = useState("");

  const handleEditClick = (id) => {
    setisEditedId(id);
    setIsEditing(true);
    setNewTitle(conversations.find((c) => c.id == id).title);
    toggleMenu(null);
  };
// Separate conversations into different groups based on date
const todayConversations = conversations.filter((conversation) => {
  const conversationDate = new Date(conversation.timestamp); // Assuming 'timestamp' is the property containing the conversation date
  const today = new Date();
  return (
    conversationDate.getDate() === today.getDate() &&
    conversationDate.getMonth() === today.getMonth() &&
    conversationDate.getFullYear() === today.getFullYear()
  );
});

const yesterdayConversations = conversations.filter((conversation) => {
  const conversationDate = new Date(conversation.timestamp);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    conversationDate.getDate() === yesterday.getDate() &&
    conversationDate.getMonth() === yesterday.getMonth() &&
    conversationDate.getFullYear() === yesterday.getFullYear()
  );
});

const beforeYesterdayConversations = conversations.filter((conversation) => {
  const conversationDate = new Date(conversation.timestamp);
  const today = new Date();
  const beforeYesterday = new Date(today);
  beforeYesterday.setDate(today.getDate() - 2); // Set to two days back
  return conversationDate < beforeYesterday;
});


// Render the conversation items
const renderConversations = (conversations) => {
  return (
    <div>
      {conversations
        .sort((a, b) => b.id - a.id)
        .map((conversation, index) => {
          return (
            <div key={index} className={`mx-2 rounded-md px-3 flex justify-between items-center mb-5 cursor-pointer   ${idActive == conversation.id ? "bg-zinc-300 h-8 p-5" : "bg-zinc-100"}`}>
              {isEditing && isEditedId == conversation.id ? (
                <div className="flex">
                  <input
                  autoFocus
                    className="border pl-2 rounded-md border-zinc-300 focus:outline-none focus:border-zinc-500"
                    type="text"
                    value={newTitle}
                    onChange={handleTitleChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit(conversation.id);
                      }
                    }}
                  />
                </div>
              ) : (
                <div  onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(conversation.id);
                }} className={`flex items-center justify-between text-sm h-8 transition-all font-medium rounded-md p-5 w-full`}>
                  <div>
                    <img src="chat-icon.svg" className="w-[20px]" alt="" />
                  </div>
                  {/* Conversation Title */}
                  <div className="text-sm truncate" title={conversation.title}>
  {conversation.title.length > 20 ? `${conversation.title.slice(0, 20)}...` : conversation.title}
</div>
                  <div className="">
                    {isEditing ? (
                      ""
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click event from bubbling up to the parent div
                          toggleMenu(conversation.id);
                        }}
                        className="w-8 h-8 text-gray-500 hover:text-gray-700"
                      >
                        {/* Three Dots Icon */}
                        <svg
                          className="w-6 h-6 mt-3 ml-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="4"
                            d="M6 10h.01M12 10h.01M18 10h.01"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Contextual Menu Icon */}
              <div className=" relative inline-block">
                {/* Contextual Menu */}
                {openMenuId === conversation.id && (
                  <div className="absolute -right-2  mt-5 w-56 rounded-md shadow-lg bg-white z-20 ring-1 ring-black ring-opacity-5 focus:outline-none" style={{ top: "100%" }} role="menu" aria-orientation="vertical" tabIndex="-1">
                    <div className="py-1" role="none">
                      {/* Menu Items */}
                      <a href="#" className="text-gray-700 flex  gap-2 items-center px-4 py-2 text-sm" role="menuitem" tabIndex="-1" onClick={() => handleEditClick(conversation.id)}>
                        <img src="pen.svg" className="" alt="" />
                        <p className="mb-[3px] font-bold">Modifier</p>
                      </a>
                      <a href="#" onClick={() => deleteConversation(conversation.id)} className="text-gray-700 px-4 py-2 text-sm flex gap-2 items-center" role="menuitem" tabIndex="-1">
                        <img src="trash.png" alt="" />
                        <p className="mb-[3px] font-bold">Supprimer</p>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};


  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleSubmit = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/conversations/updateTitle?conversationId=${id}&newTitle=${newTitle}`
      );
      // Update conversation title on success
      setIsEditing(false);
      // Update the title in your state or context
    } catch (error) {
      // Handle error
    }
  };

  // State to manage sidebar visibility

  function handleNewConversation() {
    // This is where we'll add the code to create a new conversation
    const apiUrl = "http://localhost:8080/api/conversations/create?user_id="+idUser;

    // Make the POST request using Axios
    axios
      .post(apiUrl)
      .then((response) => {
        // Handle the response here
        const conversations = response.data;
        setConversations(response.data);

        if (conversations.length > 0) {
          // Get the last conversation from the array
          const lastConversation = conversations[conversations.length - 1];

          // Extract the id from the last conversation
          const lastConversationId = lastConversation.id;

          // Navigate to the new URL using the extracted id
          navigate(`/${lastConversationId}`);
        }
      })
      .catch((error) => {
        // Handle any errors here
        showPopup("Erreur lors de la création de la conversation");
      });
  }

  function handleLinkClick(conversationId) {
    // Change the URL programmatically to include the conversation ID
    // Build the URL with the conversationId

    const url = `/${conversationId}`;

    // Trigger a full page refresh by setting window.location.href
    navigate(url);
  }
  function cancelDelete() {
   // Clear the scheduled API call
   clearTimeout(deleteTimeoutId);

   // Revert the conversations list to include the conversation that was being deleted
   // Assuming you have a way to retrieve the original list of conversations
   retrieveConversations();

   // Hide the delete popup
   setDeletePopUp(false);
}
function deleteConversation(id) {
  // Immediately hide the conversation being deleted
  const filteredConversations = conversations.filter(convo => convo.id !== id);
  setConversations(filteredConversations);

  setDeletePopUp(true);

  // Schedule the API call with a 3-second delay
  const timeoutId = setTimeout(() => {
      const apiUrl = `http://localhost:8080/api/conversations/deleteByConversationId?conversationId=${id}&userId=${idUser}`;
      axios.delete(apiUrl)
          .then((response) => {
              // Update conversations with the response data
              const updatedConversations = response.data;
              setConversations(updatedConversations);

              // Navigate to the last conversation if there are any left
              if (updatedConversations.length > 0) {
                  const lastConversationId = updatedConversations[updatedConversations.length - 1].id;
                  navigate(`/${lastConversationId}`);
              } else {
                  // If all conversations are deleted, navigate to the home page
                  navigate("/");
              }
          })
          .catch((error) => {
              // Handle errors here, if necessary
              console.error('Error deleting conversation:', error);
              // Optionally, revert the conversations list if the delete fails
              setConversations(conversations);
          });

      setDeletePopUp(false);
  }, 3000);

  // Store the timeout ID for possible cancellation
  setDeleteTimeoutId(timeoutId);
}
const retrieveConversations = () => {
  setLoading(true); // Assuming you have a loading state

  const apiUrl = `http://localhost:8080/api/conversations/conversationsByUserId?userId=${idUser}`;

  axios.get(apiUrl)
      .then((response) => {
          setConversations(response.data); // Update the conversations state
          setLoading(false);
      })
      .catch((err) => {
          setError(err); // Assuming you have an error state
          setLoading(false);
      });
};
  
  useEffect(() => {
    retrieveConversations()
  }, [isEditing]);

  return (
    <div className="flex">
      <div
      onClick={() => {toggleMenu(null);if(isEditing){setIsEditing(false)}}}
        className={`${
          isSidebarOpen
            ? "fixed inset-0 transform translate-x-0 bg-white"
            : "hidden md:flex"
        } flex flex-col justify-between w-[290px] shadow-lg border-r border-gray-300  transition-transform duration-300 ease-in-out`}
      >
        <div className="">
          {/* Sidebar Header */}
          <div className="p-4">
         
              <img src="logo.png" alt="" className="mx-auto" />
           
          </div>
          <div className="w-full mt-10">
            <div className="w-full px-3" title="Créer une nouvelle conversation">
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
             
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div
                  className=""
                  style={{ height: "500px", overflowY: "auto" }}
                >
                   {/* Today Conversations */}
    <div>
    <div>
  {todayConversations.length > 0 && (
    <div className="px-2 pb-2 font-medium text-emerald-700 mt-6 mb-1">
      Aujourd'hui
    </div>
  )}
  {renderConversations(todayConversations)}
</div>
    </div>

    {/* Yesterday Conversations */}
    <div>
    {yesterdayConversations.length > 0 && (
    <div className="px-2 pb-2 font-medium text-emerald-700 mt-6 mb-1">
      Hier
    </div>
    )}
  {renderConversations(yesterdayConversations)}
    </div>

    {/* Historique Conversations */}
    <div>
    {beforeYesterdayConversations.length > 0 && (
    <div className="px-2 pb-2 font-medium text-emerald-700 mt-6 mb-1">
      Historique
    </div>
  )}
  {renderConversations(beforeYesterdayConversations)}
    </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mb-10"  >
          {/* <img src="logout.png" alt="" className="mx-auto hover:cursor-pointer	" onClick={()=>{
          localStorage.removeItem("isAuthenticated");
          navigate("/login")}
          } /> */}
          
        {
          deletePopUp && (
            <div className="mx-auto">
              <span>Conversation supprimée.</span>
              <button 
              onClick={() => cancelDelete()} 
              className="text-blue-500 inline hover:text-blue-700 bg-transparent font-semibold border border-transparent rounded hover:underline focus:outline-none"
              >
              Annuler
            </button>

                        </div>
          )
        }
        </div>



        {/* Sidebar Footer */}
        {/* <div className="p-4 mb-6">
          <img src="settings.svg" alt="" className="mx-auto" />
        </div> */}
        {/* <div className="flex mb-6">
        <p>Dark Mode</p>
        <img src="toggle-dark.svg" alt="" />
        <p>Light Mode</p>
        </div> */}
      </div>

      <Outlet />
    </div>
  );
}

export default Sidebar;

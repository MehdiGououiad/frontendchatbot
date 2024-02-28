import { useEffect, useState, useRef } from "react";
import axios from "axios";
import TypingEffect from "./TypingEffect";

function Chat({ setLinks,isChecked ,id,showPopup ,setIsEditing}) {
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false); // State to manage typing effect status

  
  const idUser=localStorage.getItem("id")

  const [chat, setChat] = useState([]);
  const [lastmessageId, setLastmessageId] = useState(0);

  // State to track thumbs-down clicks by message ID
  const [thumbsDownClicked, setThumbsDownClicked] = useState({});

  // Function to handle thumbs-down click
  const handleThumbsDownClick = (messageId) => {
    setThumbsDownClicked(prev => ({ ...prev, [messageId]: !prev[messageId] }));
  };



  const handleChange = (event) => {
    setInputValue(event.target.value);
  };
  
  function extractHref(htmlContent) {
    const urlRegex = /http[s]?:\/\/[^\s]+/g;
    const matches = htmlContent.match(urlRegex);
  
    if (!matches) {
      return [];
    }
  
    return matches.map(url => {
      // Remove the trailing period if present
      if (url.endsWith('.')) {
        url = url.slice(0, -1);
      }
    
      // Check if the URL matches the specific case
      let text = url === "https://prohras9.rb.echonet/hra-space/portal" ? "OpenHR" : "Lien";
    
      return {
        href: url,
        text: text // The text is now conditionally set
      };
    });
    
  }
  
  
  function processMessages(messages) {
    const seenLinks = new Set();
    const extractedLinks = [];

    messages.forEach((message) => {
      // Extract links from each message
      const messageLinks = extractHref(message.content);

      // Iterate over each link and check if it's already been seen
      messageLinks.forEach((linkObj) => {
        const linkHref = linkObj.href;
        if (!seenLinks.has(linkHref)) {
          seenLinks.add(linkHref);
          extractedLinks.push({
            type: "Lien",
            value: linkHref,
            text: linkObj.text,
          });
        }
      });
    });

    setLinks(extractedLinks);
  }


const handleSend = async (predefined) => {
  let value = predefined ?? inputValue.trim(); // Trim and use predefined if available, else use trimmed inputValue

  // Check if the value is empty and return early if it is
  if (!value) {
      console.log("Input is empty or contains only whitespace. Not sending.");
      return;
  }
  if (predefined !== undefined) {
      setInputValue(predefined);
  }
  setIsThinking(true); // Start thinking
  setIsTyping(true); // Trigger the typing effect to start


  const conversationId = getConversationIdFromUrl();
  const version = isChecked ? "2" : "1";
  const apiUrl = `http://localhost:8080/api/questions/ask`;

  try {
      const payload = {
          question: value,
          conversationId: conversationId,
          version: version
      };

      const response = await axios.post(apiUrl, payload);
      getMessages();


      setLastmessageId(response.data); // Assuming response.data has the ID

      // New logic to check conversation length and potentially update title
      const conversationLength = chat.length;
      if (conversationLength <= 1) { // Assuming a new conversation or first message
          const newTitle = value; // Define how you get or set this new title
          await handleSubmit(conversationId, newTitle); // Assuming handleSubmit can accept newTitle
      }

      setInputValue("");
  } catch (error) {
      handleSendError(error);
  } finally {
      setIsThinking(false); // Done thinking
  }
};

const handleSendError = (error) => {
  if (error.response) {
      console.log("Error response status:", error.response.status);
      showPopup(isChecked ? "LLM API DOWN" : "Embedding API DOWN");
  } else if (error.code === 'ECONNABORTED' || error.message === 'timeout of xms exceeded') {
      // Handle timeout error
      showPopup("Server Down: Request Timeout");
  } else if (error.message === 'Network Error' || error.message.includes('ERR_CONNECTION_REFUSED')) {
      // Handle connection refused error
      showPopup("Network Error: Connection Refused");
  } else {
      console.log("Error:", error);
  }
};

// Modified handleSubmit to accept newTitle as a parameter
const handleSubmit = async (id, newTitle) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/api/conversations/updateTitle?conversationId=${id}&newTitle=${newTitle}`
    );
    setIsEditing(true);
  } catch (error) {
    console.log("Error updating title:", error);
    // Optionally handle the error, e.g., show an error message
  }
};





  function getConversationIdFromUrl() {
    return id;
  }
  function handleResponseSelection(content) {
    const conversationId = getConversationIdFromUrl();

    
  }

  function getMessages() {
    console.log("called");
    const conversationId = getConversationIdFromUrl();

    if (conversationId !== null) {
      // Make the API call with the extracted conversation ID
      const apiUrl = `http://localhost:8080/api/conversations/messagesByConversationId?conversationId=${conversationId}`;

      axios
        .get(apiUrl)
        .then((response) => {
          // Handle the API response here if needed
          setChat(response.data);
          processMessages(response.data); // Process messages to extract links
        })
        .catch((error) => {
          // Handle any errors here
        });
    } else {
      const apiUrl =
        "http://localhost:8080/api/conversations/conversationsByUserId?userId="+idUser;

      axios
        .get(apiUrl)
        .then((response) => {
          // Handle the response here
          // Handle the response here
          const conversations = response.data;

          if (conversations.length > 0) {
            // Get the last conversation from the array
            const firstConversation = conversations[conversations.length - 1];

            // Extract the id from the last conversation
            const firstConversationId = firstConversation.id;

            // Navigate to the new URL using the extracted id
            navigate(`/${firstConversationId}`);
          }
        })
        .catch((err) => {});
    }
  }
  const handleContentChange = (newContent) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollThreshold = 200; // Change this value as needed

 // handleScrollEvent adapted to accept a boolean parameter to force scrolling to the bottom
const handleScrollEvent = (forceScrollToBottom = false) => {
  if (scrollRef.current) {
    if (forceScrollToBottom) {
      // Force scroll to the bottom
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    } else {
      // Handle manual scroll event for button visibility
      const distanceFromBottom =
        scrollRef.current.scrollHeight -
        scrollRef.current.scrollTop -
        scrollRef.current.offsetHeight;
        console.log(distanceFromBottom);
      setShowScrollButton(distanceFromBottom > scrollThreshold);
    }
  }
};

  
  
  function handleNewConversation() {
    // This is where we'll add the code to create a new conversation
    const apiUrl = "http://localhost:8080/api/conversations/create?user_id="+idUser;

    // Make the POST request using Axios
    axios
      .post(apiUrl)
      .then((response) => {
        // Handle the response here
        const conversations = response.data;

        
            const lastConversation = conversations[conversations.length - 1];
            // Assuming lastConversation has a property 'id' or similar to use in the URL
            const lastConversationId = lastConversation.id;
        
            // Navigate to the URL based on the last conversation
            window.location.href = `/${lastConversationId}`;
        

      })
      .catch((error) => {
        // Handle any errors here
      });
  }
  const categorizeMessages = (messages) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
  
    const formatDate = (date) => date.toISOString().split('T')[0];
  
    const todayStr = formatDate(today);
    const yesterdayStr = formatDate(yesterday);
  
    const categorized = {
      'Aujourd\'hui': [],
      Hier : [],
      Historique: []
    };
  
    // Sort all messages by timestamp in descending order
    const sortedMessages = messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
    sortedMessages.forEach(message => {
      const messageDateStr = formatDate(new Date(message.timestamp));
      if (messageDateStr === todayStr) {
        categorized["Aujourd'hui"].push(message);
      } else if (messageDateStr === yesterdayStr) {
        categorized.Hier.push(message);
      } else {
        categorized.Historique.push(message);
      }
    });
  
    return categorized;
  };
  

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };
  const categorizedChat = chat.length!=0 ? categorizeMessages(chat):[];

  useEffect(() => {
    // Scroll to the bottom of the element
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
      
  }, [chat]); // This effect runs when content changes

  useEffect(() => {
    getMessages();
  }, [id]);
  return (
    <div className="lg:w-[80%] lg:border-r border-gray-300 flex flex-col justify-between w-full  lg:h-[88vh] h-[75vh] ">
      <div
        ref={scrollRef}
        //  onScroll={() => handleScrollEvent(false)}
        className="overflow-y-auto flex-grow  bg-[url('background.svg')] bg-center bg-auto bg-no-repeat"
      >
        <div className="flex gap-4 ml-2 mt-8">
          <img src="bot.svg" alt="" />
          <div className="">
            <div className="text-black text-sm leading-5 inline-block bg-zinc-100 px-4 py-2 rounded-xl">
            <TypingEffect message="Bonjour, \n
             Moi c'est <b>Rhym</b> , votre nouveau assistant RH, je suis là pour vous aider et répondre à vos questions. \n
             Comment je peux vous aider aujourd'hui ?" speed={chat.length > 0 ? 0 : 10}  onContentChange={handleContentChange} handleScrollEvent={handleScrollEvent}
              />            </div> 
            <br />
          
          </div>
        </div>
 
        {chat && chat.length > 0 ? (
          <div className="flex flex-col-reverse">
           {Object.entries(categorizedChat).map(([category, messages]) => (
        messages.length > 0 && (
          <div key={category}>
            <h2 className="text-center">{category}</h2>
            {messages
              .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
              .map(message => (
                <div
                  key={message.id}
                  className={`flex items-end my-1 ${
                    message.messageType === "Question"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.messageType === "Responsemultiple" ? (
                    <div className="flex flex-col items-center justify-center">
                      <h2 className="text-lg font-semibold mb-4">
                        J'ai peur de ne pas bien te comprendre ? Voici quelques suggestions
                      </h2>
                      <div className="flex mx-20 gap-5">
                        {message.content.split(';').slice(0, 3).map((content, index) => (
                          <div key={index} className="flex-1" style={{ flexBasis: 0 }}>
                            <div onClick={() => handleResponseSelection(content)} className="inline-block text-sm leading-5 px-4 py-2 rounded-xl whitespace-pre-line bg-gray-100 border hover:border-green-500  h-full">
                              {content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : message.messageType === "Question" ? (
                    <div className="flex flex-row-reverse my-2">
                      <img src="photo.svg" alt="" className="mr-5" />
                      <div
                        className={`text-black inline-block text-sm leading-5 px-4 py-2 rounded-xl whitespace-pre-line ${
                          message.messageType === "Question"
                            ? "bg-green-500 text-white mr-3"
                            : "bg-gray-100"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ) : (
                    <div className="flex mr-10">
                      <img src="bot.svg" alt="" className="ml-2 mr-4" />
                      <div
                        className={`inline-block text-sm leading-5 px-4 py-2 rounded-xl whitespace-pre-line mr-5 ${
                          message.messageType === "Question"
                            ? "bg-green-500 text-white mr-5"
                            : "bg-gray-100"
                        }`}
                      >
                {message.id == lastmessageId ? (
              <TypingEffect
                message={message.content}
                speed={10}
                onContentChange={handleContentChange}
                handleScrollEvent={handleScrollEvent}
              />
            ) : (
              <TypingEffect
              message={message.content}
              speed={0}
              onContentChange={handleContentChange}
              handleScrollEvent={handleScrollEvent}
            />
            )}            
                      </div>
              <img onClick={() => handleThumbsDownClick(message.id)} src="thumbs-down.svg" className="w-4" alt="" />
            {thumbsDownClicked[message.id] && <div>Hello</div>}
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        )
      ))}

          </div>
        ) : (
          <div></div>
        )}
      </div>
      {showScrollButton && (
        <button
          onClick={()=>scrollToBottom()}
          style={{
            position: "fixed",
            top: "80%", // Center vertically
            left: "50%", // Center horizontally
            transform: "translate(-50%, -50%)", // Adjust for the button's own dimensions
            zIndex: 1000, // Ensure it's above other elements (adjust as needed)
          }}
        >
          <img src="arrow-down.svg" alt="" className=" text-green-500" />
          
        </button>
      )}

      {isThinking && (
        <div className=" mt-1 flex justify-center">
          <svg
            width="50px"
            height="50px"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
          >
            <circle cx="50" cy="50" r="10">
              <animate
                attributeName="r"
                from="10"
                to="50"
                dur="2s"
                begin="0s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="1"
                to="0"
                dur="2s"
                begin="0s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
          <span className="mt-3">Ton assistant refléchit ...</span>
        </div>
      )}
      { id && chat.length == 0 &&  (
      <div className=" flex-col items-stretch  justify-center px-14  mt-2 md:px-5 hidden md:flex">
        <div className="flex  gap-3.5 justify-center ">
          <div className="flex gap-2.5">
            <button
              onClick={() => handleSend("Comment bénéficiez d'une visite médicale ?")}
              className="px-8 py-2 text-sm leading-5 text-white whitespace-nowrap justify-center items-stretch bg-emerald-600 rounded-xl hover:bg-emerald-900 md:px-5 md:py-2"
            >
              Comment bénéficiez d'une visite médicale ?
            </button>
            <button
              onClick={() => handleSend("C'est quoi le block-leave ?")}
              className="px-6 py-2 text-sm leading-5 text-white whitespace-nowrap justify-center items-stretch bg-emerald-600 rounded-xl hover:bg-emerald-900 md:px-5 md:py-2"
            >
              C'est quoi le block-leave ?
            </button>
            <button
              onClick={() =>
                handleSend("Est-ce que mon salaire est maintenu en cas de maladie ?")
              }
              className="px-6 py-2 text-sm leading-5 text-white whitespace-nowrap justify-center items-stretch bg-emerald-600 rounded-xl hover:bg-emerald-900 md:px-5 md:py-2"
            >
              Est-ce que mon salaire est maintenu en cas de maladie ?
            </button>
          </div>
        </div>
      </div>)
}
<form
    onSubmit={(e) => {
        e.preventDefault(); // Prevent the default form submit action
        handleSend(undefined);
    }}
    className={`lg:mx-20 mt-4 mx-2 ${id ? 'relative flex items-center' :'hidden'}`}
>
    <input
        type="text"
        autoFocus
        value={inputValue}
        onChange={handleChange}
        placeholder="Saisir votre question ..."
        className="py-2 pl-8 pr-12 rounded-2xl border border-gray-300 focus:outline-none focus:ring focus:border-blue-500 flex-1"
        pattern="\S+.*" // Requires at least one non-whitespace character
        required // Ensures that the input is not empty
        title="La question ne peut pas être vide ou ne contenir que des espaces."
    />

    <button
        type="submit"
        className="absolute right-0 mr-2 text-white rounded-full p-2"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
    >
        <img src="send.svg" alt="Send" />
    </button>

</form>
<p className=" text-xs mt-3 italic text-center">Les réponses de Rhym sont à titre indicatif, merci de contacter votre responsable RH pour plus de détails</p>

      <div className={`w-[250px] mx-auto px-3 ${id?"hidden":"block"}`}>
        
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

    </div>
  );
}

export default Chat;

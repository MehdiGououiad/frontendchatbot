import { useEffect, useState, useRef } from "react";
import axios from "axios";
import TypingEffect from "./TypingEffect";
function Chat({ links, setLinks }) {
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef(null);

  const [chat, setChat] = useState([]);
  const [lastmessageId, setLastmessageId] = useState(0);
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // Call handleSend when the Enter key is pressed
      handleSend();
    }
  };
  function extractHref(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    return Array.from(doc.querySelectorAll("a")).map((link) => ({
      href: link.getAttribute("href"),
      text: link.textContent,
    }));
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
    let value = inputValue;
    if (predefined !== undefined) {
      value = predefined;
      setInputValue(predefined);
    }
    setIsThinking(true); // Start thinking
    // setIsThinking(false); // Stop thinking after a delay
    // Your send logic here
    const conversationId = getConversationIdFromUrl();

    const apiUrl = `http://localhost:8081/api/questions/ask?question=${value}&conversationId=${conversationId}`;
    try {
      // Assuming apiUrl is defined somewhere in your code
      const response = await axios
        .post(apiUrl)
        .then((response) => {
          // setLastmessageId(response.data.id);
          console.log(response.data);
          setLastmessageId(response.data);
          // Handle the API response here if needed
          getMessages();
          setInputValue("");
        })
        .catch((error) => {
          // Handle any errors here
          console.error("API Error:", error);
        });

      // Handle the API response here if needed

      // Assuming getMessages() and setInputValue() are defined and need to be called after the response
      getMessages();
      setInputValue("");
    } catch (error) {
      // Handle any errors here
      console.error("API Error:", error);
    } finally {
      // Set isThinking to false once the call is complete or if an error occurs
      setIsThinking(false);
    }

    // Make the API call with the input value
  };
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

  function getMessages() {
    const conversationId = getConversationIdFromUrl();
    if (conversationId !== null) {
      // Make the API call with the extracted conversation ID
      const apiUrl = `http://localhost:8081/api/conversations/messagesByConversationId?conversationId=${conversationId}`;

      axios
        .get(apiUrl)
        .then((response) => {
          // Handle the API response here if needed
          setChat(response.data);
          processMessages(response.data); // Process messages to extract links
        })
        .catch((error) => {
          // Handle any errors here
          console.error("API Error:", error);
        });
    } else {
      const apiUrl =
        "http://localhost:8081/api/conversations/conversationsByUserId?userId=1";

      axios
        .get(apiUrl)
        .then((response) => {
          // Handle the response here
          // Handle the response here
          const conversations = response.data;

          if (conversations.length > 0) {
            // Get the last conversation from the array
            const firstConversation = conversations[0];

            // Extract the id from the last conversation
            const firstConversationId = firstConversation.id;

            // Navigate to the new URL using the extracted id
            window.location.href = `/${firstConversationId}`;
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
  console.log(showScrollButton);
  const scrollThreshold = 200; // Change this value as needed

  // Function to handle scroll events
  const handleScroll = () => {
    if (scrollRef.current) {
      const distanceFromBottom =
        scrollRef.current.scrollHeight -
        scrollRef.current.scrollTop -
        scrollRef.current.offsetHeight;
      // Show the button if the user has scrolled up past the threshold
      setShowScrollButton(distanceFromBottom > scrollThreshold);
    }
  };

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the element
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat]); // This effect runs when content changes

  useEffect(() => {
    getMessages();
  }, []);
  return (
    <div className="lg:w-[80%] lg:border-r border-gray-300 flex flex-col justify-between w-full  lg:h-[88vh] h-[75vh] ">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="overflow-y-auto flex-grow bg-[url('background.svg')] bg-center bg-auto bg-no-repeat"
      >
        <div className="flex gap-4 ml-8 mt-8">
          <img src="bot.svg" alt="" />
          <div className="">
            <div className="text-black text-sm leading-5 inline-block bg-zinc-100 px-4 py-2 rounded-xl">
              Bonjour
            </div>
            <br />
            <div className="text-black text-sm leading-5 inline-block bg-zinc-100 px-4 py-2 rounded-xl mt-2">
              Moi c'est <span className="font-bold"> Rhym</span>, votre nouveau
              assistant RH, je suis là pour vous aider et répondre à vos
              questions.
            </div>
            <br />
            <div className="text-black text-sm leading-5 inline-block bg-zinc-100 px-4 py-2 rounded-xl mt-2">
              Comment je peux vous aider aujourd'hui ?
            </div>
          </div>
        </div>

        {chat && chat.length > 0 ? (
          <div className="flex flex-col-reverse">
            {chat
              .slice()
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end my-1 ${
                    message.messageType === "Question"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.messageType === "Question" ? (
                    <div className="flex flex-row-reverse my-2">
                      <img src="photo.svg" alt="" className="mr-5" />
                      <div
                        className={`text-black inline-block text-sm leading-5 px-4 py-2 rounded-xl whitespace-pre-line	 ${
                          message.messageType === "Question"
                            ? "bg-green-500 text-white mr-3 "
                            : "bg-gray-100"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ) : (
                    <div className="flex mr-10">
                      <img src="bot.svg" alt="" className="ml-8 mr-4" />
                      <div
                        className={` inline-block text-sm leading-5 px-4 py-2 rounded-xl whitespace-pre-line	mr-5 ${
                          message.messageType === "Question"
                            ? "bg-green-500 text-white mr-5"
                            : "bg-gray-100"
                        }`}
                      >
                        {message.id == lastmessageId ? (
                          <TypingEffect
                            message={message.content}
                            speed={50}
                            onContentChange={handleContentChange}
                          />
                        ) : (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: message.content,
                            }}
                          />
                        )}
                      </div>

                      {/* <img src="like.svg" className="mr-2" alt="" />
                      <img src="dislike.svg" alt="" /> */}
                    </div>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div></div>
        )}
      </div>
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          style={{
            position: "fixed",
            top: "78%", // Center vertically
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
      <div className="flex flex-col items-stretch  justify-center px-14  mt-2 md:px-5">
        <div className="flex  gap-3.5 justify-center ">
          <div className="flex gap-2.5">
            <button
              onClick={() => handleSend("C'est quoi Futuris ?")}
              className="px-8 py-2 text-sm leading-5 text-white whitespace-nowrap justify-center items-stretch bg-emerald-600 rounded-xl hover:bg-emerald-900 md:px-5 md:py-2"
            >
              C'est quoi Futuris ?
            </button>
            <button
              onClick={() => handleSend("Quels sont mes portails RH ?")}
              className="px-6 py-2 text-sm leading-5 text-white whitespace-nowrap justify-center items-stretch bg-emerald-600 rounded-xl hover:bg-emerald-900 md:px-5 md:py-2"
            >
              Quels sont mes portails RH ?
            </button>
            <button
              onClick={() =>
                handleSend("Combien on peut mettre sur l'epargne retraite ?")
              }
              className="px-6 py-2 text-sm leading-5 text-white whitespace-nowrap justify-center items-stretch bg-emerald-600 rounded-xl hover:bg-emerald-900 md:px-5 md:py-2"
            >
              Combien on peut mettre sur l'epargne retraite ?
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center lg:mx-20 mt-2 mx-2">
        {/* <label className="cursor-pointer" htmlFor="fileInput">
          <img src="joinfile.svg" alt="" className="mr-2" />
        </label>
        <input type="file" id="fileInput" className="sr-only" /> */}
        <input
          type="text"
          autoFocus
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown} // Call handleKeyDown on key press
          placeholder="Saisir votre message ..."
          className="py-2 pl-8 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring focus:border-blue-500 flex-1"
        />

        <button
          type="button"
          className="text-white rounded-full p-2 lg:ml-2"
          onClick={() => handleSend(undefined)}
        >
          <img src="send.svg" alt="" />
        </button>
      </div>
    </div>
  );
}

export default Chat;

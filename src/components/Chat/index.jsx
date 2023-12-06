import { useEffect, useState, useRef } from "react";
import axios from "axios";
function Chat() {
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef(null);

  const [chat, setChat] = useState([]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // Call handleSend when the Enter key is pressed
      handleSend();
    }
  };

  const handleSend = () => {
    setIsThinking(true); // Start thinking
    setTimeout(() => {
      setIsThinking(false); // Stop thinking after a delay
      // Your send logic here
      const conversationId = getConversationIdFromUrl();

      const apiUrl = `http://192.168.3.20:8081/api/questions/ask?question=${inputValue}&conversationId=${conversationId}`;

      axios
        .post(apiUrl)
        .then((response) => {
          // Handle the API response here if needed
          console.log(response.data);
          getMessages();
          setInputValue("");
        })
        .catch((error) => {
          // Handle any errors here
          console.error("API Error:", error);
        });
    }, 1000); // Adjust the timeout duration as needed

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
      const apiUrl = `http://192.168.3.20:8081/api/conversations/messagesByConversationId?conversationId=${conversationId}`;

      axios
        .get(apiUrl)
        .then((response) => {
          // Handle the API response here if needed
          setChat(response.data);
        })
        .catch((error) => {
          // Handle any errors here
          console.error("API Error:", error);
        });
    } else {
      const apiUrl =
        "http://192.168.3.20:8081/api/conversations/conversationsByUserId?userId=1";

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
    <div className="lg:w-[75%] lg:border-r border-gray-300 flex flex-col justify-between w-full  lg:h-[90vh] h-[75vh] ">
      <div ref={scrollRef} className="overflow-y-auto flex-grow">
        <div className="flex gap-4 ml-8 mt-8">
          <img src="bot.svg" alt="" />
          <div className="">
            <div className="text-black text-sm leading-5 inline-block bg-zinc-100 px-4 py-2 rounded-xl">
              Bonjour
            </div>
            <br />
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
                    <div className="flex">
                      <img src="bot.svg" alt="" className="ml-8 mr-4" />
                      <div
                        className={`text-black inline-block text-sm leading-5 px-4 py-2 rounded-xl whitespace-pre-line	mr-5 ${
                          message.messageType === "Question"
                            ? "bg-green-500 text-white mr-5 "
                            : "bg-gray-100"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div></div>
        )}
      </div>
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

      <div className="flex items-center lg:mx-20 mt-4 mx-2">
        <label className="cursor-pointer" htmlFor="fileInput">
          <img src="joinfile.svg" alt="" className="mr-2" />
        </label>
        <input type="file" id="fileInput" className="sr-only" />
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown} // Call handleKeyDown on key press
          placeholder="Saisir votre message ..."
          className="py-2 pl-8 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring focus:border-blue-500 flex-1"
        />

        <button
          type="button"
          className="text-white rounded-full p-2 lg:ml-2"
          onClick={handleSend}
        >
          <img src="send.svg" alt="" />
        </button>
      </div>
    </div>
  );
}

export default Chat;

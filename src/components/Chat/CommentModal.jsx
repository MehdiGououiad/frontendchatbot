import React, { useState, useRef } from "react";

const CommentModal = ({ isOpen, onClose, messageId, reportMessage }) => {
  const textareaRef = useRef(null); // Initialize the ref

  const handleSendClick = () => {
    // Ensure the textareaRef.current is not null
    if (textareaRef.current) {
      reportMessage(messageId, textareaRef.current.value); // Use the current value of the textarea
      onClose(); // Close the modal after sending the message
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-lg p-5">
        <header className=" flex justify-between items-center border-b pb-2 border-emerald-600">
          <h2 className="text-xl font-semibold text-emerald-600 ">
            Ajouter un commentaire
          </h2>
          <button onClick={() => onClose()} className=" text-3xl ">
            &times;
          </button>
        </header>
        <div className="mt-5">
          <textarea
            ref={textareaRef} // Attach the ref to the textarea
            className="w-full p-3 text-sm text-gray-700 bg-[#F1F1F1] focus:bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            rows="4"
            placeholder="Votre commentaire..."
          ></textarea>
        </div>
        <div className="flex justify-end items-center p-2">
          <button
            onClick={() => handleSendClick()}
            className="bg-emerald-500 text-white font-semibold py-1 px-11 rounded-full hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};
export default CommentModal;

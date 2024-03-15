import React, { useState, useEffect, useRef } from "react";

const TypingEffect = ({
  message,
  speed,
  tagSpeed = 5,
  onContentChange,
  playTyping,
  handleScrollEvent,
  setPlayTyping,
}) => {
  console.log(playTyping, "playTyping");
  const [displayedContent, setDisplayedContent] = useState("");
  const [index, setIndex] = useState(0);
  const insideTag = useRef(false);
  const contentRef = useRef(null); // New ref to access the content container

  useEffect(() => {
    // Preprocess the message to replace \n with <br> only once
    const processedMessage = message.replace(/\\n/g, "<br>");

    if (speed === 0) {
      setDisplayedContent(processedMessage); // Use processedMessage with <br> for new lines
      // handleScrollEvent(true); // Pass true to force scrolling to the bottom
      if (onContentChange) {
        onContentChange(processedMessage);
      }
      // When the typing effect is skipped due to speed being 0, also call setPlayTyping
      //  if (setPlayTyping) {
      //   setPlayTyping(undefined);
      // }
    } else if (index < processedMessage.length && playTyping) {
      if (processedMessage.charAt(index) === "<") {
        insideTag.current = true;
      } else if (processedMessage.charAt(index) === ">") {
        insideTag.current = false;
      }

      const currentSpeed = insideTag.current ? tagSpeed : speed;

      const timer = setTimeout(() => {
        setDisplayedContent((prev) => prev + processedMessage.charAt(index));
        setIndex((prev) => prev + 1);
        handleScrollEvent(true); // Pass true to force scrolling to the bottom
        // Check if typing has finished and call setPlayTyping with undefined
        if (index + 1 === processedMessage.length && setPlayTyping) {
          setPlayTyping(undefined);
        }
      }, currentSpeed);

      return () => clearTimeout(timer);
    }
  }, [index, message, speed, tagSpeed, onContentChange, handleScrollEvent]);

  return (
    <div
      ref={contentRef}
      dangerouslySetInnerHTML={{ __html: displayedContent }}
    />
  );
};

export default TypingEffect;

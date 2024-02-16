import React, { useState, useEffect, useRef } from "react";

const TypingEffect = ({
  message,
  speed,
  tagSpeed = 5,
  onContentChange,
  handleScrollEvent
}) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [index, setIndex] = useState(0);
  const insideTag = useRef(false);
  const contentRef = useRef(null); // New ref to access the content container

  useEffect(() => {
    

    if (speed === 0) {
      setDisplayedContent(message.replace(/\n/g, "<br>")); // Ensure regex is correct for actual newlines
      handleScrollEvent(true); // Pass true to force scrolling to the bottom
      if (onContentChange) {
        onContentChange(message);
      }
    } else if (index < message.length) {
      if (message.charAt(index) === "<") {
        insideTag.current = true;
      } else if (message.charAt(index) === ">") {
        insideTag.current = false;
      }

      const currentSpeed = insideTag.current ? tagSpeed : speed;

      const timer = setTimeout(() => {
        if (message.charAt(index) === "\\" && message.charAt(index + 1) === "n") {
          setDisplayedContent((prev) => prev + "<br>");
          setIndex(index + 2);
        } else {
          setDisplayedContent((prev) => prev + message.charAt(index));
          setIndex((prev) => prev + 1);
        }
        handleScrollEvent(true); // Pass true to force scrolling to the bottom
      }, currentSpeed);

      return () => clearTimeout(timer);
    }
  }, [index, message, speed, tagSpeed]);

  return <div ref={contentRef} dangerouslySetInnerHTML={{ __html: displayedContent }} />;
};

export default TypingEffect;

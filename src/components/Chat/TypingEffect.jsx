import React, { useState, useEffect, useRef } from "react";

const TypingEffect = ({
  message,
  speed,
  tagSpeed = 5,
  onContentChange,
}) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [index, setIndex] = useState(0);
  const insideTag = useRef(false);

  useEffect(() => {
    if (speed === 0) {
      // If speed is 0, display the full message immediately
      setDisplayedContent(message.replace(/\\n/g, "<br>"));
      if (onContentChange) {
        onContentChange(message);
      }
    } else if (index < message.length) {
      // Check if the current character is a tag opening or closing
      if (message.charAt(index) === "<") {
        insideTag.current = true;
      } else if (message.charAt(index) === ">") {
        insideTag.current = false;
      }

      // Determine speed based on whether we're inside a tag
      const currentSpeed = insideTag.current ? tagSpeed : speed;

      const timer = setTimeout(() => {
        // Check for "\n" sequence and replace with a newline character
        if (message.charAt(index) === "\\" && index + 1 < message.length && message.charAt(index + 1) === "n") {
          setDisplayedContent(prev => prev + "<br>");
          setIndex(index + 2); // Skip the 'n' character as it's part of the "\n" sequence
        } else {
          setDisplayedContent(prev => prev + message.charAt(index));
          setIndex(prev => prev + 1);
        }
      }, currentSpeed);

      return () => clearTimeout(timer);
    }
  }, [index, message, speed, tagSpeed, displayedContent]);

  return <div dangerouslySetInnerHTML={{ __html: displayedContent }} />;
};

export default TypingEffect;

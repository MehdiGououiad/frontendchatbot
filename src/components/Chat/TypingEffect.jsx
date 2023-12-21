import React, { useState, useEffect, useRef } from "react";

const TypingEffect = ({
  message,
  speed = 100,
  tagSpeed = 5,
  onContentChange,
}) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [index, setIndex] = useState(0);
  const insideTag = useRef(false);

  useEffect(() => {
    if (index < message.length) {
      // Check if the current character is a tag opening or closing
      if (message.charAt(index) === "<") {
        insideTag.current = true;
      } else if (message.charAt(index) === ">") {
        insideTag.current = false;
      }
      if (onContentChange) {
        onContentChange(displayedContent + message.charAt(index));
      }

      // Determine speed based on whether we're inside a tag
      const currentSpeed = insideTag.current ? tagSpeed : speed;

      const timer = setTimeout(() => {
        setDisplayedContent((prev) => prev + message.charAt(index));
        setIndex((prev) => prev + 1);
      }, currentSpeed);

      return () => clearTimeout(timer);
    }
  }, [index, message, speed, tagSpeed, displayedContent, onContentChange]);

  return <div dangerouslySetInnerHTML={{ __html: displayedContent }} />;
};

export default TypingEffect;

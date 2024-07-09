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
  const [displayedContent, setDisplayedContent] = useState("");
  const [index, setIndex] = useState(0);
  const insideTag = useRef(false);
  const contentRef = useRef(null);

  const convertUrlsToLinks = (text) => {
    const urlRegex = /http[s]?:\/\/[^\s]+/g;
    return text.replace(urlRegex, (url) => {
      if (url.endsWith(".")) {
        url = url.slice(0, -1);
      }
      return `<a href="${url}" class="font-medium text-blue-600 dark:text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
  };

  useEffect(() => {
    const processedMessage = convertUrlsToLinks(message.replace(/\\n/g, "<br>"));

    if (speed === 0) {
      setDisplayedContent(processedMessage);
      if (onContentChange) {
        onContentChange(processedMessage);
      }
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
        handleScrollEvent(true);
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

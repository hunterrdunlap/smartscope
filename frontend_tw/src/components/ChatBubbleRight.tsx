import React from "react";
import ReactMarkDown from "react-markdown";

type ChatBubbleRightProps = {
  message: string;
  logoPath: string;
};

const ChatBubbleRight: React.FC<ChatBubbleRightProps> = ({
  message,
  logoPath,
}) => {
  return (
    <div className="chat chat-end m-2">
      <div className="chat-image avatar">
        <div className="w-10 ">
          <img src={logoPath} />
        </div>
      </div>
      <div className="chat-bubble chat-bubble-primary">
        <ReactMarkDown>{message}</ReactMarkDown>
      </div>
    </div>
  );
};

export default ChatBubbleRight;

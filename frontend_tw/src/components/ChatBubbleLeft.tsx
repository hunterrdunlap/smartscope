import React from "react";
import ReactMarkDown from "react-markdown";

type ChatBubbleLeftProps = {
  message: string;
  logoPath: string;
};

const ChatBubbleLeft: React.FC<ChatBubbleLeftProps> = ({
  message,
  logoPath,
}) => {
  return (
    <div className="chat chat-start m-2">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img src={logoPath} />
        </div>
      </div>
      <article className="prose">
        <div
          dangerouslySetInnerHTML={{ __html: message }}
          className="chat-bubble bg-base-300"
        ></div>
      </article>
    </div>
  );
};

export default ChatBubbleLeft;

import React, { useState } from "react";
import axios from "axios";
import { encode, decode } from "gpt-3-encoder";
import tree_brain from "../tree_brain.png";
import logo from "../Pina Logo.png";
import ReactMarkDown from "react-markdown";

const ChatGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [responses, setResponses] = useState([] as string[]);
  const [questions, setQuestions] = useState([] as string[]);
  const [loading, setLoading] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setQuestions((prevQuestions) => [...prevQuestions, prompt]);
    try {
      const result = await axios.post("http://localhost:8000/generate", {
        text: prompt,
      });
      setResponses((prevResponses) => [...prevResponses, result.data.response]);
    } catch (error) {
      console.error("Error generating chat:", error);
    }
    setLoading(false);
    setPrompt("");
  };

  const generatePrompt = async () => {
    setLoading(true);
    setQuestions((prevQuestions) => [...prevQuestions, prompt]);
    try {
      const result = await axios.post("http://localhost:8000/generate-prompt", {
        text: prompt,
      });
      setResponses((prevResponses) => [...prevResponses, result.data.response]);
    } catch (error) {
      console.error("Error generating prompt:", error);
    }
    setLoading(false);
    setPrompt("");
  };

  // const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  //   if (e.key === "Enter" && !e.shiftKey) {
  //     e.preventDefault();
  //     handleSubmit(e as any);
  //   }
  // };

  const countTokens = (text: string) => {
    // Replace this regular expression with a more sophisticated one if needed
    const tokens = text.split(/[\s,.;?!]+/);
    return tokens.length - 1;
  };

  return (
    <div className="chat-history-container">
      <div className="questions-responses-container">
        {questions.map((question, index) => (
          <div key={index}>
            <div className="question-container response-wrapper">
              <img src={logo} alt="Logo" className="response-logo" />{" "}
              <ReactMarkDown>{question}</ReactMarkDown>
            </div>
            {responses[index] ? (
              <div className="response-container response-wrapper">
                <img src={tree_brain} alt="Logo" className="response-logo" />{" "}
                <ReactMarkDown>{responses[index]}</ReactMarkDown>
              </div>
            ) : (
              loading && <p>Loading response...</p>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="prompt-container">
        <div className="input-container">
          <label>
            <textarea
              className="prompt-input"
              value={prompt}
              onChange={async (e) => {
                setPrompt(e.target.value);
                setTokenCount(await countTokens(e.target.value));
              }}
              // onKeyPress={handleKeyPress}
            />
          </label>
        </div>
        <p className="word-count">
          Word Count : ~{tokenCount}{" "}
          {tokenCount > 4000 && (
            <span style={{ color: "red" }}>
              (Too long! Maximum allowed length is 4000 tokens)
            </span>
          )}
        </p>
        {/* <button className="submit-button" type="submit" disabled={true}>
          Submit
        </button> */}
        <button
          className="submit-button"
          type="button"
          disabled={loading}
          onClick={generatePrompt}
        >
          Generate Prompt
        </button>
      </form>
    </div>
  );
};

export default ChatGenerator;

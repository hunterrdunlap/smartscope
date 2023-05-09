import React, { useState } from "react";
import axios from "axios";
import ChatBubbleLeft from "./ChatBubbleLeft";
import ChatBubbleRight from "./ChatBubbleRight";

const ChatGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [responses, setResponses] = useState([] as string[]);
  const [questions, setQuestions] = useState([] as string[]);
  const [loading, setLoading] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const [toggleState, setToggleState] = useState(false);

  const generateResponse = async () => {
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

  const generateSources = async () => {
    setLoading(true);
    setQuestions((prevQuestions) => [...prevQuestions, prompt]);
    try {
      const result = await axios.post(
        "http://localhost:8000/generate-sources",
        {
          text: prompt,
        }
      );
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

  const resetChat = () => {
    setQuestions([]);
    setResponses([]);
  };

  const countTokens = (text: string) => {
    // Replace this regular expression with a more sophisticated one if needed
    const tokens = text.split(/[\s,.;?!]+/);
    return tokens.length - 1;
  };
  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-20">
          <img
            src={"src/assets/Pina Logo.png"}
            alt="Spinning image"
            className="animate-spin-slow w-48 h-48"
          />
        </div>
      )}
      <div className="flex container h-[80vh] w-full">
        <div className="grid h-full w-6/12 object-contain flex-grow card bg-base-300 rounded-box place-items-center">
          <div className="form-control place-items-center">
            Select Model Type:
            <label className="cursor-pointer label">
              <span className="label-text p-3 $">davinci-003</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={toggleState}
                onChange={() => setToggleState(!toggleState)}
              />
              <span className="label-text p-3">gpt-4</span>
            </label>
          </div>
          Token Count: {tokenCount}
          <div>
            <button onClick={resetChat} className="btn btn-accent">
              Reset Chat Box
            </button>
          </div>
        </div>
        <div className="divider divider-horizontal"></div>
        <div className="flex flex-col h-full w-full object-contain flex-grow card bg-base-300 rounded-box justify-end items-center">
          <div className="h-full w-11/12 bg-neutral my-5 mx-5 rounded-md overflow-auto contain">
            <>
              {console.log(questions)}

              {questions.length > 0 ? (
                questions.map((question, index) => (
                  <>
                    <ChatBubbleRight
                      message={question}
                      logoPath="src/assets/Pina Logo.png"
                    />
                    {responses[index] && (
                      <ChatBubbleLeft
                        message={responses[index]}
                        logoPath="src/assets/pinagpt.png"
                      />
                    )}
                  </>
                ))
              ) : (
                <ChatBubbleLeft
                  message="Ask me a question!"
                  logoPath="src/assets/pinagpt.png"
                />
              )}
            </>
          </div>
          <div className="w-3/5">
            <textarea
              className="textarea textarea-primary w-full"
              placeholder="enter your prompt here..."
              value={prompt}
              onChange={async (e) => {
                setPrompt(e.target.value);
                setTokenCount(await countTokens(e.target.value));
              }}
            ></textarea>
          </div>
          <div className="flex container place-content-center">
            <div className="p-2">
              <button
                className="btn btn-primary"
                disabled={loading}
                onClick={generatePrompt}
              >
                Generate Prompt
              </button>
            </div>
            <div className="p-2">
              <button
                className="btn btn-secondary"
                disabled={loading}
                onClick={generateResponse}
              >
                Generate Answer
              </button>
            </div>
            <div className="p-2">
              <button
                className="btn btn-accent"
                disabled={loading}
                onClick={generateSources}
              >
                Generate Sources
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatGenerator;

import React, { useState } from "react";
import axios from "axios";

const ChatGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post("http://localhost:8000/generate", {
        text: prompt,
      });
      setResponse(result.data.response);
    } catch (error) {
      console.error("Error generating chat:", error);
    }
    setLoading(false);
  };

  const countTokens = (text: string) => {
    // Replace this regular expression with a more sophisticated one if needed
    const tokens = text.split(/[\s,.;?!]+/);
    return tokens.length;
  };

  const countTokens2 = async (text: string) => {
    try {
      const response = await axios.post("http://localhost:8000/count-tokens", {
        text: text,
      });
      return response.data.token_count;
    } catch (error) {
      console.error("Error counting tokens:", error);
      return -1; // Return -1 to indicate an error
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <textarea
            className="prompt-input"
            value={prompt}
            onChange={async (e) => {
              setPrompt(e.target.value);
              setTokenCount(await countTokens2(e.target.value));
            }}
          />
        </label>
        <p>
          Token count: {tokenCount}{" "}
          {tokenCount > 4000 && (
            <span style={{ color: "red" }}>
              (Too long! Maximum allowed length is 4000 tokens)
            </span>
          )}
        </p>
        <button className="submit-button" type="submit" disabled={loading}>
          Generate Chat
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {response && (
        <div className="response-container">
          <h3>Generated Chat:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default ChatGenerator;

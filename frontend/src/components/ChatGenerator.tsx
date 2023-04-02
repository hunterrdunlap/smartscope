import React, { useState } from 'react';
import axios from 'axios';

const ChatGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post('http://localhost:8000/generate', { text: prompt });
      setResponse(result.data.response);
    } catch (error) {
      console.error('Error generating chat:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <textarea
            className="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </label>
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
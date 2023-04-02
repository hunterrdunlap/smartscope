import React, { useState } from 'react';
import axios from 'axios';

const ChatGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await axios.post('http://localhost:8000/generate', { text: prompt });
      setResponse(result.data.response);
    } catch (error) {
      console.error('Error generating chat:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </label>
        <button type="submit">Generate Chat</button>
      </form>
      {response && (
        <div>
          <h3>Generated Chat:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default ChatGenerator;

import React from 'react';
import './App.css';
import ChatGenerator from './components/ChatGenerator';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>OpenAI Chat Generator</h1>
      </header>
      <main>
        <ChatGenerator />
      </main>
    </div>
  );
}

export default App;

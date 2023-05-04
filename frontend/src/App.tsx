import React from "react";
import "./App.css";
import ChatGenerator from "./components/ChatGenerator";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>PinaGPT</h2>
      </header>
      <main className="App-main">
        <ChatGenerator />
      </main>
    </div>
  );
}

export default App;

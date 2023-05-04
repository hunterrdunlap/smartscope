import React from "react";
import "./App.css";
import ChatGenerator from "./components/ChatGenerator";

// Define your App component
const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <header className="bg-primary text-white py-4 ">
        <div className="container mx-auto ">
          <h1 className="text-2xl font-semibold">Pina GPT</h1>
        </div>
      </header>
      <main className="container bg-base-100 mx-auto my-10 flex-grow">
        <ChatGenerator />
      </main>
      <footer className="bg-neutral text-white py-4">
        <div className="container mx-auto place-content-end">
          <a href="https://github.com/hunterrdunlap" className="text-sm">
            &copy; Hunter Dunlap
          </a>
        </div>
      </footer>
    </div>
  );
};

// Export your App component
export default App;

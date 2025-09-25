import React, { useState } from "react";
import { askAi } from "./lib/ai";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => setPrompt(e.target.value);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);


    const newMessage = { role: "user", text: prompt };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const aiResponse = await askAi(prompt);
      setMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", text: "⚠️ Error: " + err.message }]);
    }

    setPrompt("");
    setIsLoading(false);
  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow-lg bg-pink-200">
      <h1 className="text-2xl font-bold text-center mb-4">🤖 Gemini AI Chat</h1>

      {/* Messages */}
      <div className="h-96 overflow-y-auto border rounded p-4 bg-gray-400 mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg max-w-xs ${
              msg.role === "user"
                ? "bg-blue-200 self-end ml-auto text-right"
                : "bg-gray-200 text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="text-pink-700 italic">⏳ Gemini is thinking...</div>
        )}
      </div>

      {/* Input */}
      <div className="flex space-x-2">
        <textarea
          value={prompt}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows="2"
          className="flex-1 border rounded p-2 resize-none"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
          disabled={isLoading}
        >
          {isLoading ? "..." : "Send"}
        </button>
        <button
          onClick={clearChat}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

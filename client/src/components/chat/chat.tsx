import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { scrollToBottom } from "../../utils";
import { Header } from "./header";

const Chat = () => {
  const [messages, setMessages] = useState<
    { sender: "user" | "agent"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom(messagesEndRef);
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) {
      return;
    }

    const messageToSend = input;
    const userMessage: { sender: "user" | "agent"; text: string } = {
      sender: "user",
      text: messageToSend,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const agentMessage: { sender: "user" | "agent"; text: string } = {
        sender: "agent",
        text: `"${generateResponse(messageToSend)}"`,
      };
      setMessages((prev) => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateResponse = (input: string): string => {
    return `You said "${input}". How can I help further?`;
  };

  return (
    <div className="h-[90vh] w-4/5 md:w-2/5 bg-gray-800 text-white rounded-xl flex flex-col shadow-xl overflow-hidden">
      <Header />

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-800">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-3 rounded-xl max-w-xs ${
              message.sender === "user"
                ? "bg-blue-500 self-end ml-auto text-white"
                : "bg-gray-600 self-start mr-auto text-white"
            }`}
          >
            {message.text}
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            key="typing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.5,
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="bg-gray-600 text-white p-3 rounded-xl max-w-xs self-start mr-auto"
          >
            Alfred is thinking...
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-gray-600 bg-gray-700 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded-lg bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

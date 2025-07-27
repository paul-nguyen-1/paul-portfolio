import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { postData, scrollToBottom } from "../../lib/utils/utils";
import { Header } from "./header";
import { useMutation } from "@tanstack/react-query";
import type {
  SendMessageInput,
  SendMessageResponse,
} from "../../lib/utils/types";
import FloatingActionButton from "../floatingActionsButton";
import { LettersPullUp } from "../lettersPullUp";

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

  const { mutate } = useMutation({
    mutationFn: (payload: SendMessageInput) =>
      postData<SendMessageResponse, SendMessageInput>(
        `${import.meta.env.VITE_ALFRED_BACKEND_ENDPOINT}/gpt/respond-as-paul`,
        payload
      ),
    onSuccess: (res) => {
      setMessages((prev) => [...prev, { sender: "agent", text: res.reply }]);
      setIsTyping(false);
    },
    onError: (error) => {
      console.error("Mutation failed:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "agent", text: "Sorry, something went wrong." },
      ]);
      setIsTyping(false);
    },
  });

  const handleSend = (message?: string) => {
    const content = message ?? input;
    if (!content.trim()) {
      return;
    }

    const userMessage = { sender: "user" as const, text: content };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    mutate({ message: content });
    setInput("");
  };

  const suggestedQuestions = [
    "Can you give me a short intro about yourself?",
    "What did you do at NASA?",
    "What are your hobbies?",
    "What are your strengths as an engineer?",
    "Which tech stacks are you most experienced with?",
  ];

  return (
    <div className="md:h-[90vh] md:w-2/5 bg-gray-800 text-white md:rounded-xl flex flex-col shadow-xl overflow-hidden">
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

      <div className="p-2 border-t border-gray-600 bg-gray-700 flex flex-col gap-2">
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 mb-1">
            {suggestedQuestions.map((question) => (
              <button
                key={question}
                onClick={() => handleSend(question)}
                className="bg-gray-600 hover:bg-gray-500 text-white text-sm px-3 py-1 rounded-lg transition cursor-pointer"
              >
                <LettersPullUp
                  text={question}
                  className="text-sm font-medium"
                />
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 rounded-lg bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ask me anything..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSend()}
              className="bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-600 transition cursor-pointer"
            >
              Send
            </button>
            <FloatingActionButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

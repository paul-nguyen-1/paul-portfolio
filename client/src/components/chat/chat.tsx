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
import { FiArrowUp, FiStopCircle } from "react-icons/fi";
import preloadMessagesRaw from "../../../data/preload_messages.config.json";

type Message = {
  sender: "user" | "agent";
  text?: string;
  link?: { label: string; href: string };
};

const Chat = () => {
  const preloadMessages = preloadMessagesRaw as Message[];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom(messagesEndRef);
  }, [messages, isTyping]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      const next = preloadMessages[index];
      if (next) {
        setMessages((prev) => [...prev, next]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

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

    setMessages((prev) => [...prev, { sender: "user", text: content }]);
    setIsTyping(true);
    mutate({ message: content });
    setInput("");
  };

  const suggestedQuestions = [
    "What are your hobbies?",
    "What are your strengths as an engineer?",
    "Which tech stacks are you most experienced with?",
  ];

  return (
    <div className="h-screen md:h-[90vh] md:w-2/5 bg-gray-800 text-white md:rounded-xl flex flex-col shadow-xl overflow-hidden">
      <Header />

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-800 scroll-smooth">
        {messages.map((message, index) => {
          if (!message || typeof message.sender !== "string") {
            return null;
          } else {
            return (
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
                {message.link ? (
                  <a
                    href={message.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-300 hover:text-blue-200"
                  >
                    {message.link.label}
                  </a>
                ) : (
                  message.text
                )}
              </motion.div>
            );
          }
        })}

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
            Give me a second... I'm thinking
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 border-t border-gray-600 bg-gray-700 flex flex-col gap-2">
        {messages.length === preloadMessages.length && (
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.75, ease: "easeOut" }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 rounded-lg bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ask me anything..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <div className="flex items-center gap-2">
            {isTyping ? (
              <button
                disabled
                className="bg-gray-600 text-gray-300 px-4 py-2 rounded-sm transition shadow-md cursor-not-allowed"
              >
                <FiStopCircle size={18} />
              </button>
            ) : (
              <button
                onClick={() => handleSend()}
                className="bg-[#5b3cc4] hover:bg-[#483197] text-[#e6e6f5] px-4 py-2 rounded-sm transition cursor-pointer shadow-md"
              >
                <FiArrowUp size={18} />
              </button>
            )}
            <FloatingActionButton />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;

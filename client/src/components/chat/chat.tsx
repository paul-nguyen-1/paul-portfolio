import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { postData, scrollToBottom, timeAgo } from "../../../utils/utils";
import { Header } from "./header";
import { useMutation } from "@tanstack/react-query";
import type {
  SendMessageInput,
  SendMessageResponse,
} from "../../../utils/types";
import FloatingActionButton from "../floatingActionsButton";
import { LettersPullUp } from "../lettersPullUp";
import { FiArrowUp, FiStopCircle } from "react-icons/fi";
import preloadDataRaw from "../../../data/preload_messages.config.json";

type Message = {
  sender: "user" | "agent";
  text?: string;
  link?: { label: string; href: string };
  createdAt: number;
};

type PreloadData = {
  messages: Omit<Message, "createdAt">[];
  suggestedQuestions: string[];
};

const Chat = () => {
  const { messages: preloadMessages, suggestedQuestions } =
    preloadDataRaw as PreloadData;
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
        setMessages((prev) => [...prev, { ...next, createdAt: Date.now() }]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 800);
    return () => clearInterval(interval);
  }, [preloadMessages]);

  const { mutate } = useMutation({
    mutationFn: (payload: SendMessageInput) =>
      postData<SendMessageResponse, SendMessageInput>(
        `${import.meta.env.VITE_ALFRED_BACKEND_ENDPOINT}/gpt/respond-as-paul`,
        payload
      ),
    onSuccess: (res) => {
      setMessages((prev) => [
        ...prev,
        { sender: "agent", text: res.reply, createdAt: Date.now() },
      ]);
      setIsTyping(false);
    },
    onError: (error) => {
      console.error("Mutation failed:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: "Sorry, something went wrong.",
          createdAt: Date.now(),
        },
      ]);
      setIsTyping(false);
    },
  });

  const handleSend = (message?: string) => {
    const content = message ?? input;
    if (!content.trim()) {
      return;
    }
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: content, createdAt: Date.now() },
    ]);
    setIsTyping(true);
    mutate({ message: content });
    setInput("");
  };

  return (
    <div className="h-screen md:h-[90vh] md:w-2/5 bg-gray-800 text-white md:rounded-xl flex flex-col shadow-xl overflow-hidden">
      <Header />
      <div className="relative flex-1 overflow-y-auto p-4 space-y-3 bg-gray-800 scroll-smooth ">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => {
            const isUser = message.sender === "user";
            return (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{
                  type: "spring",
                  stiffness: 520,
                  damping: 38,
                  mass: 0.7,
                }}
                className={`flex max-w-[520px] items-start gap-3 rounded-2xl p-4 transition-all duration-200 ease-in-out hover:scale-[103%] transform-gpu ${
                  isUser
                    ? "ml-auto bg-blue-500"
                    : "mr-auto bg-white/10 backdrop-blur-md"
                }`}
                style={{
                  boxShadow:
                    "0 0 0 1px rgba(0,0,0,.03), 0 2px 4px rgba(0,0,0,.05), 0 12px 24px rgba(0,0,0,.05)",
                }}
              >
                <div className="flex size-10 items-center justify-center rounded-2xl shrink-0 bg-white/20">
                  <span className="text-lg">{isUser ? "🧑‍💻" : "🤖"}</span>
                </div>

                <div className="flex flex-col overflow-hidden text-left text-white">
                  <div className="flex items-center gap-2 text-sm sm:text-base font-medium">
                    <span>{isUser ? "You" : "Alfred"}</span>
                    <span className="opacity-70">·</span>
                    <span className="opacity-70 text-xs">
                      {timeAgo(message.createdAt)}
                    </span>
                  </div>
                  <div className="mt-1 text-sm break-words">
                    {message.link ? (
                      <a
                        href={message.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:opacity-80"
                      >
                        {message.link.label}
                      </a>
                    ) : (
                      message.text
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {isTyping && (
            <motion.div
              key="typing"
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
              }}
              className="flex max-w-[520px] items-start gap-3 rounded-2xl p-4 mr-auto bg-white/10 backdrop-blur-md"
              style={{
                boxShadow:
                  "0 0 0 1px rgba(0,0,0,.03), 0 2px 4px rgba(0,0,0,.05), 0 12px 24px rgba(0,0,0,.05)",
              }}
            >
              <div className="flex size-10 items-center justify-center rounded-2xl shrink-0 bg-white/20">
                <span className="text-lg">🤖</span>
              </div>
              <div className="flex flex-col text-white">
                <div className="text-sm sm:text-base font-medium">
                  Alfred <span className="opacity-70">·</span>{" "}
                  <span className="opacity-70">typing…</span>
                </div>
                <motion.div
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="mt-1 text-sm"
                >
                  Give me a second... I’m thinking
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background" />
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

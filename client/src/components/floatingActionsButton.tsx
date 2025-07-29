import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiMail,
  FiLinkedin,
  FiGithub,
  FiFileText,
} from "react-icons/fi";
import { Tooltip } from "@mantine/core";

const actions = [
  {
    icon: <FiFileText className="text-[#cfcfe7]" size={18} />,
    label: "Resume",
    link: "/resume.pdf",
  },
  {
    icon: <FiMail className="text-[#cfcfe7]" size={18} />,
    label: "Email",
    link: "mailto:paul.nguyen.swe@gmail.com",
  },
  {
    icon: <FiLinkedin className="text-[#cfcfe7]" size={18} />,
    label: "LinkedIn",
    link: "https://www.linkedin.com/in/paul-nguyen--/",
  },
  {
    icon: <FiGithub className="text-[#cfcfe7]" size={18} />,
    label: "GitHub",
    link: "https://github.com/paul-nguyen-1",
  },
];

export default function FloatingActionButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <AnimatePresence>
        {open && (
          <div className="absolute bottom-13 flex flex-col items-end space-y-2">
            {actions.map((action, i) => (
              <motion.a
                key={action.label}
                href={action.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <Tooltip label={action.label} position="left" withArrow>
                  <div className="bg-[#2a2a3b] hover:bg-[#3b3b51] p-3 rounded-full shadow-lg transition">
                    {action.icon}
                  </div>
                </Tooltip>
              </motion.a>
            ))}
          </div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="group bg-[#2a2a3b] hover:bg-[#3b3b51] p-4 rounded-full shadow-xl text-white transition cursor-pointer"
      >
        <FiPlus
          size={12}
          className="transform transition-transform duration-300 group-hover:rotate-90"
        />
      </button>
    </div>
  );
}

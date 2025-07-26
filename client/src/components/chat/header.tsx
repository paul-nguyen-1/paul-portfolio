import { Card, Image, Text, Badge, Group, Avatar } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { getRotatingIndex } from "../../utils";
import { Typing } from "../typing";

export function Header() {
  const roles = [
    { label: "Software Engineer", color: "orange" },
    { label: "Graduate Student", color: "blue" },
  ];

  const experiences = [
    {
      logo: "https://images.seeklogo.com/logo-png/19/2/nasa-logo-png_seeklogo-195796.png",
      alt: "NASA Logo",
      name: "NASA (Software Engineering Intern) - Spring 2025",
    },
    {
      logo: "https://1000logos.net/wp-content/uploads/2021/11/Lucid-Motors-Logo.png",
      alt: "Lucid Motors Logo",
      name: "Lucid Motors (Software Engineering Intern) - Summer 2024 + Fall 2024",
    },
    {
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS18Ncz9jup5M9p9x2ENszCDuu_fZuyq9lq0w&s",
      alt: "Summersalt Logo",
      name: "SUMMERSALT (Software Engineering Intern) - Summer 2023 to Summer 2024",
    },
  ];

  const roleIndex = getRotatingIndex(roles.length, 7500);
  const experienceIndex = getRotatingIndex(experiences.length, 7500);
  const currentExperience = experiences[experienceIndex];

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md">
        <Card.Section className="relative">
          <Image
            src="https://rpmliving.com/wp-content/uploads/2021/12/houston-bg.png"
            alt="Background"
            className="md:h-50"
          />
          <div className="absolute bottom-[-.5rem] left-5">
            <Avatar
              src="/portfolio.jpg"
              h={100}
              w={100}
              className="rounded-full border-4 border-white shadow-lg"
            />
          </div>
        </Card.Section>

        <Group justify="space-between" mt={8}>
          <div className="flex space-x-2">
            <div className="flex flex-col">
              <Text size="xl" fw={500} fz={24} w={135}>
                Paul Nguyen
              </Text>
              <Text c="dimmed">Houston, Texas</Text>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={roles[roleIndex].label}
                initial={{ opacity: 0, y: -20, rotateX: 90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: 20, rotateX: -90 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative top-2">
                  <Badge color={roles[roleIndex].color}>
                    {roles[roleIndex].label}
                  </Badge>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center space-x-2">
            <img
              src="https://brand.illinois.edu/wp-content/uploads/2024/02/Block-I-orange-blue-background.png"
              alt="UIUC Logo"
              className="h-10 w-10"
            />
            <Text className="md:w-50">
              University of Illinois Urbana-Champaign
            </Text>
          </div>
        </Group>
      </Card>

      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        className="mt-2 bg-gray-700 text-white"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExperience.name}
            initial={{ opacity: 0, y: -20, rotateX: 90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: 20, rotateX: -90 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <motion.img
              key={currentExperience.logo}
              src={currentExperience.logo}
              alt={currentExperience.alt}
              className="h-10 w-10 object-contain"
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8 }}
            />
            <Typing text={currentExperience.name} />
          </motion.div>
        </AnimatePresence>
      </Card>
    </>
  );
}

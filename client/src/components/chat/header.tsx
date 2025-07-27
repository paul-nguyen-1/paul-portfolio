import { Card, Image, Text, Badge, Avatar } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { getRotatingIndex } from "../../lib/utils/utils";
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
      name: "NASA (SWE Intern)",
      duration: "Spring 2025",
      link: "https://www.nasa.gov/",
    },
    {
      logo: "https://media.licdn.com/dms/image/v2/C560BAQH7XEcX6E4M7w/company-logo_200_200/company-logo_200_200/0/1630642979756/lucidmotors_logo?e=1756339200&v=beta&t=zN-0pYxAUiElWsqCrtBzGHqRbWHwTyd58lUlnWXlleA",
      alt: "Lucid Motors Logo",
      name: "Lucid Motors (SWE Intern)",
      duration: "Summer/Fall 2024",
      link: "https://www.lucidmotors.com/",
    },
    {
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS18Ncz9jup5M9p9x2ENszCDuu_fZuyq9lq0w&s",
      alt: "Summersalt Logo",
      name: "SUMMERSALT (SWE Intern)",
      duration: "Summer 2023 - Spring 2024",
      link: "https://www.summersalt.com/",
    },
  ];

  const roleIndex = getRotatingIndex(roles.length, 7500);
  const experienceIndex = getRotatingIndex(experiences.length, 7500);
  const currentExperience = experiences[experienceIndex];
  const { name: title, duration, link } = currentExperience;

  return (
    <>
      <Card shadow="sm" className="rounded-none md:rounded-xl">
        <Card.Section className="relative">
          <Image
            src="https://rpmliving.com/wp-content/uploads/2021/12/houston-bg.png"
            alt="Background"
            className="md:h-35"
          />
          <div className="absolute bottom-[-.5rem] left-5">
            <motion.div
              initial={{ y: -300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 12,
                mass: 2,
                restDelta: 0.8,
              }}
            >
              <Avatar
                src="/portfolio.jpg"
                h={100}
                w={100}
                className="rounded-full border-4 border-white shadow-lg"
              />
            </motion.div>
          </div>
        </Card.Section>

        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center flex-wrap w-full h-12">
            <motion.div
              initial={{ x: "100vw", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.75, ease: "easeOut" }}
              className="flex flex-row flex-wrap gap-2 items-center"
            >
              <Text size="xl" fw={500} fz={24}>
                Paul Nguyen
              </Text>
              <AnimatePresence mode="wait">
                <motion.div
                  key={roles[roleIndex].label}
                  initial={{ opacity: 0, y: -20, rotateX: 90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: 20, rotateX: -90 }}
                  transition={{ duration: 0.5 }}
                >
                  <Badge color={roles[roleIndex].color}>
                    {roles[roleIndex].label}
                  </Badge>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ x: "-100vw", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.75, ease: "easeOut" }}
            >
              <a
                href="https://siebelschool.illinois.edu/academics/graduate/professional-mcs"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://brand.illinois.edu/wp-content/uploads/2024/02/Block-I-orange-blue-background.png"
                  alt="UIUC Logo"
                  className="block md:hidden h-8 w-8 relative left-2"
                />
                <img
                  src="https://images.squarespace-cdn.com/content/v1/623126b50d2dfb281caaafd3/043c224d-520f-40be-a3b2-408ce588d8b6/University-of-Illinois-Urbana-Champaign-logo.jpg"
                  alt="UIUC"
                  className="md:block hidden h-14 w-full relative top-1.5"
                />
              </a>
            </motion.div>
          </div>
          <div className="absolute bottom-1">
            <Text c="dimmed" fw={500} fz={12}>
              Houston, Texas
            </Text>
          </div>
        </div>
      </Card>

      <div className="flex justify-center mt-4 rounded-lg shadow-lg text-white">
        <div className="h-16 flex justify-center px-4 py-2 w-11/12 bg-gray-700 border border-gray-600 rounded-lg">
          <AnimatePresence mode="wait">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <motion.div
                key={title + duration}
                initial={{ opacity: 0, y: -20, rotateX: 90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: 20, rotateX: -90 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center space-x-3"
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
                <div className="hidden md:flex flex-row">
                  <Text className="text-sm font-medium">
                    {title}: [{duration}]
                  </Text>
                </div>
                <div className="md:hidden flex flex-col">
                  <Typing text={title} />
                  <Typing text={`[${duration}]`} />
                </div>
              </motion.div>
            </a>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

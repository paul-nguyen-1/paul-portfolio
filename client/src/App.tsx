import Chat from "./components/chat/chat";
import profileConfigRaw from "../data/profile.config.json";
import { useUser } from "./hooks/useUser";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@mantine/core";

function App() {
  const profileConfig = profileConfigRaw;
  const { isAuthenticated, logout } = useUser();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gray-900">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${profileConfig.appBackgroundImage})` }}
      />
      <div className="absolute inset-0 bg-black opacity-50" />

      <div className="relative z-10 flex md:items-center md:justify-center min-h-screen">
        {!isAuthenticated ? (
          <div className="flex flex-col items-center space-y-4 text-white">
            <p className="text-lg">Welcome! Please choose an option:</p>
            <div className="flex gap-4">
              <Button
                color="blue"
                size="md"
                radius="md"
                onClick={() => navigate({ to: "/login" })}
              >
                Login
              </Button>
              <Button
                color="green"
                size="md"
                radius="md"
                onClick={() => navigate({ to: "/createUser" })}
              >
                Register
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Chat />
            <div className="absolute bottom-4 right-4">
              <button
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

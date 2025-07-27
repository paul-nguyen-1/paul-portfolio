import Chat from "./components/chat/chat";
import backgroundImage from "/background.jpg";

function App() {
  return (
    <>
      <div className="relative min-h-screen bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex md:items-center md:justify-center min-h-screen">
          <Chat />
        </div>
      </div>
    </>
  );
}

export default App;

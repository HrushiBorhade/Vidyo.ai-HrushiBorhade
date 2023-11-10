import "./App.css";
import Player from "./components/Player";

function App() {
  return (
    <div className="h-[98vh] max-w-full m-2 background md:rounded-lg">
      <div className="w-full px-6 py-4 h-14">
        <img src="/vidyoai-logo.svg" className="h-10 w-50" />
      </div>
      <div className="mt-10">
        <Player />
      </div>
    </div>
  );
}

export default App;

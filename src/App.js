import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from './context/SocketContext';
import Home from "./Home";
import Room from "./Room";
import Results from './Results';
import Scoreboard from './Scoreboard';
import Categories from './Categories';
import Drawing from './Drawing';
import Voting from'./Voting';
import Lobby from './Lobby';
import Host from './Host';
import Guest from './Guest';
import Rules from './Rules';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/results/:roomId" element={<Results />} />
          <Route path="/scoreboard/:roomId" element={<Scoreboard />} />
          <Route path="/lobby/:roomId" element={<Lobby />}/>
          <Route path="/categories/:roomId" element={<Categories />} />
          <Route path="/drawing/:roomId" element={<Drawing />} />
          <Route path="/voting/:roomId" element={<Voting />} />

          <Route path="/host/:roomId" element={<Host />} />
          <Route path="/guest/" element={<Guest />} />
          <Route path="/lobby/:roomId/:guestName" element={<Lobby />} />
          <Route path="/rules/" element={<Rules />} />

          {/* ellen: setup route by adding path (url) and element (react component) */}
          {/* example: <Route path="/my/URL" element={<MyComponent />} */}
        </Routes>
        </SocketProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
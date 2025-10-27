import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainMenu from "./components/MainMenu";
import Quiz from "./components/Quiz";
import Marketplace from "./components/Marketplace";
import MyAssets from "./components/MyAssets";
import Trade from "./components/Trade";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/myassets" element={<MyAssets />} />
        <Route path="/trade" element={<Trade />} />
      </Routes>
    </Router>
  );
}

export default App;

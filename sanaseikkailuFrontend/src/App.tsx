import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GameSelect from "./components/GameSelect";
import LoginForm from "./components/LoginForm";
//import MatchGameSetup from "./components/MatchGame/MatchGameSetup";

const GameSetup = lazy(() => import("./components/GameSetup"));

function App() {
  return (
    <>
      <div className="App">
        <div className="Container">
          <LoginForm />
          <Router>
            <Routes>
              <Route path="/" element={<GameSelect />} />
              <Route
                path="/matchgame"
                element={
                  <Suspense fallback={<p>Loading...</p>}>
                    <GameSetup game="matchGame" />
                  </Suspense>
                }
              />
            </Routes>
          </Router>
        </div>
      </div>
    </>
  );
}

export default App;

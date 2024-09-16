import { createContext, lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameSelect from './components/GameSelect';
import LoginForm from './components/LoginForm';
import { UserObject, UserData } from '../types';
//import MatchGameSetup from "./components/MatchGame/MatchGameSetup";

const GameSetup = lazy(() => import('./components/GameSetup'));
export const UserContext = createContext<UserObject>({
  user: null,
  setUser: () => {},
});

function App() {
  const [user, setUser] = useState<UserData>(null);
  return (
    <>
      <div className='App'>
        <UserContext.Provider value={{ user, setUser }}>
          <div id='nav'>
            <h3>Sanaseikkailu</h3>
            <LoginForm />
          </div>
          <div className='Container'>
            <Router>
              <Routes>
                <Route path='/' element={<GameSelect />} />
                <Route
                  path='/matchgame'
                  element={
                    <Suspense fallback={<p>Loading...</p>}>
                      <GameSetup game='matchGame' />
                    </Suspense>
                  }
                />
              </Routes>
            </Router>
          </div>
        </UserContext.Provider>
      </div>
    </>
  );
}

export default App;

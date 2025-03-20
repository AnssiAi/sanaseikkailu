import { createContext, lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserObject, UserData } from '../types';
import GameSelect from './components/GameSelect';
import LoginContainer from './components/LoginContainer';

const GameSetup = lazy(() => import('./components/GameSetup'));
export const UserContext = createContext<UserObject>({
  user: null,
  setUser: () => {},
});

function App() {
  const [user, setUser] = useState<UserData>(null);

  useEffect(() => {
    const json = localStorage.getItem('WQ-persist');
    if (json !== null) {
      setUser(JSON.parse(json));
    }
  }, []);

  return (
    <>
      <div className='app'>
        <UserContext.Provider value={{ user, setUser }}>
          <div className='nav'>
            <h2 className='appTitle'>Sanaseikkailu</h2>
            <LoginContainer />
          </div>
          <div className='container'>
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

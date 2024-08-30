import { useContext, useState } from 'react';
import { LoggedPlayerUser, LoginData } from '../../types';
import { userLogin } from '../services/loginService';
import { UserContext } from '../App';

const LoginForm = () => {
  const { user, setUser } = useContext(UserContext);
  const [loginData, setLoginData] = useState<LoginData>({
    username: '',
    password: '',
  });

  //Käytetään localstoragea toistaiseksi kirjautumistietojen hallintaan.
  const submitLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const login: LoggedPlayerUser = await userLogin(loginData);
      setUser(login);
      alert(`Logged in as ${login.username}`);
    } catch (err: unknown) {
      let errorMessage: string = 'Error: ';
      if (err instanceof Error) {
        errorMessage += err.message;
      }
      console.log(errorMessage);
    }
    clearFormData();
  };

  const handleFormUpdate = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (e.target instanceof HTMLInputElement) {
      const newData = {
        ...loginData,
        [e.target.name]: e.target.value,
      };
      setLoginData(newData);
    }
  };

  const clearFormData = () => {
    setLoginData({ username: '', password: '' });
  };

  const logOut = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setUser(null);
    alert('Logged out');
  };

  return (
    <div>
      {user ? (
        <>
          <p>{user.username}</p>
          <p>{user.points}</p>
          <button onClick={logOut}>Logout</button>
        </>
      ) : (
        <>
          <form onSubmit={submitLogin}>
            <label>username:</label>
            <input
              type='text'
              name='username'
              value={loginData.username}
              onChange={handleFormUpdate}
            />
            <label>password:</label>
            <input
              type='text'
              name='password'
              value={loginData.password}
              onChange={handleFormUpdate}
            />
            <button type='submit'>Login</button>
          </form>
        </>
      )}
    </div>
  );
};

export default LoginForm;

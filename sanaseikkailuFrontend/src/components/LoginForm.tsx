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

  const submitLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const login: LoggedPlayerUser = await userLogin(loginData);
      localStorage.setItem('WQ-persist', JSON.stringify(login));
      setUser(login);
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
    localStorage.removeItem('WQ-persist');
    setUser(null);
    alert('Kirjauduit ulos');
  };

  return (
    <>
      {user ? (
        <>
          <p>{user.username}</p>
          <p>{user.points}</p>
          <button onClick={logOut}>Kirjaudu ulos</button>
        </>
      ) : (
        <>
          <form onSubmit={submitLogin}>
            <label id='loginUserlabel' htmlFor='loginUsername'>
              Käyttäjänimi:
            </label>
            <input
              id='loginUsername'
              type='text'
              name='username'
              required
              value={loginData.username}
              onChange={handleFormUpdate}
              aria-label='username input'
            />
            <label id='loginPasswordlabel' htmlFor='loginPassword'>
              Salasana:
            </label>
            <input
              id='loginPassword'
              type='password'
              name='password'
              required
              value={loginData.password}
              onChange={handleFormUpdate}
              aria-label='password input'
            />
            <button type='submit'>Kirjaudu</button>
          </form>
        </>
      )}
    </>
  );
};

export default LoginForm;

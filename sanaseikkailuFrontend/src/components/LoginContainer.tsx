import { useState, useContext } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import login from '../../src/assets/icons/login.svg';
import { UserContext } from '../App';

const LoginContainer = () => {
  const { user } = useContext(UserContext);
  const [visible, setVisible] = useState<boolean>(false);
  const [register, setRegister] = useState<boolean>(false);

  const toggleVisibility = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setVisible(!visible);
  };

  const toggleRegister = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setRegister(!register);
  };

  return (
    <div className='loginContainer'>
      {visible ? (
        <>
          <button className='loginButton' onClick={toggleVisibility}>
            <span>
              <img src={login} height={35} width={35} />
            </span>
          </button>
          <div className='userContent'>
            {register ? (
              <RegisterForm toggleRegister={toggleRegister} />
            ) : (
              <>
                <LoginForm />
              </>
            )}
            {!user && !register ? (
              <button onClick={toggleRegister}>Rekisteröidy</button>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <button className='loginButton' onClick={toggleVisibility}>
            <span>
              <img src={login} height={35} width={35} />
            </span>
          </button>
        </>
      )}
    </div>
  );
};

export default LoginContainer;

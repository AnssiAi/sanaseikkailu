import { useContext, useState } from 'react';
import { UserContext } from '../App';
import { LoggedPlayerUser, NewPlayerUser } from '../../types';
import { postUser } from '../services/loginService';

interface RegisterFormProps {
  toggleRegister: (e: React.SyntheticEvent) => void;
}

const RegisterForm = ({ toggleRegister }: RegisterFormProps) => {
  const { setUser } = useContext(UserContext);
  const [loginData, setLoginData] = useState<NewPlayerUser>({
    username: '',
    password: '',
    points: 0,
  });
  const [errors, setErrors] = useState({
    username: null,
    password: null,
    retypePassword: null,
  });

  const handleUsernameUpdate = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (e.target instanceof HTMLInputElement) {
      const newData = {
        ...loginData,
        [e.target.name]: e.target.value.trim(),
      };
      setLoginData(newData);

      if (e.target.value.length < 4) {
        const newErrors = {
          ...errors,
          [e.target.name]: true,
        };
        setErrors(newErrors);
      } else {
        const newErrors = {
          ...errors,
          [e.target.name]: false,
        };
        setErrors(newErrors);
      }
    }
  };
  const handlePasswordUpdate = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (e.target instanceof HTMLInputElement) {
      const newData = {
        ...loginData,
        [e.target.name]: e.target.value.trim(),
      };
      setLoginData(newData);

      if (e.target.value.length < 8) {
        const newErrors = {
          ...errors,
          [e.target.name]: true,
        };
        setErrors(newErrors);
      } else {
        const newErrors = {
          ...errors,
          [e.target.name]: false,
        };
        setErrors(newErrors);
      }
    }
  };
  const handlePasswordMatch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (e.target instanceof HTMLInputElement) {
      if (e.target.value !== loginData.password) {
        const newErrors = {
          ...errors,
          [e.target.name]: true,
        };
        setErrors(newErrors);
      } else {
        const newErrors = {
          ...errors,
          [e.target.name]: false,
        };
        setErrors(newErrors);
      }
    }
  };

  const registerUser = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const newUser: NewPlayerUser = {
        ...loginData,
      };
      const register: LoggedPlayerUser = await postUser(newUser);
      localStorage.setItem('WQ-persist', JSON.stringify(register));
      setUser(register);
      toggleRegister(e);
    } catch (err: unknown) {
      let errorMessage: string = 'Error: ';
      if (err instanceof Error) {
        errorMessage += err.message;
      }
      console.log(errorMessage);
    }
    clearFormData();
  };

  const clearFormData = () => {
    setLoginData({ username: '', password: '', points: 0 });
  };

  return (
    <>
      <form onSubmit={registerUser}>
        <label id='registerUsernameLabel' htmlFor='registerUsername'>
          Käyttäjänimi:
        </label>
        <input
          id='registerUsername'
          type='text'
          name='username'
          required
          pattern='.{4,}'
          value={loginData.username}
          onChange={handleUsernameUpdate}
          aria-label='username input'
        />
        {errors.username && (
          <div className='inputError'>Username requires atleast four characters</div>
        )}
        <label id='registerPasswordLabel' htmlFor='registerPassword'>
          Salasana:
        </label>
        <input
          id='registerPassword'
          type='password'
          name='password'
          required
          pattern='.{8,}'
          value={loginData.password}
          onChange={handlePasswordUpdate}
          aria-label='password input'
        />
        {errors.password && (
          <div className='inputError'>Password requires atleast eight characters</div>
        )}
        <label id='registerRetypePasswordLabel' htmlFor='registerRetypePassword'>
          Vahvista salasana:
        </label>
        <input
          id='registerRetypePassword'
          type='password'
          name='retypePassword'
          required
          pattern={loginData.password}
          aria-label='retype password input'
          onChange={handlePasswordMatch}
        />
        {errors.retypePassword && (
          <div className='inputError'>Passwords have to match</div>
        )}
        <button
          type='submit'
          disabled={Object.values(errors).some(
            (entry) => entry === null || entry === true
          )}
          aria-label='form submit button'
        >
          Lähetä
        </button>
      </form>
      <button onClick={toggleRegister}>Palaa</button>
    </>
  );
};
export default RegisterForm;

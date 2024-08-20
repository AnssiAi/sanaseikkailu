import { useState } from "react";
import { LoggedPlayerUser, LoginData } from "../../types";
import { userLogin } from "../services/loginService";

const LoginForm = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    username: "",
    password: "",
  });

  const submitLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const user: LoggedPlayerUser = await userLogin(loginData);
      localStorage.setItem("userToken", user.token);
      alert(`Logged in as ${user.username}`);
    } catch (err: unknown) {
      let errorMessage: string = "Error: ";
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
    setLoginData({ username: "", password: "" });
  };

  const logOut = (e: React.SyntheticEvent) => {
    e.preventDefault();
    localStorage.removeItem("userToken");
    alert("Logged out");
  };

  return (
    <div>
      <form onSubmit={submitLogin}>
        <label>username:</label>
        <input
          type="text"
          name="username"
          value={loginData.username}
          onChange={handleFormUpdate}
        />
        <label>password:</label>
        <input
          type="text"
          name="password"
          value={loginData.password}
          onChange={handleFormUpdate}
        />
        <button type="submit">Login</button>
      </form>
      <button onClick={logOut}>Logout</button>
    </div>
  );
};

export default LoginForm;
